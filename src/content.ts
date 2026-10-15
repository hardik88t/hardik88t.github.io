import raw from './content-v2.json';

export interface Person {
  name: string;
  firstName: string;
  monogram: string;
  title: string;
  location: string;
  remote: string;
  timezone: string;
  availability: string;
  email: string;
  links: { github: string; linkedin: string; cv: string };
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
  headlines: { plain: string; promise: string; statement: string; studio: string };
  bio: { short: string; medium: string };
  principles: Principle[];
  services: Service[];
  projects: Project[];
  footer: string;
}

export const content = raw as unknown as Content;

export function service(id: string): Service {
  const found = content.services.find((s) => s.id === id);
  if (!found) throw new Error(`Missing service "${id}" in content`);
  return found;
}

export function project(slug: string): Project {
  const found = content.projects.find((p) => p.slug === slug);
  if (!found) throw new Error(`Missing project "${slug}" in content`);
  return found;
}
