import type { ComponentType } from 'react';
// The mock screens keep their own product fonts. The page chrome never uses these.
import '@fontsource-variable/ibm-plex-sans';
import '@fontsource-variable/nunito-sans';
import { WholesaleOS } from './WholesaleOS';
import { MedJot } from './MedJot';
import { PaperStudio } from './PaperStudio';
import { Fieldbook } from './Fieldbook';
import { Dhi } from './Dhi';
import { NetWatch } from './NetWatch';

/** Project mocks by slug: the six work projects. Each renders at its fixed design size (see canvas/layout.ts). */
export const MOCKS: Partial<Record<string, ComponentType>> = {
  'wholesale-os': WholesaleOS,
  medjot: MedJot,
  'paper-studio': PaperStudio,
  fieldbook: Fieldbook,
  dhi: Dhi,
  'net-watch': NetWatch,
};
