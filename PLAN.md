# Plan: v3 Monograph + Canvas (hybrid)

Concept: `/home/user/protos/_shared/v3/hybrid.md`. Phone height budget: 4900 px at 360 and 390.

## Page (Monograph Minimal, unchanged except where the concept asks)

| # | Section | Content (content.json) | Notes |
| - | --- | --- | --- |
| 1 | Masthead | `person.monogram`, `person.name`; Work (#projects), Services, Contact, Canvas (opens #work); theme toggle | Phones: four links spread across one row. |
| 2 | Hero | `headlines.plain`, `bio.short`, CV link, location, timezone, availability | Unchanged. |
| 3 | Projects | `workProjects` (eight, in the order of `workOrder`): year, type, title, oneLiner; expanded: client (anonymised only), challenge, approach, outcome, stack, "View screens" | Hover preview on desktop: the canvas mock at 360 px. One line below: "Explore all work on the canvas" (phones: "Browse all screens"). |
| 4 | Services | `services` (title and line) | Unchanged. |
| 5 | How I work | `principles` | Unchanged. |
| 6 | Contact | `headlines.studio`, email with copy, links, `experience`, `education` | Unchanged. |
| 7 | Footer | `footer` | Unchanged. |

## Overlay (lazy)

| Mode | Content | Notes |
| --- | --- | --- |
| Desktop, 900 px and up | Eight frames in a 4 x 2 grid, labels above, captions below, margin notes (highlighter) at the right | Start view: target frame and note, neighbours peeking. Switcher, minimap, zoom, hint in Monograph chrome. |
| Phones and tablets, below 900 px | Swipe gallery of the same eight frames; full-screen viewer | Starts at the target project. Dots in ink-2 and accent. |

Mock screens: the v2 mocks, unchanged, plus Net Watch (new, Android-style).

## Measured

| Viewport | Page height |
| --- | --- |
| 360 | 4835 px |
| 390 | 4692 px |
| 820 | 4554 px |
| 1440 | 5328 px |

## Engineering

Static single page, relative URLs, self-hosted fonts, no runtime network. Overlay code loads on first
open; the mock previews are static HTML. Reduced motion jumps instantly.
