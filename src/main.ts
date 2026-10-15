import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/hanken-grotesk/wght.css';
import '@fontsource/geist-mono/400.css';
import '@fontsource/geist-mono/500.css';

import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { el, prefersReducedMotion } from './lib/dom';
import { setLenis } from './lib/scroll';
import { bindAnchorLinks, renderHeader } from './sections/header';
import { renderHero } from './sections/hero';
import { renderChapters, initChapters } from './sections/chapters';
import { renderAlso } from './sections/also';
import { renderContact } from './sections/contact';
import { renderFooter } from './sections/footer';
import { SvgFallback } from './swarm/fallback';

gsap.registerPlugin(ScrollTrigger);

type SwarmHandle = {
  setState(state: number, instant?: boolean): void;
  setScroll(progress: number): void;
  setInView(visible: boolean): void;
  start(): void;
};

const reduced = prefersReducedMotion();

/**
 * Debug hook: #state-N (N = 0..4) renders morph target N with no drift and no animation.
 * Optional &count=N forces the particle count. Chapter scrolling cannot change the state.
 */
const debug = (() => {
  const m = /^#state-([0-4])(?:&count=(\d{3,6}))?$/.exec(window.location.hash);
  return m ? { state: Number(m[1]), count: m[2] ? Number(m[2]) : undefined } : null;
})();
const stageState = { state: debug?.state ?? 0, scroll: 0, inView: true };
let swarm: SwarmHandle | null = null;
let fallback: SvgFallback | null = null;

function supportsWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') ?? probe.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function setSwarmState(state: number): void {
  if (debug) return;
  stageState.state = state;
  if (swarm) swarm.setState(state);
  else fallback?.setState(state);
}

/** Loads three.js lazily so the page is interactive before the swarm renders. */
async function startSwarm(): Promise<void> {
  const canvas = document.getElementById('swarm');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const mobile = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency || 8;
  const count = mobile ? (cores <= 4 ? 3200 : 4500) : 12000;
  const minCount = mobile ? 2400 : 6000;
  const { Swarm } = await import('./swarm/renderer');
  const instance = new Swarm({
    canvas,
    count: debug?.count ?? count,
    minCount,
    reducedMotion: reduced,
    frozen: debug !== null,
  });
  instance.setState(stageState.state, true);
  instance.setScroll(stageState.scroll);
  instance.setInView(stageState.inView);
  swarm = instance;
  canvas.classList.add('is-ready');
  instance.start();
}

function setupMotion(main: HTMLElement): void {
  // Smooth scrolling (disabled under reduced motion).
  if (!reduced) {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 0.95 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  const story = document.getElementById('story');
  if (story instanceof HTMLElement) initChapters(story, setSwarmState);

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      stageState.scroll = self.progress;
      swarm?.setScroll(self.progress);
    },
  });

  // Dim the swarm once the contact form area takes over, so the copy reads cleanly.
  const canvas = document.getElementById('swarm');
  const fallbackHost = document.getElementById('swarm-fallback');
  const dim = (on: boolean) => {
    const target = [canvas, fallbackHost].filter((n): n is HTMLElement => n instanceof HTMLElement);
    gsap.to(target, { opacity: on ? 0.16 : 1, duration: reduced ? 0 : 1, ease: 'power1.out', overwrite: true });
  };
  const contact = document.getElementById('contact');
  if (contact) {
    ScrollTrigger.create({
      trigger: contact,
      start: 'top 70%',
      onEnter: () => dim(true),
      onLeaveBack: () => dim(false),
    });
  }

  // Swarm render throttling: full rate over the hero and the story, slow rate afterwards.
  const watched = [document.getElementById('top'), document.getElementById('story')].filter(
    (n): n is HTMLElement => n instanceof HTMLElement,
  );
  const visible = new Set<Element>();
  const viewObs = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visible.add(entry.target);
      else visible.delete(entry.target);
    }
    stageState.inView = visible.size > 0;
    swarm?.setInView(stageState.inView);
  });
  watched.forEach((n) => viewObs.observe(n));

  // Gentle reveals. Content starts partly visible, never hidden.
  if (!reduced) {
    main.querySelectorAll<HTMLElement>('.reveal').forEach((node) => {
      gsap.from(node, {
        y: 14,
        opacity: 0.55,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: node, start: 'top 92%', once: true },
      });
    });
  }

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

function bootstrap(): void {
  document.documentElement.classList.add('js');
  const app = document.getElementById('app');
  if (!app) return;
  if (debug) document.documentElement.classList.add('debug-state');

  const main = el('main', { id: 'main', tabindex: '-1' }, renderHero(), renderChapters(), renderAlso(), renderContact());
  app.append(renderHeader(), main, renderFooter());

  bindAnchorLinks();
  setupMotion(main);

  if (supportsWebGL()) {
    document.documentElement.classList.add('has-webgl');
    void startSwarm();
  } else {
    document.documentElement.classList.add('no-webgl');
    const host = document.getElementById('swarm-fallback');
    if (host) {
      fallback = new SvgFallback(host);
      fallback.setState(stageState.state);
    }
  }
}

bootstrap();
