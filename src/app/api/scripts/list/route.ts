export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { scripts } from '@/db/schema'
import { desc, eq, and } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get('type')  // 'free' | 'paid' | null
    const status = url.searchParams.get('status') // 'pending' | 'completed' | null

    const conditions = []
    if (type && (type === 'free' || type === 'paid')) {
      conditions.push(eq(scripts.type, type))
    }
    if (status && (status === 'pending' || status === 'completed')) {
      conditions.push(eq(scripts.status, status))
    }

    const query = db
      .select()
      .from(scripts)
      .orderBy(desc(scripts.createdAt))

    const rows = conditions.length > 0
      ? await query.where(and(...conditions))
      : await query

    return NextResponse.json({ scripts: rows, count: rows.length })
  } catch (err) {
    console.error('[scripts/list]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
