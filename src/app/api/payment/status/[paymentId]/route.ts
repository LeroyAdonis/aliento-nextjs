import { NextResponse } from 'next/server'
import { getPaymentGateRecord } from '@/lib/payment-gate'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  const { paymentId } = await params
  const record = getPaymentGateRecord(paymentId)

  if (!record) {
    return NextResponse.json({ error: 'Payment session not found' }, { status: 404 })
  }

  return NextResponse.json({
    paymentId: record.paymentId,
    packageId: record.packageId,
    buyerName: record.buyerName,
    buyerEmail: record.buyerEmail,
    status: record.status,
    paidAt: record.paidAt,
  })
}
