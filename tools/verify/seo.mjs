// Verifies the built site (dist/) for SEO, icons and agent files. No dependencies.
// usage: node tools/verify/seo.mjs [distDir]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(process.argv[2] ?? path.join(here, '..', '..', 'dist'));
const problems = [];
const need = (cond, msg) => { if (!cond) problems.push(msg); };
const read = (f) => fs.readFileSync(path.join(dist, f), 'utf8');
const decode = (s) => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x27;/g, "'");

const html = read('index.html');
const content = JSON.parse(fs.readFileSync(path.join(here, '..', '..', 'src', 'data', 'content-v2.json'), 'utf8'));
const siteTs = fs.readFileSync(path.join(here, '..', '..', 'src', 'lib', 'site.ts'), 'utf8');
const SITE_URL = /SITE_URL = '([^']+)'/.exec(siteTs)?.[1];
need(SITE_URL, 'SITE_URL not found');

// 1. files exist
const files = ['favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png',
  'site.webmanifest', 'og.png', 'llms.txt', 'llms-full.txt', 'index.md', 'sitemap.xml', 'robots.txt'];
for (const f of files) need(fs.existsSync(path.join(dist, f)), `missing dist/${f}`);

// 2. og.png size and dimensions
if (fs.existsSync(path.join(dist, 'og.png'))) {
  const buf = fs.readFileSync(path.join(dist, 'og.png'));
  need(buf.readUInt32BE(16) === 1200 && buf.readUInt32BE(20) === 630, 'og.png is not 1200x630');
  need(buf.length < 300 * 1024, `og.png is ${buf.length} bytes (limit 300 KB)`);
}

// 3. ICO header: three entries 16, 32, 48
if (fs.existsSync(path.join(dist, 'favicon.ico'))) {
  const ico = fs.readFileSync(path.join(dist, 'favicon.ico'));
  const n = ico.readUInt16LE(4);
  const sizes = [...Array(n)].map((_, i) => ico.readUInt8(6 + i * 16) || 256).sort((a, b) => a - b);
  need(JSON.stringify(sizes) === '[16,32,48]', `favicon.ico sizes ${sizes}`);
}

// 4. JSON-LD parses; @type values
const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
need(ldBlocks.length === 1, `expected one JSON-LD block, found ${ldBlocks.length}`);
let graph = [];
try {
  const doc = JSON.parse(ldBlocks[0] ?? '');
  graph = doc['@graph'] ?? [];
} catch (e) {
  problems.push('JSON-LD does not parse: ' + e.message);
}
const types = graph.map((g) => g['@type']);
for (const t of ['Person', 'WebSite', 'ProfilePage', 'ItemList']) need(types.includes(t), `JSON-LD missing @type ${t}`);
const person = graph.find((g) => g['@type'] === 'Person') ?? {};
need(person.jobTitle === 'Product engineer', 'Person.jobTitle');
need(Array.isArray(person.sameAs) && person.sameAs.length === 2, 'Person.sameAs');
need(person.worksFor?.name === 'Avinya IT', 'Person.worksFor');
need(person.address?.addressLocality === 'Ahmedabad' && person.address?.addressCountry === 'IN', 'Person.address');
need(Array.isArray(person.knowsAbout) && person.knowsAbout.length > 5, 'Person.knowsAbout');
const list = graph.find((g) => g['@type'] === 'ItemList') ?? {};
const items = list.itemListElement ?? [];
need(items.length === 6, `ItemList has ${items.length} items`);
need(items.every((i) => i.item?.['@type'] === 'CreativeWork'), 'ItemList items must be CreativeWork');
const ldText = ldBlocks[0] ?? '';
for (const p of content.projects) {
  if (!p.client) continue;
  need(!ldText.includes(p.client), `JSON-LD names a client: ${p.client}`);
}
// Every project marked "concept" in the content must be labelled Concept in JSON-LD; real ones must not be.
const shown = new Set(items.map((i) => i.item?.name));
const conceptNames = content.projects.filter((x) => x.status === 'concept' && shown.has(x.title)).map((x) => x.title);
for (const it of items) {
  const isConceptItem = conceptNames.includes(it.item?.name);
  need((it.item?.creativeWorkStatus === 'Concept') === isConceptItem, `${it.item?.name}: creativeWorkStatus must match its content status`);
}

// 5. head tags and relative references
const head = html.slice(0, html.indexOf('</head>'));
const tagList = [...head.matchAll(/<(title|meta|link|script)\b[^>]*>/g)].map((m) => m[0]);
const attrRefs = [...head.matchAll(/\b(href|src)="([^"]+)"/g)].map((m) => m[2]);
for (const ref of attrRefs) {
  const absolute = /^https?:\/\//.test(ref);
  const allowedAbsolute = absolute && ref.startsWith(SITE_URL);
  need(!ref.startsWith('/'), `root-absolute reference in head: ${ref}`);
  if (absolute) need(allowedAbsolute, `absolute reference outside SITE_URL: ${ref}`);
}
for (const f of ['favicon.svg', 'favicon.ico', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'site.webmanifest', 'index.md']) {
  need(attrRefs.includes(f) || attrRefs.includes('./' + f), `head does not link ${f}`);
}
need(/<link rel="canonical" href="[^"]+">/.test(head), 'canonical missing');
need(/<meta name="robots" content="index,follow"/.test(head), 'robots meta missing');
need(/property="og:locale" content="en_IN"/.test(head), 'og:locale missing');
need(/name="twitter:card" content="summary_large_image"/.test(head), 'twitter card missing');
need(/property="og:image:width" content="1200"/.test(head) && /property="og:image:height" content="630"/.test(head), 'og image size missing');
need(/property="og:image:alt" content="[^"]+"/.test(head), 'og image alt missing');
const desc = /<meta name="description" content="([^"]+)"/.exec(head)?.[1] ?? '';
need(desc.length > 0 && desc.length <= 155, `meta description length ${desc.length}`);
need(/<title>Hardik Thanth — Product engineer, apps and web<\/title>/.test(head), 'title text');
const themes = [...head.matchAll(/name="theme-color" content="[^"]+" media="[^"]+"/g)].length;
need(themes === 2, 'theme-color for light and dark');

// 6. one h1
const h1s = (html.match(/<h1[\s>]/g) ?? []).length;
need(h1s === 1, `expected one h1, found ${h1s}`);

// 7. project text in static HTML (decoded), including the sticky note
const text = decode(html);
for (const p of content.projects.filter((x) => ['wholesale-os', 'medjot', 'paper-studio', 'fieldbook', 'dhi', 'net-watch'].includes(x.slug))) {
  for (const key of ['oneLiner', 'challenge', 'approach', 'outcome', 'sticky']) {
    if (p[key]) need(text.includes(p[key]), `static HTML lacks ${p.slug} ${key}`);
  }
  for (const s of p.stack) need(text.includes(s), `static HTML lacks stack item ${s} for ${p.slug}`);
}

// 8. agent files
const llms = read('llms.txt');
need(llms.startsWith('# Hardik Thanth'), 'llms.txt must start with an H1');
need(/^> /m.test(llms), 'llms.txt needs a blockquote summary');
for (const sec of ['## Work', '## About', '## Contact', '## CV', '## GitHub']) need(llms.includes(sec), `llms.txt lacks ${sec}`);
const full = read('llms-full.txt');
const md = read('index.md');
for (const [name, body] of [['llms-full.txt', full], ['index.md', md]]) {
  for (const c of conceptNames) need(new RegExp(`${c}[\\s\\S]{0,400}Concept`).test(body), `${name} must label ${c} as concept`);
  need(!/\b(20\d\d)\b.*\bseason\b/i.test(body), `${name} hard-codes a season`);
}
need(/Availability/.test(full), 'availability rule missing');
need(/index\.md/.test(read('llms.txt')) && /llms-full\.txt/.test(read('llms.txt')), 'llms.txt links');
need(/\[.*\]\(https?:\/\/[^)]+\)/.test(llms), 'llms.txt links should be absolute');
need(md.startsWith('# Hardik Thanth'), 'index.md must start with an H1');

// 9. robots and sitemap
const robots = read('robots.txt');
const ai = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'CCBot'];
for (const ua of ai) need(new RegExp(`User-agent: ${ua}\\nAllow: /`).test(robots), `robots.txt lacks Allow for ${ua}`);
need(/User-agent: \*\nAllow: \//.test(robots), 'robots.txt lacks * rule');
need(robots.startsWith('#') && /Sitemap: https:\/\/[^\s]+\/sitemap\.xml/.test(robots), 'robots.txt Sitemap line');
const sitemap = read('sitemap.xml');
need(sitemap.includes(`<loc>${SITE_URL}/</loc>`), 'sitemap loc');

// report
console.log('head tags:');
for (const t of tagList) console.log('  ' + t.slice(0, 150));
console.log(`JSON-LD @types: ${types.join(', ')}`);
console.log(`ItemList: ${items.length} items; concept projects: ${conceptNames.join(', ') || 'none'}`);
console.log(`h1 count: ${h1s}; description: ${desc.length} chars`);
console.log(problems.length ? '\nPROBLEMS:\n  ' + problems.join('\n  ') : '\nproblems: none');
process.exit(problems.length ? 1 : 0);
