import { NextResponse } from 'next/server'
import { verifyCalWebhookSignature } from '@/lib/calcom'

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-cal-signature-256')

  const isValid = await verifyCalWebhookSignature(signature, rawBody)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventType = payload?.triggerEvent || payload?.eventType || 'UNKNOWN'

  console.log('[calcom-webhook]', {
    eventType,
    bookingUid: payload?.payload?.booking?.uid || payload?.payload?.uid,
    timestamp: new Date().toISOString(),
    raw: payload,
  })

  return NextResponse.json({ received: true })
}
