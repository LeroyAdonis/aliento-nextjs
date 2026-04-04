import Link from 'next/link'
import { getCalBookingByUid } from '@/lib/calcom'

export default async function ConfirmedPage({ params }: { params: Promise<{ bookingUid: string }> }) {
  const { bookingUid } = await params

  try {
    const result = await getCalBookingByUid(bookingUid)
    const booking = (result as { data?: Record<string, unknown>; booking?: Record<string, unknown> }).data || (result as { booking?: Record<string, unknown> }).booking || {}

    const start = booking?.start as string | undefined
    const title = (booking?.title as string | undefined) || 'Consultation confirmed'
    const location = (booking?.location as string | undefined) || 'Video call details will be sent via email.'

    return (
      <main className="min-h-screen bg-cream-100 px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white border border-warm-200 rounded-3xl p-8">
          <h1 className="text-3xl font-display font-semibold text-warm-900 mb-3">Booking confirmed</h1>
          <p className="text-warm-500 mb-8">{title}</p>

          <div className="space-y-3 text-sm text-warm-700 mb-8">
            <p><span className="font-medium">Booking UID:</span> {bookingUid}</p>
            {start ? <p><span className="font-medium">Date & time:</span> {new Date(start).toLocaleString()}</p> : null}
            <p><span className="font-medium">Location:</span> {location}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href={`/consult/reschedule?bookingUid=${bookingUid}`} className="px-5 py-2.5 rounded-full bg-sage-600 text-white text-sm">Reschedule</Link>
            <Link href={`/consult/cancel/${bookingUid}`} className="px-5 py-2.5 rounded-full border border-warm-300 text-sm text-warm-700">Cancel booking</Link>
          </div>
        </div>
      </main>
    )
  } catch {
    return (
      <main className="min-h-screen bg-cream-100 px-6 py-12">
        <div className="max-w-3xl mx-auto bg-white border border-warm-200 rounded-3xl p-8">
          <h1 className="text-2xl font-display font-semibold text-warm-900 mb-3">Booking not found</h1>
          <p className="text-warm-500 mb-6">This confirmation link is invalid or has expired.</p>
          <Link href="/consult" className="text-sage-700 underline">Return to consult page</Link>
        </div>
      </main>
    )
  }
}
