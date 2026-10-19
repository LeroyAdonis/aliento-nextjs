#!/usr/bin/env python3
"""Send Leroy a test email of the Aliento signature so he can see it in a real mail client.

Leroy, 2026-10-19: "can you send me a test to my email address to see what it would actually look like before I
send it for final approval by my sister."

Two things this does that a screenshot cannot:

  1. It shows BOTH states in one message. A mail client renders whichever colour scheme its user has, so a single
     card can only demonstrate one of them. The shipped file flips by itself through
     `@media (prefers-color-scheme: dark)`; a test message deliberately carries no <style> block, so neither card
     can flip under him, and he sees light and dark side by side regardless of his own setting.
  2. It links the interactive preview, where the switch is a button rather than a client setting.

The cards are generated from the file that ships (`aliento-signature-full.html`), not retyped, and the dark card
is produced by substituting the palette's own dark hexes — so the test cannot drift from the artefact.

Sending targets are asserted; nothing goes out if a check fails.
"""

import base64
import json
import os
import re
import sys
from email.message import EmailMessage
from pathlib import Path

TOKEN_PATH = os.path.expanduser("~/.hermes/google_token.json")
CREDENTIALS_PATH = os.path.expanduser("~/.hermes/google_credentials.json")
SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/drive",
]

TO = "leroyadonis3@gmail.com"
SUBJECT = "Aliento signature v2 — light and dark, and the small print now wraps on a phone"
SIG = Path("/root/aliento-nextjs/email-signature/aliento-signature-full.html")
PREVIEW_URL = "https://zahra.digitalwavetech.dev/email/aliento/aliento-signature-preview.html"

# The palette's dark end, the same values the email file's media query carries.
LIGHT_TO_DARK = {
    "#FDF8F0": "#1E2E24",   # card
    "#E5E1DB": "#2D4336",   # border
    "#2E2A26": "#FEFCF8",   # name
    "#635B4E": "#B8D5C4",   # descriptor
    "#3A5746": "#B8D5C4",   # title + links
    "#8FBD9F": "#3A5746",   # link underline
    "#9E4A38": "#D9896A",   # middot
    "#CCC6BC": "#2D4336",   # hairline
}


def fragment() -> str:
    html = SIG.read_text()
    start = html.find("<!-- paste from here")
    end = html.find("<!-- to here")
    assert start != -1 and end != -1, "paste markers missing"
    frag = html[start:end]
    assert "<style" not in frag, "a <style> block escaped into the paste region"
    assert "sig-card" in frag and "leegale-signature.png" in frag, "the card did not extract as expected"
    return frag.replace("<!-- paste from here ------------------------------------------------------->", "")


def as_dark(frag: str) -> str:
    """Swap to the dark palette and reveal the light-ink images. No <style>, all inline, so no client can flip it.

    Both image variants live in the markup, hidden or shown by an inline `display`. The first version of this
    function stripped the class names before reading them, so the light images were left visible next to the dark
    ones — a dark card showing a dark-ink mark beside a white one. Order matters: flip `display` while the class
    is still there, then drop the classes.
    """
    out = frag
    for light, dark in LIGHT_TO_DARK.items():
        out = re.sub(light, dark, out, flags=re.I)

    def hide(tag_match: re.Match) -> str:
        tag = tag_match.group(0)
        # inline-block and block both have to go, or the mark keeps drawing next to its white twin
        tag = re.sub(r"display:\s*(inline-block|block)", "display:none", tag)
        return re.sub(r'\s*class="[^"]*sig-(?:light|dark)-img[^"]*"', "", tag)

    def show(tag_match: re.Match) -> str:
        tag = tag_match.group(0)
        # honour data-display: the mark must come back as inline-block, not block, or it breaks the wordmark line
        wanted = "inline-block" if "inline-block" in tag else "block"
        tag = re.sub(r"display:\s*none", f"display:{wanted}", tag)
        return re.sub(r'\s*class="[^"]*sig-(?:light|dark)-img[^"]*"', "", tag)

    out = re.sub(r"<img[^>]*sig-light-img[^>]*>", hide, out, flags=re.S)
    out = re.sub(r"<img[^>]*sig-dark-img[^>]*>", show, out, flags=re.S)
    # the wordmark cell and the handler cell each end up with exactly one visible image
    assert "sig-light-img" not in out and "sig-dark-img" not in out, "image classes survived the swap"
    assert "display:inline-block" in out, "the inline mark lost its inline-block display in dark mode"
    return out


LABEL = ('font-family:-apple-system, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif;'
         'font-size:11px;letter-spacing:1.3px;text-transform:uppercase;color:#857A6A;'
         'margin:34px 0 10px 2px;')
NOTE = ("font-family:-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
        "font-size:13px;line-height:1.65;color:#433E34;margin:0 0 4px;max-width:600px;")


def build_html(light: str, dark: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{SUBJECT}</title></head>
<body style="margin:0;padding:24px;background:#FEFCF8;">

<p style="{NOTE}">Hi Leroy,</p>
<p style="{NOTE}">Here is the Aliento signature as it will actually paste into a mail client. I am sending both
states in one message, because your own client only renders one: the file that ships switches itself with
<code>@media (prefers-color-scheme: dark)</code>, and this message deliberately carries no style block so neither
card can flip under you.</p>

<p style="{LABEL}">1 &middot; Light &mdash; cream card, sage accents</p>
{light}

<p style="{LABEL}">2 &middot; Dark &mdash; the palette's own dark end, not an inversion</p>
{dark}

<p style="{LABEL}">3 &middot; Try the switch yourself</p>
<p style="{NOTE}">The interactive preview flips between auto, light and dark with one button, and follows your
phone's setting when set to auto: <a href="{PREVIEW_URL}" style="color:#3A5746;font-weight:600;">{PREVIEW_URL}</a></p>

<p style="{NOTE}">This second version fixes one thing: the small uppercase line beside the wordmark now drops
beneath it and wraps on a phone instead of being squeezed into a narrow column. Below 480px wide the card takes the
full width and that line becomes a normal wrapping line. Worth checking on your phone.</p>

<p style="{NOTE}" >A few honest notes. The name is set in Instrument Serif on the site; a mail client will not load
that font, so it hands over to Georgia, which is what you see here. The handwritten signature and the mark are
different files per theme, which is why the dark card has a light-ink signature. Nothing here has been tested in
Outlook desktop or Gmail's own dark mode yet. And the email address and phone are the ones from her site, so please
confirm both before this goes to her.</p>

<p style="{NOTE}">Ricky</p>
</body></html>"""


PLAIN = f"""Hi Leroy,

Updated version: on a phone the small uppercase line beside the wordmark now drops beneath it and wraps, instead
of squeezing into a narrow column.

Here is the Aliento signature in both of its states. This plain-text part is what a reader sees if their client
refuses HTML, so it is deliberately the text of the signature rather than the design.

LIGHT CARD
Dr Leegale Franscesca Adonis
Public Health Medicine Specialist
Aliento - Preventive Care & Virtual Consultations
leegale@alientomd.com | 076 236 7921 | alientomd.com

DARK CARD - same details, dark surface (sage-900), cream text, light-ink signature.

Interactive preview, one button to switch: {PREVIEW_URL}

The site sets her name in Instrument Serif; a mail client will not load it, so it falls back to Georgia. The
email address and phone come from her site and should be confirmed before this goes to her.

Ricky
"""


def get_service():
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from googleapiclient.discovery import build as google_build

    token_data = json.load(open(TOKEN_PATH))
    if not token_data.get("client_secret") and os.path.exists(CREDENTIALS_PATH):
        installed = json.load(open(CREDENTIALS_PATH)).get("installed", {})
        token_data["client_secret"] = installed["client_secret"]
        token_data["client_id"] = installed["client_id"]
    creds = Credentials.from_authorized_user_info(token_data, SCOPES)
    creds.refresh(Request())          # forced: a still-valid token can be minted without gmail.send
    out = json.loads(creds.to_json())
    out["scopes"] = SCOPES
    json.dump(out, open(TOKEN_PATH, "w"))
    return google_build("gmail", "v1", credentials=creds)


def build_message(html: str) -> EmailMessage:
    msg = EmailMessage()
    msg["To"] = TO
    msg["Subject"] = SUBJECT
    msg.set_content(PLAIN, subtype="plain", charset="utf-8")
    msg.add_alternative(html, subtype="html", charset="utf-8")
    return msg


def main() -> None:
    frag = fragment()
    light = frag
    dark = as_dark(frag)

    # Nothing may leave unverified. Note the direction: LIGHT_TO_DARK maps light hex -> dark hex, so the LIGHT
    # card must contain the KEYS and the DARK card must contain the VALUES. Asserting the dict lookup in the
    # wrong card is the mistake that caught this file: `LIGHT_TO_DARK["#FDF8F0"]` is "#1E2E24", the dark surface,
    # so an "is the cream still there" check written that way can only ever fail.
    assert "#FDF8F0" in light.upper(), "the light card lost its cream surface"
    assert "#FDF8F0" not in dark.upper(), "the dark card still carries the cream surface"
    assert LIGHT_TO_DARK["#FDF8F0"] in dark.upper(), "the dark card did not take the dark surface"
    assert "display:none" in dark and "display:block" in dark, "image swap did not happen on the dark card"
    for url in re.findall(r'src="(https://[^"]+)"', light + dark):
        assert url.startswith("https://zahra.digitalwavetech.dev/email/aliento/"), f"unexpected image host: {url}"
    html = build_html(light, dark)
    assert html.count("sig-card") >= 2, "both cards must be present"
    assert "Instrument Serif" in html, "the serif stack vanished"
    print(f"  light card {len(light)} chars, dark card {len(dark)} chars, message {len(html)} chars")

    svc = get_service()
    profile = svc.users().getProfile(userId="me").execute()["emailAddress"]
    print(f"  from {profile} -> {TO}")
    msg = build_message(html)
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    sent = svc.users().messages().send(userId="me", body={"raw": raw}).execute()

    m = svc.users().messages().get(userId="me", id=sent["id"], format="metadata").execute()
    headers = {h["name"]: h["value"] for h in m["payload"]["headers"]}
    assert "SENT" in m.get("labelIds", []), "message not in SENT"
    assert headers.get("To") == TO, f"To came back as {headers.get('To')}"
    print(f"  SENT id={sent['id']} subject={headers.get('Subject')!r}")
    print(f"  open it at https://mail.google.com/mail/u/0/#sent/{sent['id']}")


if __name__ == "__main__":
    sys.exit(main())
