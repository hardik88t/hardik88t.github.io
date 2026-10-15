// Single source of truth: src/content.json is a verbatim copy of _shared/content.json.
import data from '../content.json';

export interface Metric {
	value: number;
	unit?: string;
	label: string;
	context: string;
}

export interface PipelineStep {
	id: string;
	title: string;
	label: string;
	detail: string;
	artifacts: string[];
}

export interface Project {
	slug: string;
	title: string;
	oneLiner: string;
	description: string;
	categories: string[];
	stack: string[];
	role: string;
	year: string;
	highlights: string[];
	links: { github?: string; live?: string };
	anonymized: boolean;
	featured: boolean;
	accent: string;
}

export interface Service {
	id: string;
	title: string;
	pitch: string;
	includes: string[];
}

export interface Experience {
	company: string;
	role: string;
	from: string;
	to: string;
	location: string;
	highlights: string[];
	stack: string[];
}

export interface Content {
	_meta: { note: string; updated: string };
	profile: {
		name: string;
		shortName: string;
		monogram: string;
		location: string;
		timezone: string;
		role: string;
		availability: string;
		headline: string;
		headlineAlternates: string[];
		sub: string;
		about: string[];
		email: string;
		links: { github: string; linkedin: string; cv: string; business: string };
		experience: Experience[];
		education: { institution: string; degree: string; from: string; to: string }[];
		skills: Record<string, string[]>;
	};
	agentic: {
		title: string;
		thesis: string;
		summary: string;
		scope: string;
		agents: string[];
		pipeline: PipelineStep[];
		metrics: Metric[];
		guardrails: string[];
		tooling: { name: string; detail: string }[];
		sampleTasks: string[];
	};
	services: Service[];
	projects: Project[];
	footer: string;
}

export const content = data as Content;
export const profile = content.profile;
export const agentic = content.agentic;
export const pipeline = content.agentic.pipeline;

export const CATEGORY_LABELS: Record<string, string> = {
	agentic: 'Agentic',
	'web-app': 'Web apps',
	'ui-ux': 'UI/UX',
	desktop: 'Desktop',
	ai: 'AI',
	'native-mobile': 'Native mobile',
	cli: 'CLI',
	website: 'Websites',
	'data-viz': 'Data viz'
};

/** Featured projects first; otherwise the order in content.json is kept. */
export const projects: Project[] = [...content.projects].sort(
	(a, b) => Number(b.featured) - Number(a.featured)
);

export function projectBySlug(slug: string | null | undefined): Project | undefined {
	return projects.find((p) => p.slug === slug);
}

/** Categories that actually occur in the projects, in a stable order. */
export const projectCategories: string[] = Object.keys(CATEGORY_LABELS).filter((c) =>
	projects.some((p) => p.categories.includes(c))
);

export function categoryLabel(c: string): string {
	return CATEGORY_LABELS[c] ?? c;
}

export function formatMetric(m: Metric): string {
	return `${m.value.toLocaleString('en-US')}${m.unit ?? ''}`;
}

/** Visual family for a project's generated artwork (no screenshots exist yet). */
export function artKind(p: Project): string {
	const c = p.categories;
	if (c.includes('native-mobile')) return 'phone';
	if (c.includes('desktop')) return 'window';
	if (c.includes('cli')) return 'cli';
	if (c.includes('data-viz')) return 'chart';
	if (c.includes('agentic')) return 'graph';
	if (c.includes('ai')) return 'chat';
	if (c.includes('website')) return 'site';
	if (c.includes('web-app')) return 'dash';
	return 'kit';
}
