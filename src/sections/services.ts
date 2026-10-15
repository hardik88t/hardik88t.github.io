import { content } from '../content';
import { el } from '../lib/dom';

export function renderServices(): HTMLElement {
  return el(
    'section',
    { id: 'services', class: 'section services', 'aria-labelledby': 'services-title' },
    el(
      'div',
      { class: 'wrap' },
      el(
        'header',
        { class: 'section-head' },
        el('p', { class: 'eyebrow' }, 'What I can take on'),
        el('h2', { id: 'services-title', class: 'section-title' }, 'Services for clients'),
      ),
      el(
        'ol',
        { class: 'service-list' },
        content.services.map((s, i) =>
          el(
            'li',
            { class: 'service' },
            el(
              'div',
              { class: 'service-head' },
              el('span', { class: 'service-no', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')),
              el('h3', { class: 'service-title' }, s.title),
            ),
            el(
              'div',
              { class: 'service-body' },
              el('p', { class: 'service-pitch' }, s.pitch),
              el('ul', { class: 'service-includes' }, s.includes.map((item) => el('li', null, item))),
            ),
          ),
        ),
      ),
    ),
  );
}
