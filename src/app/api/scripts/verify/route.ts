export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { scripts } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { generateScriptHtml } from '@/lib/script-pdf'
import type { ScriptData } from '@/lib/script-pdf'

export async function POST(req: Request) {
  try {
    const { scriptId, idNumber } = (await req.json()) as { scriptId: string; idNumber: string }

    if (!scriptId || !idNumber) {
      return NextResponse.json({ error: 'Script ID and ID number required' }, { status: 400 })
    }

    const [script] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, scriptId))
      .limit(1)

    if (!script) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 })
    }

    // Verify ID number (case-insensitive, trim whitespace)
    if (script.patientIdNumber?.trim().toLowerCase() !== idNumber.trim().toLowerCase()) {
      return NextResponse.json({ error: 'ID number does not match' }, { status: 403 })
    }

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

    const html = generateScriptHtml(scriptData)

    return NextResponse.json({ html })
  } catch (err) {
    console.error('[scripts/verify]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
