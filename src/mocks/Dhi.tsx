import { Icon, type IconName } from '../shared/icons';
import s from './Dhi.module.css';

type Cluster = { key: string; color: string; cx: number; cy: number; names: string[] };

const CLUSTERS: Cluster[] = [
  { key: 'Design', color: '#6366f1', cx: 170, cy: 230, names: ['Cognitive load', 'Onboarding flows', 'Progressive disclosure', 'Empty states', 'Hierarchy', 'Microcopy', 'Focus rings'] },
  { key: 'Research', color: '#0d9488', cx: 462, cy: 170, names: ['Interview notes', 'Churn signals', 'Survey themes', 'Usability tests', 'Reading notes', 'Retention curves'] },
  { key: 'Product', color: '#d97706', cx: 190, cy: 520, names: ['Pricing tiers', 'Activation', 'Notification design', 'Roadmap bets', 'Weekly review', 'Trial length'] },
  { key: 'Writing', color: '#db2777', cx: 500, cy: 540, names: ['Plain language', 'Headlines', 'Changelog tone', 'Essay drafts', 'Glossary'] },
];

const HUB = { x: 336, y: 372 };

interface GNode {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  r: number;
  hub: boolean;
}

interface GEdge {
  a: number;
  b: number;
  direct?: boolean;
  cross?: boolean;
}

// Seeded layout so every render matches.
let seed = 11;
const rnd = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

const NODES: GNode[] = [];
const EDGES: GEdge[] = [];

NODES.push({ id: 'attention', name: 'Attention', color: '#4f46e5', x: HUB.x, y: HUB.y, r: 15, hub: true });

CLUSTERS.forEach((c) => {
  const start = NODES.length;
  c.names.forEach((name, i) => {
    const angle = (i / c.names.length) * Math.PI * 2 + rnd() * 0.5;
    const radius = 70 + rnd() * 52;
    NODES.push({
      id: `${c.key}-${i}`,
      name,
      color: c.color,
      x: c.cx + Math.cos(angle) * radius,
      y: c.cy + Math.sin(angle) * radius,
      r: i === 0 ? 7 : 4.5,
      hub: i === 0,
    });
  });
  // Ring inside the cluster, plus a spoke from the cluster hub to the centre.
  for (let i = 0; i < c.names.length; i++) {
    const a = start + i;
    const b = start + ((i + 1) % c.names.length);
    EDGES.push({ a, b });
  }
  EDGES.push({ a: start, b: start + 3, cross: false });
  EDGES.push({ a: 0, b: start, direct: true });
});

// Cross-cluster links.
EDGES.push({ a: 1, b: 8, cross: true });
EDGES.push({ a: 3, b: 16, cross: true });
EDGES.push({ a: 2, b: 22, cross: true });
EDGES.push({ a: 4, b: 17, cross: true });

const SVG_W = 664;
const SVG_H = 700;

const ICONS: IconName[] = ['file', 'route', 'search', 'sparkle', 'settings'];

export function Dhi() {
  return (
    <div className={s.root} aria-hidden="true">
      <div className={s.titlebar}>
        <span className={s.lights}>
          <i />
          <i />
          <i />
        </span>
        <p>Dhi · Ideas</p>
      </div>

      <div className={s.window}>
        <nav className={s.rail}>
          {ICONS.map((ic, i) => (
            <span key={ic} className={`${s.railBtn} ${i === 0 ? s.railOn : ''}`}>
              <Icon name={ic} size={18} />
            </span>
          ))}
        </nav>

        <section className={s.editor}>
          <div className={s.crumbs}>
            <span>Ideas</span>
            <Icon name="chevron-right" size={13} />
            <span>Attention</span>
            <span className={s.spacer} />
            <span className={s.saved}>Saved</span>
          </div>

          <div className={s.doc}>
            <p className={s.h1}>Attention is a limited budget</p>
            <p className={s.meta}>Created 3 Oct · from Reading notes · 4 links</p>

            <p className={s.p}>
              Every reader has a fixed amount of attention each day. Products that spend it carelessly lose the reader before the point lands.
            </p>
            <p className={s.p}>
              This note links to <span className={s.wl}>Cognitive load</span> and <span className={s.wl}>Onboarding flows</span>. The same
              tension shows up in <span className={s.wl}>Notification design</span>.
            </p>

            <blockquote className={s.quote}>
              “Clarity is the cheapest feature to ship.”
              <cite>Reading notes, 4 Mar</cite>
            </blockquote>

            <p className={s.h2}>Implications</p>
            <ul className={s.list}>
              <li>Show one decision per screen</li>
              <li>Move secondary actions behind a menu</li>
              <li>Measure drop-off before adding copy</li>
            </ul>
          </div>

          <div className={s.backlinks}>
            <p className={s.blTitle}>Linked from 4 notes</p>
            <div className={s.blRow}>
              <span>Onboarding flows</span>
              <span>Notification design</span>
              <span>Weekly review</span>
            </div>
          </div>
        </section>

        <section className={s.graph}>
          <div className={s.gHead}>
            <p>Graph</p>
            <span>128 notes · local view</span>
          </div>
          <svg className={s.svg} viewBox={`0 0 ${SVG_W} ${SVG_H}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
            {CLUSTERS.map((c) => (
              <circle key={`halo-${c.key}`} cx={c.cx} cy={c.cy} r={150} fill={c.color} opacity={0.075} />
            ))}

            {EDGES.map((e, i) => {
              const A = NODES[e.a];
              const B = NODES[e.b];
              if (!A || !B) return null;
              const cls = e.direct ? s.edgeHub : e.cross ? s.edgeCross : s.edge;
              return <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y} className={cls} />;
            })}

            {NODES.map((n) => (
              <g key={n.id}>
                <circle cx={n.x} cy={n.y} r={n.r} fill={n.color} stroke="#ffffff" strokeWidth={2} />
                <text x={n.x} y={n.y + n.r + 14} textAnchor="middle" className={n.hub ? s.nodeLabelHub : s.nodeLabel}>
                  {n.name}
                </text>
              </g>
            ))}
          </svg>

          <div className={s.legend}>
            {CLUSTERS.map((c) => (
              <span key={c.key}>
                <i style={{ background: c.color }} />
                {c.key}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
