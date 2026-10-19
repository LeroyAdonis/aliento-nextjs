#!/usr/bin/env python3
"""Give alientomd.com its own favicon instead of Vercel's.

The site was shipping Next.js's default `src/app/favicon.ico`, which is the Vercel triangle on a black circle —
verified by rendering the frame and looking at it, not assumed from the filename. That is the icon patients see
in a browser tab, in Safari's favourites and in a bookmark, on a site that is about to take bookings.

Everything here is derived from the brand's own `public/logo-icon.svg` (the sage leaf with the breath wave),
so the tab icon cannot drift from the logo:

  src/app/favicon.ico      multi-frame ICO: 16, 32, 48, 64, 128, 256
  src/app/apple-icon.png   180x180, opaque background, because iOS composites on white and a transparent
                           leaf on a dark home screen disappears
  public/icon-192.png      manifest icon
  public/icon-512.png      manifest icon

At 16px a 40-unit artboard with internal padding collapses into mush, so the leaf is scaled to 92% of the canvas
and given a cream plate behind it. The plate is what keeps the pale sage leaf from vanishing on a white tab bar.
"""

from pathlib import Path

import cairosvg
from PIL import Image

APP = Path("/root/aliento-nextjs/src/app")
PUB = Path("/root/aliento-nextjs/public")
SVG = PUB / "logo-icon.svg"

CREAM = "#fefcf8"  # cream-50, the site's own light surface

# The leaf at 92% of the canvas, centred on a cream disc. Rendered as one SVG so the plate is sharp at 16px.
# `plate="circle"` for the tab icon (a disc reads well on any tab-bar colour and keeps the transparent
# corners a favicon wants); `plate="square"` for apple-icon and the manifest, because iOS masks its own corners
# and a transparent corner turns BLACK when the PNG is flattened for the home screen.
ICON_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
  {plate}
  <g transform="translate(20 20) scale(0.92) translate(-20 -20)">
    <path d="M20 4 C 29 5 34 13 33 21 C 32 30 26 36 20 36 C 14 36 8 30 7 21 C 6 13 11 5 20 4Z" fill="#7C9E8A"/>
    <line x1="20" y1="7" x2="20" y2="33" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
    <path d="M9 20 C 12 15 15 18 18 20 C 21 22 24 25 27 20 C 30 15 32 17 31 20"
          stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  </g>
</svg>"""


def render(px: int, plate: str = "circle") -> Image.Image:
    shape = (
        f'<circle cx="20" cy="20" r="20" fill="{CREAM}"/>'
        if plate == "circle"
        else f'<rect x="0" y="0" width="40" height="40" fill="{CREAM}"/>'
    )
    svg = ICON_SVG.format(plate=shape)
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=px, output_height=px)
    assert png is not None, "cairosvg returned nothing"
    import io

    return Image.open(io.BytesIO(png)).convert("RGBA")


def main() -> None:
    frames = [render(px) for px in (16, 32, 48, 64, 128, 256)]
    ico = APP / "favicon.ico"
    frames[-1].save(ico, format="ICO", sizes=[(f.width, f.height) for f in frames])
    print(f"  src/app/favicon.ico      {ico.stat().st_size:>6} bytes  {len(frames)} frames "
          f"{[f.width for f in frames]}")

    apple = APP / "apple-icon.png"
    render(180, plate="square").convert("RGB").save(apple, "PNG", optimize=True)
    print(f"  src/app/apple-icon.png   {apple.stat().st_size:>6} bytes  180x180 opaque")

    for size in (192, 512):
        out = PUB / f"icon-{size}.png"
        render(size, plate="square").save(out, "PNG", optimize=True)
        print(f"  public/icon-{size}.png     {out.stat().st_size:>6} bytes  {size}x{size}")

    # Prove the plate is opaque where iOS needs it, and that the leaf is actually drawn.
    im = Image.open(apple).convert("RGB")
    corner = im.getpixel((2, 2))
    assert sum(corner) > 600, f"apple icon corner is not the cream plate: {corner}"
    assert im.getpixel((90, 90)) != corner, "apple icon centre is empty — the leaf did not render"
    print("  apple icon opaque at the edges: ok")

    small = render(16).convert("RGBA")
    greens = sum(1 for p in small.getdata() if p[1] > p[0] + 8 and p[3] > 0)
    assert greens > 40, f"16px frame barely contains the leaf ({greens} green pixels)"
    print(f"  16px frame carries the leaf: {greens} sage pixels")


if __name__ == "__main__":
    main()
