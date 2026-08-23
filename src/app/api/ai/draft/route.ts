export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { aiDraftLogs, patientAiConsent, questionnaires, scripts } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { createHash, randomUUID } from 'node:crypto'
import { draftScript, draftSickNote } from '@/lib/ai-draft'
import type { DraftMedication } from '@/lib/ai-draft'

interface AiDraftBody {
  type?: string
  questionnaireId?: string
  scriptId?: string
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex')
}

function toDraftMeds(meds: unknown): DraftMedication[] {
  if (!Array.isArray(meds)) {
    return []
  }

  return meds.map((med) => {
    const row = (typeof med === 'object' && med !== null ? med : {}) as Record<string, unknown>
    return {
      name: typeof row.name === 'string' ? row.name : '',
      dosage: typeof row.dosage === 'string' ? row.dosage : '',
      frequency: typeof row.frequency === 'string' ? row.frequency : '',
      duration: typeof row.duration === 'string' ? row.duration : '',
    }
  })
}

export async function POST(req: Request) {
  if (process.env.AI_DRAFT_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    let body: AiDraftBody
    try {
      body = (await req.json()) as AiDraftBody
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    if (body.type !== 'sick-note' && body.type !== 'script') {
      return NextResponse.json(
        { error: 'type must be "sick-note" or "script"' },
        { status: 400 }
      )
    }
    const type: 'sick-note' | 'script' = body.type

    let scriptRow: typeof scripts.$inferSelect | undefined
    let questionnaireId: string

    if (type === 'script') {
      if (!body.scriptId) {
        return NextResponse.json(
          { error: 'scriptId is required when type is "script"' },
          { status: 400 }
        )
      }

      const [found] = await db
        .select()
        .from(scripts)
        .where(eq(scripts.id, body.scriptId))
        .limit(1)

      if (!found) {
        return NextResponse.json({ error: 'Script not found' }, { status: 404 })
      }

      if (!found.questionnaireId) {
        return NextResponse.json(
          { error: 'This script has no questionnaire to draft from' },
          { status: 400 }
        )
      }

      scriptRow = found
      questionnaireId = found.questionnaireId
    } else {
      if (!body.questionnaireId) {
        return NextResponse.json(
          { error: 'questionnaireId is required when type is "sick-note"' },
          { status: 400 }
        )
      }
      questionnaireId = body.questionnaireId
    }

    const [questionnaire] = await db
      .select()
      .from(questionnaires)
      .where(eq(questionnaires.id, questionnaireId))
      .limit(1)

    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire not found' }, { status: 404 })
    }

    const [latestConsent] = await db
      .select()
      .from(patientAiConsent)
      .where(eq(patientAiConsent.questionnaireId, questionnaire.id))
      .orderBy(desc(patientAiConsent.createdAt))
      .limit(1)

    if (latestConsent && latestConsent.consent === false) {
      return NextResponse.json(
        { error: 'Patient opted out of AI assistance' },
        { status: 403 }
      )
    }

    const knownPii = {
      name: questionnaire.patientName,
      address: scriptRow?.patientAddress || undefined,
    }

    const documentId = scriptRow?.id ?? questionnaire.id
    const patientPseudonym = sha256(questionnaire.patientName)
    const questionnaireHash = sha256(questionnaire.rawData ?? '')

    try {
      const rawQuestionnaire = questionnaire.rawData ?? ''

      const draft =
        type === 'script'
          ? await draftScript(rawQuestionnaire, toDraftMeds(scriptRow?.medications), knownPii)
          : await draftSickNote(rawQuestionnaire, knownPii)

      try {
        await db.insert(aiDraftLogs).values({
          id: 'log_' + randomUUID(),
          documentType: type,
          documentId,
          patientPseudonym,
          questionnaireHash,
          model: 'opencode/big-pickle',
          status: 'ok',
        })
      } catch (logErr) {
        console.error('[api/ai/draft] failed to persist ok log', logErr)
      }

      return NextResponse.json({ ok: true, draft })
    } catch (err) {
      console.error('[api/ai/draft]', err)

      try {
        await db.insert(aiDraftLogs).values({
          id: 'log_' + randomUUID(),
          documentType: type,
          documentId,
          patientPseudonym,
          questionnaireHash,
          model: 'opencode/big-pickle',
          status: 'failed',
        })
      } catch (logErr) {
        console.error('[api/ai/draft] failed to persist failed log', logErr)
      }

      return NextResponse.json(
        { error: 'AI draft is unavailable right now — please type the note manually.' },
        { status: 503 }
      )
    }
  } catch (err) {
    console.error('[api/ai/draft]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
