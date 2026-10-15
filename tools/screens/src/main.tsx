// Renders one mock inside #stage, chosen with ?screen=<slug>. Playwright (capture.mjs) waits for
// data-ready="1" before taking a screenshot. Dev-only; never part of the site build.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { ComponentType } from 'react';
import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/nunito-sans';
import { WholesaleOS } from './mocks/WholesaleOS';
import { Fieldbook } from './mocks/Fieldbook';
import { MedJot } from './mocks/MedJot';
import { PaperStudio } from './mocks/PaperStudio';
import { Footnote } from './mocks/Footnote';
import { KilnUI } from './mocks/KilnUI';
import { Dhi } from './mocks/Dhi';
import { NetWatch } from './mocks/NetWatch';

export const SCREENS: Record<string, ComponentType> = {
  'wholesale-os': WholesaleOS,
  fieldbook: Fieldbook,
  medjot: MedJot,
  'paper-studio': PaperStudio,
  footnote: Footnote,
  'kiln-ui': KilnUI,
  dhi: Dhi,
  'net-watch': NetWatch,
};

const id = new URLSearchParams(location.search).get('screen') ?? '';
const Comp = SCREENS[id];
const stage = document.getElementById('stage')!;

if (Comp) {
  createRoot(stage).render(
    <StrictMode>
      <Comp />
    </StrictMode>,
  );
  // Ready once fonts are in and one frame has painted.
  document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
    stage.dataset.ready = '1';
  })));
} else {
  stage.textContent = `unknown screen: ${id}`;
}
