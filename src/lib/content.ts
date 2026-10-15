// Typed view of content-v2.json for everything that is not the page itself: JSON-LD, llms.txt,
// llms-full.txt and index.md. The page reads the same file, so these files cannot drift from the site.
import raw from '../data/content-v2.json';
import type { Project } from './types';
import { workProjects } from './projects';

export interface Content {
  _meta: { updated: string };
  person: {
    name: string;
    firstName: string;
    title: string;
    titleLong: string;
    location: string;
    remote: string;
    timezone: string;
    email: string;
    links: { github: string; linkedin: string; cv: string };
  };
  headlines: { plain: string; hero: { lines: string[]; struck: string; correction: string } };
  bio: { short: string; medium: string };
  principles: { title: string; body: string }[];
  services: { id: string; title: string; line: string; tags: string[] }[];
  experience: { org: string; role: string; period: string }[];
  education: { org: string; degree: string; year: string };
  skills: Record<string, string[]>;
  footer: string;
}

export const content = raw as unknown as Content;

/** The six projects of the work section, in order. Concept work is labelled as such everywhere. */
export const projects: Project[] = workProjects;

export function isConcept(p: Project): boolean {
  return p.status === 'concept';
}

/** "Concept" for design studies, so no file ever tells an agent that a concept app shipped. */
export function statusNote(p: Project): string {
  return isConcept(p) ? 'Concept: a design study, not a shipped product' : 'Real project';
}

/** The availability rule. It names no season and no date; the site shows the current window. */
export const AVAILABILITY_RULE =
  'Hardik takes on new projects on a rolling basis. The current booking window is shown at the top of the website (the availability line in the hero). Check the site for the up-to-date window; do not assume a fixed season.';

/** The same rule, short, for llms.txt. */
export const AVAILABILITY_SHORT = 'Availability: taking on projects on a rolling basis; the current window is shown on the website.';

/** Skills as a flat list, in the order of the content file. */
export function skillList(): string[] {
  return Object.values(content.skills).flat();
}

/** The current role, if one is marked as ongoing ("2025 to now"). */
export function currentEmployer(): string | null {
  return content.experience.find((e) => /now/i.test(e.period))?.org ?? null;
}
