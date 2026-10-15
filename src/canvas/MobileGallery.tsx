import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { captionFor, projectBySlug } from '../lib/content';
import { MOCKS } from '../mocks';
import { FitFrame } from '../shared/FitFrame';
import { Brand, CloseButton } from './chrome';
import { MARGIN_NOTE, UI, VIEW_NAME } from './copy';
import { FRAMES, indexOfSlug, type FrameSpec } from './layout';

/** Gutter used for the first and last slide (matches --gutter on phones). */
const GUTTER = 16;

interface MobileGalleryProps {
  /** Project slug to start on, or null for the first project. */
  target: string | null;
  onClose: () => void;
}

interface Viewing {
  frame: FrameSpec;
  opener: HTMLElement | null;
}

/**
 * Phones and tablets below 900 px: a swipe gallery of the same frames, one per screen width,
 * starting at the target project. Tapping a frame opens it full screen (Viewer).
 */
export function MobileGallery({ target, onClose }: MobileGalleryProps) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const startIndex = useRef(indexOfSlug(target));
  const [index, setIndex] = useState(startIndex.current);
  const [viewing, setViewing] = useState<Viewing | null>(null);

  // Start on the target slide. Set before paint so the reader never sees the first project flash.
  useLayoutEffect(() => {
    const g = galleryRef.current;
    const el = slideRefs.current[startIndex.current];
    if (g && el) g.scrollLeft = Math.max(0, el.offsetLeft - GUTTER);
  }, []);

  // Escape closes the viewer first, then the overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      if (viewing) setViewing(null);
      else onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewing, onClose]);

  // A new target (browser Back or Forward between deep links) moves the gallery.
  const firstTarget = useRef(true);
  useEffect(() => {
    if (firstTarget.current) {
      firstTarget.current = false;
      return;
    }
    goTo(indexOfSlug(target), false);
  }, [target]);

  const onScroll = () => {
    const g = galleryRef.current;
    if (!g) return;
    let best = 0;
    let bestDist = Infinity;
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const d = Math.abs(el.offsetLeft - g.scrollLeft - GUTTER);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex((prev) => (prev === best ? prev : best));
  };

  function goTo(i: number, smooth = true) {
    const g = galleryRef.current;
    const el = slideRefs.current[i];
    if (!g || !el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    g.scrollTo({ left: Math.max(0, el.offsetLeft - GUTTER), behavior: smooth && !reduce ? 'smooth' : 'auto' });
    setIndex(i);
  }

  return (
    <div className="cv-m">
      <header className="cv-top cv-top--m">
        <Brand />
        <CloseButton onClose={onClose} />
      </header>

      <div className="cv-m-body" inert={viewing !== null}>
        <div className="cv-m-head">
          <h2 className="cv-m-title">{UI.selectedWork}</h2>
          <p className="cv-m-hint">{UI.swipeHint}</p>
        </div>

        <div className="cv-gallery" ref={galleryRef} onScroll={onScroll} role="region" aria-label="Projects" tabIndex={0}>
          {FRAMES.map((f, i) => {
            const project = projectBySlug(f.slug);
            const Mock = MOCKS[f.slug];
            const view = VIEW_NAME[f.slug] ?? '';
            const note = MARGIN_NOTE[f.slug];
            return (
              <article
                key={f.slug}
                className="cv-slide"
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
              >
                <button
                  type="button"
                  className="cv-slide-frame"
                  aria-label={`Open ${project.title}, ${view}, full screen`}
                  onClick={(e) => setViewing({ frame: f, opener: e.currentTarget })}
                >
                  <FitFrame w={f.w} h={f.h}>
                    {Mock ? <Mock /> : null}
                  </FitFrame>
                </button>
                <div className="cv-slide-meta">
                  <h3 className="cv-slide-title">
                    {project.title} <span>/ {view}</span>
                  </h3>
                  <p className="cv-slide-caption">{captionFor(project)}</p>
                </div>
                {note ? (
                  <p className="cv-m-note">
                    <span className="cv-note-tag">{UI.noteTag}</span>
                    {note}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        <nav className="cv-dots" aria-label="Choose a project">
          {FRAMES.map((f, i) => (
            <button
              key={f.slug}
              type="button"
              aria-label={`Show ${projectBySlug(f.slug).title}`}
              aria-current={i === index ? 'true' : undefined}
              onClick={() => goTo(i)}
            >
              <span />
            </button>
          ))}
        </nav>
      </div>

      {viewing ? <Viewer frame={viewing.frame} opener={viewing.opener} onClose={() => setViewing(null)} /> : null}
    </div>
  );
}

interface ViewerProps {
  frame: FrameSpec;
  opener: HTMLElement | null;
  onClose: () => void;
}

/** A frame at its design size, full screen. Scrolls in both directions, starts centred. */
function Viewer({ frame, opener, onClose }: ViewerProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const project = projectBySlug(frame.slug);
  const view = VIEW_NAME[frame.slug] ?? '';
  const Mock = MOCKS[frame.slug];

  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollLeft = Math.max(0, (body.scrollWidth - body.clientWidth) / 2);
  }, []);

  // Closing the viewer returns focus to the frame that opened it.
  useEffect(() => {
    return () => {
      if (opener && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [opener]);

  return (
    <div className="cv-viewer" role="dialog" aria-modal="true" aria-label={`${project.title}, ${view}`}>
      <div className="cv-viewer-bar">
        <p className="cv-viewer-title">
          <strong>{project.title}</strong> / {view}
        </p>
        <CloseButton onClose={onClose} autoFocus />
      </div>
      <p className="cv-viewer-hint">{UI.viewerHint}</p>
      <div className="cv-viewer-body" ref={bodyRef}>
        <div className="cv-viewer-stage" style={{ width: frame.w, height: frame.h }}>
          {Mock ? <Mock /> : null}
        </div>
      </div>
    </div>
  );
}

