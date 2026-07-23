export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { scripts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { sendEmail } from '@/lib/email'
import { generateScriptHtml, generateScriptEmailHtml } from '@/lib/script-pdf'
import type { Medication } from '@/lib/script-pdf'

interface GenerateScriptBody {
  scriptId: string
  medications: Medication[]
  specialInstructions?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateScriptBody

    if (!body.scriptId || !body.medications || !Array.isArray(body.medications) || body.medications.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: scriptId, medications (non-empty array)' },
        { status: 400 }
      )
    }

    // Fetch existing script
    const [existing] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, body.scriptId))
      .limit(1)

    if (!existing) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    // Generate the script HTML
    const html = generateScriptHtml({
      id: existing.id,
      patientName: existing.patientName,
      patientIdNumber: existing.patientIdNumber,
      patientAddress: existing.patientAddress,
      medications: body.medications,
      specialInstructions: body.specialInstructions ?? null,
      createdAt: existing.createdAt,
    })

    // Update the script record with medications, HTML (stored as scriptPdfUrl as placeholder), and mark completed
    await db
      .update(scripts)
      .set({
        medications: body.medications as unknown as Medication[],
        specialInstructions: body.specialInstructions ?? null,
        scriptPdfUrl: html,
        status: 'completed',
        completedAt: new Date(),
      })
      .where(eq(scripts.id, body.scriptId))

    // Fetch updated script
    const [updated] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, body.scriptId))
      .limit(1)

    // If patient has email, send via Resend
    if (existing.patientEmail) {
      const emailHtml = generateScriptEmailHtml(
        {
          id: existing.id,
          patientName: existing.patientName,
          patientIdNumber: existing.patientIdNumber,
          patientAddress: existing.patientAddress,
          medications: body.medications,
          specialInstructions: body.specialInstructions ?? null,
          createdAt: existing.createdAt,
        },
        html
      )

      await sendEmail({
        purpose: 'notification',
        subject: `Prescription Ready — ${existing.patientName}`,
        html: emailHtml,
        replyTo: existing.patientEmail,
      })
    }

    return NextResponse.json({
      success: true,
      script: updated,
      html,
    })
  } catch (err) {
    console.error('[scripts/generate]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
