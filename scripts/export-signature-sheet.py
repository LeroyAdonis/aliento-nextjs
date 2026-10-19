#!/usr/bin/env python3
"""Build a clean export sheet for the four signature designs, so they can be screenshotted as PNGs.

Leroy, 2026-10-19: "drop the designs here in the chat so I can download them and send to her via WhatsApp."

WhatsApp needs images, not HTML, and the person receiving them is the doctor herself — so this sheet renders the
cards on the brand's own page colour, with the site's REAL typefaces loaded (Instrument Serif from Google,
Satoshi from Fontshare). That is the one advantage a rendered sheet has over the email file: the email has to fall
back to Georgia, the picture does not.

The markup is extracted from the files that ship and transformed for dark exactly the way the test email does it,
so the sheet cannot show a design the email files do not contain. Writes an HTML page; the screenshots are taken
from it afterwards.
"""

import importlib.util
import re
from pathlib import Path

D = Path("/root/aliento-nextjs/email-signature")
OUT = Path("/tmp/aliento-export.html")

TEL = "+27 76 236 7921"


def _load(name: str):
    spec = importlib.util.spec_from_file_location(name, f"/root/aliento-nextjs/scripts/{name}.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def fragment(path: Path) -> str:
    html = path.read_text()
    start = html.find("<!-- paste from here")
    end = html.find("<!-- to here")
    assert start != -1 and end != -1, f"{path.name}: paste markers missing"
    frag = html[start:end].replace("<!-- paste from here ------------------------------------------------------->", "")
    without_comments = re.sub(r"<!--.*?-->", "", frag, flags=re.S)
    assert not re.search(r"<style[\s>]", without_comments, re.I), f"{path.name}: <style> inside the paste region"
    return frag


# the test-email module already owns the light -> dark transform; reuse it rather than writing a second copy
sig = _load("send-signature-test-email")

CARD = {
    "full": fragment(D / "aliento-signature-full.html"),
    "compact": fragment(D / "aliento-signature-compact.html"),
}

SECTIONS = [
    ("full-light", "Aliento &middot; full card &middot; light", CARD["full"], "#FEFCF8"),
    ("full-dark", "Aliento &middot; full card &middot; dark", sig.as_dark(CARD["full"]), "#141A16"),
    ("compact-light", "Aliento &middot; compact &middot; light", CARD["compact"], "#FEFCF8"),
    ("compact-dark", "Aliento &middot; compact &middot; dark", sig.as_dark(CARD["compact"]), "#141A16"),
]

HTML = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; }
  body { margin:0; padding:0; background:#fff; font-family:'Satoshi',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
  /* stacked, not inline-block: all four panels must sit inside one tall viewport, because a node clip
     beyond the fold needs captureBeyondViewport and that times out on this browser */
  /* width:max-content so the panel hugs the card (600px + padding) instead of stretching to the viewport —
     a full-width panel at 3x is a 2700px capture and the browser daemon times out on it */
  .panel { padding: 40px; display: block; width: max-content; }
  .panel > .row { display: flex; align-items: flex-start; }
</style>
</head><body>
{sections}
</body></html>"""


def main() -> None:
    blocks = []
    for ident, label, markup, bg in SECTIONS:
        blocks.append(
            f'<div class="panel" id="{ident}" style="background:{bg};">'
            f'<div class="row">{markup}</div>'
            f"</div>"
        )
    OUT.write_text(HTML.replace("{sections}", "\n".join(blocks)))
    print(f"  {OUT}  {OUT.stat().st_size} bytes  {len(SECTIONS)} panels")
    for ident, label, markup, _ in SECTIONS:
        assert "Instrument Serif" in markup or "sig-name" in markup, f"{ident}: no type stack"
        print(f"    {ident:16} {len(markup):>6} chars  images: {markup.count('<img')}")


if __name__ == "__main__":
    main()
