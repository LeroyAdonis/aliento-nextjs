import { NextRequest, NextResponse } from 'next/server'

// Payfast ITN (Instant Transaction Notification) handler
// In production, verify the signature and update order status
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)
    const paymentStatus = params.get('payment_status')
    const paymentId = params.get('m_payment_id')

    console.log(`[Payfast ITN] Payment ${paymentId}: ${paymentStatus}`)

    // TODO: Verify signature, validate with Payfast server, update database
    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'ITN processing failed' }, { status: 500 })
  }
}
