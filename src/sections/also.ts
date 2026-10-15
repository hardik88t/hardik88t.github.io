import { service } from '../content';
import { el } from '../lib/dom';

/** Closing band: the two services that are not shown as chapters. One line each. */
export function renderAlso(): HTMLElement {
  return el(
    'section',
    { class: 'also reveal', 'aria-labelledby': 'also-label' },
    el(
      'div',
      { class: 'wrap also-inner' },
      el('p', { class: 'also-label', id: 'also-label' }, 'Also'),
      el(
        'ul',
        { class: 'also-list' },
        [service('ai').title, service('design').title].map((title) => el('li', null, title)),
      ),
    ),
  );
}
