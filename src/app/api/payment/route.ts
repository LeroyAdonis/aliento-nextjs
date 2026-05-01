import { NextRequest, NextResponse } from 'next/server'
import { buildPayfastFormData, PAYFAST_URL, PAYFAST_CONFIG } from '@/lib/payfast'
import { createPaymentGateRecord } from '@/lib/payment-gate'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { packageId, buyerEmail, buyerName, successPath, cancelPath } = body

    if (!packageId || !buyerEmail || !buyerName) {
      return NextResponse.json(
        { error: 'Missing required fields: packageId, buyerEmail, buyerName' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const paymentId = `${packageId}-${Date.now()}`

    createPaymentGateRecord({
      paymentId,
      packageId,
      buyerName,
      buyerEmail,
    })

    const successBase = successPath || '/consult/book'
    const successUrl = new URL(successBase, origin)
    successUrl.searchParams.set('payment', 'success')
    successUrl.searchParams.set('paymentId', paymentId)
    successUrl.searchParams.set('duration', packageId === 'consult-60' ? '60' : '30')

    const formData = buildPayfastFormData({
      packageId,
      buyerEmail,
      buyerName,
      paymentId,
      returnUrl: successUrl.toString(),
      cancelUrl: `${origin}${cancelPath || '/consult?payment=cancelled'}`,
      notifyUrl: `${origin}/api/payment/notify`,
    })

    return NextResponse.json({
      url: PAYFAST_URL,
      data: formData,
      sandbox: PAYFAST_CONFIG.sandboxMode,
      paymentId,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
