import { content, type Project } from '../content';
import { chips, el } from '../lib/dom';
import { mockKindFor, mockSvg } from './mocks';

const CATEGORY_LABEL: Record<string, string> = {
  agentic: 'Agentic',
  'web-app': 'Web app',
  'ui-ux': 'UI/UX',
  desktop: 'Desktop',
  ai: 'AI',
  'native-mobile': 'Native mobile',
  cli: 'CLI',
  'data-viz': 'Data viz',
  website: 'Website',
};

const label = (c: string) => CATEGORY_LABEL[c] ?? c;

function workCard(p: Project, featured: boolean): HTMLElement {
  const github = p.links.github;
  // Anonymised items keep no live link so they stay generic.
  const live = p.anonymized ? undefined : p.links.live;
  return el(
    'li',
    { class: featured ? 'work-card is-featured' : 'work-card', 'data-tilt': '' },
    el('div', { class: 'work-visual', style: `--accent:${p.accent}`, 'aria-hidden': 'true' }),
    el(
      'div',
      { class: 'work-body' },
      el('p', { class: 'work-cats' }, p.categories.map(label).join('  /  ')),
      el('h3', { class: 'work-title' }, p.title),
      el('p', { class: 'work-line' }, p.oneLiner),
      chips(featured ? p.stack : p.stack.slice(0, 5), 'chip chip-mono'),
      el(
        'div',
        { class: 'work-foot' },
        el(
          'button',
          { type: 'button', class: 'btn btn-ghost btn-small', 'data-project': p.slug, 'aria-haspopup': 'dialog' },
          'Details',
          el('span', { class: 'sr-only' }, ` for ${p.title}`),
        ),
        github ? el('a', { class: 'text-link', href: github, target: '_blank', rel: 'noopener noreferrer' }, 'GitHub', el('span', { class: 'sr-only' }, ` for ${p.title}, opens in a new tab`)) : null,
        live ? el('a', { class: 'text-link', href: live, target: '_blank', rel: 'noopener noreferrer' }, 'Live', el('span', { class: 'sr-only' }, ` for ${p.title}, opens in a new tab`)) : null,
        p.anonymized ? el('span', { class: 'anon-tag' }, 'Anonymised') : null,
      ),
    ),
  );
}

function fillVisual(card: HTMLElement, p: Project): void {
  const visual = card.querySelector<HTMLElement>('.work-visual');
  if (visual) visual.innerHTML = mockSvg(mockKindFor(p.categories), p.accent);
}

export function renderWork(): HTMLElement {
  const sorted = [...content.projects].sort((x, y) => Number(y.featured) - Number(x.featured));
  const featured = sorted.filter((p) => p.featured);
  const others = sorted.filter((p) => !p.featured);
  const cards: { el: HTMLElement; p: Project }[] = [];
  const make = (p: Project, isFeatured: boolean) => {
    const card = workCard(p, isFeatured);
    cards.push({ el: card, p });
    return card;
  };
  const section = el(
    'section',
    { id: 'work', class: 'section work', 'aria-labelledby': 'work-title' },
    el(
      'div',
      { class: 'wrap' },
      el(
        'header',
        { class: 'section-head' },
        el('p', { class: 'eyebrow' }, `${content.projects.length} projects`),
        el('h2', { id: 'work-title', class: 'section-title' }, 'Selected work'),
        el('p', { class: 'section-lede' }, 'Featured projects come first. Each card opens a detail panel with the longer story, the stack and the role.'),
      ),
      el('ul', { class: 'work-grid work-featured' }, featured.map((p) => make(p, true))),
      el('h3', { class: 'work-subhead' }, 'More work'),
      el('ul', { class: 'work-grid work-compact' }, others.map((p) => make(p, false))),
    ),
  );
  cards.forEach(({ el: card, p }) => fillVisual(card, p));
  section.querySelectorAll<HTMLButtonElement>('[data-project]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = content.projects.find((x) => x.slug === btn.dataset.project);
      if (p) openProject(p, btn);
    });
  });
  bindTilt(section);
  return section;
}

let dialogEl: HTMLDialogElement | null = null;
let returnFocus: HTMLElement | null = null;

/** Single shared dialog, populated per project. Native <dialog> gives focus trap and Escape. */
function ensureDialog(): HTMLDialogElement {
  if (dialogEl) return dialogEl;
  const dialog = el('dialog', { class: 'project-dialog', id: 'project-dialog', 'aria-labelledby': 'pd-title' });
  dialog.addEventListener('click', (e) => {
    // A click on the backdrop lands on the dialog itself, outside the inner panel.
    if (e.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    returnFocus?.focus({ preventScroll: true });
    returnFocus = null;
  });
  document.body.appendChild(dialog);
  dialogEl = dialog;
  return dialog;
}

function openProject(p: Project, trigger: HTMLElement): void {
  const dialog = ensureDialog();
  returnFocus = trigger;
  const github = p.links.github;
  const live = p.anonymized ? undefined : p.links.live;
  dialog.replaceChildren(
    el(
      'div',
      { class: 'pd-inner' },
      el(
        'div',
        { class: 'pd-head' },
        el('p', { class: 'eyebrow' }, p.categories.map(label).join('  /  ')),
        el('button', { type: 'button', class: 'icon-btn', 'data-pd-close': '', 'aria-label': 'Close details' }, '×'),
      ),
      el('div', { class: 'pd-visual', style: `--accent:${p.accent}`, 'aria-hidden': 'true' }),
      el('h2', { id: 'pd-title', class: 'pd-title' }, p.title),
      el('p', { class: 'pd-line' }, p.oneLiner),
      el('p', { class: 'pd-desc' }, p.description),
      el(
        'dl',
        { class: 'pd-meta' },
        el('div', null, el('dt', null, 'Role'), el('dd', null, p.role)),
        el('div', null, el('dt', null, 'Year'), el('dd', null, p.year)),
      ),
      el('h3', { class: 'pd-sub' }, 'Highlights'),
      el('ul', { class: 'pd-highlights' }, p.highlights.map((h) => el('li', null, h))),
      el('h3', { class: 'pd-sub' }, 'Stack'),
      chips(p.stack, 'chip chip-mono'),
      el(
        'div',
        { class: 'pd-links' },
        github ? el('a', { class: 'btn btn-ghost btn-small', href: github, target: '_blank', rel: 'noopener noreferrer' }, 'View on GitHub') : null,
        live ? el('a', { class: 'btn btn-ghost btn-small', href: live, target: '_blank', rel: 'noopener noreferrer' }, 'Visit live site') : null,
      ),
      p.anonymized ? el('p', { class: 'pd-note' }, 'Client work. Details are kept generic on purpose.') : null,
    ),
  );
  const visual = dialog.querySelector<HTMLElement>('.pd-visual');
  if (visual) visual.innerHTML = mockSvg(mockKindFor(p.categories), p.accent);
  dialog.querySelector<HTMLButtonElement>('[data-pd-close]')?.addEventListener('click', () => dialog.close());
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
  dialog.querySelector<HTMLButtonElement>('[data-pd-close]')?.focus();
}

/** Subtle pointer tilt on cards (fine pointers only, disabled under reduced motion). */
function bindTilt(root: HTMLElement): void {
  if (!window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  root.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--rx', `${(-py * 4).toFixed(2)}deg`);
      card.style.setProperty('--ry', `${(px * 5).toFixed(2)}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}
