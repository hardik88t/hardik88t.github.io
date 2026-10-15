// The work canvas on the page. Opens the design canvas (desktop) or the swipe gallery (phones), and only
// then loads the overlay code. Hash routes:
//   #work            opens the overlay at the first project
//   #work-<slug>     opens it focused on that project
// Opening pushes a history entry, so the browser Back button closes the overlay. Escape and Close do the
// same. Focus returns to the element that opened it. The page behind is made inert while open, and its
// scroll position is kept (the page is not scrolled while a canvas route is in the hash).

interface OverlayProps {
  target: string | null;
  onClose: () => void;
}

interface OverlayHandle {
  update(props: OverlayProps): void;
  unmount(): void;
}

type CanvasModule = typeof import('../canvas/mount');

const HASH = /^#work(?:-([a-z0-9-]+))?$/;
const HOST_ID = 'cv-host';

let open = false;
let host: HTMLElement | null = null;
let handle: OverlayHandle | null = null;
let opener: HTMLElement | null = null;
let inerted: Element[] = [];
let loader: Promise<CanvasModule> | null = null;
/** The frame skeleton shown at once on open, until the overlay code has loaded. */
let skeleton: HTMLElement | null = null;

/** True for #work and #work-<slug>. The page script leaves scrolling alone for these. */
export function isCanvasHash(hash: string): boolean {
  return HASH.test(hash);
}

/** The overlay code, loaded once and only on demand. Called early on hover or focus to warm it. */
function load(): Promise<CanvasModule> {
  // A failed load is forgotten, so the next open tries again.
  if (!loader) loader = import('../canvas/mount').catch((err: unknown) => {
    loader = null;
    throw err;
  });
  return loader;
}

function parse(hash: string): { slug: string | null } | null {
  const m = HASH.exec(hash);
  return m ? { slug: m[1] ?? null } : null;
}

function getHost(): HTMLElement {
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    document.body.append(host);
  }
  return host;
}

function lock(on: boolean): void {
  const h = getHost();
  document.documentElement.classList.toggle('cv-lock', on);
  if (on) {
    inerted = [...document.body.children].filter((el) => el !== h && !el.hasAttribute('inert'));
    for (const el of inerted) el.setAttribute('inert', '');
  } else {
    for (const el of inerted) el.removeAttribute('inert');
    inerted = [];
  }
}

/** Shows the overlay frame at once, so opening never waits on the chunk. It has a working Close. */
function showSkeleton(): void {
  if (skeleton || handle) return;
  const el = document.createElement('div');
  el.className = 'cv-overlay cv-skeleton';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-busy', 'true');
  el.setAttribute('aria-label', 'Selected work, design canvas');
  el.innerHTML =
    '<div class="cv-top"><div class="cv-pill cv-skeleton-brand"></div>' +
    '<div class="cv-pill cv-pill--close"><button type="button" class="cv-close">Close' +
    '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M1.5 1.5l9 9M10.5 1.5l-9 9" /></svg></button></div></div>' +
    '<div class="cv-skeleton-frame" aria-hidden="true"></div>';
  el.querySelector<HTMLButtonElement>('.cv-close')?.addEventListener('click', requestClose);
  getHost().append(el);
  skeleton = el;
  el.querySelector<HTMLButtonElement>('.cv-close')?.focus({ preventScroll: true });
}

function clearSkeleton(): void {
  skeleton?.remove();
  skeleton = null;
}

function hide(): void {
  if (!open) return;
  open = false;
  clearSkeleton();
  handle?.unmount();
  handle = null;
  lock(false);
  const back = opener;
  opener = null;
  if (back && back.isConnected) back.focus({ preventScroll: true });
}

/** Close from the overlay. Pops the history entry we pushed, or just removes the hash. */
function requestClose(): void {
  if (!open) return;
  if (history.state?.canvas === true && HASH.test(location.hash)) {
    history.back(); // the popstate handler below closes the overlay
  } else {
    history.replaceState(null, '', location.pathname + location.search);
    hide();
  }
}

async function show(slug: string | null, push: boolean, from?: HTMLElement | null): Promise<void> {
  if (!open) {
    const active = document.activeElement;
    opener = from ?? (active instanceof HTMLElement && active !== document.body ? active : null);
    open = true;
    lock(true);
    if (push) history.pushState({ canvas: true }, '', slug ? `#work-${slug}` : '#work');
  }
  showSkeleton();
  let mod: CanvasModule;
  try {
    mod = await load();
  } catch {
    // The page stays usable: leave the canvas and show the portfolio as it was.
    if (open) {
      clearSkeleton();
      requestClose();
    }
    return;
  }
  if (!open) return;
  clearSkeleton();
  // Calls resolve in the order they were made, so the latest target always wins.
  if (handle) handle.update({ target: slug, onClose: requestClose });
  else handle = mod.mountOverlay(getHost(), { target: slug, onClose: requestClose });
}

export function initCanvas(): void {
  // Links that open the overlay. Without JavaScript they are plain hash links and do nothing harmful.
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const target = e.target;
    if (!(target instanceof Element)) return;
    const link = target.closest<HTMLAnchorElement>('a[data-canvas-open]');
    if (!link || open) return;
    const route = parse(link.hash);
    if (!route) return;
    e.preventDefault();
    // "View screens" lives in a project dialog. A modal dialog would sit above the overlay, so close it
    // first and return focus to the print that opened it.
    const dlg = link.closest('dialog');
    let from: HTMLElement | null = link;
    if (dlg instanceof HTMLDialogElement && dlg.open) {
      from = document.querySelector<HTMLElement>(`[data-open-dialog="${dlg.id}"]`) ?? from;
      dlg.close();
    }
    void show(route.slug, true, from);
  });

  // Warm the overlay code when a reader points at or focuses a link to it.
  const warm = (e: Event) => {
    const target = e.target;
    if (target instanceof Element && target.closest('a[data-canvas-open]')) void load().catch(() => undefined);
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);

  // Escape closes the skeleton too. Once the overlay is mounted, it handles Escape itself.
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skeleton && open) {
      e.preventDefault();
      requestClose();
    }
  });

  // Browser Back and Forward: the hash decides whether the overlay is open and on which project.
  window.addEventListener('popstate', () => {
    const route = parse(location.hash);
    if (route) void show(route.slug, false);
    else hide();
  });

  // Deep link on load: open directly. Drop any stale canvas state so Close does not pop past the page.
  const initial = parse(location.hash);
  if (initial) {
    history.replaceState(null, '', location.href);
    void show(initial.slug, false);
  }
}
