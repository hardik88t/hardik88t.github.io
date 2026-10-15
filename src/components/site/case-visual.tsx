import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Code-drawn stand-ins for screenshots (there are none yet). Each project gets
// a small interface sketch tinted by its accent colour. Decorative only.

type Kind =
  | "monorepo"
  | "graph"
  | "timeline"
  | "terminal"
  | "chips"
  | "dashboard"
  | "tabs"
  | "chart"
  | "phases"
  | "wireframe"
  | "summarise";

export const VISUAL_KIND: Record<string, Kind> = {
  "avinya-platform": "monorepo",
  dhi: "graph",
  "net-watch": "timeline",
  agx: "terminal",
  medjot: "chips",
  anvika: "dashboard",
  tabbb: "tabs",
  cryptonow: "chart",
  tantr: "phases",
  "client-sites": "wireframe",
  adhyai: "summarise",
};

const tint = (c: string, pct: number) => `color-mix(in oklab, ${c} ${pct}%, transparent)`;

function Frame({ accent, children, label }: { accent: string; children: ReactNode; label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative h-full w-full overflow-hidden"
      style={{
        background: `radial-gradient(120% 90% at 100% 0%, ${tint(accent, 26)}, transparent 60%), var(--panel-2)`,
      }}
    >
      <div aria-hidden="true" className="hero-grid absolute inset-0 opacity-50" />
      <div className="relative h-full p-4 sm:p-5">{children}</div>
    </div>
  );
}

function Bar({ w, className, style }: { w: string; className?: string; style?: CSSProperties }) {
  return <span className={cn("block h-1.5 rounded-full bg-line-strong", className)} style={{ width: w, ...style }} />;
}

function Monorepo({ accent }: { accent: string }) {
  const apps = [0, 1, 2, 3];
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between font-mono text-[10px] text-muted">
        <span>apps/ · packages/</span>
        <span>4 apps · 5 shared</span>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
        {apps.map((a, i) => (
          <div
            key={a}
            className="flex flex-col justify-between rounded-sm border p-2"
            style={{
              borderColor: tint(accent, i === 0 ? 60 : 28),
              background: tint(accent, i === 0 ? 16 : 6),
            }}
          >
            <Bar w="46%" style={{ background: tint(accent, 70) }} />
            <Bar w="72%" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-5 rounded-sm bg-line" />
        ))}
      </div>
      <span className="block h-1 rounded-full bg-gradient-to-r from-s-running via-s-review to-s-merged opacity-80" />
    </div>
  );
}

function Graph({ accent }: { accent: string }) {
  const nodes = [
    [70, 60, 9, 1], [120, 38, 6, 0], [150, 92, 7, 0], [96, 128, 6, 0], [48, 110, 5, 0],
    [206, 58, 10, 1], [246, 36, 6, 0], [236, 110, 7, 0], [270, 84, 5, 0], [184, 136, 6, 0],
  ] as const;
  const edges: [number, number][] = [[0, 1], [0, 2], [0, 3], [0, 4], [1, 2], [3, 4], [5, 6], [5, 7], [5, 8], [7, 8], [2, 5], [9, 7]];
  return (
    <svg viewBox="0 0 300 170" className="h-full w-full" aria-hidden="true">
      <circle cx="95" cy="88" r="62" fill={tint(accent, 9)} />
      <circle cx="232" cy="84" r="54" fill={tint(accent, 6)} />
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={tint(accent, 45)} strokeWidth="1" />
      ))}
      {nodes.map(([x, y, r, hub], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={hub ? accent : tint(accent, 70)} />
      ))}
    </svg>
  );
}

function Timeline({ accent }: { accent: string }) {
  const heights = [40, 62, 55, 70, 48, 66, 30, 58, 74, 44, 60, 52, 38, 68, 56, 46, 64, 36, 72, 50, 58, 42, 66, 54];
  const drops = new Set([6, 17]);
  return (
    <div className="flex h-full flex-col justify-end gap-3">
      <div className="flex h-[70%] items-end gap-[5px]">
        {heights.map((h, i) => (
          <span
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${h}%`,
              background: drops.has(i) ? "var(--s-failed)" : tint(accent, i % 5 === 0 ? 85 : 42),
            }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted">
        <span>00:00</span>
        <span>12:00</span>
        <span>24:00</span>
      </div>
    </div>
  );
}

function Terminal({ accent }: { accent: string }) {
  const lines = [
    { c: "$ agx sync", k: "cmd" },
    { c: "index in sync, both directions", k: "ok" },
    { c: "$ agx search \"trajectory\"", k: "cmd" },
    { c: "matches with session context", k: "out" },
    { c: "$ agx doctor", k: "cmd" },
    { c: "tunnels ready · backups ok", k: "ok" },
  ];
  return (
    <div className="flex h-full flex-col rounded-sm border border-line bg-bg/70 p-3 font-mono text-[11px] leading-5">
      {lines.map((l, i) => (
        <span key={i} className={cn("truncate", l.k === "cmd" ? "text-fg" : l.k === "ok" ? "text-ink-merged" : "text-muted")}>
          {l.k === "cmd" ? <span style={{ color: accent }}>› </span> : "  "}
          {l.c}
        </span>
      ))}
      <span className="mt-1 inline-block h-3 w-[7px] animate-caret bg-fg" aria-hidden="true" />
    </div>
  );
}

function Chips({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap gap-1.5">
        {["headache", "cough", "fever", "rash"].map((c) => (
          <span key={c} className="rounded-sm border px-2 py-1 font-mono text-[11px] text-fg" style={{ borderColor: tint(accent, 55), background: tint(accent, 14) }}>
            {c}
          </span>
        ))}
      </div>
      <div className="rounded-sm border border-line bg-bg/60 p-2.5">
        <span className="block font-mono text-[10px] text-muted">type to search</span>
        <div className="mt-2 space-y-1.5">
          <Bar w="88%" style={{ background: tint(accent, 60) }} />
          <Bar w="66%" />
          <Bar w="52%" />
        </div>
      </div>
      <div className="mt-auto grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="h-9 rounded-sm bg-line" />
        ))}
      </div>
    </div>
  );
}

function Dashboard({ accent }: { accent: string }) {
  return (
    <div className="flex h-full gap-3">
      <div className="hidden w-[22%] flex-col gap-2.5 border-r border-line pr-3 sm:flex">
        {[0, 1, 2, 3].map((i) => (
          <Bar key={i} w={i === 0 ? "90%" : "70%"} style={i === 0 ? { background: tint(accent, 70) } : undefined} />
        ))}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Bar w="38%" className="h-2" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-sm border border-line bg-bg/50 p-2">
              <Bar w="60%" />
              <span className="mt-2 block h-4 w-3/4 rounded-sm" style={{ background: tint(accent, i === 1 ? 55 : 25) }} />
            </div>
          ))}
        </div>
        <div className="space-y-2 rounded-sm border border-line bg-bg/50 p-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="size-2 rounded-full" style={{ background: i === 0 ? tint(accent, 90) : "var(--line-strong)" }} />
              <Bar w={`${70 - i * 12}%`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Tabs({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex gap-1.5 overflow-hidden">
        {["Work", "Later", "Groups"].map((t, i) => (
          <span key={t} className="rounded-sm px-2.5 py-1 font-mono text-[11px] text-fg" style={{ background: i === 0 ? tint(accent, 26) : "var(--line)" }}>
            {t}
          </span>
        ))}
      </div>
      <div className="grid flex-1 grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="relative flex flex-col justify-between rounded-sm border border-line bg-bg/50 p-2.5">
            <span className="size-3 rounded-sm" style={{ background: i === 1 ? accent : "var(--line-strong)" }} />
            <Bar w="70%" />
            {i === 1 && (
              <span className="absolute top-2 right-2 rounded-sm px-1 font-mono text-[9px] text-bg" style={{ background: accent }}>
                dup
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Chart({ accent }: { accent: string }) {
  const pts = "0,70 22,62 44,66 66,48 88,54 110,36 132,44 154,28 176,38 198,22 220,30 242,16 264,24 300,10";
  return (
    <svg viewBox="0 0 300 96" preserveAspectRatio="none" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id={`fill-${accent.slice(1)}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[24, 48, 72].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="var(--line)" strokeWidth="1" />
      ))}
      <polygon points={`0,96 ${pts} 300,96`} fill={`url(#fill-${accent.slice(1)})`} />
      <polyline points={pts} fill="none" stroke={accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Phases({ accent }: { accent: string }) {
  const steps = [
    { t: "Audit", s: "done" },
    { t: "Manifest", s: "done" },
    { t: "Human approval", s: "wait" },
    { t: "Execute", s: "queued" },
  ] as const;
  const dot: Record<string, string> = {
    done: "var(--s-merged)",
    wait: "var(--s-review)",
    queued: "var(--s-queued)",
  };
  return (
    <div className="flex h-full flex-col justify-between">
      {steps.map((st, i) => (
        <div key={st.t} className="flex items-center gap-3">
          <span className="grid size-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] text-fg" style={{ borderColor: dot[st.s], color: dot[st.s] }}>
            {i + 1}
          </span>
          <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-fg">{st.t}</span>
          <span className="h-1.5 w-12 rounded-full" style={{ background: st.s === "done" ? "var(--s-merged)" : st.s === "wait" ? tint(accent, 80) : "var(--line)" }} />
        </div>
      ))}
      <span className="mt-2 inline-block self-start rounded-sm border border-line-strong px-2 py-1 font-mono text-[10px] text-muted">undo script per batch</span>
    </div>
  );
}

function Wireframe({ accent }: { accent: string }) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-sm border border-line bg-bg/50 p-3">
      <div className="flex items-center justify-between">
        <Bar w="22%" style={{ background: tint(accent, 80) }} className="h-2" />
        <div className="flex gap-2">
          <Bar w="28px" />
          <Bar w="28px" />
        </div>
      </div>
      <div className="grid grid-cols-5 items-center gap-3 rounded-sm p-3" style={{ background: tint(accent, 12) }}>
        <div className="col-span-3 space-y-2">
          <Bar w="90%" className="h-2" />
          <Bar w="70%" />
          <span className="mt-2 inline-block h-5 w-20 rounded-sm" style={{ background: accent }} />
        </div>
        <span className="col-span-2 aspect-[4/3] rounded-sm bg-line" />
      </div>
      <div className="grid flex-1 grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <span key={i} className="rounded-sm border border-line" />
        ))}
      </div>
    </div>
  );
}

function Summarise({ accent }: { accent: string }) {
  return (
    <div className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="space-y-2">
        {[92, 78, 88, 64, 80].map((w, i) => (
          <Bar key={i} w={`${w}%`} />
        ))}
      </div>
      <span className="font-mono text-xs" style={{ color: accent }}>
        →
      </span>
      <div className="space-y-2 rounded-sm border p-2.5" style={{ borderColor: tint(accent, 50), background: tint(accent, 10) }}>
        <span className="inline-block rounded-sm px-1.5 py-0.5 font-mono text-[9px] text-bg" style={{ background: accent }}>
          summary
        </span>
        <Bar w="90%" style={{ background: tint(accent, 70) }} />
        <Bar w="62%" style={{ background: tint(accent, 50) }} />
      </div>
    </div>
  );
}

export function CaseVisual({ slug, accent, title }: { slug: string; accent: string; title: string }) {
  const kind = VISUAL_KIND[slug] ?? "wireframe";
  const label = `${title}: illustrative interface sketch`;
  const body = {
    monorepo: <Monorepo accent={accent} />,
    graph: <Graph accent={accent} />,
    timeline: <Timeline accent={accent} />,
    terminal: <Terminal accent={accent} />,
    chips: <Chips accent={accent} />,
    dashboard: <Dashboard accent={accent} />,
    tabs: <Tabs accent={accent} />,
    chart: <Chart accent={accent} />,
    phases: <Phases accent={accent} />,
    wireframe: <Wireframe accent={accent} />,
    summarise: <Summarise accent={accent} />,
  }[kind];
  return <Frame accent={accent} label={label}>{body}</Frame>;
}
