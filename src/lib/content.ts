import content from "@/content.json";

// Every visible fact on the site comes from content.json. This module only
// derives presentation (labels, ordering, groupings) from it.

export const profile = content.profile;
export const agentic = content.agentic;
export const services = content.services;
export const projects = content.projects;
export const footer = content.footer;

export type Project = (typeof content.projects)[number];
export type PipelineStep = (typeof content.agentic.pipeline)[number];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);

/** Read a project's optional links without type gymnastics. */
export function projectLinks(p: Project): Partial<Record<"github" | "live", string>> {
  return p.links as Partial<Record<"github" | "live", string>>;
}

export const CATEGORY_LABELS: Record<string, string> = {
  agentic: "Agentic",
  "web-app": "Web app",
  "ui-ux": "UI/UX",
  desktop: "Desktop",
  ai: "AI",
  "native-mobile": "Native mobile",
  cli: "CLI",
  "data-viz": "Data viz",
  website: "Website",
};

/** Short "how agents helped" notes. Where content.json has no per-project
 *  detail, the note restates the general workflow from profile.about. */
const GENERAL_AGENT_NOTE =
  "Built in the same agent-directed workflow as the rest of my work: I set the architecture and the rules, coding agents do most of the implementation, and I review and gate every change.";

export const agentNotes: Record<string, string> = {
  "avinya-platform":
    "The repository is designed for agents: worktree isolation, AGENTS.md context, agent skills, local gates that mirror CI, independent AI review and a SHA-bound merge gate.",
  agx:
    "This is a tool for agent work itself. It indexes and syncs Antigravity sessions, makes transcripts searchable and diffs agent trajectories.",
  tantr:
    "Agent behaviour is the product here. Agents must audit read-only, propose a manifest and wait for human approval before any idempotent, hash-verified execution.",
};

export function agentNoteFor(slug: string): string {
  return agentNotes[slug] ?? GENERAL_AGENT_NOTE;
}

/** Stack and skill groups in the order content.json defines them. */
export const skillGroups = Object.entries(profile.skills) as [string, string[]][];

/** Dates in content are "Aug 2025" style strings; keep them as-is. */
export function formatRange(from: string, to: string) {
  return `${from} – ${to}`;
}
