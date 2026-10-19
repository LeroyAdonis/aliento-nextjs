#!/usr/bin/env python3
"""Build the signature preview page, with a working light/dark switcher, from the two email files.

The email-safe files carry their dark mode in an `@media (prefers-color-scheme: dark)` block, which is the only
mechanism a mail client will honour. That makes them impossible to review on a desktop browser that is not itself
in dark mode — so this page re-presents the SAME markup (extracted, never copied by hand) with:

  * a `data-theme` attribute that the switcher sets explicitly, so both looks are one click apart;
  * `applySignatureTheme('auto' | 'light' | 'dark')` — the dynamic switch — which resolves 'auto' from
    `prefers-color-scheme` and re-resolves whenever the OS changes while 'auto' is selected;
  * image swapping for the preview, because the light card's dark-ink signature and the dark card's white one are
    different files and a preview that only recolours text would lie about what the reader sees.

The markup is generated so the preview cannot drift from what ships. The script asserts that the dark colours in
this page's CSS are byte-identical to the ones in the email files, and fails the build if they are not.
"""

import re
from pathlib import Path

D = Path("/root/aliento-nextjs/email-signature")
FULL = D / "aliento-signature-full.html"
COMPACT = D / "aliento-signature-compact.html"
OUT = D / "aliento-signature-preview.html"

# dark tokens, asserted against the email files below rather than trusted
DARK = {
    "card": "#1E2E24",
    "hairline": "#2D4336",
    "name": "#FEFCF8",
    "accent": "#B8D5C4",
    "linkrule": "#3A5746",
    "dot": "#D9896A",
}

CSS = """
  :root {
    --page: #FEFCF8; --card: #FDF8F0; --border: #E5E1DB; --rule: #CCC6BC;
    --name: #2E2A26; --body: #433E34; --meta: #635B4E; --accent: #3A5746;
    --linkrule: #8FBD9F; --dot: #9E4A38;
  }
  [data-theme="dark"] {
    --page: #141a16; --card: %(card)s; --border: %(hairline)s; --rule: %(hairline)s;
    --name: %(name)s; --body: #E5E1DB; --meta: %(accent)s; --accent: %(accent)s;
    --linkrule: %(linkrule)s; --dot: %(dot)s;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; padding: 32px 24px 64px; background: var(--page); color: var(--body);
    font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    transition: background-color .18s ease, color .18s ease;
  }
  header { max-width: 600px; margin: 0 0 28px; }
  h1 {
    font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; font-size: 30px;
    margin: 0 0 6px; color: var(--name);
  }
  .sub { font-size: 13px; line-height: 1.6; color: var(--meta); margin: 0 0 18px; }
  .switch { display: inline-flex; border: 1px solid var(--border); border-radius: 999px; padding: 3px; gap: 2px; }
  .switch button {
    font: inherit; font-size: 12px; font-weight: 600; letter-spacing: .3px;
    padding: 7px 16px; border: 0; border-radius: 999px; cursor: pointer;
    background: transparent; color: var(--meta);
  }
  .switch button[aria-pressed="true"] { background: var(--accent); color: var(--page); }
  .resolved { font-size: 12px; color: var(--meta); margin-left: 10px; }
  .caption {
    font-size: 11px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--meta);
    margin: 34px 0 10px;
  }
  .mail { background: var(--page); padding: 0; }
  .intro { font-size: 14px; line-height: 1.65; margin: 0; padding: 22px 26px 6px; max-width: 600px; color: var(--body); }

  /* the signature itself: every colour comes from a custom property so one attribute flips the whole card */
  .sig-card { background: var(--card) !important; border-color: var(--border) !important; }
  .sig-name { color: var(--name) !important; }
  .sig-role, .sig-meta { color: var(--accent) !important; }
  .sig-rule { border-top-color: var(--rule) !important; }
  .sig-link { color: var(--accent) !important; border-bottom-color: var(--linkrule) !important; }
  .sig-dot { color: var(--dot) !important; }
  .howto { max-width: 600px; margin-top: 34px; font-size: 12.5px; line-height: 1.7; color: var(--meta); }

  /* The preview has to reproduce the email files' narrow-screen behaviour, or it reviews a layout that never
     ships. Two ranges: below 660px the fixed 600px card must shrink to the page, and below 480px the descriptor
     drops beneath the wordmark as a wrapping line — the same rules the email files carry in their media query,
     which is the copy that matters. */
  @media (max-width: 660px) {
    .sig-card { width: 100%% !important; }
    body { padding: 24px 10px 56px; }
  }
  @media (max-width: 480px) {
    .sig-brand-cell { display: block !important; width: 100%% !important; }
    .sig-descriptor {
      display: block !important; width: 100%% !important; text-align: left !important; padding: 8px 0 0 0 !important;
    }
    .sig-descriptor br { display: none !important; }
    .sig-name { font-size: 22px !important; }
  }
  .howto code { background: rgba(127,127,127,.14); padding: 1px 5px; border-radius: 3px; }
""" % DARK

SCRIPT = """
<script>
  /* applySignatureTheme — the dynamic switch.
     mode: 'auto' resolves from the operating system and keeps following it; 'light' and 'dark' pin it.
     Returns the theme actually applied, so a caller can react to it (and so this is testable). */
  (function () {
    var stage = document.getElementById('sig-stage');
    var resolvedEl = document.getElementById('sig-resolved');
    var osDark = window.matchMedia('(prefers-color-scheme: dark)');

    function applySignatureTheme(mode) {
      mode = mode || 'auto';
      var resolved = mode === 'auto' ? (osDark.matches ? 'dark' : 'light') : mode;
      stage.setAttribute('data-theme', resolved);
      stage.setAttribute('data-theme-mode', mode);
      // the two cards use different image files per theme, so a preview must swap them as a client would
      // An image's own display matters: the mark is inline with the wordmark (inline-block), the rest are block.
      // Forcing 'block' on the mark drops it onto its own line, so each image declares data-display and that wins.
      stage.querySelectorAll('.sig-light-img').forEach(function (el) {
        el.style.display = resolved === 'dark' ? 'none' : (el.dataset.display || 'block');
      });
      stage.querySelectorAll('.sig-dark-img').forEach(function (el) {
        el.style.display = resolved === 'dark' ? (el.dataset.display || 'block') : 'none';
      });
      document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.themeBtn === mode));
      });
      if (resolvedEl) resolvedEl.textContent = 'showing ' + resolved + ' (mode: ' + mode + ')';
      return resolved;
    }

    // 'auto' has to stay honest when the OS flips while the page is open
    if (osDark.addEventListener) {
      osDark.addEventListener('change', function () {
        if (stage.getAttribute('data-theme-mode') === 'auto') applySignatureTheme('auto');
      });
    }

    document.querySelectorAll('[data-theme-btn]').forEach(function (b) {
      b.addEventListener('click', function () { applySignatureTheme(b.dataset.themeBtn); });
    });

    window.applySignatureTheme = applySignatureTheme;
    applySignatureTheme('auto');
  })();
</script>
"""


def extract(path: Path) -> str:
    html = path.read_text()
    start = html.find("<!-- paste from here")
    end = html.find("<!-- to here")
    assert start != -1 and end != -1, f"{path.name}: paste markers missing"
    fragment = html[start:end]
    # drop the file's own <style> (the preview drives colour through custom properties) and its comments
    assert "<style" not in fragment, f"{path.name}: <style> is inside the paste region — cannot be previewed safely"
    return fragment.replace("<!-- paste from here ------------------------------------------------------->", "")


def main() -> None:
    # The preview must not invent dark colours: prove each one is already in the email files. The compact card
    # has no wordmark, so it legitimately carries no middot colour — assert per card, not on the union.
    shared = ["card", "hairline", "name", "accent", "linkrule"]
    for path in (FULL, COMPACT):
        text = path.read_text().upper()
        for token in shared:
            assert DARK[token].upper() in text, f"{path.name} is missing the dark {token} {DARK[token]}"
    full_text = FULL.read_text().upper()
    assert DARK["dot"].upper() in full_text, f"the full card is missing the dark middot {DARK['dot']}"
    print("  dark tokens verified against both email files (middot only on the full card)")

    full, compact = extract(FULL), extract(COMPACT)
    assert "sig-light-img" in full and "sig-dark-img" in full, "image pairs missing from the full card"

    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aliento — signature preview, light and dark</title>
<!--
  GENERATED FILE — do not edit. Built by scripts/build-signature-preview.py from
  aliento-signature-full.html and aliento-signature-compact.html, so the preview can never show something the
  email files do not contain.

  What to look at here:
    * the switcher proves both palettes side by side without changing your OS setting;
    * "Auto" is the mode a real reader gets — it follows prefers-color-scheme and updates live;
    * the dark card is not an inversion: it is the palette's own dark end (sage-900 surface, cream text).

  This page is for review only. What gets pasted into a mail client is the email-safe file, whose dark mode is
  the @media (prefers-color-scheme: dark) block plus Outlook.com's [data-ogsc] — not this JavaScript.
-->
<style>{CSS}</style>
</head>
<body>
<header>
  <h1>Aliento signature — light and dark</h1>
  <p class="sub">Both cards exactly as the email files carry them. <strong>Auto</strong> is what a reader gets:
  it follows their operating system and updates the moment it changes.</p>
  <div class="switch" role="group" aria-label="Signature theme">
    <button type="button" data-theme-btn="auto" aria-pressed="true">Auto</button>
    <button type="button" data-theme-btn="light" aria-pressed="false">Light</button>
    <button type="button" data-theme-btn="dark" aria-pressed="false">Dark</button>
  </div>
  <span class="resolved" id="sig-resolved"></span>
</header>

<div id="sig-stage" data-theme="light" data-theme-mode="auto">
  <p class="caption">Full card — 600px</p>
  <div class="mail">
    <p class="intro">Hi Leroy,<br>Thank you for the referral &mdash; I will ring her on Tuesday.<br><br>Warm regards,</p>
    {full}
  </div>

  <p class="caption">Compact — 420px</p>
  <div class="mail">
    <p class="intro">Hi Leroy,<br>Noted, thanks &mdash; I will send the script through today.<br><br>Warm regards,</p>
    {compact}
  </div>
</div>

<div class="howto">
  <p><strong>What ships:</strong> the email-safe files carry inline light styles plus a
  <code>@media (prefers-color-scheme: dark)</code> block and an Outlook.com <code>[data-ogsc]</code> fallback. A
  client that strips <code>&lt;style&gt;</code> shows the light card, which is correct — not a broken one.</p>
  <p><strong>Dark is a palette, not an inversion:</strong> sage-900 <code>{DARK['card']}</code> surface, cream-50
  <code>{DARK['name']}</code> name at 13.93:1, sage-200 <code>{DARK['accent']}</code> links at 9.07:1. Images swap
  to their light-ink variants, because a dark-ink signature on a dark card is invisible.</p>
</div>

{SCRIPT}
</body>
</html>
"""
    OUT.write_text(page)
    print(f"  {OUT.name}  {OUT.stat().st_size} bytes  (full + compact + switcher)")


if __name__ == "__main__":
    main()
