// Page weight for the first home view at 390 and at 1440, and the lazily loaded chunks for #work at desktop.
// Reports the HTML, CSS, JS (home versus the pinboard and lightbox chunks), fonts and images on first load.
// usage: node tools/qa/weight.mjs
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

async function weigh(w, hash) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(base + (hash ? '#' + hash : ''), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  const res = await page.evaluate(() => performance.getEntriesByType('resource').map((r) => ({ name: r.name, bytes: r.transferSize || r.encodedBodySize || 0, type: r.initiatorType })));
  await ctx.close();
  const cat = { html: 0, css: 0, js: 0, pinboardJs: 0, fonts: 0, images: 0 };
  const rows = [];
  for (const r of res) {
    const n = r.name.split('?')[0];
    if (n.endsWith('.js')) cat[/pinboard|proof/.test(n) ? 'pinboardJs' : 'js'] += r.bytes;
    else if (n.endsWith('.css')) cat.css += r.bytes;
    else if (n.endsWith('.woff2')) cat.fonts += r.bytes;
    else if (/\.(webp|avif|png)$/.test(n)) { cat.images += r.bytes; rows.push(`${path.basename(n)} ${r.bytes}`); }
  }
  const htmlBytes = fs.statSync(path.join(dist, 'index.html')).size;
  cat.html = htmlBytes;
  return { cat, imageCount: rows.length, res };
}

const home390 = await weigh(390, '');
const work1440 = await weigh(1440, 'work');
browser.close();
server.close();
const fmt = (o) => Object.entries(o).map(([k, v]) => `${k} ${(v / 1024).toFixed(1)} KB`).join(', ');
console.log('home 390 (first load):', fmt(home390.cat), `, images requested: ${home390.imageCount}`);
console.log('#work 1440 (first load):', fmt(work1440.cat), `, images requested: ${work1440.imageCount}`);
const chunks = fs.readdirSync(path.join(dist, '_astro')).filter((f) => f.endsWith('.js')).map((f) => `${f} ${(fs.statSync(path.join(dist, '_astro', f)).size / 1024).toFixed(1)} KB`);
console.log('JS chunks on disk:', chunks.join(' | '));
