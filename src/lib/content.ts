// Single typed entry point for src/content.json (a copy of content-v2.json).
// Components read facts from here and never hard-code them. Fields the concept does not use
// (offers, FAQ, experience, status flags) are left out of the types on purpose.
import raw from '../content.json';

export interface Person {
  name: string;
  firstName: string;
  monogram: string;
  title: string;
  titleLong: string;
  location: string;
  remote: string;
  timezone: string;
  availability: string;
  email: string;
  links: { github: string; linkedin: string; cv: string };
}

export interface Headlines {
  plain: string;
  promise: string;
  statement: string;
  studio: string;
}

export interface Service {
  id: string;
  title: string;
  line: string;
}

export interface Project {
  slug: string;
  title: string;
  type: string;
  year: string;
  anonymized: boolean;
  client?: string;
  oneLiner: string;
  challenge: string;
  approach: string;
  outcome: string;
  stack: string[];
  accent: string;
  visual: string;
  links?: { github?: string };
}

export interface Content {
  person: Person;
  headlines: Headlines;
  bio: { short: string };
  services: Service[];
  projects: Project[];
  manifesto: string[];
  footer: string;
}

export const content = raw as Content;

/** Look up a project by slug. Throws at build time if the content and the page disagree. */
export function projectBySlug(slug: string): Project {
  const found = content.projects.find((p) => p.slug === slug);
  if (!found) throw new Error(`content: no project with slug "${slug}"`);
  return found;
}

/** Mono label parts for a case study: the generic client (only when anonymized), then type and year. */
export function caseLabelParts(project: Project): string[] {
  const parts = [project.anonymized && project.client ? project.client : null, project.type, project.year];
  return parts.filter((p): p is string => Boolean(p));
}
