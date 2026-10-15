// Short UI copy for the canvas. Facts come from content.json only; the margin notes are
// one design decision per project, written from its approach and outcome.

/** The view named after each frame's title, as in "WHOLESALE OS / DASHBOARD". */
export const VIEW_NAME: Record<string, string> = {
  'wholesale-os': 'Dashboard',
  medjot: 'Visit',
  'paper-studio': 'Editor',
  fieldbook: 'Mobile app',
  footnote: 'Chat',
  'kiln-ui': 'Tokens',
  dhi: 'Workspace',
  'net-watch': 'Timeline',
};

/** Margin notes, 20 words or fewer. Rendered as highlighter blocks beside each frame. */
export const MARGIN_NOTE: Record<string, string> = {
  'wholesale-os': 'Orders are captured offline and sync on their own, so the office works from one source of truth.',
  medjot: 'Symptom chips and data kept on the device, so a full visit takes a few taps, even offline.',
  'paper-studio': 'Versioned questions, an AI first draft and instant typesetting, so a paper is ready in minutes.',
  fieldbook: 'Offline catalogue and quick reorder: a repeat order takes under thirty seconds at the counter.',
  footnote: 'Each claim shows its citation and highlights the quoted passage, so answers can be checked.',
  'kiln-ui': 'Shared tokens in Figma and code, so new screens are assembled, not redrawn.',
  dhi: 'Ingested documents become linked notes, so related ideas surface on their own in the graph.',
  'net-watch': 'Each drop is timed and logged, so a complaint becomes a shareable report instead of a hunch.',
};

export const UI = {
  dialogLabel: 'Selected work, design canvas',
  close: 'Close',
  hint: 'Drag to explore · scroll to zoom · or use ← →',
  switcherLabel: 'Projects',
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  fit: 'Fit',
  minimapLabel: 'Canvas overview. Select to move the view.',
  stageLabel: 'Design canvas',
  noteTag: 'Note',
  selectedWork: 'Selected work',
  swipeHint: 'Swipe to browse. Tap a frame to open it full screen.',
  viewerHint: 'Scroll to explore the screen.',
};
