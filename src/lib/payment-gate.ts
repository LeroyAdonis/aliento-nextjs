type PaymentGateStatus = 'pending' | 'paid' | 'failed'

interface PaymentGateRecord {
  paymentId: string
  packageId: string
  buyerName: string
  buyerEmail: string
  status: PaymentGateStatus
  createdAt: number
  paidAt?: number
}

const PAYMENT_GATE_TTL_MS = 1000 * 60 * 60 * 6 // 6h
const paymentGateStore = new Map<string, PaymentGateRecord>()

function pruneExpired() {
  const now = Date.now()
  for (const [paymentId, record] of paymentGateStore.entries()) {
    if (now - record.createdAt > PAYMENT_GATE_TTL_MS) {
      paymentGateStore.delete(paymentId)
    }
  }
}

export function createPaymentGateRecord(input: {
  paymentId: string
  packageId: string
  buyerName: string
  buyerEmail: string
}) {
  pruneExpired()

  const record: PaymentGateRecord = {
    ...input,
    status: 'pending',
    createdAt: Date.now(),
  }

  paymentGateStore.set(input.paymentId, record)
  return record
}

export function markPaymentGatePaid(paymentId: string) {
  pruneExpired()
  const existing = paymentGateStore.get(paymentId)
  if (!existing) return null

  const updated: PaymentGateRecord = {
    ...existing,
    status: 'paid',
    paidAt: Date.now(),
  }

  paymentGateStore.set(paymentId, updated)
  return updated
}

export function markPaymentGateFailed(paymentId: string) {
  pruneExpired()
  const existing = paymentGateStore.get(paymentId)
  if (!existing) return null

  const updated: PaymentGateRecord = {
    ...existing,
    status: 'failed',
  }

  paymentGateStore.set(paymentId, updated)
  return updated
}

export function getPaymentGateRecord(paymentId: string) {
  pruneExpired()
  return paymentGateStore.get(paymentId) ?? null
}
