import 'dotenv/config'
import { eq } from 'drizzle-orm'
import { db } from '../src/db'
import { scripts } from '../src/db/schema'
import { generateScriptHtml } from '../src/lib/script-pdf'

function generateScriptId(): string {
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `SCR-${Date.now()}-${suffix}`
}

async function main() {
  const id = generateScriptId()
  const patientName = 'Freda Wright'
  const patientIdNumber = '5307110083080'
  const patientAddress = '33 Boshoff, Vryburg, 8600'

  const medications = [
    {
      name: 'Tramahexal SR 100 (Tramadol HCl 100mg)',
      dosage: '100mg',
      quantity: null, // ⚠️ confirm with Dr Leegale
      refills: null, // ⚠️ confirm with Dr Leegale
    },
  ]

  await db.insert(scripts).values({
    id,
    patientName,
    patientIdNumber,
    patientCell: null,
    patientAddress,
    medications: medications as unknown as object[],
    type: 'free',
    status: 'pending',
  })

  const [created] = await db
    .select()
    .from(scripts)
    .where(eq(scripts.id, id))
    .limit(1)

  const html = generateScriptHtml({
    id: created.id,
    patientName: created.patientName,
    patientEmail: created.patientEmail ?? null,
    patientIdNumber: created.patientIdNumber ?? null,
    patientCell: created.patientCell ?? null,
    patientAddress: created.patientAddress ?? null,
    medications: created.medications as any[],
    type: created.type ?? null,
    specialInstructions: created.specialInstructions ?? null,
    createdAt: created.createdAt ?? null,
    completedAt: created.completedAt ?? null,
  })

  await db
    .update(scripts)
    .set({ scriptPdfUrl: html })
    .where(eq(scripts.id, id))

  // Write the HTML file for delivery
  const fs = await import('fs')
  fs.writeFileSync(`/tmp/${id}.html`, html)

  console.log('SCRIPT_ID=' + id)
  console.log('PATIENT=' + patientName)
  console.log('ID_NUMBER=' + patientIdNumber)
  console.log('ADDRESS=' + patientAddress)
  console.log('HTML_BYTES=' + Buffer.byteLength(html))
  console.log('WRITTEN=/tmp/' + id + '.html')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
