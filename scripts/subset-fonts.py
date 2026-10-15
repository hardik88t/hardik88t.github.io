#!/usr/bin/env python3
"""Build the two self-hosted font files from the fontsource sources.

Each variable font is instanced to the axes this site uses (weight 400-700, the optical-size
range for the display sizes, and the Recursive axes CASL, MONO and slnt, with CRSV pinned), then
subset to Latin. Output goes to src/fonts/ and is committed, so the build does not need fonttools.

Run after changing the axes or the character set:
  python3 -m pip install --user fonttools brotli
  python3 scripts/subset-fonts.py
"""
import os

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'node_modules', '@fontsource-variable')
OUT = os.path.join(ROOT, 'src', 'fonts')

# Basic Latin, plus the non-ASCII the site uses: nbsp, ©, middle dot, and typographic dashes,
# quotes and ellipsis. Accented Latin letters are not used, so they are left out.
UNICODES = (
    list(range(0x20, 0x7F))
    + [0xA0, 0xA9, 0xB7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026]
)

JOBS = [
    {
        'src': 'fraunces/files/fraunces-latin-full-normal.woff2',
        'out': 'fraunces-subset.woff2',
        # opsz kept as a range (display sizes go up to ~176px); wght 400-700; SOFT and WONK full.
        'limits': {'wght': (400, 700), 'opsz': (14, 144)},
    },
    {
        'src': 'recursive/files/recursive-latin-full-normal.woff2',
        'out': 'recursive-subset.woff2',
        # CASL, MONO and slnt are used; CRSV is not, so it is pinned to its default.
        'limits': {'wght': (400, 700), 'slnt': (-15, 0), 'CRSV': 0.5},
    },
]


def build(job):
    font = TTFont(os.path.join(SRC, job['src']))
    before = os.path.getsize(os.path.join(SRC, job['src']))
    font = instancer.instantiateVariableFont(font, job['limits'])

    options = subset.Options()
    options.flavor = 'woff2'
    options.layout_features = ['kern', 'liga', 'calt', 'locl', 'ccmp', 'mark', 'mkmk', 'onum', 'lnum', 'case']
    options.name_IDs = ['*']
    options.notdef_outline = True
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)

    path = os.path.join(OUT, job['out'])
    font.flavor = 'woff2'
    font.save(path)
    axes = [(a.axisTag, a.minValue, a.maxValue) for a in TTFont(path)['fvar'].axes] if 'fvar' in TTFont(path) else []
    print(f"{job['out']}: {before} -> {os.path.getsize(path)} bytes, axes {axes}")


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for j in JOBS:
        build(j)
