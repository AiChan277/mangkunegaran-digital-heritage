"""
Builds the kawung ornament family in public/ornament/ from one geometry.

Provenance (see docs/BATIK_ASSETS.md):
- Base geometry: "Ragam Hias Jawa - Kawung (Polos).svg" by Pinerineks,
  Wikimedia Commons, CC0 1.0 (lens-shaped leaves on a diagonal lattice).
- Adapted with reference to Nationaal Museum van Wereldculturen RV-847-85,
  batik pattern sample 'Kawung picis', before 1891 (public domain photo):
  the museum describes elliptical leaves with a dot in both foci, separated
  by lozenges. We add the focal dots (as holes) and shorten the leaves so a
  small lozenge stays open where four leaves meet.

This is an adaptation, not a reproduction of the museum sample.
Usage: python scripts/build-batik.py
"""
import math
import pathlib

OUT = pathlib.Path(__file__).resolve().parent.parent / "public" / "ornament"
OUT.mkdir(parents=True, exist_ok=True)

T = 48.0          # tile size: leaves run corner→centre along both diagonals
R = 16.5          # arc radius of each leaf side (smaller = rounder leaf)
GAP = 2.4         # distance trimmed from each leaf tip (opens the lozenge)
DOT = 1.5         # focal dot radius


def leaf(ax, ay, bx, by):
    """Lens between A and B (trimmed), with two focal dots as holes."""
    dx, dy = bx - ax, by - ay
    length = math.hypot(dx, dy)
    ux, uy = dx / length, dy / length
    a = (ax + ux * GAP, ay + uy * GAP)
    b = (bx - ux * GAP, by - uy * GAP)
    d = (
        f"M{a[0]:.2f} {a[1]:.2f}"
        f"A{R} {R} 0 0 1 {b[0]:.2f} {b[1]:.2f}"
        f"A{R} {R} 0 0 1 {a[0]:.2f} {a[1]:.2f}Z"
    )
    # Dots at one third and two thirds of the axis ("in both foci").
    for t in (1 / 3, 2 / 3):
        cx, cy = ax + dx * t, ay + dy * t
        d += f"M{cx + DOT:.2f} {cy:.2f}a{DOT} {DOT} 0 1 0 {-2 * DOT:.2f} 0a{DOT} {DOT} 0 1 0 {2 * DOT:.2f} 0Z"
    return d


def tile_paths(ox=0.0, oy=0.0):
    c = T / 2
    pts = [
        ((0, 0), (c, c)),
        ((c, c), (T, T)),
        ((T, 0), (c, c)),
        ((c, c), (0, T)),
    ]
    return [leaf(ox + a[0], oy + a[1], ox + b[0], oy + b[1]) for a, b in pts]


HEAD = '<?xml version="1.0" encoding="UTF-8"?>\n'
NOTE = (
    "<!-- Kawung ornament (adapted). Base: Pinerineks, 'Ragam Hias Jawa - Kawung (Polos)', "
    "Wikimedia Commons, CC0 1.0. Reference: NMvW RV-847-85 'Kawung picis', before 1891. "
    "Adaptation by Kelompok 7, see docs/BATIK_ASSETS.md. -->\n"
)


def svg(w, h, body, view=None):
    view = view or f"0 0 {w:g} {h:g}"
    return (
        HEAD + NOTE
        + f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:g}" height="{h:g}" viewBox="{view}">'
        + body + "</svg>\n"
    )


def path(ds):
    return f'<path fill="#000" fill-rule="evenodd" d="{"".join(ds)}"/>'


# 1. Repeating tile (used as a CSS mask, repeat in both directions).
(OUT / "kawung-tile.svg").write_text(svg(T, T, path(tile_paths())), encoding="utf8")

# 2. Single flower: four leaves around one meeting point (section marker).
c = T / 2
flower = [leaf(c, c, c - c, c - c), leaf(c, c, T, 0), leaf(c, c, T, T), leaf(c, c, 0, T)]
(OUT / "kawung-flower.svg").write_text(svg(T, T, path(flower)), encoding="utf8")

# 3. Border strip: one row of half-tiles, for thin dividers (repeat-x).
# The top half of a tile shows two leaves meeting at the centre line.
(OUT / "kawung-border.svg").write_text(
    svg(T, T / 2, f'<clipPath id="c"><rect width="{T:g}" height="{T / 2:g}"/></clipPath>'
        f'<g clip-path="url(#c)">{path(tile_paths(0, -T / 4))}</g>'),
    encoding="utf8",
)
print("wrote", ", ".join(p.name for p in sorted(OUT.glob("kawung-*.svg"))))
