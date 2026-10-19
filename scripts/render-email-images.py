#!/usr/bin/env python3
"""Render the Aliento email images as PNG — email clients do not render SVG.

Gmail strips `<img src="*.svg">` and Outlook shows a broken-image box, so the brand mark and the handwritten
signature have to exist as PNG before any signature HTML is worth testing. Everything here is rendered from
the site's OWN assets (`public/logo-icon.svg`, `public/dr-leegale-signature.svg`) rather than redrawn, so the
mark in her email is the mark in her website.

Outputs, transparent background, 2x for retina:
  aliento-mark.png      96x96   square brand mark
  aliento-mark-white.png 96x96  the white variant, for a dark card
  aliento-wordmark.png  320x96  mark + "Aliento" in a serif face (email-safe: Georgia)
  leegale-signature.png 260x80  her handwritten signature
"""
from pathlib import Path

import cairosvg
from PIL import Image, ImageDraw, ImageFont

SRC = Path("/root/aliento-nextjs/public")
OUT = Path("/root/aliento-nextjs/public/email")
OUT.mkdir(parents=True, exist_ok=True)

SERIF = ["/usr/share/fonts/truetype/msttcorefonts/Georgia.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"]


def render(svg_name: str, out_name: str, width: int, height: int) -> Path:
    """SVG -> PNG at an exact pixel size, transparent background."""
    src = SRC / svg_name
    dest = OUT / out_name
    cairosvg.svg2png(url=str(src), write_to=str(dest), output_width=width, output_height=height)
    with Image.open(dest) as im:
        assert im.size == (width, height), f"{out_name}: {im.size} != {(width, height)}"
        assert im.mode in ("RGBA", "LA"), f"{out_name}: no alpha channel, background is not transparent"
    return dest


def wordmark() -> Path:
    """Mark + wordmark in one lockup. The real display face (Instrument Serif) is a webfont and cannot be
    used inside an email, so this is drawn in Georgia — the same fallback the signature HTML uses."""
    mark_h = 96
    mark = Image.open(OUT / "aliento-mark.png").convert("RGBA").resize((mark_h, mark_h), Image.Resampling.LANCZOS)

    text = "Aliento"
    size = 64
    font_path = next((p for p in SERIF if Path(p).exists()), None)
    font = ImageFont.truetype(font_path, size) if font_path else ImageFont.load_default()

    probe = ImageDraw.Draw(Image.new("RGBA", (10, 10)))
    box = probe.textbbox((0, 0), text, font=font)
    text_w = box[2] - box[0]
    gap = 22
    width = mark_h + gap + text_w + 6
    canvas = Image.new("RGBA", (int(width), int(mark_h)), (0, 0, 0, 0))
    canvas.paste(mark, (0, 0), mark)

    draw = ImageDraw.Draw(canvas)
    # deep blue from the design system, vertically centred against the mark
    draw.text((mark_h + gap, (mark_h - (box[3] - box[1])) // 2 - box[1]), text, font=font, fill="#1e2a5e")
    dest = OUT / "aliento-wordmark.png"
    canvas.save(dest)
    return dest


for args, name in [
    (("logo-icon.svg", "aliento-mark.png", 96, 96), "mark"),
    (("logo-icon-white.svg", "aliento-mark-white.png", 96, 96), "mark (white)"),
    (("dr-leegale-signature.svg", "leegale-signature.png", 260, 80), "signature"),
]:
    p = render(*args)
    print(f"{name:14} -> {p.name}  {p.stat().st_size:,} bytes")

p = wordmark()
print(f"{'wordmark':14} -> {p.name}  {p.stat().st_size:,} bytes  {Image.open(p).size}")

print("\nall outputs in", OUT)
