// Shape of one project in content-v2.json, as the components read it.
export interface Project {
  slug: string;
  title: string;
  type: string;
  year: string;
  status: string;
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
