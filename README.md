# v2-canvas

Portfolio prototype for Hardik Thanth, concept v2-E "Canvas": the site is a design file.
Desktop and tablet (900px and up) show a pannable, zoomable canvas of designed product mocks,
each with one sticky-note design decision. Phones get a short page with a swipe gallery.

## Concept

- Canvas: dot grid, one transformed world, Hello card centred, seven project frames and a Contact card.
- Chrome: name pill, frame switcher, Contact button, zoom bar and minimap, a one-time hint.
- Start view: Hello centred at a readable zoom (0.65 to 1.0, set per viewport so it clears the chrome and
  neighbours peek in). Fit (button or key 0) shows every frame. Arrow keys and the switcher animate from there.
- Phones (below 900px): header, Hello card, horizontal scroll-snap gallery, Contact card, footer.
  Tapping a frame opens it full screen at readable size, with pinch zoom disabled and inner scroll.
- Mocks are fixed design sizes built from HTML, CSS and SVG. They are static, with no live animation.

## Stack

React 19, Vite 6, TypeScript, plain CSS and CSS modules (no Tailwind, no UI kit), `motion` for
focus transitions. Fonts are self-hosted through fontsource: Instrument Sans for the chrome,
IBM Plex Sans and Nunito Sans for the mocks.

## Layout

- `src/content-v2.json`: copy of the shared content file, the only source of facts.
- `src/frames/layout.ts`: frame positions, world bounds and sticky lane.
- `src/frames/copy.ts`: frame labels, sticky notes (20 words or fewer) and UI strings.
- `src/canvas/`: pan, zoom and focus controller (refs and rAF, no re-render per pointer move) and desktop chrome.
- `src/mobile/`: phone layout and full-screen viewer.
- `src/mocks/`: one component and CSS module per project mock, plus the phone shell.

## Build

```sh
pnpm install
pnpm build        # type-check, then dist/ with relative asset URLs
```

The static build in `dist/` works from any sub-path. Serve it with any static server.

## QA

```sh
node /home/user/protos/_tools/qa.mjs dist v2-canvas 5000
```

Checks 360, 390, 820, 1440 for broken requests, console errors and horizontal overflow, and
enforces the 5000px phone page budget. Interaction checks (drag, wheel zoom, double-click focus,
keys, minimap, copy, viewer) are scripted separately with Playwright.

## Known gaps

- Fieldbook, Footnote and Kiln UI are `status: concept` in the content file. Build or replace them before launch.
- Fit-all can go below the 0.25 zoom floor on short viewports (about 0.18 at 1280x720), so every frame stays visible.
- Net Watch is not in the concept's frame list and is left out.
