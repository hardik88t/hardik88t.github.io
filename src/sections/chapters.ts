import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content, service } from '../content';
import { el } from '../lib/dom';
import { scrollToY } from '../lib/scroll';
import { proofCard } from './proof';

interface Chapter {
  rail: string;
  title: string;
  sub?: string;
  body: string;
  proofs?: string[];
}

/** Four chapters, one per morph shape. Copy is short on purpose: each one is a single idea. */
const CHAPTERS: Chapter[] = [
  {
    rail: 'Developer',
    title: 'One developer, fully accountable',
    body: content.bio.short,
  },
  {
    rail: 'AI agents',
    title: 'With a team of AI agents',
    sub: content.principles[0].title,
    body: content.principles[0].body,
  },
  {
    rail: service('web').title,
    title: service('web').title,
    body: service('web').line,
    proofs: ['wholesale-os', 'paper-studio'],
  },
  {
    rail: 'Mobile and desktop',
    title: service('mobile').title,
    body: service('mobile').line,
    proofs: ['fieldbook', 'net-watch', 'dhi'],
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

function chapterPanel(c: Chapter, i: number): HTMLElement {
  return el(
    'article',
    { class: i === 0 ? 'chapter is-active' : 'chapter', 'data-chapter': String(i + 1), 'aria-labelledby': `chapter-${i + 1}-title` },
    el(
      'div',
      { class: 'chapter-copy' },
      el('p', { class: 'chapter-kicker' }, `${pad(i + 1)} / ${pad(CHAPTERS.length)}`),
      el('h2', { id: `chapter-${i + 1}-title`, class: 'chapter-title' }, c.title),
      c.sub ? el('h3', { class: 'chapter-sub' }, c.sub) : null,
      el('p', { class: 'chapter-body' }, c.body),
      c.proofs ? el('div', { class: 'proof-list' }, c.proofs.map((slug) => proofCard(slug))) : null,
    ),
  );
}

/** The story: a pinned stage on desktop, stacked blocks over the fixed swarm on phones. */
export function renderChapters(): HTMLElement {
  return el(
    'section',
    { id: 'story', class: 'story', 'aria-label': 'Four things I do' },
    el(
      'div',
      { class: 'story-stage' },
      el(
        'nav',
        { class: 'chapter-rail', 'aria-label': 'Chapters' },
        el(
          'ol',
          null,
          CHAPTERS.map((c, i) =>
            el(
              'li',
              null,
              el(
                'button',
                { type: 'button', class: 'chapter-rail-btn', 'data-chapter-jump': String(i), 'aria-label': `Go to chapter ${i + 1}: ${c.rail}` },
                el('span', { class: 'rail-no', 'aria-hidden': 'true' }, pad(i + 1)),
                el('span', { class: 'rail-label' }, c.rail),
              ),
            ),
          ),
        ),
      ),
      el('div', { class: 'chapter-list' }, CHAPTERS.map((c, i) => chapterPanel(c, i))),
    ),
  );
}

/**
 * Drives the swarm: chapter i (0-based) maps to morph state i + 1. State 0 is the hero cloud.
 * Desktop follows the pinned scroll progress. Phones follow whichever chapter's copy sits
 * nearest the middle of the screen.
 */
export function initChapters(section: HTMLElement, onChange: (state: number) => void): void {
  const panels = Array.from(section.querySelectorAll<HTMLElement>('.chapter'));
  const copies = panels.map((panel) => panel.querySelector<HTMLElement>('.chapter-copy') ?? panel);
  const jumps = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-chapter-jump]'));
  const desktop = window.matchMedia('(min-width: 900px)');
  let current = -1;
  let lastState = -1;

  const emit = (state: number) => {
    if (state === lastState) return;
    lastState = state;
    onChange(state);
  };

  const setActive = (index: number) => {
    if (index === current) return;
    current = index;
    panels.forEach((panel, k) => {
      const on = k === index;
      panel.classList.toggle('is-active', on);
      panel.setAttribute('aria-hidden', String(desktop.matches && !on));
    });
    jumps.forEach((btn, k) => {
      btn.classList.toggle('is-active', k === index);
      if (k === index) btn.setAttribute('aria-current', 'step');
      else btn.removeAttribute('aria-current');
    });
  };

  const nearestToMiddle = (): number => {
    const mid = window.innerHeight * 0.5;
    let best = 0;
    let bestDistance = Infinity;
    copies.forEach((node, k) => {
      const r = node.getBoundingClientRect();
      const distance = Math.abs((r.top + r.bottom) / 2 - mid);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = k;
      }
    });
    return best;
  };

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      const index = desktop.matches
        ? Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(self.progress * CHAPTERS.length)))
        : nearestToMiddle();
      setActive(index);
      // Before the story starts, the swarm stays in its hero cloud.
      emit(!self.isActive && self.progress <= 0 ? 0 : index + 1);
    },
  });

  jumps.forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number(btn.dataset.chapterJump ?? 0);
      const span = trigger.end - trigger.start;
      scrollToY(trigger.start + ((index + 0.05) / CHAPTERS.length) * span);
    });
  });
}
