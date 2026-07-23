export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { scripts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sendEmail } from '@/lib/email'
import { Resend } from 'resend'
import {
  generateScriptPdfBuffer,
  type ScriptData,
} from '@/lib/script-pdf'

const resend = new Resend(process.env.RESEND_API_KEY || '')

interface SendScriptBody {
  scriptId: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SendScriptBody

    if (!body.scriptId) {
      return NextResponse.json(
        { error: 'Missing required field: scriptId' },
        { status: 400 }
      )
    }

    // Fetch the script
    const [script] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, body.scriptId))
      .limit(1)

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    if (!script.patientEmail) {
      return NextResponse.json(
        { error: 'Script has no patient email to send to' },
        { status: 400 }
      )
    }

    // Build script data and generate PDF
    const scriptData: ScriptData = {
      id: script.id,
      patientName: script.patientName,
      patientEmail: script.patientEmail,
      patientIdNumber: script.patientIdNumber,
      patientCell: script.patientCell,
      patientAddress: script.patientAddress,
      medications: (script.medications as ScriptData['medications']) ?? [],
      type: script.type,
      specialInstructions: script.specialInstructions,
      createdAt: script.createdAt,
      completedAt: script.completedAt,
    }

    const pdfBuffer = await generateScriptPdfBuffer(scriptData)

    if (!process.env.RESEND_API_KEY) {
      console.warn('[scripts/send] RESEND_API_KEY not set — skipping send')
      return NextResponse.json({ success: false, reason: 'no_api_key' }, { status: 500 })
    }

    // 1. Send to patient via Resend directly with PDF attachment
    const patientResult = await resend.emails.send({
      from: 'Aliento Health <notifications@alientomd.com>',
      to: script.patientEmail,
      subject: `Your Prescription — ${script.patientName}`,
      html: buildPatientEmailHtml(script),
      attachments: [
        {
          filename: `prescription-${script.id}.pdf`,
          content: pdfBuffer.toString('base64'),
        },
      ],
    })

    if (patientResult.error) {
      console.error('[scripts/send] Failed to send to patient:', patientResult.error)
      return NextResponse.json({ error: 'Failed to send email to patient' }, { status: 500 })
    }

    // 2. Send copy to doctor via existing email utility
    const doctorResult = await sendEmail({
      purpose: 'notification',
      subject: `Script Copy — ${script.patientName} (${script.id})`,
      html: buildDoctorEmailHtml(script),
    })

    return NextResponse.json({
      success: true,
      patientEmailSent: true,
      doctorCopySent: doctorResult.success,
      scriptId: script.id,
    })
  } catch (err) {
    console.error('[scripts/send]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function buildPatientEmailHtml(script: Record<string, any>): string {
  const dateStr = new Date(script.createdAt).toLocaleDateString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Your Prescription</title>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;margin:0;padding:32px 0;color:#111827">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <div style="background:#4a7c59;padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Your Prescription</h1>
      <p style="margin:6px 0 0;color:#a7c4b0;font-size:14px">Aliento Health</p>
    </div>
    <div style="padding:24px 32px">
      <p style="font-size:15px;margin:0 0 16px">Dear <strong>${script.patientName}</strong>,</p>
      <p style="font-size:14px;color:#4b5563;margin:0 0 8px;line-height:1.6">
        Please find your prescription attached below. You may present this at your pharmacy.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:13px;margin:16px 0">
        <tr><td style="color:#6b7280;padding:4px 0;width:120px">Script ID</td><td style="padding:4px 0;font-weight:600">${script.id}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0">Date</td><td style="padding:4px 0">${dateStr}</td></tr>
      </table>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">Aliento Health · This is a computer-generated prescription.</p>
    </div>
  </div>
</body>
</html>`
}

function buildDoctorEmailHtml(script: Record<string, any>): string {
  const dateStr = new Date(script.createdAt).toLocaleDateString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const medications = Array.isArray(script.medications) ? script.medications : []

  const medRows = medications
    .map(
      (m: Record<string, string>, i: number) =>
        `<tr${i % 2 === 0 ? ' style="background:#f9fafb"' : ''}>
          <td style="padding:8px 12px;font-size:13px">${m.name || '—'}</td>
          <td style="padding:8px 12px;font-size:13px">${m.dosage || '—'}</td>
          <td style="padding:8px 12px;font-size:13px">${m.quantity || '—'}</td>
          <td style="padding:8px 12px;font-size:13px">${m.refills || '—'}</td>
        </tr>`
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Script Copy — ${script.patientName}</title>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;margin:0;padding:32px 0;color:#111827">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <div style="background:#4a7c59;padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:18px;font-weight:700">Script Copy — Doctor Notification</h1>
      <p style="margin:6px 0 0;color:#a7c4b0;font-size:14px">Aliento Health</p>
    </div>
    <div style="padding:24px 32px">
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <tr><td style="color:#6b7280;padding:4px 0;width:130px">Script ID</td><td style="padding:4px 0;font-weight:600">${script.id}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0">Patient</td><td style="padding:4px 0;font-weight:600">${script.patientName}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0">Email</td><td style="padding:4px 0">${script.patientEmail || '—'}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0">Date</td><td style="padding:4px 0">${dateStr}</td></tr>
        <tr><td style="color:#6b7280;padding:4px 0">Status</td><td style="padding:4px 0;text-transform:capitalize">${script.status}</td></tr>
      </table>
    </div>
    <div style="padding:0 32px 24px">
      <h3 style="margin:0 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280">Medications</h3>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
        <thead>
          <tr style="background:#f3f4f6;text-transform:uppercase;font-size:11px;letter-spacing:.06em">
            <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600">Name</th>
            <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600">Dosage</th>
            <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600">Qty</th>
            <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600">Refills</th>
          </tr>
        </thead>
        <tbody>${medRows || '<tr><td colspan="4" style="padding:12px;text-align:center;color:#9ca3af;font-size:13px">No medications listed</td></tr>'}</tbody>
      </table>
    </div>
    ${script.specialInstructions ? `<div style="padding:0 32px 24px">
      <h3 style="margin:0 0 8px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280">Special Instructions</h3>
      <p style="margin:0;font-size:13px;color:#374151;white-space:pre-wrap">${script.specialInstructions}</p>
    </div>` : ''}
    <div style="padding:16px 32px;background:#f9fafb;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">Aliento Health · Script copy for doctor records.</p>
    </div>
  </div>
</body>
</html>`
}
