import raw from './content.json';

export interface Experience {
  company: string;
  role: string;
  from: string;
  to: string;
  location: string;
  highlights: string[];
  stack: string[];
}

export interface Education {
  institution: string;
  degree: string;
  from: string;
  to: string;
}

export interface PipelineStep {
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
  profile: {
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
    experience: Experience[];
    education: Education[];
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
    tooling: Tool[];
    sampleTasks: string[];
  };
  services: Service[];
  projects: Project[];
  footer: string;
}

export const content = raw as unknown as Content;
