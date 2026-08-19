export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const messageId = searchParams.get('id')

    if (!messageId) {
      return NextResponse.json({ error: 'Missing ?id=<resend message id>' }, { status: 400 })
    }

    const { data, error } = await resend.emails.get(messageId)

    if (error) {
      return NextResponse.json({ error: 'Resend lookup failed', detail: error }, { status: 500 })
    }

    return NextResponse.json({ success: true, email: data })
  } catch (err) {
    console.error('[scripts/email-status]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
