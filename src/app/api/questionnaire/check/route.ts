export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/db'
import { questionnaires } from '@/db/schema'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const email = url.searchParams.get('email')?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const rows = await db
    .select({ id: questionnaires.id })
    .from(questionnaires)
    .where(sql`lower(${questionnaires.patientEmail}) = ${email}`)
    .limit(1)

  return NextResponse.json({ exists: rows.length > 0 })
}
