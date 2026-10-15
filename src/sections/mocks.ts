// Code-drawn project mockups. Each one follows its project's `visual` description in content-v2.json,
// with the project accent. Labels and numbers are illustrative UI text (no real data).
// All markup here is static; only the accent colour is interpolated, and it is validated first.

const UI = "'Hanken Grotesk', system-ui, sans-serif";
const MONO = "'Geist Mono', ui-monospace, monospace";
const SERIF = "Georgia, 'Times New Roman', serif";

const INK = '#E8F1F0';
const MUTED = '#8FA8A6';
const PANEL = '#071b1f';
const CARD = '#0a2226';
const CARD2 = '#0f2e33';
const DARK = '#031012';
const GOLD = '#F2C14E';
const RED = '#EF4444';
const PAPER = '#F4F1EA';
const PAPER_INK = '#1d2a2b';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface TextOpts {
  size?: number;
  weight?: number;
  fill?: string;
  mono?: boolean;
  serif?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
}

function textRaw(x: number, y: number, inner: string, o: TextOpts = {}): string {
  const family = o.serif ? SERIF : o.mono ? MONO : UI;
  const op = o.opacity !== undefined ? ` opacity="${o.opacity}"` : '';
  return `<text x="${x}" y="${y}" font-family="${family}" font-size="${o.size ?? 7}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? INK}" text-anchor="${o.anchor ?? 'start'}"${op}>${inner}</text>`;
}

const text = (x: number, y: number, s: string, o: TextOpts = {}): string => textRaw(x, y, esc(s), o);

interface BoxOpts {
  rx?: number;
  fill?: string;
  fo?: number;
  stroke?: string;
  so?: number;
  sw?: number;
}

function box(x: number, y: number, w: number, h: number, b: BoxOpts = {}): string {
  const fo = b.fo !== undefined ? ` fill-opacity="${b.fo}"` : '';
  const stroke = b.stroke ? ` stroke="${b.stroke}" stroke-opacity="${b.so ?? 1}" stroke-width="${b.sw ?? 1}"` : '';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${b.rx ?? 0}" fill="${b.fill ?? 'none'}"${fo}${stroke}/>`;
}

function dot(cx: number, cy: number, r: number, fill: string, fo = 1): string {
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" fill-opacity="${fo}"/>`;
}

function rule(x1: number, y1: number, x2: number, y2: number, stroke: string, so = 0.2, sw = 0.6): string {
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-opacity="${so}" stroke-width="${sw}"/>`;
}

/** Desktop window frame with traffic lights and a centred title. */
function windowChrome(a: string, title: string): string {
  return (
    box(0.5, 0.5, 319, 199, { rx: 9, fill: PANEL, stroke: a, so: 0.4, sw: 1 }) +
    dot(12, 12.5, 2.6, a, 0.85) +
    dot(20, 12.5, 2.6, MUTED, 0.45) +
    dot(28, 12.5, 2.6, MUTED, 0.45) +
    text(160, 15, title, { size: 6.2, mono: true, fill: MUTED, anchor: 'middle' }) +
    rule(0, 23.5, 320, 23.5, MUTED, 0.18)
  );
}

/** Plain rounded frame for phone-style mockups. */
const phoneBackdrop = (a: string): string => box(0.5, 0.5, 319, 199, { rx: 9, fill: PANEL, stroke: a, so: 0.3, sw: 1 });

/* ---------- Wholesale OS: desktop dashboard ---------- */
/* sidebar nav, order table with status pills, stock level bars, an invoice drawer */
function wholesale(a: string): string {
  let s = windowChrome(a, 'Wholesale OS');

  // Sidebar navigation.
  s += box(1, 24, 56, 175, { fill: CARD });
  s += box(8, 31, 8, 8, { rx: 2.5, fill: a });
  const nav = ['Orders', 'Stock', 'Invoices', 'Clients'];
  nav.forEach((label, i) => {
    const y = 52 + i * 14;
    if (i === 0) s += box(3, y - 8, 50, 11, { rx: 2.5, fill: a, fo: 0.2 });
    s += box(7, y - 4, 4, 4, { rx: 1, fill: i === 0 ? a : MUTED, fo: i === 0 ? 1 : 0.5 });
    s += text(14, y, label, { size: 6, fill: i === 0 ? INK : MUTED, weight: i === 0 ? 600 : 400 });
  });

  // Main: heading, action and order table.
  s += text(68, 44, 'Orders', { size: 9, weight: 600 });
  s += text(68, 53, 'Today · 28 open', { size: 5.6, mono: true, fill: MUTED });
  s += box(244, 36, 66, 15, { rx: 4, fill: a });
  s += text(277, 46.5, 'New order', { size: 5.8, weight: 600, fill: DARK, anchor: 'middle' });

  s += text(68, 66, 'ORDER', { size: 4.6, mono: true, fill: MUTED });
  s += text(112, 66, 'CLIENT', { size: 4.6, mono: true, fill: MUTED });
  s += text(166, 66, 'STATUS', { size: 4.6, mono: true, fill: MUTED });
  const rows: [string, string, string, string][] = [
    ['#2041', 'Kiran Stores', 'Packed', GOLD],
    ['#2040', 'Daily Mart', 'Open', MUTED],
    ['#2038', 'Nova Foods', 'Paid', a],
    ['#2036', 'City Chemist', 'Paid', a],
  ];
  rows.forEach(([id, client, status, c], i) => {
    const y = 74 + i * 14;
    s += rule(68, y + 6, 200, y + 6, MUTED, 0.14, 0.5);
    s += text(68, y + 3, id, { size: 5.8, mono: true, fill: MUTED });
    s += text(112, y + 3, client, { size: 6, fill: INK });
    s += box(166, y - 2, 30, 9, { rx: 4.5, fill: c, fo: 0.18 });
    s += text(181, y + 4.3, status, { size: 5.2, weight: 600, fill: c, anchor: 'middle' });
  });

  // Stock level bars.
  s += text(68, 139, 'Stock', { size: 7, weight: 600 });
  const bars: [string, number][] = [
    ['Atta 5 kg', 0.72],
    ['Oil 1 L', 0.38],
    ['Dal 1 kg', 0.12],
  ];
  bars.forEach(([label, v], i) => {
    const y = 148 + i * 12;
    s += text(68, y + 4, label, { size: 5.4, fill: MUTED });
    s += box(112, y, 84, 4, { rx: 2, fill: CARD2 });
    s += box(112, y, 84 * v, 4, { rx: 2, fill: v < 0.2 ? GOLD : a, fo: 0.9 });
  });

  // Invoice drawer over the right edge of the table.
  s += box(204, 58, 112, 136, { rx: 6, fill: CARD2, stroke: a, so: 0.5, sw: 0.8 });
  s += text(212, 72, 'Invoice INV-1184', { size: 6.6, weight: 600 });
  s += text(212, 81, 'Kiran Stores', { size: 5.4, fill: MUTED });
  const lines: [string, string][] = [
    ['Atta 5 kg × 4', 'INR 1,160'],
    ['Oil 1 L × 6', 'INR 1,110'],
    ['Dal 1 kg × 8', 'INR 1,120'],
  ];
  lines.forEach(([label, price], i) => {
    const y = 97 + i * 10;
    s += text(212, y, label, { size: 5.6 });
    s += text(308, y, price, { size: 5.2, mono: true, fill: MUTED, anchor: 'end' });
  });
  s += rule(212, 124, 308, 124, MUTED, 0.3, 0.6);
  s += text(212, 134, 'Total', { size: 6, fill: MUTED });
  s += text(308, 135, 'INR 3,390', { size: 7.4, weight: 600, fill: a, anchor: 'end' });
  s += box(212, 149, 96, 15, { rx: 4, fill: a });
  s += text(260, 158.8, 'Send invoice', { size: 5.8, weight: 600, fill: DARK, anchor: 'middle' });
  return s;
}

/* ---------- Paper Studio: question list and typeset paper preview ---------- */
/* question list on the left, typeset A4 paper preview on the right, an 'AI draft' button */
function paper(a: string): string {
  let s = windowChrome(a, 'Paper Studio');

  // Question bank with the AI draft action.
  s += box(1, 24, 112, 175, { fill: CARD });
  s += text(9, 38, 'Question bank', { size: 6.6, weight: 600 });
  s += box(9, 44, 96, 14, { rx: 4, fill: a });
  s += text(57, 53.6, 'AI draft', { size: 6, weight: 600, fill: DARK, anchor: 'middle' });
  const questions: [string, string, string][] = [
    ['Q1', 'Convex lens', 'Short'],
    ['Q2', 'Work done', 'MCQ'],
    ['Q3', "Ohm's law", 'Short'],
    ['Q4', "Newton's 2nd", 'Long'],
    ['Q5', 'Field lines', 'MCQ'],
  ];
  questions.forEach(([n, label, kind], i) => {
    const y = 68 + i * 22;
    if (i === 1) s += box(4, y - 9, 106, 17, { rx: 3, fill: a, fo: 0.16 });
    s += text(9, y + 2, n, { size: 5.6, mono: true, fill: i === 1 ? a : MUTED });
    s += text(22, y + 2, label, { size: 6.2 });
    s += text(108, y + 2, kind, { size: 4.6, mono: true, fill: MUTED, anchor: 'end' });
    s += rule(9, y + 8, 108, y + 8, MUTED, 0.14, 0.5);
  });

  // Typeset paper preview with a soft shadow.
  s += box(128, 36, 144, 168, { rx: 2, fill: '#000', fo: 0.35 });
  s += box(123, 31, 144, 168, { rx: 2, fill: PAPER });
  s += text(133, 44, 'Physics', { size: 7.4, weight: 700, fill: PAPER_INK, serif: true });
  s += text(133, 52, 'Unit test 3 · 40 marks', { size: 4.9, fill: '#5b6667', serif: true });
  s += rule(133, 57, 257, 57, PAPER_INK, 0.6, 0.5);
  const body: [number, string][] = [
    [66, 'Q1. A convex lens of focal length 15 cm'],
    [72, 'forms a real image of an object 30 cm'],
    [78, 'away. Find the image distance. (3)'],
    [89, 'Q2. Define work done by a force. (2)'],
    [101, "Q3. State Ohm's law and draw the"],
    [107, 'V-I graph for a conductor. (2)'],
    [118, 'Q4. A ball is thrown upward. Explain'],
    [124, 'why its speed is zero at the top. (3)'],
  ];
  body.forEach(([y, line]) => {
    s += text(133, y, line, { size: 4.8, fill: PAPER_INK, serif: true });
  });
  // Small ray diagram as a figure on the sheet.
  s += rule(133, 150, 257, 150, PAPER_INK, 0.45, 0.5);
  s += `<ellipse cx="196" cy="150" rx="2.4" ry="13" fill="none" stroke="${a}" stroke-width="1.2"/>`;
  s += `<path d="M 148 162 L 196 150 L 244 138" fill="none" stroke="${PAPER_INK}" stroke-width="0.6"/>`;
  s += `<path d="M 148 150 L 196 150" fill="none" stroke="${PAPER_INK}" stroke-width="0.5" stroke-dasharray="1.5 1.5"/>`;
  s += text(133, 176, 'Fig. 1', { size: 4.2, fill: '#5b6667', serif: true });
  s += text(257, 192, '1 / 2', { size: 4.4, fill: '#5b6667', serif: true, anchor: 'end' });
  return s;
}

/* ---------- Fieldbook: three phone screens ---------- */
/* today's route list, product catalogue grid, cart with 'Place order' */
function fieldbook(a: string): string {
  let s = phoneBackdrop(a);
  const xs = [14, 118, 222];
  xs.forEach((x) => {
    s += box(x, 14, 84, 172, { rx: 14, fill: CARD, stroke: a, so: 0.45, sw: 1 });
    s += box(x + 4, 20, 76, 160, { rx: 10, fill: PANEL });
    s += box(x + 34, 23, 16, 3, { rx: 1.5, fill: CARD2 });
  });

  // Screen 1: today's route.
  let x = xs[0];
  s += text(x + 9, 38, "Today's route", { size: 6.2, weight: 600 });
  s += text(x + 9, 46, '6 shops · Tue', { size: 4.8, mono: true, fill: MUTED });
  const stops: [string, string][] = [
    ['Mehta Store', '09:30'],
    ['City Chemist', '10:15'],
    ['Green Mart', '11:40'],
    ['Bhatt Traders', '13:00'],
  ];
  stops.forEach(([name, time], i) => {
    const y = 54 + i * 21;
    s += box(x + 9, y, 66, 16, { rx: 4, fill: CARD2, stroke: i === 1 ? a : 'none', sw: 0.8 });
    s += dot(x + 14, y + 8, 2, i < 1 ? MUTED : a, i < 1 ? 0.6 : 1);
    s += text(x + 19, y + 10, name, { size: 5.1 });
    s += text(x + 71, y + 10, time, { size: 4.4, mono: true, fill: MUTED, anchor: 'end' });
  });
  s += box(x + 9, 146, 66, 14, { rx: 5, fill: a });
  s += text(x + 42, 155.6, 'Start route', { size: 5.2, weight: 600, fill: DARK, anchor: 'middle' });

  // Screen 2: catalogue grid.
  x = xs[1];
  s += text(x + 9, 38, 'Catalogue', { size: 6.2, weight: 600 });
  s += box(x + 9, 44, 66, 11, { rx: 5.5, fill: CARD2 });
  s += text(x + 14, 51.6, 'Search', { size: 4.6, fill: MUTED });
  const tiles: [string, string, string][] = [
    ['Atta 5kg', '320', a],
    ['Oil 1L', '185', GOLD],
    ['Dal 1kg', '180', MUTED],
    ['Rice 1kg', '96', a],
  ];
  tiles.forEach(([label, price, c], i) => {
    const tx = x + 9 + (i % 2) * 33;
    const ty = 62 + Math.floor(i / 2) * 48;
    s += box(tx, ty, 30, 42, { rx: 4, fill: CARD2 });
    s += box(tx + 5, ty + 5, 20, 18, { rx: 3, fill: c, fo: 0.55 });
    s += text(tx + 3, ty + 31, label, { size: 4.3 });
    s += text(tx + 3, ty + 38, `INR ${price}`, { size: 4, mono: true, fill: c });
  });

  // Screen 3: cart and place order.
  x = xs[2];
  s += text(x + 9, 38, 'Cart', { size: 6.2, weight: 600 });
  const lines: [string, string][] = [
    ['Atta 5kg × 2', '640'],
    ['Oil 1L × 1', '185'],
    ['Dal 1kg × 3', '540'],
  ];
  lines.forEach(([label, price], i) => {
    const y = 52 + i * 14;
    s += text(x + 9, y, label, { size: 5 });
    s += text(x + 75, y, price, { size: 4.8, mono: true, fill: MUTED, anchor: 'end' });
  });
  s += rule(x + 9, 94, x + 75, 94, MUTED, 0.3, 0.5);
  s += text(x + 9, 105, 'Total', { size: 5.2, fill: MUTED });
  s += text(x + 75, 106, 'INR 1,365', { size: 6, weight: 600, anchor: 'end' });
  s += box(x + 9, 116, 66, 16, { rx: 5, fill: a });
  s += text(x + 42, 126.6, 'Place order', { size: 5.4, weight: 600, fill: DARK, anchor: 'middle' });
  s += text(x + 9, 144, 'Delivers Thu, 11:00', { size: 4.3, fill: MUTED });
  return s;
}

/* ---------- Net Watch: connection timeline on one phone ---------- */
/* timeline of connection events with red drop markers and an Export button */
function netwatch(a: string): string {
  let s = phoneBackdrop(a);
  const X = 96;
  const Y = 10;
  const W = 128;
  const H = 180;
  s += box(X, Y, W, H, { rx: 18, fill: CARD, stroke: a, so: 0.45, sw: 1 });
  s += box(X + 4, Y + 6, W - 8, H - 12, { rx: 14, fill: PANEL });
  s += box(X + W / 2 - 12, Y + 9, 24, 3.5, { rx: 1.7, fill: CARD2 });

  s += text(X + 12, Y + 34, 'Connection', { size: 8, weight: 600 });
  s += text(X + 12, Y + 44, 'Monitoring · 24 h', { size: 4.8, mono: true, fill: MUTED });

  // Quality bars for the last 24 hours. Drops are red.
  const heights = [22, 25, 21, 27, 24, 26, 3, 23, 25, 22, 26, 24, 20, 4, 24, 27, 23, 25, 22, 26, 3, 24, 22, 25];
  const bw = (W - 24) / heights.length;
  heights.forEach((h, i) => {
    const isDrop = h < 6;
    s += box(X + 12 + i * bw, Y + 86 - h, Math.max(1.6, bw - 1.1), h, { rx: 0.8, fill: isDrop ? RED : a, fo: isDrop ? 1 : 0.55 });
  });
  s += rule(X + 12, Y + 86.5, X + W - 12, Y + 86.5, MUTED, 0.3, 0.5);

  // Event timeline.
  const events: [string, string, string, string][] = [
    ['08:12', 'Connected · 48 Mbps', a, INK],
    ['09:40', 'Drop · 14 s', RED, RED],
    ['13:05', 'Slow · 2.1 Mbps', GOLD, INK],
    ['18:22', 'Drop · 41 s', RED, RED],
  ];
  s += rule(X + 34, Y + 112, X + 34, Y + 148, MUTED, 0.3, 0.6);
  events.forEach(([time, label, c, ink], i) => {
    const y = Y + 116 + i * 12;
    s += dot(X + 34, y - 1.5, 2, c);
    s += text(X + 12, y + 1, time, { size: 4.4, mono: true, fill: MUTED });
    s += text(X + 41, y + 1, label, { size: 5.1, fill: ink, weight: ink === RED ? 600 : 400 });
  });

  s += box(X + 12, Y + 157, W - 24, 14, { rx: 7, fill: a });
  s += text(X + W / 2, Y + 166.6, 'Export report', { size: 5.6, weight: 600, fill: DARK, anchor: 'middle' });
  return s;
}

/* ---------- Dhi: editor and a knowledge graph ---------- */
/* editor on the left, a node-link knowledge graph with coloured clusters on the right */
function dhi(a: string): string {
  let s = windowChrome(a, 'Dhi');

  // Editor pane.
  s += box(1, 24, 146, 175, { fill: CARD });
  s += text(11, 42, '# Attention', { size: 8.6, weight: 700 });
  s += text(11, 54, 'Lets each token weigh every other', { size: 5.5, fill: INK, opacity: 0.85 });
  s += text(11, 62, 'token in the same passage.', { size: 5.5, fill: INK, opacity: 0.85 });
  const link = (t: string) => `<tspan fill="${a}" font-weight="600">${esc(t)}</tspan>`;
  s += textRaw(11, 76, `Related: ${link('[[transformers]]')}`, { size: 5.5, fill: INK, opacity: 0.85 });
  s += textRaw(11, 84, `${link('[[retrieval]]')} for context.`, { size: 5.5, fill: INK, opacity: 0.85 });
  s += text(11, 102, '## Open questions', { size: 6.4, weight: 600 });
  s += text(11, 113, '- Cost at long context', { size: 5.4, fill: MUTED });
  s += textRaw(11, 123, `- When does ${link('[[RAG]]')} win?`, { size: 5.4, fill: MUTED });
  s += text(11, 190, 'Saved · 2 min ago', { size: 4.6, mono: true, fill: MUTED });

  // Graph pane with three coloured clusters.
  s += box(147, 24, 172, 175, { fill: DARK });
  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 2], [2, 3], [0, 3],
    [4, 5], [4, 6], [5, 6], [6, 7],
    [8, 9], [9, 10], [8, 10], [10, 11],
    [3, 4], [7, 8], [0, 8],
  ];
  const nodes: [number, number, number, string, string?][] = [
    [182, 60, 4.2, a, 'Attention'],
    [206, 46, 2.8, a],
    [214, 72, 3.4, a],
    [192, 86, 2.6, a],
    [262, 104, 4, '#3FE0D0', 'RAG'],
    [282, 96, 2.6, '#3FE0D0'],
    [290, 122, 3.2, '#3FE0D0'],
    [266, 134, 2.4, '#3FE0D0'],
    [204, 146, 4, GOLD, 'Graph'],
    [222, 164, 3, GOLD],
    [192, 168, 2.4, GOLD],
    [232, 140, 2.2, GOLD],
  ];
  edges.forEach(([i, j]) => {
    const [x1, y1] = nodes[i];
    const [x2, y2] = nodes[j];
    s += rule(x1, y1, x2, y2, MUTED, 0.3, 0.6);
  });
  nodes.forEach(([x, y, r, c, label]) => {
    s += dot(x, y, r, c, 0.92);
    if (label) s += text(x, y - r - 3, label, { size: 5.2, anchor: 'middle', weight: 600 });
  });
  s += dot(300, 58, 1.8, MUTED, 0.6);
  s += dot(158, 150, 1.8, MUTED, 0.6);
  return s;
}

const MOCKS: Record<string, (a: string) => string> = {
  'wholesale-os': wholesale,
  'paper-studio': paper,
  fieldbook,
  'net-watch': netwatch,
  dhi,
};

const safeAccent = (c: string): string => (/^#[0-9a-f]{6}$/i.test(c) ? c : '#3FE0D0');

/** Complete SVG markup for one project mockup (16:10). Unknown slugs fall back to the dashboard. */
export function mockSvg(slug: string, accent: string): string {
  const draw = MOCKS[slug] ?? wholesale;
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" focusable="false" aria-hidden="true">${draw(safeAccent(accent))}</svg>`;
}
