// Motion layer: GSAP (ScrollTrigger, SplitText) and Lenis. It only enhances content that is already
// readable. Under prefers-reduced-motion nothing moves and every state is final. Lenis, the cursor
// ring and magnetic buttons need a fine pointer; Lenis also needs a desktop-width viewport.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 900px)');
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

/** Hairline under the masthead that shows how far through the page the reader is. */
function initProgress(): void {
  const bar = document.querySelector<HTMLElement>('[data-progress]');
  if (!bar) return;
  gsap.fromTo(
    bar,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: { trigger: document.documentElement, start: 'top top', end: 'bottom bottom', scrub: true },
    },
  );
}

/** Lenis smooth scroll: desktop with a fine pointer only. Phones keep native scrolling. */
function initSmoothScroll(): void {
  if (!desktop.matches || !fine.matches) return;
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/**
 * Hero statement: letters unfold from wdth 62 to 100 with a stagger that totals one second.
 * Each word is width-locked at its final size first, so the lines do not re-wrap mid-animation.
 * The h1 keeps its accessible name (SplitText sets aria-label and hides the pieces).
 */
function initHeroUnfold(): void {
  const h1 = document.querySelector<HTMLElement>('[data-hero-title]');
  if (!h1) return;

  document.fonts.ready.then(() => {
    const split = SplitText.create(h1, { type: 'words,chars', wordsClass: 'w', charsClass: 'c' });
    const words = split.words as HTMLElement[];
    const chars = split.chars as HTMLElement[];
    let settled = false;
    let frame = 0;

    const lock = (): void => {
      h1.style.setProperty('font-stretch', '100%');
      words.forEach((word) => {
        word.style.width = '';
      });
      words.forEach((word) => {
        word.style.width = `${word.getBoundingClientRect().width}px`;
      });
    };

    lock();
    gsap.set(chars, { fontStretch: '62%' });
    gsap.to(chars, {
      fontStretch: '100%',
      duration: 0.6,
      ease: 'power3.out',
      stagger: { each: 0.4 / Math.max(chars.length - 1, 1), from: 'start' },
      onComplete: () => {
        settled = true;
      },
    });

    window.addEventListener('resize', () => {
      if (!settled) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(lock);
    });
  });
}

/** Section titles (desktop): they stretch from condensed to wide as they cross the viewport. */
function initStretchTitles(): void {
  if (!desktop.matches) return;
  document.querySelectorAll<HTMLElement>('[data-stretch]').forEach((el) => {
    const axis = { w: 62 };
    const apply = (): void => {
      el.style.setProperty('font-stretch', `${axis.w}%`);
    };
    apply();
    gsap.to(axis, {
      w: 100,
      ease: 'none',
      onUpdate: apply,
      scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 45%', scrub: true },
    });
  });
}

/** Manifesto: each word lights up from dim to full as the section scrolls past. Not pinned. */
function initManifesto(): void {
  const root = document.querySelector<HTMLElement>('[data-manifesto]');
  if (!root) return;
  const words: HTMLElement[] = [];
  root.querySelectorAll<HTMLElement>('.manifesto-line').forEach((line) => {
    const split = SplitText.create(line, { type: 'words', wordsClass: 'mw' });
    words.push(...(split.words as HTMLElement[]));
  });
  if (!words.length) return;

  gsap
    .timeline({ scrollTrigger: { trigger: root, start: 'top 80%', end: 'bottom 55%', scrub: true } })
    .fromTo(
      words,
      { opacity: 0.6 },
      { opacity: 1, duration: 0.6, ease: 'none', stagger: { each: 0.4 / Math.max(words.length - 1, 1), from: 'start' } },
    );
}

/** Highlighter marks draw in once, when they reach the viewport. */
function initMarks(): void {
  document.querySelectorAll<HTMLElement>('mark.hl').forEach((mark) => {
    ScrollTrigger.create({
      trigger: mark,
      start: 'top 88%',
      once: true,
      onEnter: () => mark.classList.add('is-drawn'),
    });
  });
}

/** Fade-up reveals. Phones also reveal each stacked case study. Content is set visible if this never runs. */
function initReveals(): void {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (!desktop.matches) targets.push(...document.querySelectorAll<HTMLElement>('.case'));
  targets.forEach((el) => {
    gsap.fromTo(
      el,
      { autoAlpha: 0, y: 22 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        clearProps: 'transform',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      },
    );
  });
}

/** Magnetic primary buttons: they lean toward the pointer. Fine pointers only. */
function initMagnetic(): void {
  if (!fine.matches) return;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const toX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const toY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      toX((event.clientX - (rect.left + rect.width / 2)) * 0.22);
      toY((event.clientY - (rect.top + rect.height / 2)) * 0.32);
    });
    el.addEventListener('pointerleave', () => {
      toX(0);
      toY(0);
    });
  });
}

/** Cursor ring: fine pointers only. It grows over links and buttons. The native cursor is hidden only while it is active. */
function initCursor(): void {
  if (!fine.matches) return;

  const ring = document.createElement('div');
  ring.className = 'cursor';
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(ring);

  const toX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const toY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse') return;
    // The native cursor is hidden only once the ring is actually following the pointer.
    document.documentElement.classList.add('has-ring');
    ring.classList.add('is-on');
    toX(event.clientX);
    toY(event.clientY);
    const target = event.target instanceof Element ? event.target : null;
    ring.classList.toggle('is-hover', Boolean(target?.closest('a, button, [data-magnetic]')));
  });
  document.documentElement.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
}

initProgress();

if (!reduce.matches) {
  initSmoothScroll();
  initHeroUnfold();
  initStretchTitles();
  initManifesto();
  initMarks();
  initReveals();
  initMagnetic();
  initCursor();
}

document.fonts.ready.then(() => ScrollTrigger.refresh());
