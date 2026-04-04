'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function CancelBookingPage() {
  const params = useParams<{ bookingUid: string }>()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const handleCancel = async () => {
    setStatus('loading')
    try {
      const res = await fetch(`/api/calcom/bookings/${params.bookingUid}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Cancelled by patient via portal' }),
      })
      if (!res.ok) throw new Error('Cancel failed')
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen bg-cream-100 px-6 py-12">
      <div className="max-w-xl mx-auto bg-white border border-warm-200 rounded-3xl p-8">
        <h1 className="text-2xl font-display font-semibold text-warm-900 mb-3">Cancel consultation</h1>
        <p className="text-warm-500 text-sm mb-6">Booking UID: {params.bookingUid}</p>

        {status === 'done' ? (
          <div className="space-y-4">
            <p className="text-sage-700 text-sm">Your booking has been cancelled.</p>
            <Link href="/consult" className="text-sage-700 underline">Book another consult</Link>
          </div>
        ) : (
          <>
            <p className="text-warm-600 text-sm mb-6">Are you sure you want to cancel this booking?</p>
            <button onClick={handleCancel} disabled={status === 'loading'} className="px-5 py-2.5 rounded-full bg-warm-900 text-white text-sm disabled:opacity-60">
              {status === 'loading' ? 'Cancelling...' : 'Confirm cancellation'}
            </button>
            {status === 'error' ? <p className="text-red-600 text-sm mt-4">Could not cancel booking. Please try again.</p> : null}
          </>
        )}
      </div>
    </main>
  )
}
