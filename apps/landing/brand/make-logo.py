#!/usr/bin/env python3
"""
Generate the Secant Labs mark: a 2x2 grid on a warped patch.

The mark is a unit square carrying a 2x2 grid, then bent -- lifted at the far
corner and leaned to the side, with the edges bowed. The interior lines are not
drawn by eye: the four boundary curves define a Coons patch, and every grid line
is sampled off that surface, so the whole thing reads as one continuous sheet
rather than four unrelated quadrilaterals. That is the brand idea in one glyph:
straight lines, warped space.

Depth comes from three cues stacked: the far edge is shorter than the near edge
(foreshortening), a single graded wash across the patch reads as one surface
catching light, and the grid divides off centre so the cells differ in area.

That last one is deliberate. Four equal panes in perspective, each flat-filled
and separated by heavy bars, is the Windows logo -- the bars read as mullions no
matter what colour anything is. Unequal cells, near-uniform line weight and a
faint wash are what make this a warped coordinate patch instead. It also happens
to be the truer picture: a warp that preserved every area would be a poor emblem
for a company about what transformations do to space.

Three variants come out of the same geometry, because a favicon is not a logo:

  regular  Thin, near-uniform strokes. For 64px and up.
  bold     Heavier strokes for 32-48px, where the regular ones grey out.
  tiny     16px browser tabs. Chunky, nearly straight, nearly centred: at that
           size only the structure survives, so curvature and unequal cells are
           spent on legibility instead.

Usage:  python3 make-logo.py          # writes the SVGs next to this script
"""
import math
from pathlib import Path

# --- The patch -------------------------------------------------------------
# Corners in a 0..100 design space, named from the viewer's position. The far
# edge (TL..TR) is deliberately shorter than the near edge (BL..BR): that
# foreshortening is what stops the mark reading as a flat rhombus.
BL = (16.0, 87.0)   # near left
BR = (86.0, 80.0)   # near right
TR = (90.0, 24.0)   # far right, lifted
TL = (29.0, 32.0)   # far left

# How far each boundary bows outward from its chord, in design units. Kept small
# on purpose: bow the edges much harder and adjacent bulges pull the corners into
# points, so the silhouette stops being a square and becomes a leaf.
BOW = {"bottom": 2.1, "right": 1.7, "top": 2.1, "left": 1.7}

# Where the grid divides. Deliberately off centre, which is the whole point: a
# warp that preserved every area would just be four equal panes, and four equal
# blue panes in perspective is the Windows logo. Unequal cells say the map
# stretches space more here than there -- the same idea as det as area.
U_DIV, V_DIV = 0.455, 0.545

CENTROID = tuple(sum(c[i] for c in (BL, BR, TR, TL)) / 4 for i in (0, 1))


def _bow_control(a, b, amount):
    """Quadratic control point: chord midpoint pushed along the outward normal."""
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    dx, dy = b[0] - a[0], b[1] - a[1]
    length = (dx * dx + dy * dy) ** 0.5
    nx, ny = -dy / length, dx / length
    # Point the normal away from the centre, so every edge bulges outward.
    if (mx + nx - CENTROID[0]) ** 2 + (my + ny - CENTROID[1]) ** 2 < (
        mx - CENTROID[0]
    ) ** 2 + (my - CENTROID[1]) ** 2:
        nx, ny = -nx, -ny
    return (mx + nx * amount, my + ny * amount)


def _quad(a, ctrl, b, t):
    s = 1 - t
    return (
        s * s * a[0] + 2 * s * t * ctrl[0] + t * t * b[0],
        s * s * a[1] + 2 * s * t * ctrl[1] + t * t * b[1],
    )


_EDGES = {
    "bottom": (BL, _bow_control(BL, BR, BOW["bottom"]), BR),
    "top": (TL, _bow_control(TL, TR, BOW["top"]), TR),
    "left": (BL, _bow_control(BL, TL, BOW["left"]), TL),
    "right": (BR, _bow_control(BR, TR, BOW["right"]), TR),
}


# An interior bend, applied on top of the patch. sin(pi*u)*sin(pi*v) vanishes on
# all four edges, so this bows the grid lines through the middle while leaving the
# silhouette untouched -- the two are worth decoupling, because getting interior
# curvature by bowing the boundary harder is what turns the outline into a leaf.
SAG = (-3.6, -2.4)

# Scales SAG and the off-centre division for the current variant. Set by build().
# At 16px there is no room for either luxury: the whole mark is line-cell-line-
# cell-line across sixteen pixels, so curvature and unequal cells both turn into
# noise and the smaller cell disappears. Tiny trades them away for legibility.
_sag_scale = 1.0
_div_bias = 1.0


def surface(u, v):
    """
    Coons patch. u runs left..right, v runs near..far. Interior points are the
    two rulings' average minus the bilinear corner surface -- which is what makes
    the interior agree with all four bowed edges instead of fighting them.
    """
    b = _quad(*_EDGES["bottom"], u)
    t = _quad(*_EDGES["top"], u)
    l = _quad(*_EDGES["left"], v)
    r = _quad(*_EDGES["right"], v)
    out = []
    for i in (0, 1):
        ruled = (1 - v) * b[i] + v * t[i] + (1 - u) * l[i] + u * r[i]
        bilinear = (
            (1 - u) * (1 - v) * BL[i]
            + u * (1 - v) * BR[i]
            + (1 - u) * v * TL[i]
            + u * v * TR[i]
        )
        bend = _sag_scale * SAG[i] * math.sin(math.pi * u) * math.sin(math.pi * v)
        out.append(ruled - bilinear + bend)
    return tuple(out)


SAMPLES = 18  # per curve; smooth well past any raster size the mark is used at


def _pts(fn):
    return [fn(i / SAMPLES) for i in range(SAMPLES + 1)]


def _path(points, close=False):
    d = f"M {points[0][0]:.2f} {points[0][1]:.2f}"
    for x, y in points[1:]:
        d += f" L {x:.2f} {y:.2f}"
    return d + (" Z" if close else "")


def patch_path():
    """The outer boundary of the whole patch, as one closed ring."""
    ring = []
    ring += [surface(i / SAMPLES, 0) for i in range(SAMPLES + 1)]
    ring += [surface(1, i / SAMPLES) for i in range(1, SAMPLES + 1)]
    ring += [surface(1 - i / SAMPLES, 1) for i in range(1, SAMPLES + 1)]
    ring += [surface(0, 1 - i / SAMPLES) for i in range(1, SAMPLES + 1)]
    return _path(ring, close=True)


def cell_path(u0, u1, v0, v1):
    """One cell, walked around its four edges so it hugs the surface."""
    ring = []
    ring += [surface(u0 + (u1 - u0) * i / SAMPLES, v0) for i in range(SAMPLES + 1)]
    ring += [surface(u1, v0 + (v1 - v0) * i / SAMPLES) for i in range(1, SAMPLES + 1)]
    ring += [
        surface(u1 - (u1 - u0) * i / SAMPLES, v1) for i in range(1, SAMPLES + 1)
    ]
    ring += [
        surface(u0, v1 - (v1 - v0) * i / SAMPLES) for i in range(1, SAMPLES + 1)
    ]
    return _path(ring, close=True)


BLUE = "#2d70b3"


def framing(stroke: float) -> tuple[float, float, float]:
    """
    A square viewBox that centres the mark with even optical padding.

    Computed rather than eyeballed: the warp moves the bbox around whenever a
    corner or bow is tuned, and a hand-written viewBox silently goes off-centre
    the first time someone adjusts the geometry.
    """
    pts = [surface(i / 24, j / 24) for i in range(25) for j in range(25)]
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    pad = stroke / 2 + 4.0
    x0, x1 = min(xs) - pad, max(xs) + pad
    y0, y1 = min(ys) - pad, max(ys) + pad
    side = max(x1 - x0, y1 - y0)
    return (x0 - (side - (x1 - x0)) / 2, y0 - (side - (y1 - y0)) / 2, side)


# outer stroke, inner stroke, (near, far) wash opacity, stroke colour.
#
# The wash is kept faint on purpose. A 2x2 grid in perspective with solid cells
# and heavy bars between them is a window -- the bars read as mullions no matter
# what the cells are filled with. Leading with line weight and letting the wash
# only suggest depth is what makes this a warped coordinate patch instead.
# Outer and inner weights are kept nearly equal, which matters more than their
# absolute value: a heavy boundary around thinner bars is a window frame, while
# uniform weight reads as a coordinate grid. Same reason the wash stays faint.
# outer, inner, (near, far) wash, stroke colour, sag scale, division bias.
STYLES = {
    # 64px and up: site header, LinkedIn, decks, anywhere with room.
    "regular": (2.9, 2.6, (0.16, 0.04), BLUE, 1.0, 1.0),
    # 32-48px, where the regular strokes start to grey out.
    "bold": (4.8, 4.4, (0.22, 0.05), "#2a67a6", 0.85, 0.8),
    # 16px browser tabs. Chunky, nearly straight, nearly centred -- at this size
    # the structure is all that survives, so everything else is spent on it.
    "tiny": (9.0, 8.2, (0.34, 0.12), "#2a67a6", 0.45, 0.25),
}


def build(style: str) -> str:
    global _sag_scale, _div_bias
    outer, inner, wash, stroke, _sag_scale, _div_bias = STYLES[style]
    u_div = 0.5 + (U_DIV - 0.5) * _div_bias
    v_div = 0.5 + (V_DIV - 0.5) * _div_bias

    parts = [
        f'    <path d="{patch_path()}" fill="url(#sl-surface)" />',
    ]

    # Interior lines, following the surface rather than joining edge midpoints.
    mid_u = _pts(lambda t: surface(u_div, t))
    mid_v = _pts(lambda t: surface(t, v_div))
    parts.append(
        f'    <path d="{_path(mid_v)}" fill="none" stroke="{stroke}" '
        f'stroke-width="{inner:.2f}" stroke-linecap="round" />'
    )
    parts.append(
        f'    <path d="{_path(mid_u)}" fill="none" stroke="{stroke}" '
        f'stroke-width="{inner:.2f}" stroke-linecap="round" />'
    )

    # Boundary last, so it sits crisply over the fills.
    ring = []
    ring += [surface(i / SAMPLES, 0) for i in range(SAMPLES + 1)]
    ring += [surface(1, i / SAMPLES) for i in range(1, SAMPLES + 1)]
    ring += [surface(1 - i / SAMPLES, 1) for i in range(1, SAMPLES + 1)]
    ring += [surface(0, 1 - i / SAMPLES) for i in range(1, SAMPLES + 1)]
    parts.append(
        f'    <path d="{_path(ring, close=True)}" fill="none" stroke="{stroke}" '
        f'stroke-width="{outer:.2f}" stroke-linejoin="round" />'
    )

    body = "\n".join(parts)
    note = f"{style} variant"
    vx, vy, side = framing(outer)
    # Gradient runs along the near-to-far diagonal, so the wash follows the
    # surface rather than the page.
    gx1, gy1 = surface(0.0, 0.0)
    gx2, gy2 = surface(1.0, 1.0)
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vx:.2f} {vy:.2f} {side:.2f} {side:.2f}" width="512" height="512">
  <title>Secant Labs</title>
  <!-- Generated by brand/make-logo.py. {note} -->
  <defs>
    <linearGradient id="sl-surface" gradientUnits="userSpaceOnUse"
      x1="{gx1:.2f}" y1="{gy1:.2f}" x2="{gx2:.2f}" y2="{gy2:.2f}">
      <stop offset="0" stop-color="{BLUE}" stop-opacity="{wash[0]:.2f}" />
      <stop offset="1" stop-color="{BLUE}" stop-opacity="{wash[1]:.2f}" />
    </linearGradient>
  </defs>
  <g>
{body}
  </g>
</svg>
"""


if __name__ == "__main__":
    here = Path(__file__).parent
    for style in STYLES:
        name = "logo.svg" if style == "regular" else f"logo-{style}.svg"
        (here / name).write_text(build(style))
        print("wrote", name)
