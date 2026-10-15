import { content } from '../content';
import { el } from '../lib/dom';
import { scrollToTarget } from '../lib/scroll';

const NAV = [
  { id: 'workflow', label: 'Workflow' },
  { id: 'work', label: 'Work' },
  { id: 'services', label: 'Services' },
  { id: 'stack', label: 'Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

/** Header bar with desktop nav, plus a designed full-screen menu for small screens. */
export function renderHeader(): { header: HTMLElement; menu: HTMLElement } {
  const toggle = el(
    'button',
    { class: 'menu-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'mobile-menu', 'aria-label': 'Open menu' },
    el('span', { class: 'menu-bars', 'aria-hidden': 'true' }, el('span'), el('span')),
  );
  const header = el(
    'header',
    { class: 'site-header', id: 'site-header' },
    el(
      'div',
      { class: 'wrap header-inner' },
      el(
        'a',
        { class: 'brand', href: '#top', 'aria-label': `${content.profile.name}, back to top` },
        el('span', { class: 'brand-mark', 'aria-hidden': 'true' }, content.profile.monogram),
        el('span', { class: 'brand-name' }, content.profile.name),
      ),
      el(
        'nav',
        { class: 'primary-nav', 'aria-label': 'Primary' },
        el('ul', null, NAV.map((item) => el('li', null, el('a', { href: `#${item.id}`, 'data-nav': item.id }, item.label)))),
      ),
      el('a', { class: 'btn btn-small btn-primary header-cta', href: '#contact' }, 'Start a project'),
      toggle,
    ),
  );

  const menu = el(
    'div',
    { class: 'mobile-menu', id: 'mobile-menu', hidden: true },
    el(
      'nav',
      { class: 'mobile-menu-nav', 'aria-label': 'Mobile' },
      el(
        'ol',
        null,
        NAV.map((item, i) =>
          el(
            'li',
            null,
            el('a', { href: `#${item.id}`, 'data-menu-link': item.id }, el('span', { class: 'mm-no', 'aria-hidden': 'true' }, String(i + 1).padStart(2, '0')), item.label),
          ),
        ),
      ),
    ),
    el(
      'div',
      { class: 'mobile-menu-foot' },
      el('a', { class: 'btn btn-primary', href: '#contact' }, 'Start a project'),
      el('a', { class: 'text-link', href: content.profile.links.cv, target: '_blank', rel: 'noopener noreferrer' }, 'Read the CV'),
    ),
  );

  wire(header, menu, toggle);
  return { header, menu };
}

function wire(header: HTMLElement, menu: HTMLElement, toggle: HTMLButtonElement): void {
  const setOpen = (open: boolean) => {
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) menu.querySelector<HTMLAnchorElement>('a')?.focus();
    else toggle.focus({ preventScroll: true });
  };
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) setOpen(false);
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', (e) => {
    if (e.matches && !menu.hidden) setOpen(false);
  });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight the nav item for the section currently in view.
  const links = new Map<string, HTMLAnchorElement>();
  header.querySelectorAll<HTMLAnchorElement>('[data-nav]').forEach((a) => links.set(a.dataset.nav ?? '', a));
  const obs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((a, id) => {
          const on = id === entry.target.id;
          a.classList.toggle('is-current', on);
          if (on) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  NAV.forEach((item) => {
    const node = document.getElementById(item.id);
    if (node) obs.observe(node);
  });
}

/** Delegated handler so in-page links use the smooth scroller and keep the hash in sync. */
export function bindAnchorLinks(): void {
  document.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const a = e.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const target = document.querySelector<HTMLElement>(a.getAttribute('href') ?? '');
    if (!target) return;
    e.preventDefault();
    scrollToTarget(target, -64);
    history.replaceState(null, '', a.getAttribute('href'));
  });
}
