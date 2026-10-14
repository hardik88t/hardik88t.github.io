// The six projects of the work section, in their order. The page list and the canvas frames both come
// from here, so they cannot drift apart. Every fact comes from content-v2.json.
import raw from '../data/content-v2.json';
import type { Project } from './types';

// Footnote and Kiln UI are concept placeholders and are left out of the work.
export const WORK_ORDER = ['wholesale-os', 'medjot', 'paper-studio', 'fieldbook', 'dhi', 'net-watch'] as const;

const all = raw.projects as unknown as Project[];

export function projectBySlug(slug: string): Project {
  const found = all.find((p) => p.slug === slug);
  if (!found) throw new Error(`content-v2.json has no project "${slug}"`);
  return found;
}

export const workProjects: Project[] = WORK_ORDER.map((slug) => projectBySlug(slug));

/** Caption under each frame: "For a client · type · year · stack". The client is named only for anonymized work. */
export function captionFor(p: Project): string {
  const lead = p.anonymized && p.client ? `For ${p.client.charAt(0).toLowerCase()}${p.client.slice(1)}` : null;
  return [lead, p.type, p.year, p.stack.join(', ')].filter(Boolean).join(' · ');
}
