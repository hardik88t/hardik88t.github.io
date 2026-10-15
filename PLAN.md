# v2 Swarm: build plan

Concept: "four shapes, four things I do" (`_shared/v2/concepts/swarm.md`). Phone height budget 6500px.

## Sections (in order)

| # | Section | Content used (content-v2.json) | Why it helps a client |
|---|---------|--------------------------------|------------------------|
| - | Header (fixed) | person.name, monogram; one "Contact" button | Always one way to reach him |
| 1 | Hero (cloud state 0) | person.location, person.availability, person.name, person.title, headlines.plain; CTAs | Who, what, where, and the next step in one screen |
| 2 | 01 One developer, fully accountable (state 1) | bio.short | Ownership of the result |
| 3 | 02 With a team of AI agents (state 2) | principles[0].title, principles[0].body | Small-team speed, one point of contact (the one AI idea) |
| 4 | 03 Web apps (state 3) | services[web].title, services[web].line; proofs wholesale-os, paper-studio | Proof for web clients |
| 5 | 04 Mobile and desktop apps (state 4) | services[mobile].title, services[mobile].line; proofs fieldbook, net-watch, dhi | Proof for mobile and desktop clients |
| - | Proof sheet (dialog) | challenge, approach, outcome, stack, type, oneLiner; client for anonymised; GitHub link when present | Depth on tap, nothing on the page |
| 6 | Also band | services[ai].title, services[design].title | Two extra services, one line each |
| 7 | Contact | person.email (selectable + copy), availability, remote, links (LinkedIn, GitHub, CV) | Clear next step |
| - | Footer | footer (one line) | Sign-off |

Removed: header nav and mobile menu, pipeline, metrics, guardrails, tools, sample-task ticker,
stack and skills grid, experience timeline, education, about, 11-project grid, long project
dialog, services list, copyright and nav links in the footer.

Not shown on purpose: medjot, footnote, kiln-ui (not in the concept's proof list).

## Mobile height estimate (390 x 844)

| Block | Estimate |
|-------|----------|
| Hero (min 100svh, copy starts at 50svh) | 900 |
| 4 chapter blocks (min 70svh, chapter 4 with three proof rows is taller) | 2,700 to 2,900 |
| Also band | 190 |
| Contact | 720 |
| Footer | 110 |
| **Total** | **about 4,600** (budget 6,500) |

## Build notes

- Swarm engine (`src/swarm/`), shapes, palette, fonts, fallbacks and debug hashes kept as in v1.
- Chapters: desktop pins a 400vh stage with sequential text. Phone stacks blocks over the fixed
  swarm; the active chapter is the one whose copy sits nearest the middle of the screen.
- Project mockups are code-drawn SVG with UI labels, built from each project's `visual` text.
- Proof rows become grid cards from 1200px up.
