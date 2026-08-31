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

    const messageHtml = body.message
      ? `<p style="font-size:14px;color:#333;line-height:1.6;white-space:pre-wrap">${body.message
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')}</p>`
      : ''

    const result = await getResend().emails.send({
      from: 'Aliento Health <notifications@alientomd.com>',
      to: [body.to],
      subject: body.subject || 'Prescription — Aliento Health',
      html: `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:'Inter','Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
        <tr><td style="background:#0d6b4f;padding:24px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Aliento Health</h1>
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
