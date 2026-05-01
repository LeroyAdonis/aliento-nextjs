'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const CalEmbed = dynamic(() => import('@/components/integrations/CalEmbed').then((m) => ({ default: m.CalEmbed })), {
  ssr: false,
})

type PaymentStatus = 'pending' | 'paid' | 'failed'

export function BookingContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get('paymentId') || undefined
  const [status, setStatus] = useState<PaymentStatus>('pending')

  const eventSlug = useMemo(() => {
    const duration = searchParams.get('duration') === '60' ? '60' : '30'
    return duration === '60'
      ? process.env.NEXT_PUBLIC_CALCOM_EVENT_SLUG_60 || ''
      : process.env.NEXT_PUBLIC_CALCOM_EVENT_SLUG_30 || ''
  }, [searchParams])

  useEffect(() => {
    if (!paymentId) {
      setStatus('failed')
      return
    }

    let stop = false
    const poll = async () => {
      try {
        const res = await fetch(`/api/payment/status/${paymentId}`, { cache: 'no-store' })
        if (!res.ok) {
          setStatus('failed')
          return
        }
        const data = await res.json()
        if (!stop) {
          setStatus(data.status)
        }
      } catch {
        if (!stop) setStatus('failed')
      }
    }

    poll()
    const id = setInterval(poll, 3000)

    return () => {
      stop = true
      clearInterval(id)
    }
  }, [paymentId])

  return (
    <main className="min-h-screen bg-cream-100 px-6 py-10 lg:py-14">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-3">Complete your consultation booking</h1>
        <p className="text-warm-500 mb-8">Payment is confirmed first, then your booking calendar unlocks below.</p>

        {status === 'pending' && (
          <div className="rounded-2xl border border-sage-200 bg-sage-50 p-5 text-sm text-sage-800 mb-6">
            We&apos;re waiting for PayFast confirmation. This usually takes a few seconds...
          </div>
        )}

        {status === 'failed' && (
          <div className="rounded-2xl border border-blush-200 bg-blush-50 p-5 text-sm text-warm-700 mb-6">
            We couldn&apos;t verify this payment session. Please restart from the consult page.
            <div className="mt-3">
              <Link href="/consult" className="text-sage-700 underline">Back to consult</Link>
            </div>
          </div>
        )}

        {status === 'paid' && (
          <div className="rounded-3xl border border-warm-200 bg-white p-2 lg:p-4 min-h-[760px]">
            <CalEmbed className="h-[740px] rounded-2xl overflow-hidden" eventSlug={eventSlug} />
          </div>
        )}
      </div>
    </main>
  )
}
