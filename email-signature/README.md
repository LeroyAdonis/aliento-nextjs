# Aliento Email Signature Variants

Three HTML signature variants for Dr Leegale Franscesca Adonis, Public Health Medicine Specialist at Aliento Health.

## Installation

### Gmail
1. Open the variant HTML file in a web browser (e.g., Chrome, Firefox).
2. Press `Ctrl+A` then `Ctrl+C` to copy the rendered signature (not the source code).
3. In Gmail, go to Settings → See all settings → General → Signature.
4. Click the signature box and press `Ctrl+V` to paste.
5. Scroll down and click Save Changes.

### Outlook Desktop
1. Open the variant HTML file in a web browser.
2. Press `Ctrl+A` then `Ctrl+C` to copy the rendered signature.
3. In Outlook, go to File → Options → Mail → Signatures…
4. Choose New, give it a name, and in the edit box press `Ctrl+V` to paste.
5. Click OK to save.

> **Important:** Pasting from the browser preserves the inline styles. Copying directly from the HTML source will lose styling.

## Updating Contact Details

If the phone number, title, or email changes, edit the visible text in the HTML file, and edit the
**plain-text fallback comment at the top of the file to match** — the comment is what a recipient reads when
their client blocks the block, so a stale comment is a wrong phone number in the wild.

### Moving the images to her own domain

The images currently point at `https://zahra.digitalwavetech.dev/email/aliento/` (live, verified 200
`image/png`) so the variants could be reviewed before her site was touched. For the final version they should
live on `https://alientomd.com/email/` — same filenames, so it is one find-and-replace of the host across the
three files, and nothing else in them references an image.

Source assets are `public/logo-icon.svg`, `public/logo-icon-white.svg`, `public/dr-leegale-signature.svg` and
`scripts/render-email-images.py` regenerates the PNGs from them. Those SVGs **cannot** be used in email
directly: Gmail strips `.svg` from `img src` and Outlook shows a broken-image box. Always render to PNG first.

### What was verified, and what was not

Rendered and inspected in a browser at 2x: all three variants load every image, nothing clips, the name and
title are legible. **No mail client was available to test in**, so the Outlook- and Gmail-specific claims here
rest on the markup rules followed (tables, inline CSS, no SVG, no webfonts, cell-held padding, a spacer with a
line-height for the 4px bar) rather than on an observed render. Paste it into Gmail once and check the images
come through before sending it to a patient.

---

## The DNA set — `aliento-signature-full.html`, `-compact.html`, `aliento-canvas.html`

Built after Leroy's verdict on the Digital Wave Tech signature: *"that design was Chef's kiss"*. The DWT files
(`/root/dwt-site/repo/public/email-signature*.html`) are the reference for **structure**, and the rules they
embody are written down in the `html-email-design` skill at `references/dwt-signature-dna.md`. The `variant-1/2/3`
files at the top of this README are kept for comparison; **this set supersedes them**.

| File | What it is | Use it when |
|---|---|---|
| `aliento-signature-full.html` | 600px cream card, email-safe HTML, selectable text | Everyday mail, replies, first contact |
| `aliento-signature-compact.html` | 420px, no mark, no handwritten signature, two contact routes | Mid-thread replies where the full card is rude |
| `aliento-canvas.html` | Design canvas, real fonts, both cards, with PNG-export steps | A brochure, a PDF, a printed card, or an image signature |

### Which tokens, and the trap that wasted a round

The first version of this set was styled from `src/lib/design-system.ts` — blue `#1a73e8`, teal `#0d9488`, navy
`#1e2a5e`. **Nothing imports that file.** It is dead, and the palette it describes has not been the site's for a
long time. The live tokens are the `@theme` block in `src/app/globals.css`, and the site's rendered palette is:

| Role | Token | Value | Contrast on the card |
|---|---|---|---|
| Card surface | `cream-100` | `#FDF8F0` | — |
| Page surface | `cream-50` | `#FEFCF8` | — |
| Name (display serif) | `warm-900` | `#2E2A26` | 13.46:1 |
| Descriptor | `warm-600` | `#635B4E` | 6.33:1 |
| Title, links, icons | `sage-700` | `#3A5746` | 7.55:1 |
| Wordmark accent | `blush-800` | `#9E4A38` | 5.69:1 |
| Card border | `warm-200` | `#E5E1DB` | decoration |
| Hairline | `warm-300` | `#CCC6BC` | decoration |
| Link underline | `sage-300` | `#8FBD9F` | decoration |

`warm-500 #857A6A` is 3.98:1 on this card — AA-large only — so it is not used for small text anywhere in the set.

**Type.** Display is **Instrument Serif**, body is **Satoshi**. Neither is available in a mail client, so the
email-safe files declare `'Instrument Serif', Georgia, 'Times New Roman', serif` and the system UI sans — Georgia
is the closest built-in and exists on Windows, macOS, iOS and Android. The canvas file loads the real faces
(Google Fonts + Fontshare), which is most of why the canvas looks better than the paste-in version.

### The structure it borrows from DWT

One surface rather than white-with-a-border; two type voices; a hairline rule between brand and person; contact
as three icon rows, never a run-on line; a two-tone wordmark (name + a blush middot); a full and a compact
version. There is **no tagline** — Aliento has no verified one, and the line under the wordmark is the site's own
copy ("Preventive Care & Virtual Consultations"), not new copy.

### Assets

`scripts/render-dark-signature-assets.py` generates the icon set in both brand accents: `icon-mail/phone/globe
-sage.png` (stroke `sage-700`, used by these cards) and the older teal set. Icons are deliberately **not**
ink-tight — a glyph needs breathing room inside its artboard, and the row aligns on the box; the script asserts
the three left insets agree to within a pixel so the column cannot go ragged. `leegale-signature-white.png` (the
ink recoloured to white) belongs to the retired navy card and is not referenced here — the cream cards use the
original dark-ink `leegale-signature.png`.

Emoji were not used for icons on purpose: `✉ ☎ ⌂` render as colour emoji in several clients, and the DWT repo's
own gate fails any file containing an emoji.

### Verified

Rendered at 600px and 420px on the site's own cream-50 page: card backgrounds `rgb(253,248,240)` with a
`1px rgb(229,225,219)` border, no broken images, every image on one left edge (26px padding) and all contact
links sharing one offset (55px = 26 + 16 icon + 12 gap), link computed style `rgb(58,87,70)` with a
`1px rgb(143,189,159)` underline, name computed as the serif stack at 26px in `rgb(46,42,38)`. **Not tested in a
live mail client** — paste it into Gmail once and confirm the four images come through before sending it to a
patient.


---

## Dark mode, and the switch

Leroy, 2026-10-19: *"create a darkmode version and a function that will switch them dynamically."* There was
nothing to borrow from DWT — its five signature files contain **zero** `prefers-color-scheme` rules and no
`data-ogsc` handling, so the DWT reference gave the light signature only.

### What ships in the email files

| Mechanism | Covers | Why both |
|---|---|---|
| `@media (prefers-color-scheme: dark)` | Apple Mail (macOS/iOS), Gmail apps, Thunderbird, most webmail | The standard signal |
| `[data-ogsc]` / `[data-ogsb]` | Outlook.com | It runs its own inversion and ignores the media query; it stamps those attributes on `<html>` |
| `<meta name="color-scheme" content="light dark">` + `supported-color-schemes` | Gmail, Apple Mail | Tells a client we support dark, so it uses our block instead of guessing |

**This is the one deliberate exception to the "inline styles only" rule** in the `html-email-design` skill: a
dark-mode switch cannot be expressed in inline styles. Both email files therefore keep every light style inline
(so a client that strips `<style>` renders the correct light card) and add exactly one `<style>` block for the
dark overrides. The rule in the skill now names this exception rather than being quietly broken.

**Dark is a palette, not an inversion:** sage-900 `#1E2E24` surface, border/hairline `#2D4336`, name cream-50
`#FEFCF8` at **13.93:1**, descriptor and links sage-200 `#B8D5C4` at **9.07:1**, middot blush-600 `#D9896A` at
**5.26:1**. Every value is a token the brand already owns.

**Images swap, because they have to.** A dark-ink signature and a sage mark are invisible on a dark card, so both
variants ship in the markup — the dark one hidden by an inline `display:none`, revealed by the media query with
`!important`. Both email files use `aliento-mark-white.png`, `leegale-signature-white.png` and
`icon-*-dark.png` in dark mode.

### The dynamic switch — `aliento-signature-preview.html`

Generated by `scripts/build-signature-preview.py` from the two email files (markup is extracted, never retyped,
and the script asserts the dark hexes match the email files), so the preview cannot show something the email does
not contain. It exposes:

```js
applySignatureTheme('auto' | 'light' | 'dark')   // -> 'light' | 'dark' actually applied
```

`'auto'` resolves from `matchMedia('(prefers-color-scheme: dark)')` and keeps following the OS while selected; the
function also swaps the image pair, so the preview shows what a reader would see rather than a recoloured
approximation of it. A button bar calls it, and it is on `window` so it can be driven from a console or a test.

Live for review: `https://zahra.digitalwavetech.dev/email/aliento/aliento-signature-preview.html`

### Verified, and what is still unverified

- The shipped file, loaded with the OS emulated as **dark**: card `rgb(30,46,36)`, border `rgb(45,67,54)`, name
  `rgb(254,252,248)`, links `rgb(184,213,196)`, and only the light-ink images visible. Emulated back to **light**:
  cream `rgb(253,248,240)` and the dark-ink images. Both directions measured in a browser, not assumed.
- The switcher: `light` → cream + dark-ink assets; `dark` → sage-900 + light-ink assets; `auto` → follows the OS
  (light on this box). Image counts flip 5↔5 with none left visible from the other theme.
- Test email sent to Leroy (`1a1541ec86f4c883`): both cards in one message, 10 images, 0 broken, 0 bounces,
  `SENT` + `INBOX` labels confirmed on read-back.
- **Not verified: Outlook desktop and Gmail's own dark mode.** The `[data-ogsc]` rules follow the documented
  pattern but no client here renders them, so treat Outlook dark as untested until a screenshot proves it.


---

## Narrow screens — the descriptor wraps, it does not squeeze

Leroy, 2026-10-19: *"can we get the text after the logo to wrap on smaller screens."* It could not, and the reason
was structural rather than a missing wrap rule: the wordmark and the descriptor were **two cells in one table
row**, and two `<td>`s can only stack as blocks — so on a narrow screen the descriptor was either crushed into a
narrow column beside the name or pushed past the card edge.

The fix moves the mark **inline with the wordmark** (inside the same cell, `display:inline-block`,
`vertical-align:middle`, 10px right margin). Desktop geometry is unchanged — the mark is still 20px wide with a
10px gap, so the wordmark starts 30px in, measured identical before and after. What it buys is that the row now
has only two cells, so the descriptor can become a block of its own and wrap as a normal line.

```css
@media (max-width: 480px) {
  .sig-card { width: 100% !important; }
  .sig-brand-cell { display: block !important; width: 100% !important; }
  .sig-descriptor { display: block !important; width: 100% !important; text-align: left !important;
                    padding: 8px 0 0 0 !important; }
  .sig-descriptor br { display: none !important; }   /* the hard break is for the two-line desktop column only */
}
```

Measured at five widths, `document.scrollWidth` against the viewport in every case — **no sideways scroll at 640,
600, 470, 380 or 320px**:

| Width | Card | Descriptor | Lines |
|---|---|---|---|
| 600px | 600 | beside the wordmark, right-aligned, left edge 230px | 2 (forced) |
| 470px | 470 | below the wordmark, left, 27px | 1, wrapping |
| 380px | 380 | below, 27px | 1, wrapping |
| 320px | 320 | below, 27px, width 266px | **2, wrapping** |

Two consequences worth knowing:

- **An inline image cannot be revealed with `display:block`.** The dark-mode rule that shows the white mark would
  have dropped it onto its own line, so the mark carries `data-display="inline-block"` and the dark rules use
  `.sig-dark-img.sig-inline-img { display:inline-block !important }`. The preview's switch reads `data-display`
  for the same reason, and the test-email generator restores `inline-block` for the mark rather than `block`.
- **The compact card needed the same treatment** — a fixed 420px card does not shrink on a 320px viewport, it
  overflows. It takes the full width below 480px and steps the serif name down to 19px so it can wrap.

The preview page reproduces both ranges (below 660px the card fits the page; below 480px the descriptor drops),
because a review page that does not wrap is reviewing a layout that never ships.
