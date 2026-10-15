import { content } from '../content';
import { chips, el } from '../lib/dom';

export function renderStack(): HTMLElement {
  return el(
    'section',
    { id: 'stack', class: 'section stack', 'aria-labelledby': 'stack-title' },
    el(
      'div',
      { class: 'wrap' },
      el(
        'header',
        { class: 'section-head' },
        el('p', { class: 'eyebrow' }, 'Stack and skills'),
        el('h2', { id: 'stack-title', class: 'section-title' }, 'Tools behind the products'),
      ),
      el(
        'div',
        { class: 'skill-grid' },
        Object.entries(content.profile.skills).map(([group, items]) =>
          el('div', { class: 'skill-group' }, el('h3', { class: 'skill-title' }, group), chips(items, 'chip')),
        ),
      ),
    ),
  );
}
