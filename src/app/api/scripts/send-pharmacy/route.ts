export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { scripts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { Resend } from 'resend'
import { generateScriptHtml } from '@/lib/script-pdf'

let resend: Resend | null = null

// Lazy init — constructing at module scope throws at build time when the key is unset.
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

interface SendPharmacyBody {
  scriptId: string
  pharmacyEmail: string
  ccDoctor?: boolean
}

function escHtml(s: unknown): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SendPharmacyBody

    if (!body.scriptId || !body.pharmacyEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: scriptId, pharmacyEmail' },
        { status: 400 }
      )
    }

    const [script] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, body.scriptId))
      .limit(1)

    if (!script) {
      return NextResponse.json({ error: 'Script not found' }, { status: 404 })
    }

    // Use stored generated HTML, or regenerate from medications
    let prescriptionHtml = script.scriptPdfUrl || ''
    if (!prescriptionHtml) {
      prescriptionHtml = generateScriptHtml({
        id: script.id,
        patientName: script.patientName,
        patientIdNumber: script.patientIdNumber,
        patientAddress: script.patientAddress,
        medications: Array.isArray(script.medications) ? script.medications : [],
        specialInstructions: script.specialInstructions,
        createdAt: script.createdAt,
      })
    }

    const meds = Array.isArray(script.medications) ? script.medications : []
    const medSummary = meds
      .map((m: Record<string, any>) => `${m.name || ''} ${m.dosage || ''} x${m.quantity ?? ''}`.trim())
      .filter(Boolean)
      .join('; ')

    const emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medical Prescription — ${escHtml(script.patientName)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:'Inter','Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <tr>
            <td style="background:#0d6b4f;padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Aliento Health</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Electronic prescription for dispensing</p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#333;">
                Dear Pharmacy Team,
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.6;">
                Please find attached the electronic prescription issued by
                <strong>Dr Leegale Adonis</strong> (Practice No 1181300, MP No MP0531502)
                for patient <strong>${escHtml(script.patientName)}</strong> (ID ${escHtml(script.patientIdNumber)}).
                The prescription bears the prescriber's signature and practice stamp and is
                issued in accordance with the Medicines and Related Substances Act.
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.6;">
                <strong>Medication:</strong> ${escHtml(medSummary)}<br/>
                <strong>Script ID:</strong> ${escHtml(script.id)}
              </p>
              <div style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
                ${prescriptionHtml}
              </div>
              <hr style="border:none;border-top:1px solid #e8e8e8;margin:24px 0;" />
              <p style="margin:0 0 4px;font-size:12px;color:#999;text-align:center;">
                Aliento Health &middot; 112A, 9th Road, Hyde Park, Johannesburg, 2196
              </p>
              <p style="margin:0;font-size:11px;color:#bbb;text-align:center;">
                This is an automated electronic prescription. Verification: practice No 1181300.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    const sendTo: string[] = [body.pharmacyEmail]
    if (body.ccDoctor !== false) {
      sendTo.push('leegailadonis@gmail.com')
    }

    const result = await getResend().emails.send({
      from: 'Aliento Health <notifications@alientomd.com>',
      to: sendTo,
      subject: `Medical Prescription — ${script.patientName} — Aliento Health`,
      html: emailHtml,
    })

    if (result.error) {
      console.error('[scripts/send-pharmacy] Failed:', result.error)
      return NextResponse.json({ error: 'Failed to send email', detail: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.data?.id, scriptId: script.id })
  } catch (err) {
    console.error('[scripts/send-pharmacy]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
