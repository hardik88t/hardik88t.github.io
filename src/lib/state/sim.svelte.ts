// Simulated agent fleet for the live widgets. It only uses real names, real sample
// tasks and the real pipeline. Progress is a deterministic loop. It ticks only while a
// visible subscriber exists, stops when the tab is hidden, and holds still under
// reduced motion (a meaningful static frame).
import { agentic } from '$lib/content';

export interface AgentRow {
	agent: string;
	task: string;
	progress: number;
	speed: number;
	taskIdx: number;
	merged: number;
}

const STAGES = agentic.pipeline.length;
const TASKS = agentic.sampleTasks;
const SPEEDS = [3.9, 2.8, 4.6, 3.3, 4.1, 2.6];
const START = [18, 56, 7, 71, 38, 29];

function makeRows(): AgentRow[] {
	return agentic.agents.map((agent, i) => ({
		agent,
		task: TASKS[i % TASKS.length],
		progress: START[i % START.length],
		speed: SPEEDS[i % SPEEDS.length],
		taskIdx: i % TASKS.length,
		merged: 0
	}));
}

export const sim = $state({
	rows: makeRows(),
	tick: 0,
	observers: 0,
	reduced: false
});

let timer: ReturnType<typeof setInterval> | undefined;
let listening = false;

export function stageOf(progress: number): number {
	return Math.min(STAGES - 1, Math.floor(progress / (100 / STAGES)));
}

/** Number of agents currently in each pipeline stage. */
export function stageCounts(): number[] {
	const counts = new Array(STAGES).fill(0);
	for (const r of sim.rows) counts[stageOf(r.progress)]++;
	return counts;
}

/** Agents that have not yet reached review. */
export function runningCount(): number {
	return sim.rows.filter((r) => stageOf(r.progress) < 5).length;
}

function step() {
	sim.tick++;
	for (const r of sim.rows) {
		r.progress += r.speed;
		if (r.progress >= 100) {
			r.progress = 0;
			r.merged++;
			r.taskIdx = (r.taskIdx + 1) % TASKS.length;
			r.task = TASKS[r.taskIdx];
		}
	}
}

function running(): boolean {
	return sim.observers > 0 && !sim.reduced && typeof document !== 'undefined' && !document.hidden;
}

function sync() {
	if (running() && !timer) {
		timer = setInterval(step, 1100);
	} else if (!running() && timer) {
		clearInterval(timer);
		timer = undefined;
	}
}

function listen() {
	if (listening || typeof window === 'undefined') return;
	listening = true;
	document.addEventListener('visibilitychange', sync);
	const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
	sim.reduced = mq.matches;
	mq.addEventListener('change', (e) => {
		sim.reduced = e.matches;
		sync();
	});
}

/** Register a visible live widget. Returns the matching release function. */
export function observe(): () => void {
	listen();
	sim.observers++;
	sync();
	let done = false;
	return () => {
		if (done) return;
		done = true;
		sim.observers = Math.max(0, sim.observers - 1);
		sync();
	};
}
