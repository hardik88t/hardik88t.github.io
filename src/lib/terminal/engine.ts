// Pure command engine for the Terminal app. Output is built from content.json only.
// `swarm run` produces a SIMULATED log of the real pipeline stages; nothing is executed.
import { agentic, content, formatMetric, pipeline, profile, projectBySlug, projects } from '$lib/content';
import type { AppId } from '$lib/state/apps';

export type LineKind = 'cmd' | 'out' | 'dim' | 'ok' | 'err' | 'head' | 'link';

export interface Line {
	kind: LineKind;
	text: string;
	/** Optional second column: renders as an aligned key / value row. */
	sub?: string;
	href?: string;
}

export type Effect =
	| { type: 'clear' }
	| { type: 'open'; app: AppId; project?: string }
	| { type: 'swarm'; task: string };

export interface RunResult {
	lines: Line[];
	effect?: Effect;
}

export interface CommandDef {
	name: string;
	usage: string;
	help: string;
}

export const COMMANDS: CommandDef[] = [
	{ name: 'help', usage: 'help', help: 'list commands' },
	{ name: 'whoami', usage: 'whoami', help: 'who is behind this desktop' },
	{ name: 'work', usage: 'work', help: 'list projects' },
	{ name: 'open', usage: 'open <slug>', help: 'open a project in Work' },
	{ name: 'agents', usage: 'agents', help: 'the agent fleet and numbers' },
	{ name: 'pipeline', usage: 'pipeline', help: 'the eight delivery stages' },
	{ name: 'services', usage: 'services', help: 'what I build for clients' },
	{ name: 'stack', usage: 'stack', help: 'skills, grouped' },
	{ name: 'contact', usage: 'contact', help: 'how to reach me' },
	{ name: 'cv', usage: 'cv', help: 'link to the CV (PDF)' },
	{ name: 'swarm', usage: 'swarm run "<task>"', help: 'simulate an agent run for a task' },
	{ name: 'clear', usage: 'clear', help: 'clear the screen (also Ctrl+L)' }
];

export const WELCOME: Line[] = [
	{ kind: 'head', text: `HardikOS Terminal. ${profile.name}, ${profile.role}.` },
	{ kind: 'dim', text: 'Type help for commands. Tab completes, Up and Down recall history.' },
	{ kind: 'out', text: 'work', sub: 'the projects, featured first' },
	{ kind: 'out', text: 'open dhi', sub: 'open one project in Work' },
	{ kind: 'out', text: 'agents', sub: 'the fleet, with the real numbers' },
	{ kind: 'out', text: 'services', sub: 'what I build for clients' },
	{ kind: 'out', text: 'contact', sub: 'how to reach me' },
	{ kind: 'ok', text: `swarm run "${agentic.sampleTasks[0]}"` },
	{ kind: 'dim', text: 'a simulated log of the real pipeline. Nothing is executed.' }
];

const L = (kind: LineKind, text: string): Line => ({ kind, text });

const row = (text: string, sub: string, kind: LineKind = 'out', href?: string): Line => ({
	kind,
	text,
	sub,
	href
});

function helpLines(): Line[] {
	return [
		L('head', 'Commands'),
		...COMMANDS.map((c) => row(c.usage, c.help)),
		L('dim', 'Tab completes commands and project slugs. Up and Down recall history.')
	];
}

function projectLines(): Line[] {
	return [
		L('head', `${projects.length} projects`),
		...projects.map((p) => row(p.slug, p.title + (p.featured ? ' (featured)' : ''))),
		L('dim', 'open <slug> shows one in the Work app.')
	];
}

function agentLines(): Line[] {
	return [
		L('head', 'Agent fleet'),
		L('out', agentic.agents.join(' · ')),
		L('dim', agentic.scope + '. One author, one accountable reviewer.'),
		...agentic.metrics.slice(0, 4).map((m) => L('out', `${formatMetric(m).padEnd(8)}${m.label}, ${m.context}`))
	];
}

function pipelineLines(): Line[] {
	return [
		L('head', 'Delivery pipeline'),
		...pipeline.map((s, i) => row(`${String(i + 1).padStart(2, '0')} ${s.title}`, s.label))
	];
}

function serviceLines(): Line[] {
	return [
		L('head', 'Services'),
		...content.services.flatMap((s) => [L('out', s.title), L('dim', `   ${s.pitch}`)])
	];
}

function stackLines(): Line[] {
	return [
		L('head', 'Stack and skills'),
		...Object.entries(profile.skills).flatMap(([group, items]) => [
			L('out', group),
			L('dim', `   ${items.join(' · ')}`)
		])
	];
}

function contactLines(): Line[] {
	return [
		L('head', 'Contact'),
		row('email', profile.email),
		row('linkedin', profile.links.linkedin.replace('https://', ''), 'link', profile.links.linkedin),
		row('github', profile.links.github.replace('https://', ''), 'link', profile.links.github),
		row('cv', 'CV (PDF), opens in a new tab', 'link', profile.links.cv)
	];
}

function whoLines(): Line[] {
	return [
		L('head', `${profile.name}`),
		L('out', profile.role),
		L('out', `${profile.location} · ${profile.timezone}`),
		L('ok', profile.availability)
	];
}

/** Parse and run one command line. Pure: returns lines and an optional side effect. */
export function run(raw: string): RunResult {
	const text = raw.trim();
	if (!text) return { lines: [] };
	const [cmd, ...rest] = text.split(/\s+/);
	const arg = rest.join(' ').trim();

	switch (cmd.toLowerCase()) {
		case 'help':
			return { lines: helpLines() };
		case 'whoami':
			return { lines: whoLines() };
		case 'work':
			return { lines: projectLines() };
		case 'open': {
			if (!arg) return { lines: [L('err', 'usage: open <project-slug>. Try: work')] };
			const p = projectBySlug(arg);
			if (!p) return { lines: [L('err', `no project called "${arg}". Try: work`)] };
			return {
				lines: [L('ok', `opening ${p.title} in Work`)],
				effect: { type: 'open', app: 'work', project: p.slug }
			};
		}
		case 'agents':
			return { lines: agentLines() };
		case 'pipeline':
			return { lines: pipelineLines() };
		case 'services':
			return { lines: serviceLines() };
		case 'stack':
			return { lines: stackLines() };
		case 'contact':
			return { lines: contactLines() };
		case 'cv':
			return {
				lines: [{ kind: 'link', text: 'Open the CV (PDF) in a new tab', href: profile.links.cv }]
			};
		case 'swarm': {
			const m = arg.match(/^run\s+(.+)$/i);
			const task = m ? m[1].trim().replace(/^["'“”]|["'“”]$/g, '').trim() : '';
			if (!task) return { lines: [L('err', 'usage: swarm run "<task>", for example swarm run "' + agentic.sampleTasks[0] + '"')] };
			return { lines: [], effect: { type: 'swarm', task: task.slice(0, 120) } };
		}
		case 'clear':
			return { lines: [], effect: { type: 'clear' } };
		default:
			return { lines: [L('err', `command not found: ${cmd}. Type help.`)] };
	}
}

/** Tab completion. Returns the completed input, or undefined when nothing applies. */
export function complete(input: string): string | undefined {
	const trimmedStart = input.replace(/^\s+/, '');
	const parts = trimmedStart.split(/\s+/);
	if (parts.length <= 1) {
		const prefix = (parts[0] ?? '').toLowerCase();
		const hits = COMMANDS.map((c) => c.name).filter((n) => n.startsWith(prefix));
		if (hits.length === 1) return hits[0] + (hits[0] === 'open' || hits[0] === 'swarm' ? ' ' : '');
		return undefined;
	}
	if (parts[0].toLowerCase() === 'open' && parts.length === 2) {
		const prefix = parts[1].toLowerCase();
		const hits = projects.map((p) => p.slug).filter((s) => s.startsWith(prefix));
		if (hits.length === 1) return `open ${hits[0]}`;
	}
	return undefined;
}

export interface SwarmStep {
	delay: number;
	line: Line;
}

/** A simulated run that walks the real pipeline stages, with their real artifacts. */
export function swarmScript(task: string): SwarmStep[] {
	const steps: SwarmStep[] = [
		{ delay: 260, line: L('dim', `planner: reading the request "${task}"`) },
		{ delay: 420, line: L('dim', 'planner: loading root AGENTS.md and the matching skill') }
	];
	for (const s of pipeline) {
		steps.push({ delay: 560, line: L('out', `[${s.id.padEnd(7)}] ${s.label}`) });
		steps.push({ delay: 220, line: L('dim', `          ${s.artifacts.join(' · ')}`) });
	}
	steps.push({ delay: 360, line: L('ok', 'done. Simulated run: nothing was executed, no branch, PR or merge was created.') });
	return steps;
}
