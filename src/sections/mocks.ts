// Code-drawn project visuals (SVG). Colours derive from each project's accent.
// No text labels or figures: these are decorative mockups, not data.

export type MockKind = 'board' | 'graph' | 'phone' | 'terminal' | 'chart' | 'chat' | 'page' | 'cards' | 'browser';

const PRIORITY: [string, MockKind][] = [
  ['cli', 'terminal'],
  ['native-mobile', 'phone'],
  ['desktop', 'graph'],
  ['data-viz', 'chart'],
  ['ai', 'chat'],
  ['agentic', 'board'],
  ['website', 'page'],
  ['ui-ux', 'cards'],
  ['web-app', 'browser'],
];

export function mockKindFor(categories: string[]): MockKind {
  for (const [cat, kind] of PRIORITY) if (categories.includes(cat)) return kind;
  return 'browser';
}

const safeAccent = (c: string) => (/^#[0-9a-f]{6}$/i.test(c) ? c : '#3FE0D0');

const frame = (a: string, body: string) => `
  <rect x="14" y="14" width="292" height="172" rx="10" fill="#071b1f" stroke="${a}" stroke-opacity=".35"/>
  <circle cx="28" cy="27" r="3" fill="${a}" opacity=".7"/><circle cx="38" cy="27" r="3" fill="#8FA8A6" opacity=".4"/><circle cx="48" cy="27" r="3" fill="#8FA8A6" opacity=".4"/>
  <line x1="14" y1="38" x2="306" y2="38" stroke="${a}" stroke-opacity=".18"/>
  ${body}`;

function board(a: string): string {
  const cols = [0, 1, 2];
  let s = '';
  cols.forEach((c) => {
    const x = 28 + c * 94;
    s += `<rect x="${x}" y="50" width="82" height="128" rx="4" fill="#0a2226"/>`;
    s += `<rect x="${x + 8}" y="58" width="36" height="4" rx="2" fill="${a}" opacity=".6"/>`;
    for (let r = 0; r < 4; r++) {
      const hi = (c === 0 && r === 1) || (c === 2 && r === 0);
      s += `<rect x="${x + 7}" y="${70 + r * 26}" width="68" height="20" rx="3" fill="${hi ? a : '#0f2e33'}" fill-opacity="${hi ? 0.9 : 1}" stroke="${a}" stroke-opacity=".25"/>`;
      s += `<rect x="${x + 12}" y="${77 + r * 26}" width="${34 - r * 4}" height="3" rx="1.5" fill="${hi ? '#031012' : '#8FA8A6'}" fill-opacity="${hi ? 0.8 : 0.5}"/>`;
    }
  });
  s += `<path d="M 70 80 C 100 80, 100 110, 122 110 M 164 136 C 190 136, 190 90, 216 90" fill="none" stroke="${a}" stroke-width="1.4" stroke-dasharray="3 3" opacity=".7"/>`;
  return frame(a, s);
}

function browser(a: string): string {
  let s = `<rect x="14" y="38" width="62" height="148" fill="#0a2226"/>`;
  for (let i = 0; i < 5; i++) s += `<rect x="24" y="${54 + i * 22}" width="42" height="5" rx="2.5" fill="#8FA8A6" fill-opacity=".35"/>`;
  [0, 1, 2].forEach((i) => {
    s += `<rect x="${88 + i * 72}" y="50" width="64" height="40" rx="4" fill="#0f2e33" stroke="${a}" stroke-opacity=".25"/>`;
    s += `<rect x="${96 + i * 72}" y="60" width="28" height="4" rx="2" fill="${a}" opacity=".55"/>`;
    s += `<rect x="${96 + i * 72}" y="72" width="44" height="10" rx="2" fill="#8FA8A6" fill-opacity=".3"/>`;
  });
  const bars = [30, 52, 40, 66, 48, 72, 58];
  bars.forEach((h, i) => {
    s += `<rect x="${92 + i * 25}" y="${166 - h}" width="15" height="${h}" rx="2" fill="${a}" fill-opacity="${0.35 + (i % 3) * 0.2}"/>`;
  });
  return frame(a, s);
}

function cards(a: string): string {
  let s = '';
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 3; c++) {
      const x = 28 + c * 90;
      const y = 52 + r * 66;
      s += `<rect x="${x}" y="${y}" width="80" height="58" rx="6" fill="#0a2226" stroke="${a}" stroke-opacity=".2"/>`;
      s += `<rect x="${x + 8}" y="${y + 8}" width="14" height="14" rx="4" fill="${(r + c) % 2 ? a : '#8FA8A6'}" fill-opacity=".75"/>`;
      s += `<rect x="${x + 8}" y="${y + 32}" width="50" height="4" rx="2" fill="#8FA8A6" fill-opacity=".45"/>`;
      s += `<rect x="${x + 8}" y="${y + 41}" width="34" height="4" rx="2" fill="#8FA8A6" fill-opacity=".25"/>`;
    }
  }
  return frame(a, s);
}

function graph(a: string): string {
  const nodes: [number, number, number][] = [
    [70, 80, 6], [112, 60, 4], [142, 102, 7], [96, 130, 4], [56, 120, 5], [180, 66, 5], [210, 118, 8],
    [238, 84, 4], [262, 140, 5], [176, 150, 4], [228, 52, 3], [150, 40, 3], [92, 162, 3], [160, 124, 4],
  ];
  const edges: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 4], [2, 13], [13, 9], [9, 6], [6, 7], [7, 5], [5, 1], [6, 8], [10, 7], [11, 1], [12, 3], [13, 3]];
  let s = '';
  edges.forEach(([i, j]) => {
    const [x1, y1] = nodes[i];
    const [x2, y2] = nodes[j];
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${a}" stroke-opacity=".3"/>`;
  });
  nodes.forEach(([x, y, r], i) => {
    s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${i % 3 === 0 ? a : '#8FA8A6'}" fill-opacity="${i % 3 === 0 ? 0.9 : 0.55}"/>`;
  });
  return frame(a, s);
}

function phone(a: string): string {
  let s = `<rect x="112" y="26" width="96" height="152" rx="16" fill="#0a2226" stroke="${a}" stroke-opacity=".4"/>`;
  s += `<rect x="150" y="30" width="20" height="4" rx="2" fill="#031012"/>`;
  for (let i = 0; i < 4; i++) {
    const y = 52 + i * 26;
    s += `<rect x="122" y="${y}" width="76" height="20" rx="5" fill="#0f2e33"/>`;
    s += `<circle cx="132" cy="${y + 10}" r="5" fill="${i % 2 ? a : '#8FA8A6'}" fill-opacity=".7"/>`;
    s += `<rect x="142" y="${y + 7}" width="46" height="4" rx="2" fill="#8FA8A6" fill-opacity=".4"/>`;
  }
  s += `<rect x="122" y="160" width="76" height="8" rx="4" fill="${a}" fill-opacity=".5"/>`;
  return `<rect x="14" y="14" width="292" height="172" rx="10" fill="#071b1f" stroke="${a}" stroke-opacity=".2"/>` + s;
}

function terminal(a: string): string {
  let s = '';
  const widths = [120, 90, 150, 60, 110, 130];
  widths.forEach((w, i) => {
    const y = 58 + i * 17;
    s += `<text x="28" y="${y + 6}" font-family="monospace" font-size="10" fill="${a}">$</text>`;
    s += `<rect x="42" y="${y}" width="${w}" height="5" rx="2.5" fill="#8FA8A6" fill-opacity="${i === 0 ? 0.7 : 0.35}"/>`;
  });
  s += `<rect x="42" y="${58 + widths.length * 17}" width="7" height="11" fill="${a}"/>`;
  return frame(a, s);
}

function chart(a: string): string {
  let s = '';
  for (let i = 0; i < 4; i++) s += `<line x1="28" y1="${62 + i * 30}" x2="292" y2="${62 + i * 30}" stroke="#8FA8A6" stroke-opacity=".12"/>`;
  const pts: [number, number][] = [[28, 150], [70, 120], [110, 132], [150, 92], [190, 104], [230, 66], [268, 80], [292, 52]];
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  s += `<defs><linearGradient id="g-${a.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}" stop-opacity=".45"/><stop offset="1" stop-color="${a}" stop-opacity="0"/></linearGradient></defs>`;
  s += `<path d="${d} L292 170 L28 170 Z" fill="url(#g-${a.slice(1)})"/>`;
  s += `<path d="${d}" fill="none" stroke="${a}" stroke-width="2"/>`;
  [0, 1, 2, 3, 4, 5, 6].forEach((i) => {
    const h = 14 + ((i * 37) % 30);
    s += `<rect x="${32 + i * 36}" y="${170 - h}" width="10" height="${h}" rx="2" fill="#8FA8A6" fill-opacity=".3"/>`;
  });
  return frame(a, s);
}

function chat(a: string): string {
  let s = '';
  const bubbles: [number, number, number, boolean][] = [
    [36, 54, 130, false], [150, 84, 130, true], [36, 116, 150, false], [120, 146, 140, true],
  ];
  bubbles.forEach(([x, y, w, mine]) => {
    s += `<rect x="${x}" y="${y}" width="${w}" height="22" rx="11" fill="${mine ? a : '#0f2e33'}" fill-opacity="${mine ? 0.85 : 1}"/>`;
    s += `<rect x="${x + 12}" y="${y + 9}" width="${w * 0.6}" height="4" rx="2" fill="${mine ? '#031012' : '#8FA8A6'}" fill-opacity=".6"/>`;
  });
  [0, 1, 2].forEach((i) => (s += `<circle cx="${36 + i * 9}" cy="168" r="2.5" fill="${a}" opacity="${0.4 + i * 0.25}"/>`));
  return frame(a, s);
}

function page(a: string): string {
  let s = `<rect x="28" y="50" width="264" height="22" rx="4" fill="#0a2226"/>`;
  s += `<rect x="36" y="58" width="36" height="6" rx="3" fill="${a}" opacity=".8"/>`;
  s += `<rect x="200" y="58" width="80" height="6" rx="3" fill="#8FA8A6" fill-opacity=".4"/>`;
  s += `<rect x="28" y="82" width="150" height="66" rx="6" fill="${a}" fill-opacity=".22"/>`;
  s += `<rect x="40" y="96" width="90" height="8" rx="4" fill="#E8F1F0" fill-opacity=".7"/>`;
  s += `<rect x="40" y="112" width="64" height="5" rx="2.5" fill="#E8F1F0" fill-opacity=".35"/>`;
  s += `<rect x="190" y="82" width="102" height="66" rx="6" fill="#0a2226"/>`;
  [0, 1].forEach((i) => (s += `<rect x="${28 + i * 92}" y="158" width="84" height="18" rx="4" fill="#0f2e33"/>`));
  return frame(a, s);
}

const MOCKS: Record<MockKind, (a: string) => string> = { board, browser, cards, graph, phone, terminal, chart, chat, page };

/** Full SVG markup for a project visual, built from static code only. */
export function mockSvg(kind: MockKind, accent: string): string {
  const a = safeAccent(accent);
  return `<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" focusable="false" aria-hidden="true">${MOCKS[kind](a)}</svg>`;
}
