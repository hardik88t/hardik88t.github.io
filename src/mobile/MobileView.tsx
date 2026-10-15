import { useCallback, useEffect, useRef, useState } from 'react';
import { ContactCard, HelloCard } from '../frames/cards';
import { FRAME_VIEW, STICKY, UI } from '../frames/copy';
import { FRAMES, type FrameSpec } from '../frames/layout';
import { captionFor, footer, person, projectBySlug } from '../content';
import { MOCKS } from '../mocks';
import { FitFrame } from '../shared/FitFrame';
import { Viewer } from './Viewer';
import './mobile.css';

const PROJECTS = FRAMES.filter((f) => f.kind === 'project');

export function MobileView() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [viewing, setViewing] = useState<FrameSpec | null>(null);
  const frameRef = useRef<number | null>(null);

  const slideOffsets = useCallback(() => {
    const gallery = galleryRef.current;
    if (!gallery) return [];
    const base = gallery.getBoundingClientRect().left - gallery.scrollLeft;
    return Array.from(gallery.querySelectorAll<HTMLElement>('[data-slide]')).map(
      (el) => el.getBoundingClientRect().left - base,
    );
  }, []);

  const onScroll = () => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      const gallery = galleryRef.current;
      if (!gallery) return;
      const offs = slideOffsets();
      if (offs.length < 2) return;
      const step = offs[1] - offs[0];
      const i = Math.min(PROJECTS.length - 1, Math.max(0, Math.round(gallery.scrollLeft / step)));
      setIndex((prev) => (prev === i ? prev : i));
    });
  };

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  const goTo = (i: number) => {
    const gallery = galleryRef.current;
    if (!gallery) return;
    const offs = slideOffsets();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    gallery.scrollTo({ left: offs[i] - offs[0], behavior: reduce ? 'auto' : 'smooth' });
    setIndex(i);
  };

  const onViewerClose = useCallback(() => setViewing(null), []);

  return (
    <div className="m-app">
      <header className="m-top">
        <a className="m-brand" href="#top">
          <span className="monogram monogram--sm" aria-hidden="true">
            {person.monogram}
          </span>
          <span>{person.name}</span>
        </a>
        <a className="btn btn--primary m-cta" href="#contact">
          {UI.contactButton}
        </a>
      </header>

      <main id="top" className="m-main">
        <section className="m-hello" aria-label="Introduction">
          <HelloCard variant="mobile" />
        </section>

        <section className="m-work" aria-labelledby="m-work-title">
          <div className="m-work-head">
            <h2 id="m-work-title">{UI.selectedWork}</h2>
            <p>{UI.swipeHint}</p>
          </div>

          <div className="m-gallery" ref={galleryRef} onScroll={onScroll} role="region" aria-label="Projects" tabIndex={0}>
            {PROJECTS.map((f) => {
              const project = projectBySlug(f.id);
              const { name, view } = FRAME_VIEW[f.id];
              const Mock = MOCKS[f.id];
              return (
                <article key={f.id} className="slide" data-slide>
                  <button
                    type="button"
                    className="slide-frame"
                    aria-label={`Open ${name}, ${view}, full screen`}
                    onClick={() => setViewing(f)}
                  >
                    <FitFrame w={f.w} h={f.h} className="slide-fit">
                      {Mock ? <Mock /> : null}
                    </FitFrame>
                  </button>
                  <div className="slide-meta">
                    <h3>
                      {name} <span>/ {view}</span>
                    </h3>
                    <p className="slide-caption">{captionFor(project)}</p>
                  </div>
                  {STICKY[f.id] ? <p className="m-sticky">{STICKY[f.id]}</p> : null}
                </article>
              );
            })}
          </div>

          <nav className="m-dots" aria-label="Choose a project">
            {PROJECTS.map((f, i) => (
              <button
                key={f.id}
                type="button"
                aria-label={`Show ${FRAME_VIEW[f.id].name}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => goTo(i)}
              >
                <span />
              </button>
            ))}
          </nav>
        </section>

        <section id="contact" className="m-contact" aria-label="Contact">
          <ContactCard variant="mobile" />
        </section>
      </main>

      <footer className="m-foot">
        <p>{footer}</p>
      </footer>

      {viewing ? <Viewer frame={viewing} onClose={onViewerClose} /> : null}
    </div>
  );
}
