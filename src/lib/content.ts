import data from './data/content-v2.json';

/**
 * Single content source for the page. Only the parts listed in the concept are rendered.
 * `_meta`, `status`, `needsConfirm` and `anonymized` are never shown as labels.
 */
export const content = data;

export type Project = (typeof data.projects)[number];

export function projectFor(slug: string): Project | undefined {
	return data.projects.find((p) => p.slug === slug);
}

/** Anonymized projects show the generic client name and never a link. */
export function exampleName(p: Project): string {
	if (p.anonymized && 'client' in p && typeof p.client === 'string') return p.client;
	return p.title;
}

export function pad2(n: number): string {
	return String(n).padStart(2, '0');
}
