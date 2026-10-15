#!/usr/bin/env python3
"""Writes tools/icons/mark.svg, the ONE source for every icon (favicon, PNGs, ICO, maskable).

The "h" is the Fraunces glyph outline, read from the site's own subset font (src/fonts) at a fixed
weight, so the icon matches the wordmark without depending on a web font at icon time. The pink flick
is the same hand-drawn stroke idea as the header wordmark. Colours follow the palette tokens
(src/lib/palette.ts); the dark variant is inside the SVG under prefers-color-scheme.

usage: python3 make_source.py
"""
import pathlib
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

HERE = pathlib.Path(__file__).resolve().parent
FONT = HERE.parents[1] / 'src' / 'fonts' / 'fraunces-subset.woff2'
SIZE = 512
INK_HEIGHT = 372          # height of the "h" in icon units (512 canvas); large enough to read at 16 px
CENTRE = (256, 236)       # the "h" sits a little high so the flick balances it

font = TTFont(str(FONT))
inst = instancer.instantiateVariableFont(font, {'wght': 650, 'opsz': 36, 'SOFT': 50, 'WONK': 0})
gs = inst.getGlyphSet()
name = inst.getBestCmap()[ord('h')]

bp = BoundsPen(gs)
gs[name].draw(bp)
x0, y0, x1, y1 = bp.bounds
scale = INK_HEIGHT / (y1 - y0)
w = (x1 - x0) * scale
h = (y1 - y0) * scale
# map font units to icon units: flip y, centre the bounding box on CENTRE
tx = CENTRE[0] - w / 2 - x0 * scale
ty = CENTRE[1] + h / 2 + y0 * scale
svgpen = SVGPathPen(gs, ntos=lambda v: f'{v:.1f}'.rstrip('0').rstrip('.'))
gs[name].draw(TransformPen(svgpen, (scale, 0, 0, -scale, tx, ty)))
h_d = svgpen.getCommands()

left = CENTRE[0] - w / 2
right = CENTRE[0] + w / 2
base = CENTRE[1] + h / 2
# the flick: under the foot of the h, sweeping right and slightly down, a little hand-drawn curve
flick_d = f'M{left + w * 0.10:.1f} {base + 30:.1f} Q{left + w * 0.55:.1f} {base + 14:.1f} {right + w * 0.10:.1f} {base + 24:.1f}'

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{SIZE}" height="{SIZE}" viewBox="0 0 {SIZE} {SIZE}">
  <!-- Source mark for every icon. Edit here, then run build.mjs. Colours: palette.ts light and dark. -->
  <style>
    .paper {{ fill: #F6F6F3; }}
    .ink {{ fill: #18181C; }}
    .flick {{ fill: none; stroke: #FF48B0; stroke-width: 30; stroke-linecap: round; }}
    @media (prefers-color-scheme: dark) {{
      .paper {{ fill: #141519; }}
      .ink {{ fill: #EDEDE6; }}
      .flick {{ stroke: #FF6FC2; }}
    }}
  </style>
  <rect class="paper" width="{SIZE}" height="{SIZE}"/>
  <path class="ink" d="{h_d}"/>
  <path class="flick" d="{flick_d}"/>
</svg>
'''
out = HERE / 'mark.svg'
out.write_text(svg, encoding='utf-8')
print('wrote', out, 'bbox', round(left), round(right), 'base', round(base))
