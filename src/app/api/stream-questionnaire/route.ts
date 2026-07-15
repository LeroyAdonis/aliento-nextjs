import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/db'
import { questionnaires } from '@/db/schema'
import { sendEmail } from '@/lib/email'
import { randomUUID } from 'crypto'

const bodySchema = z.object({
  stream: z.string().default('consult'),
  patientName: z.string().min(1, 'patientName is required'),
  patientEmail: z.string().email('Invalid email address'),
  data: z.record(z.string(), z.unknown()),
})

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json()
    const parsed = bodySchema.safeParse(raw)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { stream, patientName, patientEmail, data } = parsed.data
    const id = randomUUID()

    await db.insert(questionnaires).values({
      id,
      patientName,
      patientEmail,
      rawData: JSON.stringify(data),
      stream,
    })

    // Stream-aware email notification
    const streamLabel = stream === 'consult' ? 'Consultation' : stream.charAt(0).toUpperCase() + stream.slice(1)
    const emailResult = await sendEmail({
      purpose: 'questionnaire',
      subject: `New ${streamLabel} Questionnaire — ${patientName}`,
      html: `
        <h2>New ${streamLabel} Questionnaire</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Stream</td><td style="padding:8px;border:1px solid #ddd;">${stream}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Patient</td><td style="padding:8px;border:1px solid #ddd;">${patientName}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;">${patientEmail}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">ID</td><td style="padding:8px;border:1px solid #ddd;">${id}</td></tr>
        </table>
        <hr style="margin:16px 0;" />
        <pre style="background:#f5f5f5;padding:12px;border-radius:4px;overflow-x:auto;font-size:13px;">${JSON.stringify(data, null, 2)}</pre>
      `,
      replyTo: patientEmail,
    })

    return NextResponse.json({
      success: true,
      id,
      emailSent: emailResult.success,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
