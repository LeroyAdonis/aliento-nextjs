'use client'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const CalEmbed = dynamic(() => import('@/components/integrations/CalEmbed').then((m) => ({ default: m.CalEmbed })), {
  ssr: false,
})

export default function RescheduleClient() {
  const searchParams = useSearchParams()
  const rescheduleUid = searchParams.get('rescheduleUid') || searchParams.get('bookingUid') || ''
  const eventTypeSlug = searchParams.get('eventTypeSlug') || process.env.NEXT_PUBLIC_CALCOM_EVENT_SLUG_30 || ''

  return (
    <main className="min-h-screen bg-cream-100 px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-display font-semibold text-warm-900 mb-2">Reschedule consultation</h1>
        <p className="text-warm-500 mb-6">Pick a new time that works for you.</p>
        <div className="rounded-3xl border border-warm-200 bg-white p-2 lg:p-4 min-h-[760px]">
          <CalEmbed className="h-[740px] rounded-2xl overflow-hidden" eventSlug={eventTypeSlug} rescheduleUid={rescheduleUid} />
        </div>
      </div>
    </main>
  )
}
