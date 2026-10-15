// Screenshots for review: home 1440 and 390 (light and dark), #work at 390, a case study at 1440 and 390,
// and 2x close-ups of the contact sheet and of a pinboard cluster. Writes to the shots folder.
// usage: node tools/qa/shots.mjs   (run after `pnpm build`)
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '..', '..', 'dist');
const OUT = '/home/user/protos/_shots/v4-imperfect-max/checks';
fs.mkdirSync(OUT, { recursive: true });
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

async function shot(name, { w, hash = '', dark = false, full = false, dpr = 1, clip = null, cluster = null }) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: dpr, colorScheme: dark ? 'dark' : 'light', isMobile: w < 500, hasTouch: w < 500 });
  const page = await ctx.newPage();
  await page.goto(base + (hash ? '#' + hash : ''), { waitUntil: 'load' });
  if (dark) await page.evaluate(() => { document.documentElement.dataset.theme = 'dark'; });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(700);
  if (cluster) {
    await page.locator('[data-board]').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('[data-zoom="fit"]')?.click());
    await page.waitForTimeout(150);
    const el = page.locator(`[data-cluster="${cluster}"]`);
    const bb = await el.boundingBox();
    await page.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: bb.x - 12, y: bb.y - 12, width: bb.width + 24, height: bb.height + 24 } });
  } else if (clip) {
    await page.locator(clip).first().scrollIntoViewIfNeeded();
    const bb = await page.locator(clip).first().boundingBox();
    await page.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: bb.x - 8, y: bb.y - 8, width: bb.width + 16, height: bb.height + 16 } });
  } else {
    if (full) {
      // Lazy images below the fold only load once they are scrolled into view: walk the page first.
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < h; y += 500) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(50); }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: full });
  }
  await ctx.close();
  console.log('wrote', name);
}

await shot('home-1440-light', { w: 1440, full: true });
await shot('work-start-1440', { w: 1440, hash: 'work' });
await shot('work-start-1440-dark', { w: 1440, hash: 'work', dark: true });
await shot('work-wholesale-os-1440-dark', { w: 1440, hash: 'work-wholesale-os', dark: true, full: true });
await shot('work-wholesale-os-390-dark', { w: 390, hash: 'work-wholesale-os', dark: true, full: true });
await shot('work-wholesale-os-390', { w: 390, hash: 'work-wholesale-os', full: true });
await shot('work-wholesale-os-1440', { w: 1440, hash: 'work-wholesale-os', full: true });
await shot('home-1440-dark', { w: 1440, dark: true, full: true });
await shot('home-390-light', { w: 390, full: true });
await shot('home-1440-dark-check', { w: 1440, dark: true, full: true });
await shot('home-390-dark', { w: 390, dark: true, full: true });
await shot('work-390', { w: 390, hash: 'work', full: true });
await shot('work-medjot-390', { w: 390, hash: 'work-medjot', full: true });
await shot('work-medjot-1440', { w: 1440, hash: 'work-medjot', full: true });
await shot('contact-sheet-2x', { w: 1440, dpr: 2, clip: '.sheet' });
await shot('pinboard-cluster-2x', { w: 1440, dpr: 2, hash: 'work', cluster: 0 });
await browser.close();
server.close();
