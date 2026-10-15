import { content } from '../content';
import { el } from '../lib/dom';

/** Hero (swarm cloud). Name, role, one headline, two calls to action. */
export function renderHero(): HTMLElement {
  const p = content.person;
  const lastName = p.name.split(' ').slice(1).join(' ');
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
          el('span', null, `${p.location} · ${p.availability}`),
        ),
        el(
          'h1',
          { id: 'hero-title', class: 'hero-name' },
          el('span', { class: 'hero-name-line' }, p.firstName),
          el('span', { class: 'hero-name-line hero-name-accent' }, lastName),
        ),
        el('p', { class: 'hero-role' }, p.title),
        el('p', { class: 'hero-lede' }, content.headlines.plain),
        el(
          'div',
          { class: 'cta-row' },
          el('a', { class: 'btn btn-primary', href: '#contact' }, 'Start a project'),
          el('a', { class: 'btn btn-ghost', href: '#story' }, 'See what I do'),
        ),
      ),
    ),
    el(
      'a',
      { class: 'scroll-cue', href: '#story', 'aria-label': 'Scroll to the story' },
      el('span', { class: 'scroll-cue-label' }, 'Scroll'),
      el('span', { class: 'scroll-cue-line', 'aria-hidden': 'true' }),
    ),
  );
}
