import { NextRequest, NextResponse } from 'next/server'
import { markPaymentGateFailed, markPaymentGatePaid } from '@/lib/payment-gate'

// Payfast ITN (Instant Transaction Notification) handler
// In production, verify signature, validate with PayFast endpoint and persist status.
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)
    const paymentStatus = params.get('payment_status')
    const paymentId = params.get('m_payment_id')

    if (paymentId) {
      if (paymentStatus === 'COMPLETE') {
        markPaymentGatePaid(paymentId)
      } else if (paymentStatus) {
        markPaymentGateFailed(paymentId)
      }
    }

    console.log('[Payfast ITN]', {
      paymentId,
      paymentStatus,
      pfPaymentId: params.get('pf_payment_id'),
      amountGross: params.get('amount_gross'),
    })

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'ITN processing failed' }, { status: 500 })
  }
}
