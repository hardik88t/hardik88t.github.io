import { buildTargets } from './targets';

const NS = 'http://www.w3.org/2000/svg';

/**
 * Static fallback when WebGL is unavailable: the same shape targets drawn as SVG dots.
 * Chapter changes swap the dot positions with no animation.
 */
export class SvgFallback {
  private readonly circles: SVGCircleElement[] = [];
  private readonly shapes: Float32Array[];

  constructor(host: HTMLElement, count = 900) {
    const targets = buildTargets(count, 7);
    this.shapes = targets.shapes;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-1.5 -1.5 3 3');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.setAttribute('focusable', 'false');
    for (let i = 0; i < count; i++) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', targets.seeds[i * 4 + 3] > 0.5 ? '0.008' : '0.012');
      c.setAttribute('class', targets.seeds[i * 4 + 3] > 0.5 ? 'dot dot-faint' : 'dot');
      svg.appendChild(c);
      this.circles.push(c);
    }
    host.replaceChildren(svg);
    this.setState(0);
  }

  setState(state: number): void {
    const arr = this.shapes[Math.min(this.shapes.length - 1, Math.max(0, Math.round(state)))];
    this.circles.forEach((c, i) => {
      c.setAttribute('cx', arr[i * 3].toFixed(3));
      c.setAttribute('cy', (-arr[i * 3 + 1]).toFixed(3));
    });
  }
}
