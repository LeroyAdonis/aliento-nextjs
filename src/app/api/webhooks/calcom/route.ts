import { NextResponse } from 'next/server'
import { verifyCalWebhookSignature } from '@/lib/calcom'
import { sendEmail } from '@/lib/email'

type CalAttendee = { name?: string; email?: string; timeZone?: string }
type CalBookingPayload = {
  uid?: string
  title?: string
  startTime?: string
  endTime?: string
  attendees?: CalAttendee[]
  responses?: { name?: string; email?: string; notes?: string }
  cancellationReason?: string
  rescheduleReason?: string
  organizer?: { name?: string; email?: string; timeZone?: string }
}

const EVENT_LABELS: Record<string, string> = {
  BOOKING_CREATED: 'New booking',
  BOOKING_RESCHEDULED: 'Booking rescheduled',
  BOOKING_CANCELLED: 'Booking cancelled',
  BOOKING_REQUESTED: 'Booking requested',
  BOOKING_PAID: 'Booking paid',
  BOOKING_REJECTED: 'Booking rejected',
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function formatDateTime(iso?: string, timeZone?: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-ZA', {
      timeZone: timeZone || 'Africa/Johannesburg',
      dateStyle: 'full',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function buildBookingHtml(eventType: string, booking: CalBookingPayload): string {
  const label = EVENT_LABELS[eventType] || eventType
  const attendee = booking.attendees?.[0]
  const tz = attendee?.timeZone || booking.organizer?.timeZone

  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;white-space:nowrap">${k}</td><td style="padding:6px 12px;font-size:13px;color:#111827">${v}</td></tr>`

  const rows = [
    row('Event', escapeHtml(label)),
    row('Title', escapeHtml(booking.title || '—')),
    row('Booking UID', escapeHtml(booking.uid || '—')),
    row('Patient', escapeHtml(attendee?.name || booking.responses?.name || '—')),
    row('Email', escapeHtml(attendee?.email || booking.responses?.email || '—')),
    row('Start', escapeHtml(formatDateTime(booking.startTime, tz))),
    row('End', escapeHtml(formatDateTime(booking.endTime, tz))),
    row('Time zone', escapeHtml(tz || '—')),
  ]

  if (booking.cancellationReason) {
    rows.push(row('Cancellation reason', escapeHtml(booking.cancellationReason)))
  }
  if (booking.rescheduleReason) {
    rows.push(row('Reschedule reason', escapeHtml(booking.rescheduleReason)))
  }
  if (booking.responses?.notes) {
    rows.push(row('Notes', escapeHtml(booking.responses.notes)))
  }

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;padding:32px 0;color:#111827">
  <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <div style="background:#4a7c59;padding:24px 32px">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600">${escapeHtml(label)}</h1>
      <p style="margin:6px 0 0;color:#a7c4b0;font-size:14px">${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
    </div>
    <table style="width:100%;border-collapse:collapse">${rows.join('')}</table>
  </div>
</body></html>`
}

export async function POST(req: Request) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-cal-signature-256')

  const isValid = await verifyCalWebhookSignature(signature, rawBody)
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventType: string = payload?.triggerEvent || payload?.eventType || 'UNKNOWN'
  const booking: CalBookingPayload = payload?.payload?.booking || payload?.payload || {}

  console.log('[calcom-webhook]', {
    eventType,
    bookingUid: booking?.uid,
    timestamp: new Date().toISOString(),
  })

  if (EVENT_LABELS[eventType]) {
    const attendee = booking.attendees?.[0]
    const patientName = attendee?.name || booking.responses?.name || 'Patient'
    const replyTo = attendee?.email || booking.responses?.email

    try {
      await sendEmail({
        purpose: 'booking',
        subject: `${EVENT_LABELS[eventType]} — ${patientName}`,
        html: buildBookingHtml(eventType, booking),
        replyTo,
      })
    } catch (err) {
      console.error('[calcom-webhook] email send failed', err)
    }
  }

  return NextResponse.json({ received: true })
}
