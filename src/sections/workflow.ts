import { content } from '../content';
import { chips, el, prefersReducedMotion } from '../lib/dom';

/** Agent workflow showcase: pipeline, metrics, guardrails, tooling and a task ticker. */
export function renderWorkflow(): HTMLElement {
  const a = content.agentic;
  const tasks = a.sampleTasks;
  return el(
    'section',
    { id: 'workflow', class: 'section workflow', 'aria-labelledby': 'workflow-title' },
    el(
      'div',
      { class: 'wrap' },
      el(
        'header',
        { class: 'section-head' },
        el('p', { class: 'eyebrow' }, 'The agent workflow'),
        el('h2', { id: 'workflow-title', class: 'section-title' }, a.title),
        el('p', { class: 'section-lede' }, a.summary),
        el('p', { class: 'section-meta' }, `Scope: ${a.scope}`),
      ),
      el(
        'ol',
        { class: 'pipeline', 'aria-label': 'Delivery pipeline, eight steps' },
        a.pipeline.map((step, i) =>
          el(
            'li',
            { class: 'pipeline-step', 'data-step': String(i) },
            el('p', { class: 'step-top' }, el('span', { class: 'step-no' }, String(i + 1).padStart(2, '0'))),
            el('h3', { class: 'step-title' }, step.title),
            el('p', { class: 'step-label' }, step.label),
            el('p', { class: 'step-detail' }, step.detail),
            chips(step.artifacts, 'chip chip-mono'),
          ),
        ),
      ),
      el(
        'ul',
        { class: 'metrics', 'aria-label': 'Numbers from the monorepo' },
        a.metrics.map((m) =>
          el(
            'li',
            { class: 'metric' },
            el(
              'p',
              { class: 'metric-value' },
              el('span', { class: 'metric-num' }, String(m.value)),
              m.unit ? el('span', { class: 'metric-unit' }, m.unit) : null,
            ),
            el('p', { class: 'metric-label' }, m.label),
            el('p', { class: 'metric-ctx' }, m.context),
          ),
        ),
      ),
      el(
        'div',
        { class: 'workflow-split' },
        el(
          'div',
          { class: 'guardrails' },
          el('h3', { class: 'block-title' }, 'Guardrails'),
          el(
            'ol',
            null,
            a.guardrails.map((g, i) => el('li', null, el('span', { class: 'gr-no', 'aria-hidden': 'true' }, `G${i + 1}`), el('span', null, g))),
          ),
        ),
        el(
          'div',
          { class: 'tooling' },
          el('h3', { class: 'block-title' }, 'Tools I built'),
          el(
            'ul',
            { class: 'tool-list' },
            a.tooling.map((t) => el('li', { class: 'tool' }, el('h4', { class: 'tool-name' }, t.name), el('p', { class: 'tool-detail' }, t.detail))),
          ),
        ),
      ),
    ),
    el(
      'div',
      { class: 'ticker', 'aria-label': 'Sample tasks' },
      el(
        'p',
        { class: 'ticker-caption' },
        'Sample tasks in the same pipeline',
      ),
      el(
        'div',
        { class: 'ticker-viewport' },
        el(
          'ul',
          { class: 'ticker-track' },
          tasks.map((t) => el('li', { class: 'ticker-item' }, t)),
          tasks.map((t) => el('li', { class: 'ticker-item', 'aria-hidden': 'true' }, t)),
        ),
      ),
    ),
  );
}

/** Pipeline highlight, metric rules and ticker pausing. Numbers always show their true value. */
export function initWorkflow(root: HTMLElement): void {
  const reduced = prefersReducedMotion();

  const metrics = Array.from(root.querySelectorAll<HTMLElement>('.metric'));
  if (reduced) {
    metrics.forEach((m) => m.classList.add('is-in'));
  } else {
    const metricObs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          metricObs.unobserve(entry.target);
        }
      },
      { threshold: 0.4 },
    );
    metrics.forEach((m) => metricObs.observe(m));
  }

  const steps = Array.from(root.querySelectorAll<HTMLElement>('.pipeline-step'));
  const stepObs = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-lit');
          stepObs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.5 },
  );
  steps.forEach((s) => stepObs.observe(s));

  const ticker = root.querySelector<HTMLElement>('.ticker');
  if (ticker) {
    const tickerObs = new IntersectionObserver((entries) => {
      for (const entry of entries) ticker.classList.toggle('is-paused', !entry.isIntersecting);
    });
    tickerObs.observe(ticker);
  }
}
