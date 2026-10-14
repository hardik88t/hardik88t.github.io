// Renders every icon from tools/icons/mark.svg (the one source): public/favicon.svg, favicon.ico (16/32/48),
// apple-touch-icon.png (180), icon-192.png, icon-512.png, icon-maskable-512.png (safe-zone padding) and
// site.webmanifest. Rendering uses headless Chromium, so the SVG renders exactly as a browser draws it.
//
// usage: node tools/icons/build.mjs [--sheet <file.png>]
//   --sheet writes a contact sheet (16, 32, 180, 512, maskable with the safe-zone overlay, light and dark)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const pub = path.join(root, 'public');
const source = path.join(here, 'mark.svg');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const PAPER = '#F6F6F3';
// Maskable: the whole mark sits inside the 80% safe-zone circle (radius 0.4 of the icon). Checked on the sheet.
const MASK_INSET = 0.68;
const MASK_PX = Math.round(512 * MASK_INSET);
const MASK_OFF = Math.round((512 - MASK_PX) / 2);
const sheetArg = process.argv.indexOf('--sheet');
const sheetOut = sheetArg > 0 ? process.argv[sheetArg + 1] : null;

const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const src = pathToFileURL(source).href;

/** A page with `html`, loaded from a file next to the source (about:blank cannot load file:// images). */
async function pageWith(ctx, html) {
  const file = path.join(here, '.render.html');
  fs.writeFileSync(file, html);
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
  fs.rmSync(file, { force: true });
  return page;
}

/** One PNG of the source at `size` px. `inset` shrinks the mark on a paper field (maskable). */
async function renderPng(size, { inset = 1, scheme = 'light' } = {}) {
  const ctx = await browser.newContext({ viewport: { width: size, height: size }, deviceScaleFactor: 1, colorScheme: scheme });
  const box = Math.round(size * inset);
  const off = Math.round((size - box) / 2);
  const page = await pageWith(ctx, `<!doctype html><html><body style="margin:0;background:${PAPER};width:${size}px;height:${size}px;overflow:hidden">
    <img src="${src}" style="position:absolute;left:${off}px;top:${off}px;width:${box}px;height:${box}px;display:block"></body></html>`);
  const buf = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: size, height: size } });
  await ctx.close();
  return buf;
}

/** ICO with PNG entries (Windows Vista and later). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(entries.length, 4);
  const dir = Buffer.alloc(16 * entries.length);
  let offset = header.length + dir.length;
  const blobs = [];
  entries.forEach((e, i) => {
    const o = i * 16;
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o);
    dir.writeUInt8(e.size >= 256 ? 0 : e.size, o + 1);
    dir.writeUInt8(0, o + 2);
    dir.writeUInt8(0, o + 3);
    dir.writeUInt16LE(1, o + 4);
    dir.writeUInt16LE(32, o + 6);
    dir.writeUInt32LE(e.png.length, o + 8);
    dir.writeUInt32LE(offset, o + 12);
    offset += e.png.length;
    blobs.push(e.png);
  });
  return Buffer.concat([header, dir, ...blobs]);
}

// 1. the SVG itself
fs.mkdirSync(pub, { recursive: true });
fs.copyFileSync(source, path.join(pub, 'favicon.svg'));

// 2. PNGs
const files = {};
files['apple-touch-icon.png'] = await renderPng(180);
files['icon-192.png'] = await renderPng(192);
files['icon-512.png'] = await renderPng(512);
files['icon-maskable-512.png'] = await renderPng(512, { inset: MASK_INSET });
for (const [name, buf] of Object.entries(files)) fs.writeFileSync(path.join(pub, name), buf);

// 3. ICO, 16/32/48
const icoEntries = [];
for (const size of [16, 32, 48]) icoEntries.push({ size, png: await renderPng(size) });
fs.writeFileSync(path.join(pub, 'favicon.ico'), ico(icoEntries));

// 4. manifest (relative paths; the colours are the light paper and ink tokens)
const manifest = {
  name: 'Hardik Thanth',
  short_name: 'Hardik',
  description: 'Hardik Thanth, product engineer: web and mobile apps.',
  lang: 'en',
  start_url: './',
  scope: './',
  display: 'browser',
  background_color: PAPER,
  theme_color: PAPER,
  icons: [
    { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
};
fs.writeFileSync(path.join(pub, 'site.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');

// 5. optional contact sheet for review: light sizes, the maskable with its safe zone, and dark rendering
if (sheetOut) {
  const sizes = [16, 32, 48, 180, 192, 256, 512];
  const figs = sizes
    .map((s) => `<figure><div class="box" style="width:${s}px;height:${s}px"><img src="${src}" width="${s}" height="${s}"></div><figcaption>${s}</figcaption></figure>`)
    .join('');
  // 16 and 32 px enlarged 4x with nearest-neighbour, to judge the pixels a browser tab actually shows
  const small = [16, 32]
    .map((s) => `<figure><div class="px" style="width:${s * 4}px;height:${s * 4}px"><img src="${src}" width="${s * 4}" height="${s * 4}" style="image-rendering:pixelated"></div><figcaption>${s} px, 4x nearest</figcaption></figure>`)
    .join('');
  const darkCtx = await browser.newContext({ viewport: { width: 420, height: 230 }, colorScheme: 'dark' });
    const dpage = await pageWith(darkCtx, `<!doctype html><body style="margin:0;background:#141519;display:flex;gap:28px;align-items:flex-end;padding:20px">
    ${[16, 32, 48, 180].map((s) => `<img src="${src}" width="${s}" height="${s}">`).join('')}</body>`);
  const darkPng = (await dpage.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 420, height: 230 } })).toString('base64');
  await darkCtx.close();
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 620 }, deviceScaleFactor: 1 });
  const page = await pageWith(ctx, `<!doctype html><html><head><style>
    body{margin:0;padding:24px;font:14px system-ui;background:#eceded;color:#15161a;width:1052px}
    .row{display:flex;gap:28px;align-items:flex-end;margin-bottom:22px;flex-wrap:wrap}
    figure{margin:0;text-align:center}
    figcaption{margin-top:8px;color:#5c616c;font-size:13px}
    .box{position:relative;overflow:hidden;background:#fff;border-radius:6px;box-shadow:0 0 0 1px #d6d9df}
    .box img{position:absolute;left:0;top:0;display:block}
    .field{position:absolute;inset:0;background:${PAPER}}
    .field img{position:absolute;display:block}
    .px{position:relative;overflow:hidden;background:#fff;box-shadow:0 0 0 1px #d6d9df}
    .px img{position:absolute;left:0;top:0;display:block}
    .zone{position:absolute;left:51px;top:51px;width:410px;height:410px;border-radius:50%;border:1.5px dashed #ff0050}
    h3{margin:0 0 10px;font-size:15px}
  </style></head><body>
    <h3>Light: 16, 32, 48, 180, 192, 256, 512 (px)</h3>
    <div class="row">${figs}</div>
    <h3>Tab sizes enlarged (what a 16 and 32 px favicon shows)</h3>
    <div class="row">${small}</div>
    <h3>Maskable 512 with safe-zone overlay (dashed circle = 80% diameter; the mark must sit inside it)</h3>
    <div class="row">
      <figure><div class="box" style="width:512px;height:512px"><div class="field"><img src="${src}" style="width:${MASK_PX}px;height:${MASK_PX}px;left:${MASK_OFF}px;top:${MASK_OFF}px"></div><div class="zone"></div></div><figcaption>maskable 512</figcaption></figure>
    </div>
    <h3>Dark (prefers-color-scheme inside the SVG)</h3>
    <img src="data:image/png;base64,${darkPng}" width="420" height="230">
  </body></html>`);
  await page.screenshot({ path: sheetOut, fullPage: true });
  await ctx.close();
  console.log('sheet', sheetOut);
}

await browser.close();
console.log('icons written to', pub, Object.keys(files).concat(['favicon.svg', 'favicon.ico', 'site.webmanifest']).join(', '));
