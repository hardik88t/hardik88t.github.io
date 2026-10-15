// Short UI copy written for the frames. Facts come from content-v2.json only.
import type { FrameId } from './layout';

export const FRAME_VIEW: Record<FrameId, { name: string; view: string }> = {
  hello: { name: 'Hello', view: 'Intro' },
  'wholesale-os': { name: 'Wholesale OS', view: 'Dashboard' },
  fieldbook: { name: 'Fieldbook', view: 'Mobile app' },
  medjot: { name: 'MedJot', view: 'Visit' },
  'paper-studio': { name: 'Paper Studio', view: 'Editor' },
  footnote: { name: 'Footnote', view: 'Chat' },
  'kiln-ui': { name: 'Kiln UI', view: 'Tokens' },
  dhi: { name: 'Dhi', view: 'Workspace' },
  contact: { name: 'Contact', view: 'Card' },
};

/** One design decision per project, 20 words or fewer, written from approach and outcome. */
export const STICKY: Partial<Record<FrameId, string>> = {
  'wholesale-os': 'Orders are captured offline and sync on their own, so the office works from one source of truth.',
  fieldbook: 'Offline catalogue and quick reorder: a repeat order takes under thirty seconds at the counter.',
  medjot: 'Symptom chips and data kept on the device, so a full visit takes a few taps, even offline.',
  'paper-studio': 'Versioned questions, an AI first draft and instant typesetting, so a paper is ready in minutes.',
  footnote: 'Each claim shows its citation and highlights the quoted passage, so answers can be checked.',
  'kiln-ui': 'Shared tokens in Figma and code, so new screens are assembled, not redrawn.',
  dhi: 'Ingested documents become linked notes, so related ideas surface on their own in the graph.',
};

export const UI = {
  pillTagline: 'Product engineer',
  hint: 'Drag to explore · scroll to zoom · or use ← →',
  switcherLabel: 'Frames',
  contactButton: 'Contact',
  zoomOut: 'Zoom out',
  zoomIn: 'Zoom in',
  fit: 'Fit',
  minimapLabel: 'Canvas overview. Select to move the view.',
  helloCta: 'Email me',
  copyEmail: 'Copy email',
  copied: 'Copied',
  copyManual: 'Copying was blocked. Select the address above and copy it.',
  contactIntro: 'Tell me what you are building.',
  selectedWork: 'Selected work',
  swipeHint: 'Swipe to browse. Tap a frame to open it full screen.',
  viewerClose: 'Close',
  viewerHint: 'Scroll to explore the screen.',
};
