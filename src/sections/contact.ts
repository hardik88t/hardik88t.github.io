import { content } from '../content';
import { copyText, el } from '../lib/dom';

export function renderContact(): HTMLElement {
  const p = content.profile;
  const status = el('p', { class: 'copy-status', role: 'status', 'aria-live': 'polite' });
  const copyBtn = el('button', { type: 'button', class: 'btn btn-primary', id: 'copy-email' }, 'Copy email');
  copyBtn.addEventListener('click', async () => {
    const ok = await copyText(p.email);
    status.textContent = ok ? 'Email copied to your clipboard.' : 'Copy was blocked. Select the address above and copy it manually.';
  });
  return el(
    'section',
    { id: 'contact', class: 'section contact', 'aria-labelledby': 'contact-title' },
    el(
      'div',
      { class: 'wrap contact-grid' },
      el(
        'div',
        { class: 'contact-copy' },
        el('p', { class: 'eyebrow' }, 'Contact'),
        el('h2', { id: 'contact-title', class: 'section-title' }, 'Start a project'),
        el('p', { class: 'section-lede' }, 'Tell me what you are building and where it is stuck. Email is the quickest way to start the conversation.'),
        el('p', { class: 'contact-avail' }, `${p.availability}. Based in ${p.location}, ${p.timezone}.`),
      ),
      el(
        'div',
        { class: 'contact-card' },
        el('p', { class: 'contact-label' }, 'Email'),
        el('p', { class: 'contact-email' }, el('span', { class: 'email-text' }, p.email)),
        el('div', { class: 'copy-row' }, copyBtn, el('a', { class: 'btn btn-ghost', href: `mailto:${p.email}` }, 'Open in mail app')),
        status,
        el(
          'ul',
          { class: 'contact-links' },
          el('li', null, el('a', { class: 'contact-link', href: p.links.linkedin, target: '_blank', rel: 'noopener noreferrer' }, el('span', null, 'LinkedIn'), el('span', { class: 'arrow', 'aria-hidden': 'true' }, '↗'))),
          el('li', null, el('a', { class: 'contact-link', href: p.links.github, target: '_blank', rel: 'noopener noreferrer' }, el('span', null, 'GitHub'), el('span', { class: 'arrow', 'aria-hidden': 'true' }, '↗'))),
          el('li', null, el('a', { class: 'contact-link', href: p.links.cv, target: '_blank', rel: 'noopener noreferrer' }, el('span', null, 'CV (PDF)'), el('span', { class: 'arrow', 'aria-hidden': 'true' }, '↗'))),
        ),
      ),
    ),
  );
}
