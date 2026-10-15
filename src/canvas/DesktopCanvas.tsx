import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { ContactCard, HelloCard } from '../frames/cards';
import { FRAME_VIEW, STICKY, UI } from '../frames/copy';
import { BBOX, FRAMES, LABEL_H, STICKY_GAP, STICKY_W, type FrameSpec } from '../frames/layout';
import { captionFor, person, projectBySlug } from '../content';
import { MOCKS } from '../mocks';
import { Icon } from '../shared/icons';
import { CanvasController, type View } from './controller';
import './canvas.css';

const MINI_W = 176;
const MINI_S = MINI_W / BBOX.w;
const MINI_H = BBOX.h * MINI_S;
const CONTACT_INDEX = FRAMES.findIndex((f) => f.kind === 'contact');

const INTERACTIVE = 'a, button, input, textarea, select, [data-nopan]';

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function DesktopCanvas() {
  const ctrl = useMemo(() => new CanvasController(), []);
  const stageRef = useRef<HTMLElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLSpanElement>(null);
  const switcherRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [hintOn, setHintOn] = useState(true);
  const activeRef = useRef(0);
  const interacted = useRef(false);

  const markInteraction = useCallback(() => {
    if (interacted.current) return;
    interacted.current = true;
    setHintOn(false);
  }, []);

  const select = useCallback(
    (index: number, animated = true) => {
      const i = Math.min(FRAMES.length - 1, Math.max(0, index));
      activeRef.current = i;
      setActive(i);
      ctrl.focusIndex(i, animated);
    },
    [ctrl],
  );

  // Bind the controller, fit-all on load and on resize until the viewer interacts.
  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;

    ctrl.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctrl.bind(stage, world);
    ctrl.animateTo(ctrl.startView(), 0);

    const ro = new ResizeObserver(() => {
      ctrl.measure();
      // Re-fit on resize until the viewer takes control of the view.
      if (!interacted.current) ctrl.animateTo(ctrl.startView(), 0);
    });
    ro.observe(stage);

    const offSettle = ctrl.onSettle((v: View) => {
      const i = ctrl.nearestIndex(v);
      if (i !== activeRef.current) {
        activeRef.current = i;
        setActive(i);
      }
    });

    // Zoom read-out and minimap viewport are written straight to the DOM on every paint.
    const offPaint = ctrl.subscribe((v) => {
      const zoom = zoomRef.current;
      if (zoom) {
        const pct = `${Math.round(v.k * 100)}%`;
        if (zoom.textContent !== pct) zoom.textContent = pct;
      }
      const vp = viewportRef.current;
      if (vp) {
        const x0 = -v.x / v.k;
        const y0 = -v.y / v.k;
        vp.style.width = `${(ctrl.size.w / v.k) * MINI_S}px`;
        vp.style.height = `${(ctrl.size.h / v.k) * MINI_S}px`;
        vp.style.transform = `translate(${(x0 - BBOX.x) * MINI_S}px, ${(y0 - BBOX.y) * MINI_S}px)`;
      }
    });

    // Gestures: drag to pan, pinch to zoom (two pointers), wheel to zoom at cursor.
    const pts = new Map<number, { x: number; y: number }>();
    let start = { x: 0, y: 0 };
    let moved = false;
    let pinchDist = 0;
    let pinchMid = { x: 0, y: 0 };
    let wheelTimer = 0;

    const onMove = (e: PointerEvent) => {
      const p = pts.get(e.pointerId);
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - p.y;
      p.x = e.clientX;
      p.y = e.clientY;

      if (pts.size === 1) {
        if (!moved) {
          if (Math.hypot(e.clientX - start.x, e.clientY - start.y) < 4) return;
          moved = true;
          markInteraction();
          stage.classList.add('is-grabbing');
        }
        ctrl.panBy(dx, dy);
      } else if (pts.size >= 2) {
        const [a, b] = [...pts.values()];
        const d = dist(a, b);
        const m = mid(a, b);
        const rect = stage.getBoundingClientRect();
        if (pinchDist > 0 && d > 0) {
          ctrl.zoomAt(pinchMid.x - rect.left, pinchMid.y - rect.top, d / pinchDist);
          ctrl.panBy(m.x - pinchMid.x, m.y - pinchMid.y);
        }
        pinchDist = d;
        pinchMid = m;
      }
    };

    const endPointer = (e: PointerEvent) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size === 0) {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', endPointer);
        window.removeEventListener('pointercancel', endPointer);
        stage.classList.remove('is-grabbing');
        if (moved) ctrl.settle();
        moved = false;
        pinchDist = 0;
      } else if (pts.size === 1) {
        pinchDist = 0;
        const only = [...pts.values()][0];
        start = { x: only.x, y: only.y };
        moved = true;
      }
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if ((e.target as Element).closest(INTERACTIVE)) return;
      ctrl.stop();
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) {
        start = { x: e.clientX, y: e.clientY };
        moved = false;
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        pinchDist = dist(a, b);
        pinchMid = mid(a, b);
        moved = true;
        markInteraction();
        stage.classList.add('is-grabbing');
      }
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', endPointer);
      window.addEventListener('pointercancel', endPointer);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      markInteraction();
      ctrl.stop();
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 16;
      else if (e.deltaMode === 2) dy *= 600;
      dy = Math.max(-240, Math.min(240, dy));
      const rect = stage.getBoundingClientRect();
      ctrl.zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-dy * 0.0022));
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => ctrl.settle(), 160);
    };

    const onDouble = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest(`${INTERACTIVE}, .selectable`)) return;
      const el = t.closest<HTMLElement>('[data-frame-index]');
      if (!el) return;
      markInteraction();
      select(Number(el.dataset.frameIndex));
    };

    const onFocusIn = (e: FocusEvent) => {
      // Keyboard focus into a frame pans to it. Mouse focus does not move the canvas.
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
      const t = e.target as HTMLElement;
      if (!t.matches(':focus-visible')) return;
      const el = t.closest<HTMLElement>('[data-frame-index]');
      if (el) select(Number(el.dataset.frameIndex));
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const c = ctrl.center();
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          markInteraction();
          select(activeRef.current + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          markInteraction();
          select(activeRef.current - 1);
          break;
        case '0':
          markInteraction();
          ctrl.fitAll();
          break;
        case '+':
        case '=':
          markInteraction();
          ctrl.zoomAt(c.x, c.y, 1.25);
          ctrl.settle();
          break;
        case '-':
        case '_':
          markInteraction();
          ctrl.zoomAt(c.x, c.y, 0.8);
          ctrl.settle();
          break;
        default:
      }
    };

    const onScroll = () => {
      stage.scrollTop = 0;
      stage.scrollLeft = 0;
    };

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('dblclick', onDouble);
    stage.addEventListener('focusin', onFocusIn);
    stage.addEventListener('scroll', onScroll);
    stage.addEventListener('dragstart', (e) => e.preventDefault());
    window.addEventListener('keydown', onKey);

    return () => {
      ro.disconnect();
      offSettle();
      offPaint();
      window.clearTimeout(wheelTimer);
      stage.removeEventListener('pointerdown', onDown);
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('dblclick', onDouble);
      stage.removeEventListener('focusin', onFocusIn);
      stage.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', endPointer);
      window.removeEventListener('pointercancel', endPointer);
      ctrl.stop();
    };
  }, [ctrl, markInteraction, select]);

  // Keep the active switcher item in view as the canvas moves.
  useEffect(() => {
    const el = switcherRefs.current[active];
    if (!el) return;
    el.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: ctrl.reduceMotion ? 'auto' : 'smooth',
    });
  }, [active, ctrl]);

  const onMinimapClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const wx = BBOX.x + (e.clientX - r.left) / MINI_S;
    const wy = BBOX.y + (e.clientY - r.top) / MINI_S;
    markInteraction();
    ctrl.centerOn(wx, wy, true);
  };

  return (
    <div className="canvas-app">
      <header className="topbar">
        <div className="pill">
          <span className="monogram monogram--sm" aria-hidden="true">
            {person.monogram}
          </span>
          <p>
            {person.name}
            <span className="pill-dash" aria-hidden="true">
              {' '}
              —{' '}
            </span>
            <span className="pill-role">{UI.pillTagline}</span>
          </p>
        </div>

        <nav className="switcher" aria-label={UI.switcherLabel}>
          <div className="switcher-track">
            {FRAMES.map((f, i) => (
              <button
                key={f.id}
                ref={(el) => {
                  switcherRefs.current[i] = el;
                }}
                type="button"
                aria-current={active === i ? 'true' : undefined}
                onClick={() => {
                  markInteraction();
                  select(i);
                }}
              >
                {FRAME_VIEW[f.id].name}
              </button>
            ))}
          </div>
        </nav>

        <button
          type="button"
          className="btn btn--primary topbar-contact"
          onClick={() => {
            markInteraction();
            select(CONTACT_INDEX);
          }}
        >
          {UI.contactButton}
        </button>
      </header>

      <main className="stage" ref={stageRef} aria-label="Design canvas">
        <div className="world" ref={worldRef}>
          {FRAMES.map((f, i) => (
            <FrameNode key={f.id} spec={f} index={i} />
          ))}
        </div>
      </main>

      <p className="hint" data-on={hintOn ? 'true' : 'false'}>
        {UI.hint}
      </p>

      <div className="tools">
        <button
          type="button"
          className="minimap"
          aria-label={UI.minimapLabel}
          style={{ width: MINI_W, height: MINI_H }}
          onClick={onMinimapClick}
        >
          {FRAMES.map((f) => (
            <span
              key={f.id}
              className={`mini-frame mini-${f.kind}`}
              style={miniRect(f, f.kind === 'project' ? projectBySlug(f.id).accent : undefined)}
            />
          ))}
          <span ref={viewportRef} className="mini-view" />
        </button>

        <div className="zoombar" role="group" aria-label="Zoom">
          <button
            type="button"
            aria-label={UI.zoomOut}
            onClick={() => {
              markInteraction();
              ctrl.zoomCenter(0.8);
            }}
          >
            <Icon name="minus" size={16} />
          </button>
          <span className="zoom-value" ref={zoomRef}>
            100%
          </span>
          <button
            type="button"
            aria-label={UI.zoomIn}
            onClick={() => {
              markInteraction();
              ctrl.zoomCenter(1.25);
            }}
          >
            <Icon name="plus" size={16} />
          </button>
          <button
            type="button"
            className="zoom-fit"
            onClick={() => {
              markInteraction();
              ctrl.fitAll();
            }}
          >
            {UI.fit}
          </button>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {FRAME_VIEW[FRAMES[active].id].name}
      </span>
    </div>
  );
}

function miniRect(f: FrameSpec, accent?: string): CSSProperties {
  return {
    left: (f.x - BBOX.x) * MINI_S,
    top: (f.y - BBOX.y) * MINI_S,
    width: f.w * MINI_S,
    height: f.h * MINI_S,
    background: accent ? `color-mix(in srgb, ${accent} 46%, #ffffff)` : undefined,
  };
}

interface FrameNodeProps {
  spec: FrameSpec;
  index: number;
}

function FrameNode({ spec, index }: FrameNodeProps) {
  const { name, view } = FRAME_VIEW[spec.id];
  const pos = { left: spec.x, top: spec.y, width: spec.w, height: spec.h };
  const isProject = spec.kind === 'project';
  const Mock = isProject ? MOCKS[spec.id] : undefined;
  const sticky = isProject ? STICKY[spec.id] : undefined;
  const caption = isProject ? captionFor(projectBySlug(spec.id)) : null;

  return (
    <>
      <p
        className="frame-label"
        data-frame-index={index}
        style={{ left: spec.x, top: spec.y - LABEL_H, width: spec.w }}
        aria-hidden="true"
      >
        <span>
          <span className="fl-name">{name}</span>
          <span className="fl-view"> / {view}</span>
        </span>
        {caption ? <span className="fl-caption">{caption}</span> : null}
      </p>

      <section
        className={`frame frame--${spec.kind}`}
        style={pos}
        data-frame-index={index}
        aria-label={`${name}, ${view}`}
      >
        {spec.kind === 'hello' ? <HelloCard variant="canvas" /> : null}
        {spec.kind === 'contact' ? <ContactCard variant="canvas" /> : null}
        {Mock ? <Mock /> : null}
      </section>

      {sticky ? (
        <p
          className="sticky"
          style={{
            left: spec.x + spec.w + STICKY_GAP,
            top: spec.y + 48,
            width: STICKY_W,
            transform: `rotate(${spec.tilt ?? 0}deg)`,
          }}
        >
          {sticky}
        </p>
      ) : null}
    </>
  );
}
