export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { scripts } from '@/db/schema'

interface CreateScriptBody {
  patientName: string
  patientEmail?: string
  patientIdNumber?: string
  patientCell?: string
  patientAddress?: string
  type?: 'free' | 'paid'
  paymentId?: string
  questionnaireId?: string
}

function generateScriptId(): string {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `SCR-${Date.now()}-${suffix}`
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateScriptBody

    if (!body.patientName) {
      return NextResponse.json(
        { error: 'Missing required field: patientName' },
        { status: 400 }
      )
    }

    const id = generateScriptId()

    await db.insert(scripts).values({
      id,
      patientName: body.patientName,
      patientEmail: body.patientEmail ?? null,
      patientIdNumber: body.patientIdNumber ?? null,
      patientCell: body.patientCell ?? null,
      patientAddress: body.patientAddress ?? null,
      type: body.type ?? 'free',
      paymentId: body.paymentId ?? null,
      questionnaireId: body.questionnaireId ?? null,
    })

    const [created] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, id))
      .limit(1)

    return NextResponse.json({ success: true, script: created }, { status: 201 })
  } catch (err) {
    console.error('[scripts/create]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
