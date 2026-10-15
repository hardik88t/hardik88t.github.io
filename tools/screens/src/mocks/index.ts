import type { ComponentType } from 'react';
import type { FrameId } from '../frames/layout';
import { WholesaleOS } from './WholesaleOS';
import { Fieldbook } from './Fieldbook';
import { MedJot } from './MedJot';
import { PaperStudio } from './PaperStudio';
import { Footnote } from './Footnote';
import { KilnUI } from './KilnUI';
import { Dhi } from './Dhi';

/** Project mocks by frame id. Each renders at its fixed design size from layout.ts. */
export const MOCKS: Partial<Record<FrameId, ComponentType>> = {
  'wholesale-os': WholesaleOS,
  fieldbook: Fieldbook,
  medjot: MedJot,
  'paper-studio': PaperStudio,
  footnote: Footnote,
  'kiln-ui': KilnUI,
  dhi: Dhi,
};
