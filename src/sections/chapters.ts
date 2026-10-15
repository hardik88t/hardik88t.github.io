import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from '../content';
import { el, chips } from '../lib/dom';
import { scrollToY } from '../lib/scroll';

interface Chapter {
  rail: string;
  kicker: string;
  title: string;
  body: string;
  stat?: { value: string; label: string };
  chips?: string[];
}

const CHAPTERS: Chapter[] = [
  {
    rail: 'One developer',
    kicker: '01 / Orchestrator',
    title: 'One developer',
    body: content.agentic.thesis,
    stat: { value: String(content.agentic.metrics[0].value), label: content.agentic.metrics[0].label },
  },
  {
    rail: 'A fleet of agents',
    kicker: '02 / Agents',
    title: 'A fleet of agents',
    body: content.agentic.pipeline[1].detail,
    stat: { value: String(content.agentic.metrics[3].value), label: content.agentic.metrics[3].label },
    chips: content.agentic.agents,
  },
  {
    rail: 'Shipping products',
    kicker: '03 / Web applications',
    title: 'Shipping products',
    body: content.services[0].pitch,
    stat: { value: String(content.agentic.metrics[1].value), label: content.agentic.metrics[1].label },
    chips: content.services[0].includes,
  },
  {
    rail: 'Everywhere',
    kicker: '04 / Desktop and mobile',
    title: 'Everywhere',
    body: content.services[2].pitch,
    chips: content.services[2].includes,
  },
];

/** Pinned chapter stage (desktop) that stacks into plain blocks on small screens. */
export function renderChapters(): HTMLElement {
  return el(
    'section',
    { id: 'workflow-story', class: 'chapters', 'aria-label': 'The swarm, chapter by chapter' },
    el(
      'div',
      { class: 'chapters-stage' },
      el(
        'nav',
        { class: 'chapter-rail', 'aria-label': 'Story chapters' },
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
                el('span', { class: 'rail-no', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')),
                el('span', { class: 'rail-label' }, c.rail),
              ),
            ),
          ),
        ),
      ),
      el(
        'div',
        { class: 'chapter-list' },
        CHAPTERS.map((c, i) =>
          el(
            'article',
            { class: i === 0 ? 'chapter is-active' : 'chapter', 'data-chapter': String(i + 1), 'aria-labelledby': `chapter-${i + 1}-title` },
            el('p', { class: 'chapter-kicker' }, c.kicker),
            el('h2', { id: `chapter-${i + 1}-title`, class: 'chapter-title' }, c.title),
            el('p', { class: 'chapter-body' }, c.body),
            c.chips ? chips(c.chips, 'chip chip-soft') : null,
            c.stat
              ? el(
                  'p',
                  { class: 'chapter-stat' },
                  el('span', { class: 'chapter-stat-value' }, c.stat.value),
                  el('span', { class: 'chapter-stat-label' }, c.stat.label),
                )
              : null,
          ),
        ),
      ),
    ),
  );
}

/**
 * Drives the swarm: each chapter maps to one morph state (1..4). On desktop the
 * active chapter follows the pinned scroll progress; on mobile it follows whichever
 * stacked block sits nearest the middle of the viewport.
 */
export function initChapters(section: HTMLElement, onChange: (state: number) => void): void {
  const panels = Array.from(section.querySelectorAll<HTMLElement>('.chapter'));
  const jumps = Array.from(section.querySelectorAll<HTMLButtonElement>('[data-chapter-jump]'));
  const desktop = window.matchMedia('(min-width: 900px)');
  let current = -1;
  let lastState = -1;
  // State 0 is the hero cloud; chapter i (0-based) maps to state i + 1.
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

  const trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
      let index = 0;
      if (desktop.matches) {
        index = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(self.progress * CHAPTERS.length)));
      } else {
        panels.forEach((panel, k) => {
          if (panel.getBoundingClientRect().top <= window.innerHeight * 0.5) index = k;
        });
      }
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
