import * as THREE from 'three';
import { createGeometry, createMaterial, createUniforms, type SwarmUniforms } from './particles';
import { SHAPE_COUNT } from './targets';

const FOV = 40;
const CAM_Z = 10;
const MORPH_SECONDS = 1.9;

export interface SwarmOptions {
  canvas: HTMLCanvasElement;
  count: number;
  minCount: number;
  reducedMotion: boolean;
  /** Debug: no drift, turn or probe; the morph state is set once and rendered still. */
  frozen?: boolean;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The particle swarm. States: 0 cloud (hero), 1 core, 2 agent clusters, 3 browser grid, 4 phone.
 * One Points draw call; morphing happens in the vertex shader via the uMorph uniform.
 */
export class Swarm {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene = new THREE.Scene();
  private readonly camera: THREE.PerspectiveCamera;
  private readonly uniforms: SwarmUniforms = createUniforms();
  private readonly material: THREE.ShaderMaterial;
  private readonly points: THREE.Points;
  private readonly minCount: number;
  private readonly reduced: boolean;
  private readonly frozen: boolean;
  private count: number;

  private raf = 0;
  private running = false;
  private lastNow = 0;
  private time = 0;
  private inView = true;
  private frameNo = 0;
  private scrollP = 0;
  private halfW = 1;
  private halfH = 1;
  private morph = { from: 0, to: 0, t0: 0, active: false };
  private pointer = { nx: 0, ny: 0, x: 0, y: 0, lastMove: -1e9, amt: 0 };
  private probe = { frames: 0, sum: 0, stages: 0 };
  private frameDt = 0.016;

  private readonly onVisibility = () => {
    if (document.hidden) this.stop();
    else this.start();
  };
  private resizeTimer = 0;
  private readonly onResize = () => {
    window.clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(() => this.resize(), 120);
  };
  private readonly onPointer = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    this.pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
    this.pointer.lastMove = performance.now();
  };
  private readonly onPointerOut = () => {
    this.pointer.lastMove = -1e9;
  };

  constructor(opts: SwarmOptions) {
    this.count = opts.count;
    this.minCount = opts.minCount;
    this.reduced = opts.reducedMotion;
    this.frozen = opts.frozen ?? false;

    this.renderer = new THREE.WebGLRenderer({
      canvas: opts.canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x000000, 0);
    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    this.camera.position.set(0, 0, CAM_Z);

    this.uniforms.uIdle.value = this.reduced || this.frozen ? 0 : 1;
    this.material = createMaterial(this.uniforms);
    this.points = new THREE.Points(createGeometry(this.count), this.material);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.resize();
    document.addEventListener('visibilitychange', this.onVisibility);
    window.addEventListener('resize', this.onResize);
    if (!this.reduced) {
      window.addEventListener('pointermove', this.onPointer, { passive: true });
      document.documentElement.addEventListener('mouseleave', this.onPointerOut);
    }
  }

  /** Starts the render loop (no-op for reduced motion, which renders on demand). */
  start(): void {
    if (this.reduced || this.frozen) {
      this.update();
      return;
    }
    if (this.running || document.hidden) return;
    this.running = true;
    this.lastNow = 0;
    this.raf = requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Morph to a state index (0..4). Animated unless instant or reduced motion. */
  setState(index: number, instant = false): void {
    const to = clamp(index, 0, SHAPE_COUNT - 1);
    if (this.reduced || instant) {
      this.morph.active = false;
      this.morph.to = to;
      this.uniforms.uMorph.value = to;
      this.uniforms.uFlow.value = 0;
      if (!this.running) this.update();
      return;
    }
    if (!this.morph.active && Math.abs(this.uniforms.uMorph.value - to) < 1e-4) return;
    this.morph = { from: this.uniforms.uMorph.value, to, t0: performance.now(), active: true };
    if (!this.running) this.update();
  }

  setScroll(progress: number): void {
    this.scrollP = clamp(progress, 0, 1);
  }

  setInView(visible: boolean): void {
    this.inView = visible;
  }

  dispose(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointer);
    document.documentElement.removeEventListener('mouseleave', this.onPointerOut);
    this.points.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.halfH = Math.tan((FOV * Math.PI) / 360) * CAM_Z;
    this.halfW = this.halfH * (w / h);
    this.uniforms.uPixelRatio.value = dpr * clamp(h / 900, 0.8, 1.12);

    if (w >= 900) {
      // Desktop: swarm sits on the right, leaving the left column for copy.
      this.uniforms.uScale.value = Math.min(this.halfH * 0.72, this.halfW * 0.42);
      this.uniforms.uOffset.value.set(this.halfW * 0.36, -this.halfH * 0.03);
    } else {
      // Mobile: swarm sits in the upper part of the screen, copy below.
      this.uniforms.uScale.value = Math.min(this.halfH * 0.42, this.halfW * 0.74);
      this.uniforms.uOffset.value.set(0, this.halfH * 0.6);
    }
    if (!this.running) this.update();
  }

  /** Replaces the geometry with a different particle count (used by the FPS probe). */
  private rebuild(count: number): void {
    this.count = count;
    this.points.geometry.dispose();
    this.points.geometry = createGeometry(count);
  }

  private readonly loop = (now: number): void => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = this.lastNow ? Math.min(0.05, (now - this.lastNow) / 1000) : 0.016;
    this.lastNow = now;
    if (!this.inView) {
      // Canvas is dimmed behind DOM sections: keep it alive at a low rate.
      this.frameNo++;
      if (this.frameNo % 6 !== 0) return;
    }
    this.frameDt = dt;
    this.probeStep(dt);
    this.time += dt;
    this.update();
  };

  /** Quick FPS probe: if the device struggles, step the particle count down (twice at most). */
  private probeStep(dt: number): void {
    if (this.reduced || this.frozen || this.probe.stages >= 2 || !this.inView) return;
    this.probe.frames++;
    if (this.probe.frames > 30) this.probe.sum += dt * 1000;
    if (this.probe.frames === 130) {
      const avg = this.probe.sum / 100;
      if (avg > 34 && this.count > this.minCount) {
        this.rebuild(Math.max(this.minCount, Math.round(this.count * 0.62)));
      }
      this.probe.stages++;
      this.probe.frames = 0;
      this.probe.sum = 0;
    }
  }

  private update(): void {
    const u = this.uniforms;
    if (this.morph.active) {
      const t = clamp((performance.now() - this.morph.t0) / (MORPH_SECONDS * 1000), 0, 1);
      u.uMorph.value = this.morph.from + (this.morph.to - this.morph.from) * easeInOutCubic(t);
      u.uFlow.value = Math.sin(Math.PI * t);
      if (t >= 1) {
        this.morph.active = false;
        u.uMorph.value = this.morph.to;
        u.uFlow.value = 0;
      }
    }

    const p = this.pointer;
    const still = this.reduced || this.frozen;
    const active = !still && performance.now() - p.lastMove < 1400 ? 1 : 0;
    const dt = this.frameDt;
    const k = 1 - Math.exp(-dt * 6);
    p.amt += (active - p.amt) * (1 - Math.exp(-dt * 3));
    p.x += (p.nx * this.halfW - p.x) * k;
    p.y += (p.ny * this.halfH - p.y) * k;
    u.uPointer.value.set(p.x, p.y);
    u.uPointerAmt.value = p.amt;

    u.uTime.value = this.time;
    u.uRotY.value = still ? 0 : 0.07 * Math.sin(this.time * 0.23) + (this.scrollP - 0.5) * 0.2;
    u.uRotX.value = still ? 0 : p.ny * 0.04;
    this.renderer.render(this.scene, this.camera);
  }
}
