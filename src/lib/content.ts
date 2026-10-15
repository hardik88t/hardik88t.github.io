// Single typed entry point for the copied content.json. Components never hard-code facts.
// Only the fields this concept renders are typed here; the rest of the file is unused.
import raw from '../content.json';

export interface Person {
  name: string;
  monogram: string;
  location: string;
  timezone: string;
  availability: string;
  email: string;
  links: { github: string; linkedin: string; cv: string };
}

export interface Headlines {
  plain: string;
  studio: string;
}

export interface Principle {
  title: string;
  body: string;
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
}

export interface Experience {
  org: string;
  role: string;
  period: string;
}

export interface Education {
  org: string;
  degree: string;
  year: string;
}

export interface SiteContent {
  person: Person;
  headlines: Headlines;
  bio: { short: string };
  principles: Principle[];
  services: Service[];
  projects: Project[];
  experience: Experience[];
  education: Education;
  footer: string;
}

export const content = raw as unknown as SiteContent;

/** The work index shows these six projects, in this order (set by the concept). */
const workOrder = ['wholesale-os', 'medjot', 'paper-studio', 'fieldbook', 'dhi', 'net-watch'] as const;

export const workProjects: Project[] = workOrder.map((slug) => {
  const project = content.projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`content.json has no project "${slug}"`);
  return project;
});

/** Split the headline so one phrase can carry the highlighter. Falls back to plain text. */
export function splitPhrase(text: string, phrase: string): { lead: string; mark: string; trail: string } {
  const at = text.indexOf(phrase);
  if (at < 0) return { lead: text, mark: '', trail: '' };
  return { lead: text.slice(0, at), mark: phrase, trail: text.slice(at + phrase.length) };
}
