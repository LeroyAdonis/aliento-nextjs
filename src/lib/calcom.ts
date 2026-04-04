import crypto from 'crypto'

const CALCOM_API_BASE = 'https://api.cal.com/v2'

async function calcomFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const apiKey = process.env.CALCOM_API_KEY
  if (!apiKey) {
    throw new Error('CALCOM_API_KEY is not configured')
  }

  const res = await fetch(`${CALCOM_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(data?.message || `Cal.com request failed (${res.status})`)
  }

  return data as T
}

export async function getCalBookingByUid(bookingUid: string) {
  return calcomFetch<{ data?: unknown; booking?: unknown }>(`/bookings/${bookingUid}`)
}

export async function cancelCalBooking(bookingUid: string, reason?: string) {
  return calcomFetch(`/bookings/${bookingUid}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason: reason || 'Cancelled by patient' }),
  })
}

export async function verifyCalWebhookSignature(signature: string | null, rawBody: string) {
  const secret = process.env.CALCOM_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const provided = signature.replace(/^sha256=/, '')

  if (provided.length !== expected.length) return false

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided))
}
