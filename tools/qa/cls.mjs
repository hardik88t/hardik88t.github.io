// Cumulative layout shift, measured the way a visitor sees it: five consecutive runs, each in a fresh
// browser context (cold cache), for #, #work and #work-medjot at 390 and 1440. Each run loads the page,
// waits, scrolls the whole page, and returns to the top. The layout-shift observer starts before any
// script runs, so shifts during the first parse are counted too. No body hiding is used.
// usage: node tools/qa/cls.mjs   (after pnpm build). Exit 1 if any run has CLS > 0.
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '..', '..', 'dist');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  let f = path.join(dist, decodeURIComponent(req.url.split('?')[0]));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const VIEWS = ['', 'work', 'work-medjot'];
const WIDTHS = [390, 1440];
const RUNS = 5;
const results = [];
let failed = false;

for (const w of WIDTHS) for (const v of VIEWS) for (let run = 1; run <= RUNS; run++) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 900 ? 844 : 900 }, isMobile: w < 500, hasTouch: w < 500 });
  await ctx.addInitScript(() => {
    window.__cls = 0;
    window.__src = [];
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) {
        if (e.hadRecentInput) continue;
        window.__cls += e.value;
        for (const s of e.sources || []) {
          const n = s.node;
          const name = n ? (n.className?.baseVal ?? n.className ?? n.tagName) : '?';
          window.__src.push(`${Math.round(e.startTime)}ms ${e.value.toFixed(4)} ${name} ${JSON.stringify(s.previousRect)}->${JSON.stringify(s.currentRect)}`);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });
  const page = await ctx.newPage();
  await page.goto(base + (v ? '#' + v : ''), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const out = await page.evaluate(() => ({ cls: window.__cls, src: window.__src.slice(0, 3) }));
  results.push({ w, view: v || 'home', run, cls: +out.cls.toFixed(4), src: out.src });
  if (out.cls > 0) failed = true;
  console.log(`${w} #${v || '(home)'} run ${run}: CLS ${out.cls.toFixed(4)}${out.src.length ? '  ' + out.src.join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();
server.close();
const worst = Math.max(...results.map((r) => r.cls));
console.log(`\n${results.length} runs, worst CLS ${worst.toFixed(4)}`);
process.exit(failed ? 1 : 0);
