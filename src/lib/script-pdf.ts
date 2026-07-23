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
    .logo-placeholder {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #0d6b4f, #1a9e7a);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 800;
      font-size: 18px;
      letter-spacing: -0.5px;
      flex-shrink: 0;
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
    .qr-placeholder {
      width: 72px;
      height: 72px;
      border: 2px dashed #0d6b4f;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      color: #0d6b4f;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin: 0 auto 4px;
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
        <div class="logo-placeholder">AH</div>
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
        <div class="sig-label">Prescriber Signature</div>
        <div class="sig-space"></div>
        <div style="font-size: 12px; color: #666; margin-top: 4px;">
          ${escHtml(DOCTOR.name)}
        </div>
      </div>
      <div class="stamp-area">
        <div class="qr-placeholder">Digital<br />Stamp</div>
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
      ${
        script.type
          ? `<p style="margin-top: 4px; font-size: 10px; color: #999;">Type: ${escHtml(script.type)}</p>`
          : ''
      }
    </div>
  </div>
</body>
</html>`
}

// ─── PDF buffer conversion ─────────────────────────────────────────────────

/**
 * Convert the prescription HTML string to a Buffer for download/display.
 * On Vercel (serverless), we return the HTML as-is since puppeteer/chromium
 * can't run there. The HTML is styled at A4 print size and prints perfectly
 * to PDF from any browser (Cmd+P / Ctrl+P → "Save as PDF").
 *
 * @example
 * ```ts
 * const html = generateScriptHtml(scriptData)
 * const buf = generateScriptPdfBuffer(html)
 * // serve as text/html or store for later
 * ```
 */
export function generateScriptPdfBuffer(html: string): Buffer {
  return Buffer.from(html, 'utf-8')
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
