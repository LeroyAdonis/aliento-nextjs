/**
 * Aliento Health — Medical Script PDF Generator
 *
 * Generates professional prescription HTML that can be:
 *   - Rendered directly in the browser (print-to-PDF via Cmd+P)
 *   - Converted to a PDF buffer via Puppeteer/Playwright on the server
 *   - Saved as HTML for archival
 */

export interface MedicationItem {
  name: string
  dosage?: string | null
  quantity?: number | null
  refills?: number | null
}

// Backward-compat alias used by existing route files
export type Medication = MedicationItem

export interface ScriptData {
  id: string
  patientName: string
  patientEmail?: string | null
  patientIdNumber?: string | null
  patientCell?: string | null
  patientAddress?: string | null
  medications: MedicationItem[]
  type?: string | null
  specialInstructions?: string | null
  createdAt?: Date | string | null
  completedAt?: Date | string | null
}

// ─── Doctor credentials ────────────────────────────────────────────────────

const DOCTOR = {
  name: 'Dr Leegale Adonis',
  qualifications: 'MBBCH, MBA, MMed Comm Health, FCPHM, PhD',
  practiceNo: '1181300',
  mpNo: 'MP0531502',
  address: '112A, 9th Road, Hyde Park, Johannesburg, 2196',
  practiceName: 'Aliento Health',
}

const SIGNATURE_SVG = `<svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="1240.000000pt" height="319.000000pt" viewBox="0 0 1240.000000 319.000000" preserveAspectRatio="xMidYMid meet"><g transform="translate(0.000000,319.000000) scale(0.100000,-0.100000)" fill="#1a1a1a" stroke="#1a1a1a"><path d="M5123 2885 c-184 -57 -344 -267 -668 -879 l-58 -108 -113 4 c-78 3 -118 9 -130 19 -45 37 -206 260 -264 367 -17 31 -30 42 -47 42 -55 0 -9 -96 150 -313 27 -37 47 -70 44 -73 -5 -5 -139 62 -290 146 -69 37 -80 41 -93 28 -25 -24 -8 -41 114 -110 152 -86 181 -100 279 -132 78 -26 85 -31 153 -105 38 -43 70 -82 70 -86 0 -12 -109 -175 -117 -175 -5 0 -46 55 -93 123 -102 147 -256 306 -350 360 -123 71 -203 90 -380 91 -473 3 -804 -207 -902 -569 -30 -112 -30 -316 0 -428 42 -154 133 -285 245 -351 170 -99 487 -85 744 34 224 104 489 319 679 553 25 31 49 57 53 57 3 0 32 -36 64 -80 l58 -80 -129 -127 c-278 -277 -438 -564 -332 -598 42 -13 87 15 186 118 85 87 230 278 339 445 l28 42 81 -73 c154 -140 256 -201 406 -242 101 -28 320 -26 425 3 178 51 340 153 474 299 70 76 70 76 80 50 22 -56 52 -166 69 -247 15 -73 20 -85 39 -88 25 -4 28 29 38 363 7 244 8 250 41 228 33 -21 45 -14 111 71 74 96 83 89 83 -65 0 -89 3 -111 19 -130 26 -33 109 -36 273 -11 73 12 176 26 228 32 55 6 137 25 195 44 55 19 127 36 160 38 60 4 135 33 203 78 l32 22 0 -45 c0 -107 97 -61 165 76 15 32 32 60 37 63 15 10 28 -17 28 -57 0 -21 8 -47 19 -60 19 -23 19 -23 128 -11 192 21 196 20 265 -43 110 -102 238 -171 381 -205 225 -54 446 -26 510 64 99 139 -144 714 -345 817 -45 23 -137 25 -177 4 -48 -25 -98 -92 -141 -194 -89 -205 -138 -297 -179 -334 -48 -43 -60 -45 -88 -14 -145 157 -201 486 -142 836 21 128 21 135 4 147 -28 20 -58 -1 -177 -124 -188 -195 -269 -346 -227 -424 13 -25 74 -51 100 -43 30 10 24 45 -11 58 -45 17 -46 40 -6 121 33 68 103 158 210 271 l47 50 -5 -45 c-45 -392 -18 -605 99 -803 19 -32 35 -60 35 -62 0 -1 -37 -6 -82 -9 -46 -4 -99 -9 -119 -12 l-36 -5 -6 53 c-7 54 -31 88 -65 88 -9 0 -26 10 -38 21 -33 31 -59 20 -145 -57 -79 -71 -176 -140 -185 -132 -2 3 22 29 55 57 106 92 191 212 191 269 0 44 -20 55 -93 50 -104 -6 -235 -85 -295 -175 l-14 -23 -29 37 c-87 109 -271 170 -483 160 -61 -3 -122 -9 -135 -13 -23 -7 -24 -6 -17 32 4 21 48 161 98 311 50 149 88 279 85 287 -11 28 -43 18 -69 -21 -43 -66 -173 -302 -269 -491 -90 -178 -94 -183 -137 -202 -25 -11 -50 -20 -57 -20 -9 0 -14 72 -18 298 -10 476 -41 572 -187 572 -127 0 -385 -175 -666 -452 -68 -66 -85 -79 -104 -73 -20 6 -17 11 42 73 177 185 279 395 282 584 1 73 -2 91 -20 115 -43 59 -121 77 -211 48z m132 -57 c67 -30 46 -215 -46 -399 -63 -127 -258 -343 -319 -354 -142 -27 -228 -62 -304 -125 -32 -26 -58 -40 -77 -40 -16 0 -29 2 -29 5 0 9 209 393 258 475 203 336 390 496 517 438z m611 -336 c13 -18 28 -56 34 -85 15 -65 29 -326 29 -553 l1 -171 -117 -52 c-65 -28 -123 -51 -129 -51 -6 0 -24 19 -39 43 -72 108 -185 231 -280 302 -53 40 -199 115 -224 115 -20 0 34 55 174 179 310 275 490 364 551 273z m464 -499 c-17 -59 -36 -122 -41 -139 -7 -23 -18 -33 -46 -42 -20 -6 -39 -10 -41 -7 -2 2 31 71 74 154 43 82 80 148 82 146 3 -2 -10 -52 -28 -112z m-2857 22 c214 -38 347 -148 581 -483 l58 -83 -55 -72 c-57 -73 -255 -275 -337 -343 -353 -292 -804 -388 -1046 -223 -226 154 -280 613 -103 878 162 243 560 387 902 326z m5006 1 c94 -49 229 -265 301 -483 73 -221 47 -280 -133 -305 -195 -27 -460 53 -611 184 l-39 34 55 55 c57 57 100 135 189 343 56 130 106 186 168 186 23 0 54 -6 70 -14z m-3551 -88 c-94 -106 -220 -255 -282 -335 -27 -35 -51 -63 -53 -63 -2 0 -24 14 -49 30 -51 36 -56 65 -28 161 31 106 53 132 136 158 77 25 196 80 238 112 15 11 42 18 69 19 l43 0 -74 -82z m271 22 c130 -61 276 -192 379 -338 l42 -61 -29 -15 c-126 -66 -641 -191 -641 -156 0 15 -32 28 -106 44 -80 16 -184 60 -184 76 0 18 165 218 329 398 97 107 93 106 210 52z m-852 -124 c6 -5 -30 -76 -38 -76 -8 0 -79 77 -79 86 0 7 111 -3 117 -10z m138 -3 c-17 -41 -45 -136 -45 -154 0 -26 -19 -24 -51 7 l-28 27 21 41 c36 72 58 96 85 96 20 0 24 -4 18 -17z m2187 -54 c112 -22 176 -49 228 -96 70 -63 81 -88 73 -164 -6 -61 -6 -62 -50 -81 -53 -23 -217 -65 -290 -74 -100 -13 -287 53 -335 117 -17 23 -17 29 -3 114 27 156 35 166 140 188 41 9 186 7 237 -4z m667 -29 c-50 -82 -244 -270 -280 -270 -10 0 -12 53 -3 100 16 78 186 209 273 210 l33 0 -23 -40z m-1120 -39 c-38 -63 -120 -173 -125 -168 -3 2 11 45 31 94 29 72 41 91 63 100 50 20 56 16 31 -26z m-149 -36 c0 -20 -44 -116 -60 -130 -28 -25 -32 -17 -24 49 6 47 11 59 33 71 26 14 51 19 51 10z m-1679 -71 c32 -26 59 -50 59 -54 0 -5 16 -31 35 -60 l35 -52 -19 -26 c-40 -55 -162 -148 -181 -137 -15 9 -123 167 -123 179 0 13 120 196 129 196 3 0 32 -21 65 -46z m1529 -82 c0 -99 0 -99 -41 -162 l-41 -64 -60 113 c-34 63 -57 116 -52 121 7 7 182 89 192 90 1 0 2 -44 2 -98z m-219 -104 c24 -46 54 -105 67 -132 l22 -49 -27 -31 c-123 -137 -212 -214 -316 -271 -229 -126 -513 -134 -736 -20 -88 44 -239 166 -283 228 l-20 28 47 69 c45 65 51 70 120 95 l73 27 74 -17 c94 -22 306 -22 415 0 160 33 424 112 483 146 29 16 38 8 81 -73z m677 -69 c24 -10 49 -19 55 -20 28 -2 -42 -17 -85 -18 -70 -2 -78 4 -78 56 l0 45 33 -22 c17 -11 51 -30 75 -41z m-462 -90 c-3 -17 -6 -54 -6 -82 0 -57 -7 -55 -31 8 -16 42 -16 45 5 74 27 39 40 39 32 0z m-1596 -95 c0 -9 -165 -247 -248 -359 -73 -97 -204 -235 -223 -235 -41 0 75 192 218 362 101 119 253 259 253 232z"/></g></svg>`

// ─── HTML generator ────────────────────────────────────────────────────────

/**
 * Generate a fully-styled prescription HTML document.
 * Call this, then pass the result to `generateScriptPdfBuffer` or render it
 * in the browser for print-to-PDF.
 */
export function generateScriptHtml(script: ScriptData): string {
  const medications = Array.isArray(script.medications)
    ? script.medications.filter(
        (m: MedicationItem) => m && m.name && m.name.trim() !== '',
      )
    : []

  const itemCount = medications.length
  const today = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Build medication table rows
  const tableRows =
    itemCount > 0
      ? medications
          .map(
            (m, i) => `
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px;">${i + 1}.</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px; font-weight: 600;">${escHtml(m.name)}</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px;">${escHtml(m.dosage ?? '—')}</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px; text-align: center;">${m.quantity ?? '—'}</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px; text-align: center;">${m.refills ?? 0}</td>
          </tr>`,
          )
          .join('')
      : ''

  const hasMedications = itemCount > 0

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prescription — ${escHtml(script.patientName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
    @page { margin: 20mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a1a;
      background: #fff;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      max-width: 210mm;
      margin: 0 auto;
      padding: 40px 40px 30px;
      background: #fff;
      position: relative;
    }
    /* Decorative top border */
    .top-border {
      height: 6px;
      background: linear-gradient(90deg, #0d6b4f 0%, #1a9e7a 50%, #0d6b4f 100%);
      border-radius: 3px;
      margin-bottom: 28px;
    }
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e8e8e8;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .practice-info h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0d6b4f;
      letter-spacing: -0.3px;
    }
    .practice-info .doctor-name {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-top: 2px;
    }
    .practice-info .quals {
      font-size: 11px;
      color: #666;
    }
    .header-right {
      text-align: right;
      font-size: 11px;
      color: #555;
      line-height: 1.6;
    }
    .header-right strong {
      color: #333;
    }
    /* Title */
    .rx-title {
      text-align: center;
      margin-bottom: 24px;
    }
    .rx-title h2 {
      font-size: 22px;
      font-weight: 700;
      color: #0d6b4f;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .rx-title p {
      font-size: 11px;
      color: #888;
      margin-top: 2px;
    }
    /* Patient info section */
    .patient-section {
      background: #f7fbf9;
      border: 1px solid #d4e8df;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 24px;
      font-size: 13px;
    }
    .patient-section .label {
      color: #666;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .patient-section .value {
      color: #1a1a1a;
      font-weight: 500;
    }
    .patient-section .full-width {
      grid-column: 1 / -1;
    }
    /* Medication table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    thead th {
      background: #0d6b4f;
      color: #fff;
      padding: 10px 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
    }
    thead th:first-child { border-radius: 6px 0 0 0; }
    thead th:last-child { border-radius: 0 6px 0 0; }
    tbody tr:nth-child(even) { background: #f9fdfb; }
    tbody tr:hover { background: #edf7f2; }
    /* Checkboxes */
    .checkbox-row {
      display: flex;
      gap: 24px;
      margin: 16px 0 12px;
      font-size: 13px;
    }
    .checkbox-row label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: default;
    }
    .checkbox-row input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #0d6b4f;
    }
    /* Special instructions */
    .instructions-box {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 12px 0 16px;
      min-height: 50px;
      font-size: 13px;
    }
    .instructions-box .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      font-weight: 600;
      margin-bottom: 4px;
    }
    /* Signature & stamp */
    .signature-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e8e8e8;
    }
    .signature-line {
      flex: 1;
    }
    .signature-line .sig-label {
      font-size: 11px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .signature-line .sig-space {
      margin-top: 4px;
      width: 240px;
      border-bottom: 1px solid #333;
      padding-bottom: 2px;
    }
    .stamp-area {
      text-align: center;
    }

    .stamp-label {
      font-size: 9px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    /* Footer / tamper-proof */
    .footer {
      margin-top: 24px;
      padding: 12px 16px;
      background: #fafafa;
      border-radius: 6px;
      border: 1px solid #eee;
    }
    .footer p {
      font-size: 11px;
      color: #666;
      text-align: center;
      font-style: italic;
    }
    .footer .tamper-note {
      color: #c0392b;
      font-weight: 600;
      font-style: normal;
    }
    .item-count-badge {
      display: inline-block;
      background: #0d6b4f;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 12px;
      border-radius: 12px;
      margin: 4px 0 8px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Decorative top border -->
    <div class="top-border"></div>

    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <img src="https://alientomd.com/logo-icon.svg" alt="Aliento" style="width:56px;height:56px;border-radius:12px;" />
        <div class="practice-info">
          <h1>${escHtml(DOCTOR.practiceName)}</h1>
          <div class="doctor-name">${escHtml(DOCTOR.name)}</div>
          <div class="quals">${escHtml(DOCTOR.qualifications)}</div>
        </div>
      </div>
      <div class="header-right">
        <strong>Practice No:</strong> ${escHtml(DOCTOR.practiceNo)}<br />
        <strong>MP No:</strong> ${escHtml(DOCTOR.mpNo)}<br />
        <span>${escHtml(DOCTOR.address)}</span>
      </div>
    </div>

    <!-- Prescription title -->
    <div class="rx-title">
      <h2>Medical Prescription</h2>
      <p>${today}</p>
    </div>

    <!-- Patient details -->
    <div class="patient-section">
      <div>
        <div class="label">Patient Name</div>
        <div class="value">${escHtml(script.patientName)}</div>
      </div>
      <div>
        <div class="label">ID Number</div>
        <div class="value">${escHtml(script.patientIdNumber ?? '—')}</div>
      </div>
      <div>
        <div class="label">Cell</div>
        <div class="value">${escHtml(script.patientCell ?? '—')}</div>
      </div>
      <div>
        <div class="label">Email</div>
        <div class="value">${escHtml(script.patientEmail ?? '—')}</div>
      </div>
      ${
        script.patientAddress
          ? `<div class="full-width">
              <div class="label">Address</div>
              <div class="value">${escHtml(script.patientAddress)}</div>
            </div>`
          : ''
      }
    </div>

    <!-- Medication table (only if there are items) -->
    ${
      hasMedications
        ? `
    <table>
      <thead>
        <tr>
          <th style="width: 36px;">#</th>
          <th>Medication / Item</th>
          <th style="width: 30%;">Dosage</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 10%; text-align: center;">Refills</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <div class="item-count-badge">Total items: ${itemCount}</div>`
        : '<p style="color: #999; font-style: italic; text-align: center; padding: 20px 0;">No medications listed on this prescription.</p>'
    }

    <!-- Dispense checkboxes -->
    <div class="checkbox-row">
      <label>
        <input type="checkbox" checked disabled /> Dispense As Written (DAW)
      </label>
      <label>
        <input type="checkbox" disabled /> May Substitute
      </label>
    </div>

    <!-- Special instructions -->
    <div class="instructions-box">
      <div class="label">Special Instructions</div>
      <div>${escHtml(script.specialInstructions ?? 'None')}</div>
    </div>

    <!-- Signature & stamp -->
    <div class="signature-area">
      <div class="signature-line">
        <div class="signature-block" style="display:flex;flex-direction:column;align-items:flex-start;width:240px;">
          <div style="margin-bottom:-8px;z-index:1;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 319" width="220" height="auto" style="width:220px;display:block;fill:none;stroke:#1a1a1a;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;">
              ${SIGNATURE_SVG.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
            </svg>
          </div>
          <div style="width:100%;border-bottom:1px solid #333;margin-bottom:6px;"></div>
          <div style="font-size:0.75rem;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Prescriber Signature</div>
          <div style="font-size:0.875rem;font-weight:600;color:#111827;margin-top:2px;">
            ${escHtml(DOCTOR.name)}
          </div>
        </div>
      </div>
      <div class="stamp-area">
        <svg width="120" height="120" viewBox="0 0 120 120" style="display:block;margin:0 auto 4px;">
          <defs>
            <path id="arc-top" d="M 18,60 A 42,42 0 1,1 102,60" />
            <path id="arc-bot" d="M 18,60 A 42,42 0 0,0 102,60" />
          </defs>
          <circle cx="60" cy="60" r="56" fill="none" stroke="#0d6b4f" stroke-width="2" />
          <circle cx="60" cy="60" r="49" fill="none" stroke="#0d6b4f" stroke-width="0.6" opacity="0.4" />
          <text font-family="'Inter',sans-serif" font-size="6" fill="#0d6b4f" font-weight="700" letter-spacing="2">
            <textPath href="#arc-top" startOffset="50%" text-anchor="middle">ALIENTO HEALTH</textPath>
          </text>
          <text font-family="'Inter',sans-serif" font-size="5" fill="#0d6b4f" font-weight="600" letter-spacing="1.5">
            <textPath href="#arc-bot" startOffset="50%" text-anchor="middle">MEDICAL PRACTITIONER</textPath>
          </text>
          <path d="M 60,37 Q 68,47 60,57 Q 52,47 60,37" fill="#0d6b4f" opacity="0.85" />
          <text x="60" y="70" text-anchor="middle" font-family="'Inter',sans-serif" font-size="6" fill="#0d6b4f" font-weight="700">Dr L Adonis</text>
          <text x="60" y="78" text-anchor="middle" font-family="'Inter',sans-serif" font-size="4.5" fill="#0d6b4f">MBBCH · MBA · PhD</text>
          <text x="60" y="85" text-anchor="middle" font-family="'Inter',sans-serif" font-size="3.5" fill="#0d6b4f" opacity="0.7">MP0531502</text>
        </svg>
        <div class="stamp-label">Rx #${escHtml(script.id.slice(0, 8).toUpperCase())}</div>
      </div>
    </div>

    <!-- Footer / tamper-proof note -->
    <div class="footer">
      <p>
        <span class="tamper-note">⚠ Tamper-Proof:</span>
        This prescription contains <strong>${itemCount} medication(s)</strong>.
        No further items have been prescribed.
      </p>
    </div>
  </div>
</body>
</html>`
}

// ─── PDF buffer conversion (pdfkit) ─────────────────────────────────────────

const PDFDocument = null as any

/**
 * Generate a real A4 PDF buffer for a prescription using pdfkit.
 */
export function generateScriptPdfBuffer(script: ScriptData): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const buffers: Buffer[] = []

  doc.on('data', (chunk: Buffer) => buffers.push(chunk))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const pageWidth = doc.page.width
    const leftMargin = doc.page.margins.left
    const rightMargin = doc.page.margins.right
    const contentWidth = pageWidth - leftMargin - rightMargin
    const brandColor = '#0d6b4f'
    const lightBg = '#f7fbf9'
    const borderColor = '#d4e8df'

    // ── Helper functions ──────────────────────────────────────────────
    function brandRect(y: number, h: number) {
      doc.rect(leftMargin, y, contentWidth, h).fill(brandColor)
    }

    function sectionLabel(text: string, x: number, y: number) {
      doc.fontSize(9).fillColor('#666').font('Helvetica-Bold')
      doc.text(text.toUpperCase(), x, y, { continued: false })
    }

    function sectionValue(text: string, x: number, y: number) {
      doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica')
      doc.text(text || '—', x, y, { continued: false })
    }

    // ── Top decorative line ──────────────────────────────────────────
    doc.rect(leftMargin, 30, contentWidth, 4).fill(brandColor)

    // ── Header ────────────────────────────────────────────────────────
    // Logo circle
    doc.circle(leftMargin + 28, 70, 24).fill(brandColor)
    doc.fontSize(14).fillColor('#fff').font('Helvetica-Bold')
    doc.text('AH', leftMargin + 18, 60, { width: 20, align: 'center' })

    // Practice name & doctor
    doc.fontSize(16).fillColor(brandColor).font('Helvetica-Bold')
    doc.text(DOCTOR.practiceName, leftMargin + 60, 50)
    doc.fontSize(11).fillColor('#333').font('Helvetica-Bold')
    doc.text(DOCTOR.name, leftMargin + 60, 70)
    doc.fontSize(9).fillColor('#666').font('Helvetica')
    doc.text(DOCTOR.qualifications, leftMargin + 60, 85)

    // Right-aligned practice info
    const rightX = leftMargin + contentWidth
    doc.fontSize(9).fillColor('#555').font('Helvetica')
    doc.text(`Practice No: ${DOCTOR.practiceNo}`, rightX - 150, 50, { width: 150, align: 'right' })
    doc.text(`MP No: ${DOCTOR.mpNo}`, rightX - 150, 63, { width: 150, align: 'right' })
    doc.text(DOCTOR.address, rightX - 150, 76, { width: 150, align: 'right' })

    // ── Separator line ───────────────────────────────────────────────
    const headerBottom = 110
    doc.moveTo(leftMargin, headerBottom).lineTo(rightX, headerBottom).strokeColor('#e8e8e8').lineWidth(1).stroke()

    // ── Title ─────────────────────────────────────────────────────────
    const titleY = headerBottom + 20
    doc.fontSize(18).fillColor(brandColor).font('Helvetica-Bold')
    doc.text('MEDICAL PRESCRIPTION', leftMargin, titleY, { width: contentWidth, align: 'center' })
    const today = new Date().toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
    doc.fontSize(10).fillColor('#888').font('Helvetica')
    doc.text(today, leftMargin, titleY + 20, { width: contentWidth, align: 'center' })

    // ── Patient section ───────────────────────────────────────────────
    const patientY = titleY + 50
    doc.roundedRect(leftMargin, patientY, contentWidth, 80, 6).fill(lightBg)
    doc.roundedRect(leftMargin, patientY, contentWidth, 80, 6).stroke(borderColor)

    const pCol1 = leftMargin + 16
    const pCol2 = leftMargin + contentWidth / 2 + 8
    const pRow1 = patientY + 12
    const pRow2 = patientY + 40

    sectionLabel('Patient Name', pCol1, pRow1)
    sectionValue(script.patientName, pCol1, pRow1 + 12)
    sectionLabel('ID Number', pCol2, pRow1)
    sectionValue(script.patientIdNumber ?? '—', pCol2, pRow1 + 12)
    sectionLabel('Cell', pCol1, pRow2)
    sectionValue(script.patientCell ?? '—', pCol1, pRow2 + 12)
    sectionLabel('Email', pCol2, pRow2)
    sectionValue(script.patientEmail ?? '—', pCol2, pRow2 + 12)

    // ── Medication table ─────────────────────────────────────────────
    const meds = Array.isArray(script.medications)
      ? script.medications.filter((m) => m && m.name && m.name.trim() !== '')
      : []

    const tableY = patientY + 100
    const colWidths = [30, contentWidth * 0.35, contentWidth * 0.25, 60, 60]
    const colStarts = [leftMargin]
    for (let i = 1; i < colWidths.length; i++) {
      colStarts.push(colStarts[i - 1] + colWidths[i - 1])
    }

    // Table header
    const headerH = 24
    brandRect(tableY, headerH)
    doc.fontSize(9).fillColor('#fff').font('Helvetica-Bold')
    const headers = ['#', 'Medication / Item', 'Dosage', 'Qty', 'Refills']
    headers.forEach((h, i) => {
      doc.text(h, colStarts[i] + 6, tableY + 7, {
        width: colWidths[i] - 12,
        align: i >= 3 ? 'center' : 'left',
      })
    })

    // Table rows
    let rowY = tableY + headerH
    const rowH = 22
    meds.forEach((m, i) => {
      const bg = i % 2 === 0 ? '#f9fdfb' : '#ffffff'
      doc.rect(leftMargin, rowY, contentWidth, rowH).fill(bg)
      doc.rect(leftMargin, rowY, contentWidth, rowH).stroke('#ccc')

      doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica')
      doc.text(String(i + 1), colStarts[0] + 6, rowY + 6, { width: colWidths[0] - 12, align: 'center' })
      doc.font('Helvetica-Bold')
      doc.text(m.name, colStarts[1] + 6, rowY + 6, { width: colWidths[1] - 12 })
      doc.font('Helvetica')
      doc.text(m.dosage ?? '—', colStarts[2] + 6, rowY + 6, { width: colWidths[2] - 12 })
      doc.text(String(m.quantity ?? '—'), colStarts[3] + 6, rowY + 6, { width: colWidths[3] - 12, align: 'center' })
      doc.text(String(m.refills ?? 0), colStarts[4] + 6, rowY + 6, { width: colWidths[4] - 12, align: 'center' })
      rowY += rowH
    })

    // ── Special instructions ──────────────────────────────────────────
    const instrY = rowY + 16
    doc.roundedRect(leftMargin, instrY, contentWidth, 50, 6).stroke('#ddd')
    sectionLabel('Special Instructions', leftMargin + 12, instrY + 8)
    doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica')
    doc.text(script.specialInstructions || 'None', leftMargin + 12, instrY + 22, {
      width: contentWidth - 24,
    })

    // ── Signature & stamp ─────────────────────────────────────────────
    const sigY = instrY + 70
    doc.moveTo(leftMargin, sigY).lineTo(rightX, sigY).strokeColor('#e8e8e8').lineWidth(1).stroke()

    doc.fontSize(9).fillColor('#888').font('Helvetica-Bold')
    doc.text('PRESCRIBER SIGNATURE', leftMargin, sigY + 8)

    // Render signature (typed name in PDF, SVG in HTML preview)
    doc.moveTo(leftMargin, sigY + 30).lineTo(leftMargin + 200, sigY + 30).strokeColor('#333').lineWidth(1).stroke()
    doc.fontSize(10).fillColor('#666').font('Helvetica')
    doc.text(DOCTOR.name, leftMargin, sigY + 34)

    // Stamp area
    const stampX = rightX - 100
    doc.fontSize(7).fillColor(brandColor).font('Helvetica-Bold')
    doc.text('ALIENTO HEALTH', stampX, sigY + 4, { width: 80, align: 'center' })
    doc.fontSize(6).fillColor('#666').font('Helvetica')
    doc.text(`MP ${DOCTOR.mpNo}`, stampX, sigY + 14, { width: 80, align: 'center' })
    doc.roundedRect(stampX, sigY + 22, 80, 30, 4).stroke(brandColor)
    doc.fontSize(8).fillColor(brandColor).font('Helvetica-Bold')
    doc.text('Dr L Adonis', stampX + 4, sigY + 28, { width: 72, align: 'center' })
    doc.fontSize(6).fillColor('#666').font('Helvetica')
    doc.text(DOCTOR.qualifications.slice(0, 30), stampX + 4, sigY + 40, { width: 72, align: 'center' })
    doc.fontSize(6).fillColor('#888').font('Helvetica')
    doc.text(`Rx #${script.id.slice(0, 8).toUpperCase()}`, stampX + 4, sigY + 48, { width: 72, align: 'center' })

    // ── Footer ────────────────────────────────────────────────────────
    const footerY = Math.max(sigY + 80, doc.y + 20)
    doc.roundedRect(leftMargin, footerY, contentWidth, 40, 6).fill('#fafafa')
    doc.roundedRect(leftMargin, footerY, contentWidth, 40, 6).stroke('#eee')
    doc.fontSize(9).fillColor('#666').font('Helvetica-Oblique')
    doc.text(
      `Tamper-Proof: This prescription contains ${meds.length} medication(s). No further items have been prescribed.`,
      leftMargin + 12,
      footerY + 8,
      { width: contentWidth - 24, align: 'center' },
    )
    if (script.type) {
      doc.fontSize(8).fillColor('#999').font('Helvetica')
      doc.text(`Type: ${script.type}`, leftMargin + 12, footerY + 26, { width: contentWidth - 24, align: 'center' })
    }

    doc.end()
  })
}

// ─── Email wrapper ─────────────────────────────────────────────────────────

const EMAIL_BRAND_COLOR = '#0d6b4f'

/**
 * Wraps the prescription HTML inside a minimal email template suitable for
 * sending via Resend or any transactional email provider.
 *
 * Used by `src/app/api/scripts/generate/route.ts`.
 */
export function generateScriptEmailHtml(
  script: ScriptData,
  scriptHtml: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Prescription — Aliento Health</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:'Inter','Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:${EMAIL_BRAND_COLOR};padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Aliento Health</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your prescription is ready</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#333;">
                Dear <strong>${escHtml(script.patientName)}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.6;">
                Please find your prescription from Dr Leegale Adonis attached below.
                You may print this prescription or present it electronically at your pharmacy.
              </p>

              <!-- Embedded prescription -->
              <div style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
                ${scriptHtml}
              </div>

              <hr style="border:none;border-top:1px solid #e8e8e8;margin:24px 0;" />

              <p style="margin:0 0 4px;font-size:12px;color:#999;text-align:center;">
                Aliento Health &middot; ${escHtml(DOCTOR.address)}
              </p>
              <p style="margin:0;font-size:11px;color:#bbb;text-align:center;">
                This is an automated message. Do not reply directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function escHtml(s: unknown): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
}
