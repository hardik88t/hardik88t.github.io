export const NAV_ITEMS = [
  { id: "workflow", label: "Workflow" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "stack", label: "Stack" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]["id"];
