# v2-canvas: build plan

Concept: "my design canvas". Desktop/tablet (>= 900px) is a pannable, zoomable canvas of
designed product mocks. Phones (< 900px) get a short page with a swipe gallery.

## Desktop canvas (>= 900px)

World layout, 3 columns x 3 rows, centred on the Hello card (world px, 1 unit = 1 css px at zoom 1):

| Row | Col A | Col B | Col C |
|---|---|---|---|
| 1 | Wholesale OS (1280x800) | Fieldbook (1280x880, 3 phones) | MedJot (1280x880, 2 phones) |
| 2 | Paper Studio (1280x800) | **Hello** (520 card, centred) | Footnote (1280x800) |
| 3 | Kiln UI (1280x800) | Dhi (1280x800) | Contact (520 card) |

Each project frame has a label above (name / view), a caption (type, year, stack) and one
yellow sticky note (<= 20 words) to its right. Initial view is fit-all.

Controls: drag to pan, wheel to zoom at cursor (0.25 to 2), pinch on touch, double-click a
frame to focus it (motion animation), arrow keys to move between frames, 0 for fit, +/- to zoom.
Top bar: name pill, frame switcher (scrolls horizontally), Contact button. Bottom right: zoom
bar and minimap (click to jump). One-time hint fades after first interaction.

## Phones (< 900px)

Compact header, Hello card (headline, bio, four services, contact buttons), a horizontal
scroll-snap gallery of the seven project frames (each frame scaled to fit a fixed box, then
title, caption and sticky note, with a dot indicator), Contact card, footer.
Tapping a frame opens a full-screen viewer at readable size (pinch disabled, inner scroll).

Height estimate at 360 and 390px wide: header 64, Hello about 720, gallery about 560,
Contact about 440, footer 64 and gaps about 120. Total about 2,000px, budget 5,000px.

## Content use

| Section | Content used |
|---|---|
| Hello | person.name, title, headlines.plain, bio.short, services (title + line), contact links |
| Frames | projects (title, type, year, client for anonymized, stack, accent, oneLiner-based note) |
| Contact | person.email (selectable + copy), links.linkedin, links.github, links.cv, availability, location, timezone |
| Footer | footer |

Not used (outside the concept): principles, studio offers, FAQ, steps, experience, skills,
education, manifesto, statement, promise, studio headline, Net Watch, status/needsConfirm labels.

## Mocks (fixed design size, real-looking data, no live animation)

- Wholesale OS: sidebar, KPI row, stock bars, orders table with status pills, invoice drawer. IBM Plex Sans.
- Fieldbook: three phones (route, catalogue grid, cart with Place order). Nunito Sans.
- MedJot: two phones (visit form with symptom chips, medicine autocomplete, receipt sheet). Nunito Sans.
- Paper Studio: question list plus typeset A4 preview, AI draft button. IBM Plex Sans.
- Footnote: chat answer with citation chips, sources, highlighted passage panel. IBM Plex Sans.
- Kiln UI: token sheet (colour, type scale, spacing) and component states. Nunito Sans.
- Dhi: desktop window with editor, backlinks and a node-link graph with coloured clusters. Nunito Sans.

## Decisions to review

- Net Watch is left out because the concept lists seven project frames and no Net Watch.
- Fit-all can go below 0.25 on small viewports so every frame stays visible. Wheel, keys and buttons stay within 0.25 to 2.
- Fieldbook, Footnote and Kiln UI have `status: concept` in content. They are rendered without labels, per the brief, and must be built or replaced before launch.
