import { NextRequest, NextResponse } from 'next/server'
import { buildPayfastFormData, PAYFAST_URL, PAYFAST_CONFIG } from '@/lib/payfast'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { packageId, buyerEmail, buyerName } = body

    if (!packageId || !buyerEmail || !buyerName) {
      return NextResponse.json(
        { error: 'Missing required fields: packageId, buyerEmail, buyerName' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const formData = buildPayfastFormData({
      packageId,
      buyerEmail,
      buyerName,
      returnUrl: `${origin}/contact?payment=success`,
      cancelUrl: `${origin}/contact?payment=cancelled`,
      notifyUrl: `${origin}/api/payment/notify`,
    })

    return NextResponse.json({
      url: PAYFAST_URL,
      data: formData,
      sandbox: PAYFAST_CONFIG.sandboxMode,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
