# v3 "Perfect Imperfect": plan

Portfolio of Hardik Thanth plus a design-system page (`#system`), one static Astro 5 page.
Stack: Astro 5 (static, zero client JS for imperfections), TypeScript, hand-written CSS, one small
bundled script (theme, copy email, dialogs, view switch), two fontsource variable families.

## Rules every imperfection must keep

- Deterministic: values come from `seed(slug | index)` at build time (`src/lib/seed.ts`), never runtime random.
- Free: CSS transforms, paint, or absolutely positioned inline SVG only. No change to width, height or
  margins after load, so CLS stays 0. No blur filters, no JS, no text rotated bigger than a caption.
- Contrast: pink and gold are never text colours (pink on paper 2.8:1, gold on paper 2.2:1, so both are
  decoration only). Text on pink or yellow uses the on-highlight token: ink on pink 5.7:1, ink on yellow 14.2:1
  (light), and dark text on the same tokens in dark mode. The system page prints every ratio, computed at build time (`src/lib/contrast.ts`).
- Accessibility is never imperfect: focus rings, buttons, dialogs, email, nav, numbers and dates are
  straight, solid and high contrast. Decorative SVG is `aria-hidden`. Struck-through words are
  `aria-hidden` and the replacement is what is read.
- Calm: at most about three noticeable imperfections per viewport. Reduced motion turns off all motion.

## Imperfections

| # | Flavour | Where it appears | How it stays free |
|---|---|---|---|
| 1 | Human: visible edit (struck word + pink correction) | Hero h1 ("feel ~~perfect~~ human"); system "Components: Edit" | Strike is an absolutely positioned SVG overlay. Correction sits in an absolutely positioned span. Pink is a paint-only plate under ink text, rotated in `::before` so the text stays straight. Struck text is `aria-hidden`. |
| 2 | Hand-made: hand-drawn marks (underline, circle, arrow, bracket, strike), 3 seeded variants each | Hero "See the work" underline; margin-note arrows; system components | Inline SVG `<use>` of symbols. `currentColor`, `vector-effect: non-scaling-stroke`, `preserveAspectRatio="none"`, `aria-hidden`. |
| 3 | Asymmetry: uneven 12-column spans, offsets, one print breaking the column by about 12px | Work section (desktop collage) | Static CSS grid placement; the art box uses `aspect-ratio`, so space is reserved before the SVG paints. |
| 4 | Asymmetry on phones: prints alternate left and right at about 86% width | Work section (phone) | Static widths and alignment. |
| 5 | Seeded tilt (`--tilt-xs` / `--tilt-sm`, sign from seed) | Each print's sheet, index cards, letter plate | Rotation sits on decorative wrappers and `::before` plates, never on the focusable button or on text. |
| 6 | Risograph print: halftone dots (SVG `<pattern>`), two inks (ink + project accent), overprint (multiply / screen), misregistration (`--misreg` offset on the accent layer) | The six project prints | Inline SVG, no filters, no blur. Pattern IDs are unique per print. Text inside the art is aria-hidden. |
| 7 | Digital: ink bleed (`--ink-bleed`) on accent shapes | The six project prints | Same-colour `stroke` on accent shapes. No SVG filter. |
| 8 | Digital: pixel corner (stepped top-right corner) | Print sheets | `clip-path` polygon, paint only. |
| 9 | Risograph misregistration on very large display type | Hero h1; system h1 and wordmark | Hard `text-shadow` offset of `--misreg` in pink. No blur. Ink text is unchanged, so contrast is unchanged. |
| 10 | Typographic: seeded Fraunces WONK / SOFT per heading | All h2 and h3 headings | `font-variation-settings` on the same font file. No swap, so no shift. |
| 11 | Typographic: kerning gap in the wordmark ("im perfect" reads "i'm perfect") | System wordmark | Letter-spacing on one glyph. Plain text, and the gap is explained on the page. |
| 12 | Digital: hairline that stops 1px short of its neighbour | Work heading (desktop); section rules | Pseudo-element with `height: calc(100% - 1px)`. |
| 13 | Asymmetry: hanging heading into the left margin | "What I do" heading (desktop only, at 900px and up) | Negative margin on desktop only, so it never causes horizontal scroll on phones. |
| 14 | Typographic: ragged-right text | All body copy | Left aligned, `text-wrap: pretty`. |
| 15 | Digital: nudged grid item (`--nudge-sm`) | "How I work" card 2 | Transform only. |
| 16 | Human: index cards stacked slightly off | "How I work" cards | Paper plates rotated in `::before`; text is not rotated. Phone: small offsets. |
| 17 | Human: kintsugi gold hairline repair | "How I work" card 3; system "Components: Kintsugi" | Inline SVG overlay, decorative, not text. Gold is never used as text. |
| 18 | Human: margin notes with a hand-drawn arrow (max two) | "What I do" (desktop: absolute in the right margin; phone: inline) | Absolute only at 1000px and up, so no overflow. Recursive CASL 1, slnt -8, ink-2 colour (AA). |
| 19 | Typographic: hand-numbered list (Recursive casual numerals) | "What I do" numerals | Font axes only. |
| 20 | Human: handwritten signature "Hardik" | Contact letter | Inline SVG, fixed size, `role="img"` with a label. |
| 21 | Human: honest aside | Work intro (one caption line) | Plain text. |
| 22 | Riso yellow highlight behind a phrase | Hero bio ("from the first sketch to a production release") | Paint-only plate in `::before`, text in the on-highlight token (14.2:1 light, dark text in dark mode). |
| 23 | Paper grain (`--grain`) | Whole page, behind content | `body::before`, fixed, `z-index: -1`, `pointer-events: none`. Behind text, so no contrast loss, and no layout effect. |
| 24 | Motion: one settle for prints (≤ 400ms, transform only) and hover nudges | Prints | Transform only. Turned off under `prefers-reduced-motion`. |

Always perfect: the primary button "Start a project" (solid ink, 48px, 2px radius), every focus ring
(3px blue, 3px offset), the email address and its copy button, nav and footer links, the dialogs and
their close buttons, numbers and dates, body text.

## Palette and type

- Light: paper `#F6F6F3`, ink `#18181C`, ink-2 `#55565E`, rule `#D9D9D2`, riso blue `#0070B5` (text
  links), pink `#FF48B0` (decoration and display only), yellow `#FFE800` (highlight, ink text),
  gold `#C9A227` (hairlines only).
- Dark ("night print"): paper `#141519`, ink `#EDEDE6`, ink-2 `#A6A7AE`, rule `#2C2D33`, blue `#5DB8F2`,
  pink `#FF6FC2`, yellow `#FFE800` (dark text), gold `#D8B44A`.
- Tokens on `:root`. Dark mode: `prefers-color-scheme` guarded by `:root:not([data-theme="light"])`,
  plus `:root[data-theme="dark"]`. The toggle sets `data-theme` and stores it in try/catch localStorage.
- Fonts (self-hosted from fontsource sources, instanced and subset by `scripts/subset-fonts.py`, 154KB total, `font-display: optional`, woff2 preloaded):
  Fraunces (opsz, wght, SOFT, WONK) for display; Recursive (CASL, MONO, slnt) for body (CASL 0),
  UI and mono labels (MONO 1), margin notes and numerals (CASL 1, slnt -6 to -8).
  `optional` means no late swap, so no shift.

## Content (from `_shared/v2/content-v2.json`, copied to `src/data/`)

- Used: person (name, titleLong, location, availability, email, links), headlines.plain, bio.short,
  projects (six: wholesale-os, medjot, paper-studio, fieldbook, dhi, net-watch), services (4),
  principles (3), footer.
- Not used: footnote and kiln-ui (concept placeholders outside the six), experience, education,
  skills, studio, manifesto. The `_meta`, `status`, `needsConfirm`, `anonymized` fields are never shown.
  Anonymized projects show `client` and no link.
- Copy I write (UI only, no new facts): hero edit line, section intros, the letter, the system page.
  The letter's claims come from the content file (intro call of 30 minutes; written plan in two working
  days).

## Structure

Portfolio view (default), in order:
1. Header: name (Fraunces), nav Work / About / Contact, "The system" text link, theme toggle.
2. Hero: mono line (location, availability), h1 with the edit, bio.short, "Start a project" (perfect
   primary) and "See the work" (hand underline).
3. Work: intro with the honest aside; six prints as dialog buttons with caption (title, type, one-liner).
   Desktop collage. Phone single column.
4. About (what I do): four services as a hand-numbered list, two margin notes.
5. How I work: three index cards (principles). The third has the kintsugi repair.
6. Contact: letter ("Dear future client", 2 to 3 sentences), signature, email with copy button,
   GitHub / LinkedIn / CV links.
7. Footer: "Built with Perfect Imperfect →" (opens the system view) and the credit line.

System view (`#system`, hides the portfolio, with "← Back to portfolio"):
1. Wordmark "imperfect" (kern gap reads "i'm perfect") and the subtitle "Perfect Imperfect".
2. The one rule, big: "If an imperfection causes a problem, it isn't the imperfection."
3. Principles: Deliberate, Free, Budgeted, Accessibility is never imperfect, Perfection is reserved for
   what matters (with Von Restorff and pratfall, one or two sentences each).
4. Tokens: colour swatches (irregular edges, computed contrast), type specimens (Fraunces WONK 0 vs 1,
   Recursive CASL 0 vs 1), imperfection tokens drawn (tilt steps, nudge steps, misregistration, grain,
   ink bleed).
5. Components: Button (perfect), Link (hand underline), Print card, Margin note, Edit, Rule, Kintsugi
   repair, Dialog (perfect). Each has a caption: where the imperfection is, and why it's free.
6. Checklist: no layout shift, no JS for imperfections, AA contrast, deterministic, reduced-motion safe,
   at most three per viewport.

## Budgets and engineering

- Phone height budget: portfolio 5200px (`qa.mjs` budget), system view 6000px (checked by hand).
- JS: one bundled module (target under 10KB) plus one inline head script (theme and view, a few hundred bytes).
- Build: `astro check && astro build && node scripts/relativize.mjs`. Output in `dist/`, relative asset URLs.
- CLS: Playwright PerformanceObserver for `layout-shift` during load, scroll and view switch. Target 0.
- QA: `node /home/user/protos/_tools/qa.mjs dist v3-imperfect 5200` → `"problems": []`. Screenshots in
  `/home/user/protos/_shots/v3-imperfect/checks/`: portfolio at 1440 and 390 in light and dark, system
  at 1440 and 390, the dialog open, 2x close-ups of the hero and one print.
- Look → fix rounds: at least two, judged on the screenshots.

## Known risks (checked in QA)

- Fraunces WONK on a WONK-sensitive heading could change line breaks; check the headline at 360 and 390.
- Prints are the heaviest visual piece. Check that the six riso treatments do not look like six styles.
- Misregistration on the hero must read as deliberate at 2x, not as a rendering bug.
- Two outcome claims and availability are flagged `needsConfirm` in the content file; render as given and
  list them in the final report.
- Fieldbook is `status: concept` in the content file; the spec asks for it, so it ships with a flag.
