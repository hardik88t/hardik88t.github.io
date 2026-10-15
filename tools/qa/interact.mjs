// Interaction checks for the maximal site: pinboard (keys, drag, wheel zoom, minimap, click suppression after
// a drag), proof lightbox (open, arrows inside the group, Escape, focus return), view switching with Back and
// Forward, and the phone strips. Serves dist/ on 127.0.0.1. Exit 1 on any failure.
// usage: node tools/qa/interact.mjs [--shots]
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '..', '..', 'dist');
const SHOTS = '/home/user/protos/_shots/v4-imperfect-max/checks';
const doShots = process.argv.includes('--shots');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json' };
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
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); console.log(`${ok ? 'ok  ' : 'FAIL'} ${msg}`); };

async function openPage(width, hash = '') {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(base + (hash ? '#' + hash : ''), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  return { ctx, page, errors };
}

// Prints and cluster text must never overlap: each print's box (rotation included) is checked against the
// cluster's text box, at the start view and at fit.
async function checkZones(page, label) {
  const hits = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-cluster]').forEach((cl, i) => {
      const t = cl.querySelector('.cluster__title');
      if (!t) return;
      const tr = t.getBoundingClientRect();
      cl.querySelectorAll('.cluster__pin').forEach((pin, j) => {
        const pr = pin.getBoundingClientRect();
        const hit = !(pr.right <= tr.left + 1 || pr.left >= tr.right - 1 || pr.bottom <= tr.top + 1 || pr.top >= tr.bottom - 1);
        if (hit) out.push(`cluster ${i} print ${j}`);
      });
    });
    return out;
  });
  check(hits.length === 0, `${label}: no print covers cluster text${hits.length ? ' (' + hits.join(', ') + ')' : ''}`);
}

// --- Desktop: pinboard ---
{
  const { ctx, page, errors } = await openPage(1440);
  await page.click('a[href="#work"]');
  await page.waitForTimeout(400);
  const mounted = await page.evaluate(() => document.querySelector('[data-board]')?.dataset.mounted === '1');
  check(mounted, 'pinboard mounts on #work at desktop width');
  await checkZones(page, 'start view');
  const zoomStart = await page.textContent('[data-zoom-label]');
  check(zoomStart?.trim() === '95%', `start view at 95% (got ${zoomStart})`);
  const tr0 = await page.evaluate(() => document.querySelector('[data-world]').style.transform);
  await page.focus('[data-board]');
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(50);
  const tr1 = await page.evaluate(() => document.querySelector('[data-world]').style.transform);
  check(tr1 !== tr0, 'ArrowRight moves to the next cluster');
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('0');
  const fitLabel = await page.textContent('[data-zoom-label]');
  await checkZones(page, 'fit');
  check(Number(fitLabel.replace('%', '')) < 95, `zero fits the board (label ${fitLabel})`);
  await page.click('[data-zoom="in"]');
  await page.click('[data-zoom="in"]');
  const zoomed = await page.textContent('[data-zoom-label]');
  check(zoomed.trim() !== fitLabel.trim(), `zoom buttons change the level (${zoomed})`);
  // Drag: pan, then a click right after the drag must not open the proof.
  await page.locator('[data-board]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const board = await page.locator('[data-board]').boundingBox();
  const before = await page.evaluate(() => document.querySelector('[data-world]').style.transform);
  await page.mouse.move(board.x + 300, board.y + 200);
  await page.mouse.down();
  await page.mouse.move(board.x + 220, board.y + 170, { steps: 6 });
  await page.mouse.up();
  const after = await page.evaluate(() => document.querySelector('[data-world]').style.transform);
  check(before !== after, `drag pans the board (${before} -> ${after})`);
  const dialogOpened = await page.evaluate(() => document.getElementById('proof-dialog').open);
  check(!dialogOpened, 'a drag does not open the proof');
  // Wheel with Control zooms; plain wheel pans.
  await page.locator('[data-board]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const board2 = await page.locator('[data-board]').boundingBox();
  await page.mouse.move(board2.x + 300, board2.y + 200);
  const lvl0 = await page.textContent('[data-zoom-label]');
  await page.keyboard.down('Control');
  await page.mouse.wheel(0, -200);
  await page.keyboard.up('Control');
  await page.waitForTimeout(60);
  const lvl1 = await page.textContent('[data-zoom-label]');
  check(lvl0 !== lvl1, `Control and wheel zoom (${lvl0.trim()} to ${lvl1.trim()}) board=${JSON.stringify(board)}`);
  // Minimap click centers the board.
  await page.locator('[data-minimap]').scrollIntoViewIfNeeded();
  const mm = await page.locator('[data-minimap]').boundingBox();
  const tBefore = await page.evaluate(() => document.querySelector('[data-world]').style.transform);
  await page.mouse.click(mm.x + mm.width * 0.9, mm.y + mm.height * 0.9);
  const tAfter = await page.evaluate(() => document.querySelector('[data-world]').style.transform);
  check(tBefore !== tAfter, 'minimap click moves the view');
  // Lightbox: click a pin opens the proof, arrows move inside the group, Escape closes and returns focus.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.querySelector('[data-cluster="0"] [data-proof]').click());
  await page.waitForTimeout(400);
  const open1 = await page.evaluate(() => document.getElementById('proof-dialog').open);
  check(open1, 'clicking a pin opens the proof lightbox');
  const count1 = await page.textContent('#proof-count');
  check(/^\s*1 of 3\s*$/.test(count1), `group count for wholesale board (${count1.trim()})`);
  await page.keyboard.press('ArrowRight');
  const count2 = await page.textContent('#proof-count');
  check(/^\s*2 of 3\s*$/.test(count2), `ArrowRight moves to next screen (${count2.trim()})`);
  if (doShots) {
    await page.screenshot({ path: path.join(SHOTS, 'proof-open-1440.png') });
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(150);
  const focusBack = await page.evaluate(() => document.activeElement?.getAttribute('data-proof') !== null || document.activeElement?.tagName === 'A');
  check(focusBack, 'Escape closes and focus returns to a screen link');
  if (doShots) {
    await page.evaluate(() => { document.querySelector('[data-board]').focus(); });
    await page.screenshot({ path: path.join(SHOTS, 'work-1440.png') });
  }
  check(errors.length === 0, `no console errors on desktop pinboard (${errors.join(' | ')})`);
  await ctx.close();
}

// --- Views: hash navigation, Back and Forward ---
{
  const { ctx, page, errors } = await openPage(390);
  await page.click('a[href="#about"]');
  await page.waitForTimeout(150);
  const aboutTitle = await page.title();
  check(aboutTitle.includes('About'), `title updates to About (${aboutTitle})`);
  const homeHidden = await page.evaluate(() => document.getElementById('home').hidden);
  check(homeHidden, 'home is hidden when About is shown');
  await page.goBack();
  await page.waitForTimeout(150);
  const backHome = await page.evaluate(() => !document.getElementById('home').hidden);
  check(backHome, 'Back returns to home');
  await page.goForward();
  await page.waitForTimeout(150);
  const fwdAbout = await page.evaluate(() => !document.getElementById('about').hidden);
  check(fwdAbout, 'Forward returns to About');
  await page.evaluate(() => { location.hash = 'work-medjot'; });
  await page.waitForTimeout(150);
  check(await page.evaluate(() => !document.getElementById('work-medjot').hidden), 'case study view opens from its link');
  check(errors.length === 0, `no console errors on view switching (${errors.join(' | ')})`);
  await ctx.close();
}

// --- Phone: contact sheet scrolls sideways natively, and the work cards swipe ---
{
  const { ctx, page } = await openPage(390);
  const sheet = await page.evaluate(() => {
    const el = document.querySelector('[data-sheet]');
    return { sw: el.scrollWidth, cw: el.clientWidth };
  });
  check(sheet.sw > sheet.cw, 'contact sheet scrolls sideways on a phone');
  const strip = await page.evaluate(() => {
    const el = document.querySelector('.work-card__strip');
    return el ? { sw: el.scrollWidth, cw: el.clientWidth, ov: getComputedStyle(el).overflowX } : null;
  });
  check(strip && strip.ov === 'auto', 'work card strips are horizontal scroll containers');
  await page.click('a[href="#work"]');
  await page.waitForTimeout(150);
  const boardHidden = await page.evaluate(() => getComputedStyle(document.querySelector('.board-wrap')).display === 'none');
  check(boardHidden, 'no pinboard on phones (cards instead)');
  const pinboardLoaded = await page.evaluate(() => performance.getEntriesByType('resource').some((r) => r.name.includes('pinboard')));
  check(!pinboardLoaded, 'pinboard script is not loaded on phones');
  await ctx.close();
}

await browser.close();
server.close();
console.log(failures.length ? `\n${failures.length} failure(s)` : '\nall interaction checks passed');
process.exit(failures.length ? 1 : 0);
