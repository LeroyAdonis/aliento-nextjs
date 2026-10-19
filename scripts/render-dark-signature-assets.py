#!/usr/bin/env python3
"""Build the two assets a dark signature card needs, from Aliento's own artwork.

The DWT signature DNA puts everything on one deep surface, which breaks two existing assets:

  * the handwritten signature is dark ink, so on `primary-900` it is invisible;
  * the contact rows want leading glyphs, and unicode glyphs (✉ ☎ ⌂) render as colour emoji in several
    clients — a design defect, and the DWT repo's own gate fails any file containing an emoji.

So: recolour the signature to white and draw three hairline icons, rendered from SVG to PNG because email
clients do not render SVG. Stroke colour is `secondary-300` (#5eead4), the design system's existing teal tint,
measured at 9.17:1 against `#1e2a5e` — the same token, not a new one.

Writes into `public/email/` and the live document root, keeping the same filenames the HTML references.
"""

from pathlib import Path

import cairosvg
from PIL import Image

PUB = Path("/root/aliento-nextjs/public/email")
LIVE = Path("/var/www/email-assets/aliento")

TEAL = "#5eead4"   # secondary-300 in the stale design-system.ts — kept for the archived navy card
SAGE = "#3A5746"   # sage-700 — accent on the cream card
SAGE_LIGHT = "#B8D5C4"  # sage-200 — accent on the dark card (sage-900 surface)   # sage-700 — the LIVE site accent (src/app/globals.css), 7.55:1 on cream-100

ICONS = {
    # 24x24 artboard, 2px round-cap strokes, no fills: legible at 16px and at 32px
    "icon-mail": """
        <path d="M3 6.5h18v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>
        <path d="M3.5 7 12 13.2 20.5 7"/>""",
    "icon-phone": """
        <path d="M7.2 3.5h-2A2.2 2.2 0 0 0 3 5.9C3 14 10 21 18.1 21a2.2 2.2 0 0 0 2.4-2.2v-2l-4.3-1.6-1.9 2.1a14.6 14.6 0 0 1-5.6-5.6l2.1-1.9z"/>""",
    "icon-globe": """
        <circle cx="12" cy="12" r="8.7"/>
        <path d="M3.4 12h17.2"/>
        <path d="M12 3.3c2.4 2.4 3.6 5.4 3.6 8.7s-1.2 6.3-3.6 8.7c-2.4-2.4-3.6-5.4-3.6-8.7S9.6 5.7 12 3.3z"/>""",
}


def svg(body: str, colour: str = TEAL) -> str:
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" '
        f'fill="none" stroke="{colour}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'
        f"{body}</svg>"
    )


def whiten_signature() -> None:
    """Keep the alpha, replace every ink pixel with white. Aspect ratio is preserved exactly."""
    src = PUB / "leegale-signature.png"
    im = Image.open(src).convert("RGBA")
    r, g, b, a = im.split()
    white = Image.new("RGBA", im.size, (255, 255, 255, 0))
    white.putalpha(a)
    out = PUB / "leegale-signature-white.png"
    white.save(out, "PNG", optimize=True)
    for dest in (out, LIVE / out.name):
        if dest != out:
            Image.open(out).save(dest, "PNG", optimize=True)
    print(f"  leegale-signature-white.png  {im.size[0]}x{im.size[1]}  {out.stat().st_size} bytes")


def render_icons() -> None:
    """2x for retina: the HTML asks for 16x16, the file is 32x32.

    Unlike a logo, an icon must NOT be ink-tight — the glyph sits inside its artboard with breathing room, and
    the row aligns on the box, not on the ink. What has to be true is that the set is consistent, so the three
    glyphs read as one column: the same artboard, and left insets that agree to within a pixel.
    """
    insets = {}
    # sage first: the cream card is what ships
    sets = ([(n + "-sage", b, SAGE) for n, b in ICONS.items()]
            + [(n + "-dark", b, SAGE_LIGHT) for n, b in ICONS.items()]
            + [(n, b, TEAL) for n, b in ICONS.items()])
    for name, body, colour in sets:
        png = cairosvg.svg2png(bytestring=svg(body, colour).encode(), output_width=32, output_height=32)
        assert png is not None, f"{name}: cairosvg returned nothing"
        out = PUB / f"{name}.png"
        out.write_bytes(png)
        (LIVE / out.name).write_bytes(png)
        im = Image.open(out).convert("RGBA")
        bbox = im.split()[3].getbbox()
        assert bbox is not None, f"{name}: transparent-only image"
        assert im.size == (32, 32), f"{name}: unexpected canvas {im.size}"
        insets[name] = bbox
        print(f"  {name}.png  {im.size[0]}x{im.size[1]}  {out.stat().st_size} bytes  ink bbox {bbox}")
    lefts = {b[0] for b in insets.values() if not b is None}
    assert max(lefts) - min(lefts) <= 1, f"icon left insets disagree, the column will look ragged: {insets}"
    print(f"  icon set consistent: left insets {sorted(lefts)}")


if __name__ == "__main__":
    PUB.mkdir(parents=True, exist_ok=True)
    LIVE.mkdir(parents=True, exist_ok=True)
    print("dark-card assets:")
    whiten_signature()
    render_icons()
    print("done")
