# Plan: v2 Monograph Minimal ("the index card")

Phone height budget: 4600 px (QA at 360 and 390). Target: about 4000 px so the budget has headroom.

## Sections (in order) and the content each uses

| # | Section | Content used (content-v2.json) | Notes |
| - | --- | --- | --- |
| 1 | Masthead | `person.monogram`, `person.name`; nav Work, Services, Contact; theme toggle | Desktop: one sticky row. Phone: non-sticky, name row plus a full-width nav row (no hamburger). |
| 2 | Hero | `headlines.plain` (highlight "web and mobile apps"), `bio.short`, `person.links.cv`, `person.location`, `person.timezone`, `person.availability` | Links: "Start a project" to #contact, "Download CV". One meta line. |
| 3 | Work index | `projects` for wholesale-os, medjot, paper-studio, fieldbook, dhi, net-watch: year, title, type, oneLiner, challenge, approach, outcome, client (anonymised only), stack | Native details/summary rows. Desktop hover shows a code-drawn mock from `visual` and `accent`. No mock on phones. |
| 4 | Services | `services` (title and line only; tags dropped) | 2x2 on tablet and up, one column on phones. |
| 5 | How I work | `principles` (three numbered lines) | |
| 6 | Contact | `headlines.studio` as heading, `person.email` (selectable, mailto) with Copy button, LinkedIn, GitHub, CV; `experience` (3 lines); `education` (1 line, mono) | Copy status text never claims a message was sent. |
| 7 | Footer | `footer` | One line, with a back-to-top link. |

Not used (per the concept): skills, studio offers, steps, FAQ, retainer, manifesto, medium bio, headlines promise and statement, remote, project links, the Footnote and Kiln UI projects, and the `status`, `needsConfirm` and `anonymized` flags (never shown as labels).

## Removed from v1

Workflow (agent workflow essay and figures), Pipeline, Skills, Experience timeline, the hamburger menu script, and the v1 content.json (replaced by the v2 copy).

## Design system (kept)

Archivo variable (wdth 62% for display), Source Serif 4 body, IBM Plex Mono labels, cool white and ink palette, ultramarine accent, yellow highlighter, light and dark theme toggle, relativize script.

## Mobile height estimate (360 and 390 px)

| Block | Estimate |
| --- | --- |
| Masthead (two rows) | ~110 |
| Hero | ~560 |
| Work (heading plus six collapsed rows of ~140 each) | ~1000 |
| Services (heading plus four items) | ~600 |
| How I work (heading plus three items) | ~620 |
| Contact (heading, email, links, experience, education) | ~800 |
| Footer | ~90 |
| Section padding (about 64 px top and bottom per section) | ~640 |
| Total | ~4400 estimated; measured 4412 at 360 and 4291 at 390 after tightening (budget 4600) |

## Engineering

Static single page, relative URLs, self-hosted fonts, no runtime network. One small script (theme, copy, work preview pointer tracking). Reduced motion is respected, and the only motion is a short opacity fade on the hero and hover states.
