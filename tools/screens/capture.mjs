// Screenshots each mock from the harness at 2x into raw/. Chromium from /opt/pw-browsers, 127.0.0.1 only.
// usage: node capture.mjs [slug ...]   (the harness must be running: pnpm dev, see README in PLAN notes)
// Writes raw/<slug>.png (the whole mock) and, for multi-phone mocks, raw/<slug>--phone-<n>.png.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');

const here = path.dirname(fileURLToPath(import.meta.url));
const rawDir = path.join(here, 'raw');
fs.mkdirSync(rawDir, { recursive: true });

const BASE = process.env.HARNESS_URL ?? 'http://127.0.0.1:5179/';
const ALL = ['wholesale-os', 'medjot', 'paper-studio', 'fieldbook', 'footnote', 'kiln-ui', 'dhi', 'net-watch'];
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ALL;

// Crops: named regions of a mock, in css px from the stage's top-left. Each is a second screen for a
// pinboard cluster or a case study. Coordinates were read from the full captures.
const CROPS = {
  'wholesale-os--invoice': { slug: 'wholesale-os', x: 920, y: 0, w: 360, h: 800 },
  'wholesale-os--stock': { slug: 'wholesale-os', x: 240, y: 350, w: 660, h: 200 },
  'paper-studio--a4': { slug: 'paper-studio', x: 600, y: 90, w: 520, h: 700 },
  'footnote--chat': { slug: 'footnote', x: 240, y: 60, w: 660, h: 720 },
  'kiln-ui--tokens': { slug: 'kiln-ui', x: 320, y: 60, w: 960, h: 360 },
  'dhi--graph': { slug: 'dhi', x: 640, y: 40, w: 640, h: 760 },
};

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--font-render-hinting=none'],
});
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

for (const slug of slugs) {
  const crops = Object.entries(CROPS).filter(([, c]) => c.slug === slug);
  if (crops.length && slug !== 'net-watch') {
    await page.goto(`${BASE}?screen=${slug}`, { waitUntil: 'load' });
    await page.waitForSelector('#stage[data-ready="1"]', { state: 'attached', timeout: 15000 });
    const sbox = await page.locator('#stage').boundingBox();
    for (const [name, c] of crops) {
      await page.screenshot({ path: path.join(rawDir, `${name}.png`), animations: 'disabled',
        clip: { x: sbox.x + c.x, y: sbox.y + c.y, width: c.w, height: c.h } });
      console.log(`${name}: crop ${c.w}x${c.h}`);
    }
  }
  if (process.env.CROPS_ONLY) continue;
  await page.goto(`${BASE}?screen=${slug}`, { waitUntil: 'load' });
  await page.waitForSelector('#stage[data-ready="1"]', { state: 'attached', timeout: 15000 }).catch(async (e) => { console.error(slug, 'not ready:', errors.join(' | ') || e.message); throw e; });
  const stage = page.locator('#stage');
  // net-watch: its stage is a 1280-wide backdrop around two devices, so the devices are the prints.
  if (slug !== 'net-watch') await stage.screenshot({ path: path.join(rawDir, `${slug}.png`), animations: 'disabled' });
  // Phone shells inside a mock: CSS modules keep the local name, so the class contains "_phone_".
  const phones = slug === 'net-watch' ? page.locator('[class*="_device_"]') : page.locator('[class*="_phone_"]');
  const n = await phones.count();
  if (n > 0) {
    for (let i = 0; i < n; i++) {
      await phones.nth(i).screenshot({ path: path.join(rawDir, `${slug}--phone-${i + 1}.png`), animations: 'disabled' });
    }
  }
  const box = await stage.boundingBox();
  console.log(`${slug}: ${Math.round(box.width)}x${Math.round(box.height)} css px, phones=${n}`);
}
await browser.close();
if (errors.length) {
  console.error('console errors:\n' + errors.join('\n'));
  process.exitCode = 1;
}
