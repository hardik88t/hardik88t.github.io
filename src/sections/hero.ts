import { content } from '../content';
import { el } from '../lib/dom';

export function renderHero(): HTMLElement {
  const p = content.profile;
  const stats = content.agentic.metrics.slice(0, 3);
  return el(
    'section',
    { id: 'top', class: 'hero', 'aria-labelledby': 'hero-title' },
    el(
      'div',
      { class: 'wrap hero-inner' },
      el(
        'div',
        { class: 'hero-copy' },
        el(
          'p',
          { class: 'hero-meta' },
          el('span', { class: 'status-dot', 'aria-hidden': 'true' }),
          el('span', null, p.availability),
        ),
        el('p', { class: 'hero-loc' }, `${p.location}  ·  ${p.timezone}`),
        el(
          'h1',
          { id: 'hero-title', class: 'hero-name' },
          el('span', { class: 'hero-name-line' }, 'Hardik'),
          el('span', { class: 'hero-name-line hero-name-accent' }, 'Thanth'),
        ),
        el('p', { class: 'hero-lede' }, p.headline),
        el('p', { class: 'hero-sub' }, p.sub),
        el(
          'div',
          { class: 'cta-row' },
          el('a', { class: 'btn btn-primary', href: '#contact' }, 'Start a project'),
          el('a', { class: 'btn btn-ghost', href: '#workflow' }, 'See the agent workflow'),
          el(
            'a',
            { class: 'text-link', href: p.links.cv, target: '_blank', rel: 'noopener noreferrer' },
            'Read the CV',
            el('span', { class: 'sr-only' }, ' (PDF, opens in a new tab)'),
          ),
        ),
      ),
      el(
        'dl',
        { class: 'hero-stats' },
        stats.map((m) =>
          el(
            'div',
            { class: 'hero-stat' },
            el('dt', { class: 'hero-stat-value' }, String(m.value), m.unit ? el('span', { class: 'unit' }, m.unit) : null),
            el('dd', { class: 'hero-stat-label' }, el('span', null, m.label), el('span', { class: 'hero-stat-ctx' }, m.context)),
          ),
        ),
      ),
    ),
    el(
      'a',
      { class: 'scroll-cue', href: '#workflow-story', 'aria-label': 'Scroll to the swarm story' },
      el('span', { class: 'scroll-cue-label' }, 'Scroll'),
      el('span', { class: 'scroll-cue-line', 'aria-hidden': 'true' }),
    ),
  );
}
