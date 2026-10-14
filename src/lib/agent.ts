// Plain-text and Markdown versions of the site for AI assistants and crawlers: llms.txt (llmstxt.org format),
// llms-full.txt and index.md. Every fact comes from content-v2.json; every absolute URL from SITE_URL.
import { SITE_DESCRIPTION, absUrl } from './site';
import { AVAILABILITY_RULE, AVAILABILITY_SHORT, content, isConcept, projects, statusNote } from './content';
import type { Project } from './types';

const p = content.person;
const HOME = absUrl('/');
const SUMMARY = `${p.name} is a ${p.title.toLowerCase()} in ${p.location.split(',')[0]}. He designs and builds web and mobile apps, desktop tools and AI features, from first sketch to production release.`;

function projectLine(proj: Project): string {
  const note = isConcept(proj) ? ', concept, not shipped' : '';
  return `${proj.oneLiner} (${proj.type}, ${proj.year}${note})`;
}

export function llmsTxt(): string {
  const work = projects.map((proj) => `- [${proj.title}](${HOME}#projects): ${projectLine(proj)}`).join('\n');
  return `# ${p.name}

> ${SUMMARY}

Client names are kept private; the work is described instead.

## Work

${work}

## About

- [About and services](${HOME}#about): what I do, how I work, and the services offered (home page).

## Contact

- [Contact](${HOME}#contact): email ${p.email}, LinkedIn and GitHub. ${AVAILABILITY_SHORT}

## CV

- [CV (PDF)](${p.links.cv}): full-stack developer CV.

## GitHub

- [GitHub](${p.links.github}): public code, including the projects that have a public repository.

## Optional

- [Full text](${absUrl('/llms-full.txt')}): bio, services, all six projects, experience, education, skills, contact and availability in plain text.
- [Markdown page](${absUrl('/index.md')}): the portfolio page as Markdown.
`;
}

function projectFull(proj: Project): string {
  const lines = [
    `### ${proj.title}`,
    `${proj.type}, ${proj.year}. ${statusNote(proj)}.`,
    proj.anonymized && proj.client ? `Client: ${proj.client}` : '',
    '',
    `One line: ${proj.oneLiner}`,
    `Challenge: ${proj.challenge}`,
    `Approach: ${proj.approach}`,
    `Outcome: ${proj.outcome}`,
    `Stack: ${proj.stack.join(', ')}`,
    proj.sticky ? `Design decision: ${proj.sticky}` : '',
    proj.links?.github ? `Code: ${proj.links.github}` : '',
    proj.links?.live ? `Live demo: ${proj.links.live}` : '',
  ];
  return lines.filter((l) => l !== '').join('\n');
}

export function llmsFull(): string {
  const services = content.services.map((s) => `- ${s.title}: ${s.line} Tools: ${s.tags.join(', ')}.`).join('\n');
  const principles = content.principles.map((x) => `- ${x.title}: ${x.body}`).join('\n');
  const experience = content.experience.map((e) => `- ${e.role}, ${e.org} (${e.period})`).join('\n');
  const skills = Object.entries(content.skills).map(([k, v]) => `- ${k}: ${v.join(', ')}`).join('\n');
  return `# ${p.name}

> ${SUMMARY}

Location: ${p.location}. ${p.remote}. Timezone: ${p.timezone}. Title: ${p.titleLong}.
Home page: ${HOME}

## Bio

${content.bio.medium}

## Services

${services}

## How I work

${principles}

## Work

Six projects, in order. Client names are kept private where the content says so.

${projects.map(projectFull).join('\n\n')}

## Experience

${experience}

## Education

- ${content.education.degree}, ${content.education.org} (${content.education.year})

## Skills

${skills}

## Contact

- Email: ${p.email}
- GitHub: ${p.links.github}
- LinkedIn: ${p.links.linkedin}
- CV (PDF): ${p.links.cv}

## Availability

${AVAILABILITY_RULE}
`;
}

export function indexMd(): string {
  const h = content.headlines.hero;
  const headline = `${h.lines.join(' ')} ~~${h.struck}~~ *${h.correction}*.`;
  const services = content.services
    .map((s) => `### ${s.title}\n\n${s.line}\n\nTools: ${s.tags.join(', ')}.`)
    .join('\n\n');
  const work = projects
    .map((proj) => {
      const lines = [
        `### ${proj.title}`,
        '',
        `${proj.type} · ${proj.year}${proj.anonymized && proj.client ? ` · for ${proj.client.charAt(0).toLowerCase()}${proj.client.slice(1)}` : ''} · ${proj.stack.join(', ')}`,
        '',
        isConcept(proj) ? '*Concept: a design study, not a shipped product.*' : '',
        `- **Summary:** ${proj.oneLiner}`,
        `- **Challenge:** ${proj.challenge}`,
        `- **Approach:** ${proj.approach}`,
        `- **Outcome:** ${proj.outcome}`,
        proj.sticky ? `- **Design decision:** ${proj.sticky}` : '',
        proj.links?.github ? `- **Code:** ${proj.links.github}` : '',
        proj.links?.live ? `- **Live demo:** ${proj.links.live}` : '',
      ];
      return lines.filter((l, i, a) => !(l === '' && (i === 0 || a[i - 1] === ''))).join('\n');
    })
    .join('\n\n');
  const principles = content.principles.map((x) => `### ${x.title}\n\n${x.body}`).join('\n\n');
  const experience = content.experience.map((e) => `- ${e.role}, ${e.org} (${e.period})`).join('\n');
  return `# ${p.name}

> ${SITE_DESCRIPTION}

[Website](${HOME}) · [llms.txt](${absUrl('/llms.txt')}) · [Full text](${absUrl('/llms-full.txt')}) · [CV (PDF)](${p.links.cv}) · [GitHub](${p.links.github}) · [LinkedIn](${p.links.linkedin})

## Hero

${headline}

${content.bio.medium}

## Availability

${AVAILABILITY_RULE}

## Services

${services}

## Selected work

Client names are kept private. Open the website for the same six projects with their screens.

${work}

## How I work

${principles}

## Experience

${experience}

## Education

- ${content.education.degree}, ${content.education.org} (${content.education.year})

## Contact

- Email: ${p.email}
- Location: ${p.location}. ${p.remote}.
- GitHub: ${p.links.github} · LinkedIn: ${p.links.linkedin} · CV: ${p.links.cv}
`;
}
