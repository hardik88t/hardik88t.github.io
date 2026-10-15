"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Cpu, Sparkles, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { profile } from "@/lib/content";
import { useInView } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import {
  LANES,
  RUN_MS,
  START_MS,
  TOTAL_CHECKS,
  TOTAL_TASKS,
  laneSnapshot,
  runTotals,
  splitTitle,
  type LaneSnapshot,
  type Phase,
} from "@/lib/orchestrator";

const LANE_ICONS = [Terminal, Cpu, Sparkles] as const;

const PHASE_BADGE: Record<Phase, { variant: "queued" | "running" | "review" | "merged"; label: string }> = {
  queued: { variant: "queued", label: "queued" },
  running: { variant: "running", label: "running" },
  review: { variant: "review", label: "in review" },
  merged: { variant: "merged", label: "squash-merged" },
};

const PHASE_FILL: Record<Phase, string> = {
  queued: "bg-transparent",
  running: "bg-s-running",
  review: "bg-s-review",
  merged: "bg-s-merged",
};

/** Packet that drops down the bus into a lane when a task is dispatched. */
function DispatchPacket() {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute left-1/2 z-20 size-2 -translate-x-1/2 rounded-full bg-s-running shadow-[0_0_0_3px_color-mix(in_oklab,var(--s-running)_22%,transparent)]"
      initial={{ top: -44, opacity: 0 }}
      animate={{ top: 12, opacity: [0, 1, 1, 0.9] }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
    />
  );
}

function LogRows({ snap }: { snap: LaneSnapshot }) {
  if (snap.phase === "queued") {
    return (
      <p className="text-muted">
        <span className="opacity-70">›</span> waiting for a worktree
      </p>
    );
  }
  const rows = snap.log.slice(-3);
  return (
    <ul className="space-y-0.5">
      {rows.map((line, i) => {
        const isStreaming = !line.done;
        const typed = isStreaming
          ? line.text.slice(0, Math.round(line.text.length * line.progress))
          : line.text;
        return (
          <li
            key={`${i}-${line.text}`}
            className={cn("flex min-w-0 items-baseline gap-2", line.done ? "text-muted" : "text-fg")}
          >
            <span aria-hidden="true" className={cn("shrink-0", isStreaming ? "text-ink-running" : "opacity-60")}>
              ›
            </span>
            <span className="min-w-0 truncate">
              {typed}
              {isStreaming && (
                <span aria-hidden="true" className="ml-px inline-block h-3 w-[7px] translate-y-px bg-s-running animate-caret" />
              )}
            </span>
            {line.done && line.gate && (
              <span className="ml-auto shrink-0 text-ink-merged">ok</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function Lane({
  index,
  snap,
  run,
  reduce,
}: {
  index: number;
  snap: LaneSnapshot;
  run: number;
  reduce: boolean;
}) {
  const Icon = LANE_ICONS[index];
  const badge = PHASE_BADGE[snap.phase];
  const { prefix, subject } = splitTitle(snap.title);
  const pct = snap.phase === "merged" ? 100 : Math.round(snap.progress * 100);

  return (
    <li className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-4 py-3.5">
      {/* bus: vertical line with the lane node */}
      <div className="relative flex justify-center">
        <span aria-hidden="true" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-line" />
        <span
          className={cn(
            "relative z-10 grid size-8 place-items-center rounded-md border bg-panel-2",
            snap.phase === "running" && "border-s-running/60 text-ink-running",
            snap.phase === "review" && "border-s-review/60 text-ink-review",
            snap.phase === "merged" && "border-s-merged/60 text-ink-merged",
            snap.phase === "queued" && "border-line-strong text-muted",
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
        </span>
        {!reduce && snap.phase === "queued" && (
          <DispatchPacket key={`${run}-${index}-${snap.slot}`} />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-mono text-[11px] tracking-wide text-muted">
            {LANES[index].agent} · wt-0{index + 1}
          </span>
          <Badge variant={badge.variant} className="shrink-0">
            {badge.label}
          </Badge>
        </div>

        <p className="mt-1.5 min-h-[21px] font-mono text-[13px] leading-[21px] text-fg [overflow-wrap:anywhere]">
          {prefix && <span className="text-muted">{prefix} </span>}
          {subject}
        </p>

        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div
            className={cn("h-full rounded-full transition-[width] duration-100 ease-linear", PHASE_FILL[snap.phase])}
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="mt-3 min-h-[68px] font-mono text-[11.5px] leading-[18px]">
          <LogRows snap={snap} />
        </div>

        {snap.phase === "review" && (
          <div
            key={`${run}-${index}-${snap.slot}-review`}
            className="mt-1 animate-[chip-in_320ms_ease-out_both] font-mono text-[11px] text-ink-review"
          >
            <span className="inline-flex items-center gap-1.5 rounded-sm border border-s-review/45 bg-s-review/10 px-2 py-1">
              <Sparkles className="size-3" aria-hidden="true" />
              pr-review · attesting head SHA
            </span>
          </div>
        )}
        {snap.phase === "merged" && (
          <div
            key={`${run}-${index}-${snap.slot}-merged`}
            className="mt-1 flex animate-[chip-in_320ms_ease-out_both] items-center gap-1.5 font-mono text-[11px] text-ink-merged"
          >
            <Check className="size-3.5" aria-hidden="true" />
            merge gate passed on this exact commit
          </div>
        )}
      </div>
    </li>
  );
}

function Stat({ label, value, of }: { label: string; value: number; of: string }) {
  return (
    <div className="min-w-0 px-4 py-3">
      <p className="font-mono text-[10.5px] tracking-[0.08em] text-muted uppercase">{label}</p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="num text-2xl leading-none font-semibold text-fg">{value}</span>
        <span className="num truncate text-[11px] text-muted">{of}</span>
      </p>
    </div>
  );
}

export function OrchestratorPanel() {
  const reduce = useReducedMotion() ?? false;
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const [elapsed, setElapsed] = useState(START_MS);

  // One shared clock drives every lane. It only runs while the panel is on
  // screen, and never under reduced motion (the start frame is a real state).
  useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    let last = 0;
    let acc = 0;
    const tick = (now: number) => {
      if (last === 0) last = now;
      const dt = Math.min(now - last, 120);
      last = now;
      acc += dt;
      if (acc >= 33) {
        const step = acc;
        acc = 0;
        setElapsed((e) => e + step);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, inView]);

  const t = elapsed % RUN_MS;
  const run = Math.floor(elapsed / RUN_MS) + 1;
  const totals = runTotals(t);
  const snaps = LANES.map((_, i) => laneSnapshot(i, t));

  return (
    <div ref={ref} className="relative">
      <div className="glow pointer-events-none absolute -inset-x-16 -inset-y-12 -z-10 opacity-90" aria-hidden="true" />

      <section
        aria-labelledby="orchestrator-title"
        className="surface relative overflow-hidden rounded-lg shadow-[0_50px_120px_-50px_var(--shade)]"
      >
        <p className="sr-only">
          A simulated run of Hardik&apos;s orchestrator. Three agent lanes take
          conventional-commit tasks through isolated worktrees, local gates,
          independent review and a SHA-bound merge. It is a simulation, not live data.
        </p>

        <header className="flex items-center justify-between gap-4 border-b border-line px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-9 shrink-0 place-items-center rounded-md border border-line-strong bg-panel-2 font-mono text-xs font-semibold text-fg"
            >
              {profile.monogram}
            </span>
            <div className="min-w-0">
              <h3 id="orchestrator-title" className="text-sm leading-tight font-semibold">
                Orchestrator
              </h3>
              <p className="truncate font-mono text-[11px] text-muted">
                {profile.shortName.toLowerCase()} · {LANES.length} agent lanes
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-s-running animate-pulse-soft" />
            <Badge variant="outline">simulated</Badge>
          </div>
        </header>

        <div aria-hidden="true" className="grid grid-cols-3 divide-x divide-line border-b border-line">
          <Stat label="Merged" value={totals.merged} of={`of ${TOTAL_TASKS}`} />
          <Stat label="Checks" value={totals.checks} of={`of ${TOTAL_CHECKS} gates`} />
          <Stat label="In review" value={totals.inReview} of="attesting" />
        </div>

        <ol aria-hidden="true" className="px-4">
          {snaps.map((snap, i) => (
            <Lane key={LANES[i].agent} index={i} snap={snap} run={run} reduce={reduce} />
          ))}
        </ol>

        <footer aria-hidden="true" className="flex items-center justify-between gap-4 border-t border-line px-4 py-3 font-mono text-[11px] text-muted">
          <span className="truncate">run {String(run).padStart(2, "0")} · simulated loop</span>
          <span className="flex shrink-0 items-center gap-2">
            <span className="hidden xl:inline">worktree · gates · review · merge</span>
            <span className="relative h-px w-16 overflow-hidden bg-line-strong">
              <span className="absolute inset-y-0 left-0 bg-s-running" style={{ width: `${(t / RUN_MS) * 100}%` }} />
            </span>
          </span>
        </footer>
      </section>
    </div>
  );
}
