export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

let resend: Resend | null = null

// Lazy init — constructing at module scope throws at build time when the key is unset.
function getResend(): Resend {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

interface SendPdfBody {
  to: string
  subject: string
  message?: string
  pdfBase64: string
  pdfName?: string
  /** Send as a practice address instead of notifications@. Allowlisted, never caller-controlled text. */
  fromAddress?: string
  /** Replies must land in a monitored mailbox, not in notifications@. */
  replyTo?: string
  /** Plain-text alternative. Corporate pharmacy filters score text-only-of-two better than HTML-only. */
  text?: string
  /** Copy the patient in, when the sender is the practice address. Single address only. */
  cc?: string
}

/** Only addresses on the practice domain may be used as the sender. Anything else falls back to notifications@. */
const PRACTICE_FROM: Record<string, string> = {
  'leegale@alientomd.com': 'Dr Leegale Adonis',
  'notifications@alientomd.com': 'Aliento Health',
  'contact@alientomd.com': 'Aliento Health',
  'info@alientomd.com': 'Aliento Health',
  'bookings@alientomd.com': 'Aliento Health',
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SendPdfBody

    if (!body.to || !body.pdfBase64) {
      return NextResponse.json(
        { error: 'Missing required fields: to, pdfBase64' },
        { status: 400 }
      )
    }

    // JSON body limit on Vercel is 4.5MB — PDF base64 should be well under.
    const pdfBase64 = body.pdfBase64.replace(/^data:application\/pdf;base64,/, '')
    const pdfName = body.pdfName || 'prescription.pdf'

    const DEFAULT_FROM = 'notifications@alientomd.com'
    const fromKey = (body.fromAddress || DEFAULT_FROM).toLowerCase().trim()

    // Sending as a named practice address is privileged: without this gate the endpoint is an open relay on
    // the clinic domain, which is exactly how a sending domain destroys its own deliverability.
    if (fromKey !== DEFAULT_FROM) {
      const supplied = req.headers.get('x-script-token') || ''
      const expected = process.env.SCRIPT_SEND_TOKEN || ''
      if (!expected || supplied !== expected) {
        return NextResponse.json({ error: 'Not authorised to send as that address' }, { status: 401 })
      }
    }

    const fromName = PRACTICE_FROM[fromKey] ?? PRACTICE_FROM['notifications@alientomd.com']
    const fromHeader = `${fromName} <${PRACTICE_FROM[fromKey] ? fromKey : 'notifications@alientomd.com'}>`

    const messageHtml = body.message
      ? `<p style="font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap">${body.message
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</p>`
      : ''

    const result = await getResend().emails.send({
      from: fromHeader,
      to: [body.to],
      ...(body.cc && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.cc) ? { cc: [body.cc] } : {}),
      // Resend's node SDK maps `replyTo` (camelCase) to the reply_to field; a snake_case key here is silently
      // dropped, which is how a pharmacy reply ends up nowhere. Verified against resend 6.x dist/index.mjs.
      ...(body.replyTo && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.replyTo) ? { replyTo: body.replyTo } : {}),
      ...(body.text ? { text: body.text } : {}),
      subject: body.subject || 'Prescription — Aliento Health',
      html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:'Inter','Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="background:#0d6b4f;padding:24px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">${fromName === 'Aliento Health' ? 'Aliento Health' : fromName}</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Prescription document attached</p>
        </td></tr>
        <tr><td style="padding:32px;">
          ${messageHtml || '<p style="margin:0 0 16px;font-size:15px;color:#333;">Please find the attached prescription document.</p>'}
          <p style="margin:16px 0 0;font-size:13px;color:#888;">Aliento Health &middot; 112A, 9th Road, Hyde Park, Johannesburg, 2196</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
      attachments: [
        {
          filename: pdfName,
          content: pdfBase64,
        },
      ],
    })

    if (result.error) {
      console.error('[scripts/send-pdf] Failed:', result.error)
      return NextResponse.json({ error: 'Failed to send email', detail: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: result.data?.id })
  } catch (err) {
    console.error('[scripts/send-pdf]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
