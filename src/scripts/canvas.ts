// The work overlay on the page. Opens the design canvas (desktop) or the swipe gallery (phones),
// and only then loads the overlay code. Hash routes:
//   #work            opens the overlay at the first project
//   #work-<slug>     opens it focused on that project
// Opening pushes a history entry, so the browser Back button closes the overlay. Escape and Close
// do the same. Focus returns to the link that opened it. The page behind is made inert while open.

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

/** The overlay code, loaded once and only on demand. Called early on hover or focus to warm it. */
function load(): Promise<CanvasModule> {
  if (!loader) loader = import('../canvas/mount');
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

function hide(): void {
  if (!open) return;
  open = false;
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

async function show(slug: string | null, push: boolean): Promise<void> {
  if (!open) {
    const active = document.activeElement;
    opener = active instanceof HTMLElement && active !== document.body ? active : null;
    open = true;
    lock(true);
    if (push) history.pushState({ canvas: true }, '', slug ? `#work-${slug}` : '#work');
  }
  const mod = await load();
  if (!open) return;
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
    void show(route.slug, true);
  });

  // Warm the overlay code when a reader points at or focuses a link to it.
  const warm = (e: Event) => {
    const target = e.target;
    if (target instanceof Element && target.closest('a[data-canvas-open]')) void load();
  };
  document.addEventListener('pointerover', warm, { passive: true });
  document.addEventListener('focusin', warm);

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
