// The pinboard: a pannable, zoomable board of clusters. Desktop with JS only, loaded when #work is shown.
// Drag to pan (a click after a drag does not open anything). Wheel pans; Control or Command with the wheel
// zooms toward the cursor. Where the board cannot move, the wheel scrolls the page, so nothing traps it.
// Arrow keys move between projects, + and - zoom, 0 fits. Buttons and the minimap do the same by pointer.
// Everything here is also in the index table and the cards, so the board is an extra, not the only way in.

const MIN = 0.35;
const MAX = 1.6;
const START = 0.95;

export function mountPinboard(): void {
  const board = document.querySelector<HTMLElement>('[data-board]');
  const worldEl = board?.querySelector<HTMLElement>('[data-world]');
  if (!board || !worldEl || board.dataset.mounted) return;
  board.dataset.mounted = '1';
  const world: HTMLElement = worldEl;

  const WW = world.offsetWidth;
  const WH = world.offsetHeight;
  const clusters = Array.from(board.querySelectorAll<HTMLElement>('[data-cluster]'));
  const centers = clusters.map((el) => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 }));
  const label = document.querySelector<HTMLElement>('[data-zoom-label]');
  const minimap = document.querySelector<SVGSVGElement>('[data-minimap]');
  const viewRect = minimap?.querySelector<SVGRectElement>('[data-view-rect]');
  const vw = () => board.clientWidth;
  const vh = () => board.clientHeight;

  let s = START;
  let tx = 0;
  let ty = 0;
  let current = 0;

  function clamp(): void {
    s = Math.min(MAX, Math.max(MIN, s));
    const W = WW * s;
    const H = WH * s;
    const slack = 48;
    tx = W <= vw() ? (vw() - W) / 2 : Math.min(slack, Math.max(vw() - W - slack, tx));
    ty = H <= vh() ? (vh() - H) / 2 : Math.min(slack, Math.max(vh() - H - slack, ty));
  }

  function apply(): void {
    world.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    if (label) label.textContent = `${Math.round(s * 100)}%`;
    if (viewRect) {
      viewRect.setAttribute('x', String(-tx / s));
      viewRect.setAttribute('y', String(-ty / s));
      viewRect.setAttribute('width', String(vw() / s));
      viewRect.setAttribute('height', String(vh() / s));
    }
  }

  function centerWorld(x: number, y: number, scale = s): void {
    s = scale;
    tx = vw() / 2 - x * s;
    ty = vh() / 2 - y * s;
    clamp();
    apply();
  }

  function zoomAt(cx: number, cy: number, factor: number): void {
    const next = Math.min(MAX, Math.max(MIN, s * factor));
    const k = next / s;
    tx = cx - (cx - tx) * k;
    ty = cy - (cy - ty) * k;
    s = next;
    clamp();
    apply();
  }

  function go(i: number): void {
    const n = clusters.length;
    current = ((i % n) + n) % n;
    const c = centers[current];
    if (c) centerWorld(c.x, c.y);
  }

  function fit(): void {
    const scale = Math.min(vw() / WW, vh() / WH) * 0.96;
    centerWorld(WW / 2, WH / 2, Math.min(MAX, Math.max(MIN, scale)));
  }

  // Pointer: drag to pan. A drag longer than a few pixels suppresses the click that follows it.
  let drag: { x0: number; y0: number; tx0: number; ty0: number; moved: boolean } | null = null;
  let suppressClick = false;
  // Native image dragging would cancel the pointer drag, so it is switched off on the board.
  board.addEventListener('dragstart', (e) => e.preventDefault());
  board.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    drag = { x0: e.clientX, y0: e.clientY, tx0: tx, ty0: ty, moved: false };
  });
  window.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x0;
    const dy = e.clientY - drag.y0;
    if (!drag.moved && Math.hypot(dx, dy) < 5) return;
    drag.moved = true;
    board.classList.add('is-dragging');
    tx = drag.tx0 + dx;
    ty = drag.ty0 + dy;
    clamp();
    apply();
  });
  const endDrag = () => {
    if (!drag) return;
    suppressClick = drag.moved;
    drag = null;
    board.classList.remove('is-dragging');
    window.setTimeout(() => {
      suppressClick = false;
    }, 60);
  };
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  board.addEventListener(
    'click',
    (e) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  // Wheel: pan when the board can move that way; Control or Command zooms toward the cursor.
  board.addEventListener(
    'wheel',
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const r = board.getBoundingClientRect();
        zoomAt(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0022));
        return;
      }
      const before = [tx, ty];
      tx -= e.deltaX;
      ty -= e.deltaY;
      clamp();
      if (tx === before[0] && ty === before[1]) return; // at the edge: let the page scroll
      e.preventDefault();
      apply();
    },
    { passive: false },
  );

  // Keyboard, on the board region (links inside a cluster bubble here too).
  board.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(current + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(current - 1);
    } else if (e.key === '0') {
      fit();
    } else if (e.key === '+' || e.key === '=') {
      zoomAt(vw() / 2, vh() / 2, 1.2);
    } else if (e.key === '-') {
      zoomAt(vw() / 2, vh() / 2, 1 / 1.2);
    }
  });

  // Focus on a link inside a cluster brings that cluster into view (not when a pointer press caused it).
  board.addEventListener('focusin', (e) => {
    if (drag) return;
    const el = (e.target as Element | null)?.closest?.('[data-cluster]') as HTMLElement | null;
    if (!el) return;
    const i = clusters.indexOf(el);
    if (i >= 0 && i !== current) {
      current = i;
      const c = centers[i];
      if (c) centerWorld(c.x, c.y);
    }
  });

  // Zoom buttons.
  document.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const act = btn.dataset.zoom;
      if (act === 'fit') fit();
      else if (act === 'in') zoomAt(vw() / 2, vh() / 2, 1.25);
      else if (act === 'out') zoomAt(vw() / 2, vh() / 2, 1 / 1.25);
    });
  });

  // Minimap: a click centers the board there.
  minimap?.addEventListener('click', (e) => {
    const r = minimap.getBoundingClientRect();
    const wx = ((e.clientX - r.left) / r.width) * WW;
    const wy = ((e.clientY - r.top) / r.height) * WH;
    centerWorld(wx, wy);
  });

  window.addEventListener('resize', () => {
    clamp();
    apply();
  });

  go(0);
}
