export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { scripts } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing required query param: id' },
        { status: 400 }
      )
    }

    const [script] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, id))
      .limit(1)

    if (!script) {
      return NextResponse.json(
        { error: 'Script not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ script })
  } catch (err) {
    console.error('[scripts/get]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
