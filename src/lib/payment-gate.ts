import { db } from '@/db'
import { payments } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function createPaymentGateRecord(params: {
  paymentId: string
  packageId: string
  buyerName: string
  buyerEmail: string
}) {
  await db.insert(payments).values({
    paymentId: params.paymentId,
    packageId: params.packageId,
    buyerName: params.buyerName,
    buyerEmail: params.buyerEmail,
    status: 'pending',
  })
}

export async function getPaymentGateRecord(paymentId: string) {
  const rows = await db
    .select()
    .from(payments)
    .where(eq(payments.paymentId, paymentId))
    .limit(1)
  return rows[0] || null
}

export async function markPaymentGatePaid(paymentId: string) {
  await db
    .update(payments)
    .set({ status: 'paid', paidAt: new Date() })
    .where(eq(payments.paymentId, paymentId))
}

export async function markPaymentGateFailed(paymentId: string) {
  await db
    .update(payments)
    .set({ status: 'failed' })
    .where(eq(payments.paymentId, paymentId))
}
