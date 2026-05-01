import { db } from '../db'
import { payments } from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'

export type PaymentGateStatus = 'pending' | 'paid' | 'failed'

export interface PaymentGateRecord {
  paymentId: string
  packageId: string
  buyerName: string
  buyerEmail: string
  status: 'pending' | 'paid' | 'failed'
  createdAt: Date
  paidAt: Date | null
}

export async function createPaymentGateRecord(input: {
  paymentId: string
  packageId: string
  buyerName: string
  buyerEmail: string
}): Promise<PaymentGateRecord> {
  await db.insert(payments).values({
    paymentId: input.paymentId,
    packageId: input.packageId,
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    status: 'pending',
    createdAt: new Date(),
    paidAt: null,
  })

  return {
    ...input,
    status: 'pending' as const,
    createdAt: new Date(),
    paidAt: null,
  }
}

export async function markPaymentGatePaid(paymentId: string): Promise<PaymentGateRecord | null> {
  await db
    .update(payments)
    .set({ status: 'paid', paidAt: new Date() })
    .where(eq(payments.paymentId, paymentId))

  return getPaymentGateRecord(paymentId)
}

export async function markPaymentGateFailed(paymentId: string): Promise<PaymentGateRecord | null> {
  await db
    .update(payments)
    .set({ status: 'failed' })
    .where(eq(payments.paymentId, paymentId))

  return getPaymentGateRecord(paymentId)
}

export async function getPaymentGateRecord(paymentId: string): Promise<PaymentGateRecord | null> {
  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.paymentId, paymentId))
    .limit(1)

  if (!result[0]) return null

  const row = result[0]
  return {
    paymentId: row.paymentId,
    packageId: row.packageId,
    buyerName: row.buyerName,
    buyerEmail: row.buyerEmail,
    status: row.status as 'pending' | 'paid' | 'failed',
    createdAt: row.createdAt,
    paidAt: row.paidAt,
  }
}

export async function pruneExpired(): Promise<void> {
  const sixHoursAgo = new Date(Date.now() - 1000 * 60 * 60 * 6)
  await db
    .delete(payments)
    .where(
      and(
        eq(payments.status, 'pending'),
        sql`${payments.createdAt} < ${sixHoursAgo.toISOString()}`
      )
    )
}