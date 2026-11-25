/**
 * Aliento Health — Script Store (Drizzle CRUD)
 *
 * Utility functions for creating, reading, updating, and completing
 * prescription script records in PostgreSQL via Drizzle ORM.
 */

import { db } from '@/db'
import { scripts } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface MedicationItem {
  name: string
  dosage?: string | null
  quantity?: number | null
  refills?: number | null
}

export interface CreateScriptData {
  patientName: string
  patientEmail?: string | null
  patientIdNumber?: string | null
  patientCell?: string | null
  patientAddress?: string | null
  medications?: MedicationItem[]
  type?: 'paid' | 'free'
  specialInstructions?: string | null
  paymentId?: string | null
  questionnaireId?: string | null
}

export interface ScriptRecord {
  id: string
  patientName: string
  patientEmail: string | null
  patientIdNumber: string | null
  patientCell: string | null
  patientAddress: string | null
  medications: MedicationItem[]
  type: 'paid' | 'free'
  status: 'pending' | 'completed'
  specialInstructions: string | null
  paymentId: string | null
  questionnaireId: string | null
  scriptPdfUrl: string | null
  createdAt: Date
  completedAt: Date | null
}

// ─── CRUD ──────────────────────────────────────────────────────────────────

/**
 * Insert a new script record. Auto-generates a UUID `id` and defaults
 * `status` to `'pending'` and `type` to `'free'`.
 *
 * ```ts
 * const script = await createScript({
 *   patientName: 'Jane Doe',
 *   patientEmail: 'jane@example.com',
 *   medications: [{ name: 'Atorvastatin', dosage: '20mg', quantity: 30 }],
 *   type: 'paid',
 * })
 * ```
 */
export async function createScript(
  data: CreateScriptData,
): Promise<ScriptRecord> {
  const id = randomUUID()

  const [record] = await db
    .insert(scripts)
    .values({
      id,
      patientName: data.patientName,
      patientEmail: data.patientEmail ?? null,
      patientIdNumber: data.patientIdNumber ?? null,
      patientCell: data.patientCell ?? null,
      patientAddress: data.patientAddress ?? null,
      medications: JSON.stringify(data.medications ?? []),
      type: data.type ?? 'free',
      status: 'pending',
      specialInstructions: data.specialInstructions ?? null,
      paymentId: data.paymentId ?? null,
      questionnaireId: data.questionnaireId ?? null,
    })
    .returning()

  return mapRecord(record)
}

/**
 * Get a single script by its `id`. Returns `null` if not found.
 */
export async function getScript(id: string): Promise<ScriptRecord | null> {
  const [record] = await db
    .select()
    .from(scripts)
    .where(eq(scripts.id, id))
    .limit(1)

  return record ? mapRecord(record) : null
}

/**
 * List all scripts ordered by creation date (newest first).
 * Pass `limit` to cap results.
 */
export async function listScripts(limit?: number): Promise<ScriptRecord[]> {
  const rows = await db
    .select()
    .from(scripts)
    .orderBy(desc(scripts.createdAt))
    .limit(limit ?? 100)

  return rows.map(mapRecord)
}

/**
 * Update the medications array on an existing script.
 * Replaces the full array — pass the complete list.
 *
 * ```ts
 * await updateScriptMedications(scriptId, [
 *   { name: 'Metformin', dosage: '500mg', quantity: 60, refills: 3 },
 * ])
 * ```
 */
export async function updateScriptMedications(
  id: string,
  medications: MedicationItem[],
): Promise<ScriptRecord> {
  const [record] = await db
    .update(scripts)
    .set({ medications: JSON.stringify(medications) })
    .where(eq(scripts.id, id))
    .returning()

  return mapRecord(record)
}

/**
 * Mark a script as completed with the final PDF URL and timestamp.
 *
 * ```ts
 * const completed = await completeScript(scriptId, pdfUrl)
 * ```
 */
export async function completeScript(
  id: string,
  pdfUrl: string,
): Promise<ScriptRecord> {
  const [record] = await db
    .update(scripts)
    .set({
      status: 'completed',
      scriptPdfUrl: pdfUrl,
      completedAt: new Date(),
    })
    .where(eq(scripts.id, id))
    .returning()

  return mapRecord(record)
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Map a raw Drizzle row to a typed `ScriptRecord`, safely parsing the
 * `medications` JSONB column.
 */
function mapRecord(row: typeof scripts.$inferSelect): ScriptRecord {
  let medications: MedicationItem[] = []

  if (row.medications) {
    if (typeof row.medications === 'string') {
      try {
        medications = JSON.parse(row.medications)
      } catch {
        medications = []
      }
    } else if (Array.isArray(row.medications)) {
      medications = row.medications as MedicationItem[]
    }
  }

  return {
    id: row.id,
    patientName: row.patientName,
    patientEmail: row.patientEmail,
    patientIdNumber: row.patientIdNumber,
    patientCell: row.patientCell,
    patientAddress: row.patientAddress,
    medications,
    type: row.type as 'paid' | 'free',
    status: row.status as 'pending' | 'completed',
    specialInstructions: row.specialInstructions,
    paymentId: row.paymentId,
    questionnaireId: row.questionnaireId,
    scriptPdfUrl: row.scriptPdfUrl,
    createdAt: row.createdAt,
    completedAt: row.completedAt,
  }
}
