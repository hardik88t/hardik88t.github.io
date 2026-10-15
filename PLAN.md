# v2-studio plan

Concept: "hire me, here's exactly how". A conversion-focused offer page. Clear, calm, confident.
Phone height budget: 7000px at 360 and 390 (FAQ collapsed by default).

## Sections (in order) and content used

| # | Section | Content (content-v2.json) | Why it helps a client decide |
|---|---------|---------------------------|------------------------------|
| 1 | Header | `person.name`, `person.monogram`, nav, "Book a call" | Identity and a way to reach him at all times |
| 2 | Hero | `headlines.studio` (h1), `headlines.promise`, `person.title`, "Book a free call", "See offers", picker with 4 needs | States the problem and routes to the right offer in one tap |
| 3 | Offers | `studio.offers` x4 (name, for, what, timeline, includes, example), `studio.retainer` | What can be bought, how long, what is included |
| 4 | How I work | `principles` x3 | Why trust him: one owner, design plus code, easy to change |
| 5 | Process | `studio.steps` x4 | Shows the sequence from call to handover (numbers used only here) |
| 6 | Questions | `studio.faq` x6, one open at a time | Removes the usual objections (price, AI, time zone, ownership) |
| 7 | Book a free call | email + copy, LinkedIn, GitHub, `person.availability`, short form (opens mailto draft) | The conversion point |
| 8 | Footer | `person.name`, `person.location`, `person.timezone` | Location and time zone for the client |

## Mobile height estimate (360 and 390 px)

- Header 60
- Hero (eyebrow, h1, promise, CTAs, picker stacked) ~ 820
- Offers (heading, carousel of 4 snap tickets at ~580 each, dots, retainer row) ~ 1,000
- How I work (3 stacked principles) ~ 420
- Process (4 numbered steps stacked) ~ 560
- Questions (6 collapsed rows) ~ 420
- Book a free call (intro, form, email + copy, links, availability) ~ 1,050
- Footer ~ 150

Measured after build: 5706 px at 360 and 5511 px at 390 (budget 7000 px). The section estimates above were the first pass.

## Removed on purpose

- Services grid, projects grid, experience, skills, education, CV link: portfolio content, not the offer.
- `headlines.plain`, `headlines.statement`, `bio`, `manifesto`, `footer` string: not in the concept.
- Commit, PR and test counts, pipeline or agent tooling: internal process, never shown.
- Project status, `anonymized` and `needsConfirm` flags: never rendered. Anonymized examples show the generic client name and no link.

## Design rules

- Tokens on `:root`: white, ink `#11131A`, secondary `#5B6170`, hairline `#E6E8EE`, cobalt `#2B4BFF`, tint `#EEF1FF`.
- Schibsted Grotesk 700 for display, tight tracking. DM Mono for small labels only. Both self-hosted via fontsource.
- Step numbers appear only in the 4-step process.
- Tickets: perforated edge (dashed line with notches) between offer body and example stub.
- Example visuals are code-drawn mini mockups (HTML and CSS), `aria-hidden`.
- Motion: one-shot section fades (only with JS and no reduced motion), accordion, picker transitions. No loaders, no scroll-jacking, no live simulations.
- Dark theme: not built (optional in the concept). `color-scheme: light` is set.
