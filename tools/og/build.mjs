// Builds public/og.png (1200 x 630) from tools/og/og.template.html. Every line of copy comes from
// src/data/content-v2.json (the hero headline, the struck word, the correction, the title) and the
// domain comes from SITE_URL in src/lib/site.ts, so nothing is typed twice.
//
// usage: node tools/og/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_PATH || '/opt/node22/lib/node_modules/playwright');
const CHROME = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';

const content = JSON.parse(fs.readFileSync(path.join(root, 'src/data/content-v2.json'), 'utf8'));
const siteTs = fs.readFileSync(path.join(root, 'src/lib/site.ts'), 'utf8');
const siteUrl = /SITE_URL = '([^']+)'/.exec(siteTs)?.[1];
if (!siteUrl) throw new Error('SITE_URL not found in src/lib/site.ts');
const hero = content.headlines.hero;
const [line1, line2, line3] = hero.lines;

const fontUrl = (rel) => pathToFileURL(path.join(root, rel)).href;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const html = fs
  .readFileSync(path.join(here, 'og.template.html'), 'utf8')
  .replace('{{FRAUNCES}}', fontUrl('src/fonts/fraunces-subset.woff2'))
  .replace('{{RECURSIVE}}', fontUrl('src/fonts/recursive-subset.woff2'))
  .replace('{{LINE1}}', esc(line1))
  .replace('{{LINE2}}', esc(line2))
  .replace('{{LINE3}}', esc(line3))
  .replace('{{STRUCK}}', esc(hero.struck))
  .replace('{{CORRECTION}}', esc(hero.correction))
  .replace('{{TITLE}}', esc(content.person.title))
  .replace('{{HOST}}', esc(new URL(siteUrl).host));

const file = path.join(here, '.render.html');
fs.writeFileSync(file, html);
const browser = await chromium.launch({ executablePath: CHROME, args: ['--no-sandbox'] });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1, colorScheme: 'light' });
const page = await ctx.newPage();
await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const out = path.join(root, 'public', 'og.png');
await page.screenshot({ path: out, type: 'png', clip: { x: 0, y: 0, width: 1200, height: 630 } });
await ctx.close();
await browser.close();
fs.rmSync(file, { force: true });
const bytes = fs.statSync(out).size;
console.log(`og.png ${bytes} bytes (limit 300 KB)`, bytes < 300 * 1024 ? 'ok' : 'TOO LARGE');
