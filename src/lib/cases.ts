// Per-project view data for the maximal site. Facts come only from data/content-v2.json. Everything here is
// derived from those facts or is a design note in the owner's voice. Nothing new is claimed.
import content from '../data/content-v2.json';
import type { Project } from './types';

export interface Pin {
  name: string; // riso name in src/assets/screens/riso
  w: number; // width on the pinboard, css px at zoom 1
  x: number; // position inside the cluster box
  y: number;
  r: number; // rotation in degrees, seeded and small
  label: string; // alt for the proof link
  phone?: boolean;
}

export interface CaseExtra {
  slug: string;
  hero: string; // riso name for the large mounted print on the case study
  heroPhone?: boolean;
  screens: Pin[]; // 2 or 3 screens for the case study. Each opens its proof.
  did: string[]; // 4 "what I did" items, phrased as activities
  decision: string; // one margin note with a design decision
  board: {
    pins: Pin[];
    title: { x: number; y: number; w: number };
  };
}

export const ORDER = ['wholesale-os', 'medjot', 'paper-studio', 'fieldbook', 'footnote', 'kiln-ui', 'dhi', 'net-watch'];

const extras: CaseExtra[] = [
  {
    slug: 'wholesale-os',
    hero: 'wholesale-os',
    screens: [
      { name: 'wholesale-os', w: 0, x: 0, y: 0, r: 0, label: 'Orders dashboard, desktop' },
      { name: 'wholesale-os--invoice', w: 0, x: 0, y: 0, r: 0, label: 'Invoice drawer' },
      { name: 'wholesale-os--stock', w: 0, x: 0, y: 0, r: 0, label: 'Stock levels' },
    ],
    did: [
      'Mapped how reps took orders on paper and by phone, then moved it into one system.',
      'Built a multi-tenant web platform for orders, stock and invoices.',
      'Added offline order capture for reps on the road, with sync when they are back online.',
      'Put live stock next to orders, so the office works from one source of truth.',
    ],
    decision: 'Stock sits beside the orders, so nobody leaves an order to check a shelf.',
    board: {
      pins: [
        { name: 'wholesale-os', w: 330, x: 0, y: 0, r: -1.2, label: 'Orders dashboard, desktop' },
        { name: 'wholesale-os--invoice', w: 150, x: 250, y: 90, r: 2.2, label: 'Invoice drawer' },
        { name: 'wholesale-os--stock', w: 260, x: 20, y: 236, r: -0.7, label: 'Stock levels' },
      ],
      title: { x: 430, y: 40, w: 210 },
    },
  },
  {
    slug: 'medjot',
    hero: 'medjot--phone-1',
    heroPhone: true,
    screens: [
      { name: 'medjot--phone-1', w: 0, x: 0, y: 0, r: 0, label: 'New visit with symptom chips', phone: true },
      { name: 'medjot--phone-2', w: 0, x: 0, y: 0, r: 0, label: 'Medicine search and receipt preview', phone: true },
    ],
    did: [
      'Designed a visit form around symptom chips, duration and the basic readings.',
      'Built an installable app that keeps all data on the device.',
      'Added learned autocomplete and a command palette for medicines.',
      'Made the printed receipt the last step of a visit.',
    ],
    decision: 'Symptoms are tap chips first. Typing is there when a tap is not enough.',
    board: {
      pins: [
        { name: 'medjot--phone-1', w: 170, x: 0, y: 0, r: -1, label: 'New visit with symptom chips', phone: true },
        { name: 'medjot--phone-2', w: 170, x: 190, y: 30, r: 1.4, label: 'Medicine search and receipt preview', phone: true },
      ],
      title: { x: 430, y: 60, w: 210 },
    },
  },
  {
    slug: 'paper-studio',
    hero: 'paper-studio',
    screens: [
      { name: 'paper-studio', w: 0, x: 0, y: 0, r: 0, label: 'Question bank beside the paper preview' },
      { name: 'paper-studio--a4', w: 0, x: 0, y: 0, r: 0, label: 'A4 paper, typeset in the browser' },
    ],
    did: [
      'Built a question bank with versioned questions.',
      'Added AI-drafted papers, so teachers start from a first version.',
      'Typeset the A4 paper in the browser as it is edited.',
      'Generated the answer key along with each paper.',
    ],
    decision: 'The paper is typeset as you edit, so the preview is never a guess.',
    board: {
      pins: [
        { name: 'paper-studio', w: 360, x: 0, y: 0, r: 1, label: 'Question bank beside the paper preview' },
        { name: 'paper-studio--a4', w: 150, x: 250, y: 170, r: -2.2, label: 'A4 paper, typeset in the browser' },
      ],
      title: { x: 430, y: 40, w: 210 },
    },
  },
  {
    slug: 'fieldbook',
    hero: 'fieldbook--phone-2',
    heroPhone: true,
    screens: [
      { name: 'fieldbook--phone-1', w: 0, x: 0, y: 0, r: 0, label: 'Today’s route', phone: true },
      { name: 'fieldbook--phone-2', w: 0, x: 0, y: 0, r: 0, label: 'Product catalogue', phone: true },
      { name: 'fieldbook--phone-3', w: 0, x: 0, y: 0, r: 0, label: 'Cart and place order', phone: true },
    ],
    did: [
      'Designed today’s route as the first screen a rep sees.',
      'Built an offline catalogue with prices and stock.',
      'Made the quick reorder path, aiming at under thirty seconds at the counter.',
      'Built one cross-platform app for iOS and Android with React Native and Expo.',
    ],
    decision: 'The reorder button is the largest thing on the catalogue, on purpose.',
    board: {
      pins: [
        { name: 'fieldbook--phone-1', w: 132, x: 0, y: 60, r: -1, label: 'Today’s route', phone: true },
        { name: 'fieldbook--phone-2', w: 132, x: 130, y: 20, r: 0.8, label: 'Product catalogue', phone: true },
        { name: 'fieldbook--phone-3', w: 132, x: 260, y: 70, r: -0.6, label: 'Cart and place order', phone: true },
      ],
      title: { x: 430, y: 60, w: 210 },
    },
  },
  {
    slug: 'footnote',
    hero: 'footnote',
    screens: [
      { name: 'footnote', w: 0, x: 0, y: 0, r: 0, label: 'Answer with citations, desktop' },
      { name: 'footnote--chat', w: 0, x: 0, y: 0, r: 0, label: 'Chat answer with numbered citations' },
    ],
    did: [
      'Designed answers with numbered citation chips.',
      'Built a sources panel that highlights the quoted passage.',
      'Set up retrieval over documents with vector search.',
      'Shaped the chat so every sentence can be checked against its source.',
    ],
    decision: 'Every number in an answer links to the sentence it came from.',
    board: {
      pins: [
        { name: 'footnote', w: 340, x: 0, y: 0, r: -1.2, label: 'Answer with citations, desktop' },
        { name: 'footnote--chat', w: 190, x: 210, y: 150, r: 2, label: 'Chat answer with numbered citations' },
      ],
      title: { x: 430, y: 40, w: 210 },
    },
  },
  {
    slug: 'kiln-ui',
    hero: 'kiln-ui',
    screens: [
      { name: 'kiln-ui', w: 0, x: 0, y: 0, r: 0, label: 'Token sheet and component states' },
      { name: 'kiln-ui--tokens', w: 0, x: 0, y: 0, r: 0, label: 'Buttons in every state' },
    ],
    did: [
      'Set up design tokens in Figma and in code.',
      'Built a component library with buttons, inputs and toggles in every state.',
      'Tested the components for accessibility.',
      'Wrote a docs site with live examples.',
    ],
    decision: 'The token sheet comes first, so every component is built from one set of values.',
    board: {
      pins: [
        { name: 'kiln-ui', w: 360, x: 0, y: 0, r: -1, label: 'Token sheet and component states' },
        { name: 'kiln-ui--tokens', w: 280, x: 120, y: 200, r: 1.5, label: 'Buttons in every state' },
      ],
      title: { x: 430, y: 40, w: 210 },
    },
  },
  {
    slug: 'dhi',
    hero: 'dhi',
    screens: [
      { name: 'dhi', w: 0, x: 0, y: 0, r: 0, label: 'Editor beside the graph' },
      { name: 'dhi--graph', w: 0, x: 0, y: 0, r: 0, label: 'Knowledge graph with coloured clusters' },
    ],
    did: [
      'Built a Tauri desktop app with a React editor.',
      'Used an LLM to read documents and write linked notes.',
      'Drew the notes as an explorable graph with coloured clusters.',
      'Kept the window fast and native.',
    ],
    decision: 'The graph is a view of the notes, not a second place to keep them.',
    board: {
      pins: [
        { name: 'dhi', w: 340, x: 0, y: 0, r: 1.2, label: 'Editor beside the graph' },
        { name: 'dhi--graph', w: 180, x: 220, y: 170, r: -1.8, label: 'Knowledge graph with coloured clusters' },
      ],
      title: { x: 430, y: 40, w: 210 },
    },
  },
  {
    slug: 'net-watch',
    hero: 'net-watch--phone-1',
    heroPhone: true,
    screens: [
      { name: 'net-watch--phone-1', w: 0, x: 0, y: 0, r: 0, label: 'Connection timeline with drop markers', phone: true },
      { name: 'net-watch--phone-2', w: 0, x: 0, y: 0, r: 0, label: 'Export report settings', phone: true },
    ],
    did: [
      'Built a native Android app in Kotlin with Jetpack Compose.',
      'Added a background monitor for drops and slow periods.',
      'Designed a timeline of every event, with an export.',
      'Made the report shareable, so the claim comes with evidence.',
    ],
    decision: 'The timeline lists drops in order, so the export reads like evidence.',
    board: {
      pins: [
        { name: 'net-watch--phone-1', w: 170, x: 0, y: 0, r: -1.4, label: 'Connection timeline with drop markers', phone: true },
        { name: 'net-watch--phone-2', w: 170, x: 200, y: 40, r: 1.2, label: 'Export report settings', phone: true },
      ],
      title: { x: 430, y: 40, w: 210 },
    },
  },
];

export interface Case extends Project {
  extra: CaseExtra;
  index: number;
  prev: Project | null;
  next: Project | null;
}

const projects = ORDER.map((slug) => content.projects.find((p) => p.slug === slug)).filter(
  (p): p is NonNullable<typeof p> => Boolean(p),
) as unknown as Project[];

/** The eight projects in display order, each with its extra view data and neighbours. */
export const cases: Case[] = projects.map((p, i) => {
  const extra = extras.find((e) => e.slug === p.slug);
  if (!extra) throw new Error(`No case data for ${p.slug}`);
  return {
    ...p,
    extra,
    index: i,
    prev: projects[(i - 1 + projects.length) % projects.length] ?? null,
    next: projects[(i + 1) % projects.length] ?? null,
  };
});

export const caseById = (slug: string) => cases.find((c) => c.slug === slug);
export const pad = (n: number) => String(n + 1).padStart(2, '0');
