import { agentic } from "@/lib/content";

// Deterministic simulation of one orchestrator run: three agent lanes take
// turns on a task each (queued -> running -> review -> merged). Given the same
// elapsed time the output is always identical, so the loop is reproducible and
// the reduced-motion frame is a real, meaningful state.

export const TIMING = {
  queued: 900,
  running: 3800,
  review: 1700,
  merged: 1400,
  laneOffset: 1300,
  tasksPerLane: 3,
  hold: 2800,
} as const;

export const TASK_MS =
  TIMING.queued + TIMING.running + TIMING.review + TIMING.merged;
export const RUN_MS =
  TIMING.laneOffset * 2 + TASK_MS * TIMING.tasksPerLane + TIMING.hold;

/** First frame shown at rest: lane 1 merged, lane 2 in review, lane 3 running. */
export const START_MS = 7000;

/** Streamed log lines. Index >= GATE_FROM are gates that count as checks. */
export const LOG_LINES = [
  "git worktree add · own db + ports",
  "AGENTS.md + matching skill loaded",
  "vertical slice · schema to UI + tests",
  "typecheck · lint · knip",
  "secret scan · clean",
  "dependency-cruiser · 17 rules",
  "tests against real Postgres",
];
export const GATE_FROM = 3;
export const GATES_PER_TASK = LOG_LINES.length - GATE_FROM;

export const LANES = [
  { agent: agentic.agents[0], slots: [0, 3, 6] },
  { agent: agentic.agents[1], slots: [1, 4, 7] },
  { agent: agentic.agents[2], slots: [2, 5, 8] },
] as const;

export const TOTAL_TASKS = LANES.length * TIMING.tasksPerLane;
export const TOTAL_CHECKS = TOTAL_TASKS * GATES_PER_TASK;

export type Phase = "queued" | "running" | "review" | "merged";

export type LogLine = { text: string; gate: boolean; done: boolean; progress: number };

export type LaneSnapshot = {
  slot: number;
  title: string;
  phase: Phase;
  progress: number;
  log: LogLine[];
};

export function laneSnapshot(lane: number, t: number): LaneSnapshot {
  const { queued, running, review, merged, laneOffset, tasksPerLane } = TIMING;
  const local = t - lane * laneOffset;

  let slot = 0;
  let x = 0;
  if (local >= 0) {
    slot = Math.min(Math.floor(local / TASK_MS), tasksPerLane - 1);
    x = Math.min(local - slot * TASK_MS, TASK_MS - 1);
  }

  const runEnd = queued + running;
  const reviewEnd = runEnd + review;
  let phase: Phase;
  let progress: number;
  if (x < queued) {
    phase = "queued";
    progress = x / queued;
  } else if (x < runEnd) {
    phase = "running";
    progress = (x - queued) / running;
  } else if (x < reviewEnd) {
    phase = "review";
    progress = (x - runEnd) / review;
  } else {
    phase = "merged";
    progress = (x - reviewEnd) / merged;
  }

  const lineWindow = running / LOG_LINES.length;
  const runElapsed =
    phase === "queued" ? 0 : phase === "running" ? x - queued : running;
  const doneCount =
    phase === "queued"
      ? 0
      : phase === "running"
        ? Math.floor(runElapsed / lineWindow)
        : LOG_LINES.length;

  const log: LogLine[] = [];
  for (let i = 0; i < doneCount; i++) {
    log.push({ text: LOG_LINES[i], gate: i >= GATE_FROM, done: true, progress: 1 });
  }
  if (phase === "running" && doneCount < LOG_LINES.length) {
    log.push({
      text: LOG_LINES[doneCount],
      gate: doneCount >= GATE_FROM,
      done: false,
      progress: (runElapsed - doneCount * lineWindow) / lineWindow,
    });
  }

  const taskIndex = LANES[lane].slots[slot];
  return {
    slot,
    title: agentic.sampleTasks[taskIndex],
    phase,
    progress: Math.min(Math.max(progress, 0), 1),
    log,
  };
}

/** Counters for the whole run at time t. */
export function runTotals(t: number) {
  const { queued, running, review, laneOffset, tasksPerLane } = TIMING;
  const runEnd = queued + running;
  const reviewEnd = runEnd + review;
  const lineWindow = running / LOG_LINES.length;
  let mergedCount = 0;
  let checks = 0;
  let inReview = 0;

  for (let lane = 0; lane < LANES.length; lane++) {
    for (let slot = 0; slot < tasksPerLane; slot++) {
      const x = t - (lane * laneOffset + slot * TASK_MS);
      if (x < 0) continue;
      if (x >= reviewEnd) {
        mergedCount++;
      } else if (x >= runEnd) {
        inReview++;
      }
      if (x >= queued) {
        const elapsed = Math.min(x - queued, running);
        const doneLines = Math.min(LOG_LINES.length, Math.floor(elapsed / lineWindow));
        checks += Math.max(0, doneLines - GATE_FROM);
      }
    }
  }

  return { merged: mergedCount, checks, inReview };
}

/** Split a conventional-commit title into its type/scope prefix and subject. */
export function splitTitle(title: string) {
  const match = /^([a-z]+)(\([^)]*\))?:\s*(.*)$/.exec(title);
  if (!match) return { prefix: "", subject: title };
  return { prefix: `${match[1]}${match[2] ?? ""}:`, subject: match[3] };
}
