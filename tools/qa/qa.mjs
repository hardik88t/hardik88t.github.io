// QA for the maximal site. Serves dist/ on 127.0.0.1 and checks every view at 360, 390, 820 and 1440:
// horizontal overflow, console and page errors, failed requests, CLS (layout-shift, no recent input),
// and the phone height of each view. Screenshots go to the shots folder. Exit 1 on any problem.
// usage: node tools/qa/qa.mjs [--shots] [--only=home,work] [--dir=dist]
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(here, '..', '..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => {
  const [k, v = 'true'] = a.replace(/^--/, '').split('=');
  return [k, v];
}));
const dist = path.resolve(site, args.dir ?? 'dist');
const SHOTS = '/home/user/protos/_shots/v4-imperfect-max/checks';
const doShots = args.shots === 'true';

const SLUGS = ['wholesale-os', 'medjot', 'paper-studio', 'fieldbook', 'footnote', 'kiln-ui', 'dhi', 'net-watch'];
const VIEWS = ['', 'work', ...SLUGS.map((s) => `work-${s}`), 'about', 'system'];
const VIEWPORTS = [360, 390, 820, 1440];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(dist, url);
  if (!file.startsWith(dist)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  if (!fs.existsSync(file)) { res.writeHead(404); return res.end('nf'); }
  res.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--no-sandbox'] });
const problems = [];
const report = {};

for (const vw of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vw, height: vw < 900 ? 844 : 900 }, deviceScaleFactor: 1, isMobile: vw < 500, hasTouch: vw < 500, reducedMotion: 'no-preference' });
  await ctx.addInitScript(() => {
    window.__cls = 0;
    window.__clsSources = [];
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.hadRecentInput) continue;
          window.__cls += e.value;
          for (const s of e.sources || []) {
            const n = s.node;
            const name = n ? (n.className?.baseVal ?? n.className ?? n.tagName) : '?';
            window.__clsSources.push(`${Math.round(e.startTime)}ms ${e.value.toFixed(4)} ${name} ${JSON.stringify(s.previousRect)}->${JSON.stringify(s.currentRect)}`);
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
  });
  for (const v of VIEWS) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
    const failed = [];
    page.on('requestfailed', (r) => failed.push(r.url()));
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
    await page.goto(`${base}${v ? '#' + v : ''}`, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(450);
    // Layout shift after load, while scrolling through the view.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(40); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(120);
    const info = await page.evaluate(() => {
      const doc = document.documentElement;
      const visible = [...document.querySelectorAll('.view')].filter((el) => !el.hidden && getComputedStyle(el).display !== 'none');
      const overflowEls = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) continue;
        if (r.right > doc.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') overflowEls.push(el.tagName + '.' + el.className);
        if (overflowEls.length > 4) break;
      }
      const h1 = visible[0]?.querySelector('h1');
      return {
        height: doc.scrollHeight,
        overflowX: doc.scrollWidth > doc.clientWidth + 1,
        overflowEls,
        cls: window.__cls,
        clsSources: window.__clsSources.slice(0, 4),
        view: visible[0]?.id || 'home?',
        title: document.title,
        h1: h1?.textContent?.trim().slice(0, 60) ?? null,
      };
    });
    const key = `${vw}:${v || 'home'}`;
    report[key] = { height: info.height, cls: +info.cls.toFixed(4), title: info.title, view: info.view };
    if (info.overflowX) problems.push(`${key}: horizontal overflow (${info.overflowEls.join(', ')})`);
    if (info.cls > 0) problems.push(`${key}: CLS ${info.cls.toFixed(4)} ${info.clsSources.join(' | ')}`);
    if (errors.length) problems.push(`${key}: ${errors.join(' | ')}`);
    if (failed.length) problems.push(`${key}: failed ${failed.slice(0, 3).join(' | ')}`);
    if (!info.h1 && info.view !== 'home?') problems.push(`${key}: no h1 in view ${info.view}`);
    if (vw === 390 && !v && info.height > 3600) problems.push(`${key}: home is ${info.height}px, budget 3600`);
    if (doShots && ['', 'work', 'work-wholesale-os', 'about', 'system'].includes(v) && [390, 1440].includes(vw)) {
      fs.mkdirSync(SHOTS, { recursive: true });
      await page.screenshot({ path: path.join(SHOTS, `${(v || 'home')}-${vw}.png`), fullPage: false });
    }
    await page.close();
  }
  await ctx.close();
}
await browser.close();
server.close();

console.log(JSON.stringify({ report: args.report === 'true' ? report : undefined, problems }, null, 2));
process.exit(problems.length ? 1 : 0);
