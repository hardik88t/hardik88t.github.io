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
  /** One design decision for the canvas sticky note, 20 words or fewer. Not shown on the page itself. */
  sticky?: string;
  challenge: string;
  approach: string;
  outcome: string;
  stack: string[];
  accent: string;
  visual: string;
  links?: { github?: string };
}
