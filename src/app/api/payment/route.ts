import { NextRequest, NextResponse } from 'next/server'
import { buildPayfastFormData, PAYFAST_URL, PAYFAST_CONFIG } from '@/lib/payfast'
import { createPaymentGateRecord } from '@/lib/payment-gate'
import { db } from '@/db'
import { questionnaires } from '@/db/schema'
import { sql } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { packageId, buyerEmail, buyerName, successPath, cancelPath, stream } = body

    if (!packageId || !buyerEmail || !buyerName) {
      return NextResponse.json(
        { error: 'Missing required fields: packageId, buyerEmail, buyerName' },
        { status: 400 }
      )
    }

    const streamValue = stream ?? 'consult'

    // Verify questionnaire exists before allowing payment
    const existing = await db
      .select({ id: questionnaires.id })
      .from(questionnaires)
      .where(sql`lower(${questionnaires.patientEmail}) = ${buyerEmail.toLowerCase().trim()}`)
      .limit(1)

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Please complete the health questionnaire before booking. Go to /questionnaire first.' },
        { status: 403 }
      )
    }

    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const paymentId = `${packageId}-${Date.now()}`

    await createPaymentGateRecord({
      paymentId,
      packageId,
      buyerName,
      buyerEmail,
      stream: streamValue,
    })

    // Stream-aware success redirect
    const successBase = successPath || `/${streamValue}/confirmed`
    const successUrl = new URL(successBase, origin)
    successUrl.searchParams.set('payment', 'success')
    successUrl.searchParams.set('paymentId', paymentId)
    successUrl.searchParams.set('duration', packageId === 'consult-35' ? '35' : '20')

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
