// Single typed entry point for the copied content.json. Components never hard-code facts.
import raw from '../content.json';

export interface ExperienceItem {
  company: string;
  role: string;
  from: string;
  to: string;
  location: string;
  highlights: string[];
  stack: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  from: string;
  to: string;
}

export interface Profile {
  name: string;
  shortName: string;
  monogram: string;
  location: string;
  timezone: string;
  role: string;
  availability: string;
  headline: string;
  sub: string;
  about: string[];
  email: string;
  links: { github: string; linkedin: string; cv: string; business: string };
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: Record<string, string[]>;
}

export interface PipelineStage {
  id: string;
  title: string;
  label: string;
  detail: string;
  artifacts: string[];
}

export interface Metric {
  value: number;
  unit?: string;
  label: string;
  context: string;
}

export interface Tool {
  name: string;
  detail: string;
}

export interface Agentic {
  title: string;
  thesis: string;
  summary: string;
  scope: string;
  agents: string[];
  pipeline: PipelineStage[];
  metrics: Metric[];
  guardrails: string[];
  tooling: Tool[];
  sampleTasks: string[];
}

export interface Service {
  id: string;
  title: string;
  pitch: string;
  includes: string[];
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

export interface Content {
  profile: Profile;
  agentic: Agentic;
  services: Service[];
  projects: Project[];
  footer: string;
}

export const content = raw as Content;

/** Featured projects first, then the rest; original order kept within each group. */
export const orderedProjects: Project[] = [
  ...content.projects.filter((p) => p.featured),
  ...content.projects.filter((p) => !p.featured),
];

/** Human label for a project category slug, used as mono tags. */
export const categoryLabel: Record<string, string> = {
  agentic: 'Agentic',
  'web-app': 'Web app',
  'ui-ux': 'UI/UX',
  desktop: 'Desktop',
  ai: 'AI',
  'native-mobile': 'Native mobile',
  cli: 'CLI',
  'data-viz': 'Data viz',
  website: 'Website',
};

export function labelFor(category: string): string {
  return categoryLabel[category] ?? category;
}

export interface ProjectLink {
  label: string;
  href: string;
}

/** Public links for a project, in a stable display order. Empty when the content gives none. */
export function projectLinks(project: Project): ProjectLink[] {
  const out: ProjectLink[] = [];
  if (project.links.live) out.push({ label: 'Live site', href: project.links.live });
  if (project.links.github) out.push({ label: 'GitHub', href: project.links.github });
  return out;
}

/** Year part of a "Mon YYYY" string from the experience data. */
export function yearOf(date: string): string {
  return date.split(' ').pop() ?? date;
}
