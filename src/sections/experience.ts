import { content } from '../content';
import { chips, el } from '../lib/dom';

export function renderExperience(): HTMLElement {
  const p = content.profile;
  return el(
    'section',
    { id: 'experience', class: 'section experience', 'aria-labelledby': 'experience-title' },
    el(
      'div',
      { class: 'wrap experience-grid' },
      el(
        'div',
        { class: 'experience-about' },
        el('p', { class: 'eyebrow' }, 'Experience'),
        el('h2', { id: 'experience-title', class: 'section-title' }, 'About and career'),
        p.about.map((para) => el('p', { class: 'about-para' }, para)),
      ),
      el(
        'div',
        { class: 'experience-main' },
        el(
          'ol',
          { class: 'timeline' },
          p.experience.map((job) =>
            el(
              'li',
              { class: 'job' },
              el('p', { class: 'job-when' }, `${job.from} – ${job.to}`, el('span', { class: 'job-where' }, job.location)),
              el(
                'div',
                { class: 'job-body' },
                el('h3', { class: 'job-role' }, job.role),
                el('p', { class: 'job-company' }, job.company),
                el('ul', { class: 'job-highlights' }, job.highlights.map((h) => el('li', null, h))),
                chips(job.stack, 'chip chip-mono'),
              ),
            ),
          ),
        ),
        el(
          'div',
          { class: 'education' },
          el('h3', { class: 'block-title' }, 'Education'),
          p.education.map((ed) =>
            el(
              'div',
              { class: 'edu' },
              el('p', { class: 'edu-degree' }, ed.degree),
              el('p', { class: 'edu-school' }, `${ed.institution}  ·  ${ed.from} – ${ed.to}`),
            ),
          ),
        ),
      ),
    ),
  );
}
