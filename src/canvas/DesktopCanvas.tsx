import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent as ReactMouseEvent } from 'react';
import { captionFor, projectBySlug } from '../lib/projects';
import { MOCKS } from '../mocks';
import { Icon } from '../shared/icons';
import { CanvasController, type View } from './controller';
import { BBOX, FRAMES, LABEL_H, NOTE_GAP, NOTE_W, indexOfSlug, type FrameSpec } from './layout';
import { UI } from './copy';
import { CloseButton, Wordmark } from './chrome';

const MINI_W = 200;
const MINI_S = MINI_W / BBOX.w;
const MINI_H = BBOX.h * MINI_S;

const INTERACTIVE = 'a, button, input, textarea, select, [data-nopan]';

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

interface DesktopCanvasProps {
  /** Project slug to open on, or null for the first frame. */
  target: string | null;
  onClose: () => void;
}

/** The design canvas: pan, zoom, frame switcher, minimap and keys. Opens on the target frame. */
export function DesktopCanvas({ target, onClose }: DesktopCanvasProps) {
  const ctrl = useMemo(() => new CanvasController(), []);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);
  const viewportRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const switcherRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const startIndex = useRef(indexOfSlug(target));
  const [active, setActive] = useState(startIndex.current);
  const [hintOn, setHintOn] = useState(true);
  const activeRef = useRef(active);
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

  // Bind the controller and start on the target frame. Re-fit on resize until the reader takes control.
  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;

    ctrl.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctrl.bind(stage, world);
    ctrl.animateTo(ctrl.startView(startIndex.current), 0);

    const ro = new ResizeObserver(() => {
      ctrl.measure();
      if (!interacted.current) ctrl.animateTo(ctrl.startView(startIndex.current), 0);
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
        if (!a || !b) return;
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
        if (only) start = { x: only.x, y: only.y };
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
        if (a && b) {
          pinchDist = dist(a, b);
          pinchMid = mid(a, b);
        }
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
      if (t.closest(INTERACTIVE)) return;
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

    const onDragStart = (e: Event) => e.preventDefault();

    stage.addEventListener('pointerdown', onDown);
    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('dblclick', onDouble);
    stage.addEventListener('focusin', onFocusIn);
    stage.addEventListener('scroll', onScroll);
    stage.addEventListener('dragstart', onDragStart);
    window.addEventListener('keydown', onKey);

    // Escape closes the overlay. The overlay owns the close; this keeps the desktop canvas self-contained.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onEscape);

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
      stage.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onEscape);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', endPointer);
      window.removeEventListener('pointercancel', endPointer);
      ctrl.stop();
    };
  }, [ctrl, markInteraction, select, onClose]);

  // A new target (browser Back or Forward between two deep links) moves the canvas to that frame.
  const firstTarget = useRef(true);
  useEffect(() => {
    if (firstTarget.current) {
      firstTarget.current = false;
      return;
    }
    select(indexOfSlug(target));
  }, [target, select]);

  // Keep the active switcher item in view as the canvas moves. Scroll the track only, never the page.
  useEffect(() => {
    const track = trackRef.current;
    const el = switcherRefs.current[active];
    if (!track || !el) return;
    const left = el.offsetLeft - (track.clientWidth - el.offsetWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
  }, [active]);

  const onMinimapClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const wx = BBOX.x + (e.clientX - r.left) / MINI_S;
    const wy = BBOX.y + (e.clientY - r.top) / MINI_S;
    markInteraction();
    ctrl.centerOn(wx, wy, true);
  };

  const activeTitle = projectBySlug(FRAMES[active]?.slug ?? '').title;

  return (
    <div className="cv-desk">
      <header className="cv-top">
        <div className="cv-pill">
          <Wordmark />
        </div>

        <nav className="cv-switch" aria-label={UI.switcherLabel}>
          <div className="cv-switch-track" ref={trackRef}>
            {FRAMES.map((f, i) => (
              <button
                key={f.slug}
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
                {projectBySlug(f.slug).title}
              </button>
            ))}
          </div>
        </nav>

        <div className="cv-pill cv-pill--close">
          <CloseButton onClose={onClose} />
        </div>
      </header>

      <div className="cv-stage" ref={stageRef} role="region" aria-label={UI.stageLabel}>
        <div className="cv-world" ref={worldRef}>
          {FRAMES.map((f, i) => (
            <FrameNode key={f.slug} frame={f} index={i} />
          ))}
        </div>
      </div>

      <p className="cv-hint" hidden={!hintOn}>
        {UI.hint}
      </p>

      <div className="cv-tools">
        <button
          type="button"
          className="cv-mini"
          aria-label={UI.minimapLabel}
          style={{ width: MINI_W, height: MINI_H }}
          onClick={onMinimapClick}
        >
          {FRAMES.map((f, i) => (
            <span key={f.slug} className={`cv-mini-frame${i === active ? ' is-active' : ''}`} style={miniRect(f)} />
          ))}
          <span ref={viewportRef} className="cv-mini-view" />
        </button>

        <div className="cv-zoom" role="group" aria-label="Zoom">
          <button
            type="button"
            aria-label={UI.zoomOut}
            onClick={() => {
              markInteraction();
              ctrl.zoomCenter(0.8);
            }}
          >
            <Icon name="minus" size={16} strokeWidth={1.6} />
          </button>
          <span className="cv-zoom-value" ref={zoomRef}>
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
            <Icon name="plus" size={16} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            className="cv-zoom-fit"
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
        {activeTitle}
      </span>
    </div>
  );
}

function miniRect(f: FrameSpec): CSSProperties {
  return {
    left: (f.x - BBOX.x) * MINI_S,
    top: (f.y - BBOX.y) * MINI_S,
    width: f.w * MINI_S,
    height: f.h * MINI_S,
  };
}

interface FrameNodeProps {
  frame: FrameSpec;
  index: number;
}

/** One project: its title and caption above the frame, the screen, and its sticky note to the right. */
function FrameNode({ frame, index }: FrameNodeProps) {
  const project = projectBySlug(frame.slug);
  const Mock = MOCKS[frame.slug];
  const caption = captionFor(project);

  return (
    <>
      <p
        className="cv-label"
        data-frame-index={index}
        style={{ left: frame.x, top: frame.y - LABEL_H, width: frame.w, height: LABEL_H }}
        aria-hidden="true"
      >
        <span className="cv-label-name">{project.title}</span>
        <span className="cv-caption">{caption}</span>
      </p>

      <section
        className="cv-frame"
        style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h }}
        data-frame-index={index}
        aria-label={`${project.title}. ${caption}`}
      >
        {Mock ? <Mock /> : null}
      </section>

      {project.sticky ? (
        <p className="cv-note" style={{ left: frame.x + frame.w + NOTE_GAP, top: frame.y + 48, width: NOTE_W }}>
          {project.sticky}
        </p>
      ) : null}
    </>
  );
}
