import data from '@/content.json'

// Single source of truth for all copy and data (copied from _shared/content.json).
export const content = data
export type Content = typeof data
export type Project = (typeof data.projects)[number]
export type PipelineStage = (typeof data.agentic.pipeline)[number]
export type Experience = (typeof data.profile.experience)[number]
export type Service = (typeof data.services)[number]

export const CATEGORY_LABELS: Record<string, string> = {
  agentic: 'Agentic',
  'web-app': 'Web app',
  'ui-ux': 'UI/UX',
  desktop: 'Desktop',
  ai: 'AI',
  'native-mobile': 'Native mobile',
  cli: 'CLI',
  'data-viz': 'Data viz',
  website: 'Website',
}

/** Two-letter chip text derived from a tool name, e.g. "Claude Code" -> "CC", "T3 Code" -> "TC". */
export function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length === 1) return (parts[0] ?? '').slice(0, 2).toUpperCase()
  return parts
    .map((p) => p.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}
