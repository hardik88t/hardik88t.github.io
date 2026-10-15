import data from './content-v2.json';

// The content file is the only source of facts. Render from these exports only.
export const person = data.person;
export const headline = data.headlines.plain;
export const bio = data.bio.short;
export const services = data.services;
export const footer = data.footer;
export const projects = data.projects;

export type Project = (typeof data.projects)[number];

export function projectBySlug(slug: string): Project {
  const found = data.projects.find((p) => p.slug === slug);
  if (!found) throw new Error(`Unknown project: ${slug}`);
  return found;
}

/** Caption under each frame: "For a client · type · year · stack". Client only for anonymized work. */
export function captionFor(p: Project): string {
  const client = (p as { client?: string }).client;
  const lead = p.anonymized && client ? `For ${client.charAt(0).toLowerCase()}${client.slice(1)}` : null;
  return [lead, p.type, p.year, p.stack.join(', ')].filter(Boolean).join(' · ');
}
