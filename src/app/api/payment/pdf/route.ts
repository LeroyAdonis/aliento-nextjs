import { NextRequest, NextResponse } from 'next/server'
import { buildPayfastFormData, PAYFAST_URL, PAYFAST_CONFIG } from '@/lib/payfast'
import { createPaymentGateRecord } from '@/lib/payment-gate'

// R50 in cents for the article PDF download
const PDF_PRICE_CENTS = 5000

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { articleTitle, articleSlug, buyerEmail, buyerName } = body

    if (!articleTitle || !articleSlug || !buyerEmail || !buyerName) {
      return NextResponse.json(
        { error: 'Missing required fields: articleTitle, articleSlug, buyerEmail, buyerName' },
        { status: 400 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const paymentId = `pdf-${articleSlug}-${Date.now()}`

    // Create a payment record (reuse existing payment-gate for simplicity)
    await createPaymentGateRecord({
      paymentId,
      packageId: `pdf-${articleSlug}`,
      buyerName,
      buyerEmail,
    })

    const successUrl = new URL(`/health-topics/${articleSlug}`, origin)
    successUrl.searchParams.set('pdf', 'success')
    successUrl.searchParams.set('paymentId', paymentId)

    const formData = buildPayfastFormData({
      packageId: 'pdf-article',
      buyerEmail,
      buyerName,
      paymentId,
      returnUrl: successUrl.toString(),
      cancelUrl: `${origin}/health-topics/${articleSlug}?pdf=cancelled`,
      notifyUrl: `${origin}/api/payment/notify`,
    })

    // Override the amount to R50
    formData.amount = '50.00'
    formData.item_name = `PDF: ${articleTitle}`
    formData.item_description = `Downloadable PDF of "${articleTitle}"`

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
