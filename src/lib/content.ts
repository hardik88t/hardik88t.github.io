// Single typed entry point for the copied content.json. Components never hard-code facts.
// Only the fields this site renders are typed here.
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
export const person = content.person;

/**
 * The eight projects, in this order, everywhere: the work index, the canvas frames and the
 * canvas switcher. Every project on the home page has a canvas frame and vice versa.
 */
export const workOrder = [
  'wholesale-os',
  'medjot',
  'paper-studio',
  'fieldbook',
  'footnote',
  'kiln-ui',
  'dhi',
  'net-watch',
] as const;

export const workProjects: Project[] = workOrder.map((slug) => {
  const project = content.projects.find((p) => p.slug === slug);
  if (!project) throw new Error(`content.json has no project "${slug}"`);
  return project;
});

export function projectBySlug(slug: string): Project {
  const found = content.projects.find((p) => p.slug === slug);
  if (!found) throw new Error(`content.json has no project "${slug}"`);
  return found;
}

/** Caption under each canvas frame: "For a client · type · year · stack". Client only for anonymized work. */
export function captionFor(p: Project): string {
  const lead = p.anonymized && p.client ? `For ${p.client.charAt(0).toLowerCase()}${p.client.slice(1)}` : null;
  return [lead, p.type, p.year, p.stack.join(', ')].filter(Boolean).join(' · ');
}

/** Split the headline so one phrase can carry the highlighter. Falls back to plain text. */
export function splitPhrase(text: string, phrase: string): { lead: string; mark: string; trail: string } {
  const at = text.indexOf(phrase);
  if (at < 0) return { lead: text, mark: '', trail: '' };
  return { lead: text.slice(0, at), mark: phrase, trail: text.slice(at + phrase.length) };
}
