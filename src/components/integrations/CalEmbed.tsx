'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

interface CalEmbedProps {
  calUsername?: string
  eventSlug: string
  prefill?: {
    name?: string
    email?: string
  }
  rescheduleUid?: string
  className?: string
}

export function CalEmbed({
  calUsername,
  eventSlug,
  prefill,
  rescheduleUid,
  className,
}: CalEmbedProps) {
  const username = calUsername || process.env.NEXT_PUBLIC_CALCOM_USERNAME

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#7C9E8A' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [])

  if (!username) {
    return (
      <div className="rounded-2xl border border-blush-200 bg-blush-50 px-4 py-6 text-sm text-warm-600">
        Booking is temporarily unavailable. Please set <code>NEXT_PUBLIC_CALCOM_USERNAME</code>.
      </div>
    )
  }

  const calLink = `${username}/${eventSlug}`

  return (
    <div className={className}>
      <Cal
        calLink={calLink}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
        config={{
          layout: 'month_view',
          theme: 'light',
          ...(prefill?.name ? { name: prefill.name } : {}),
          ...(prefill?.email ? { email: prefill.email } : {}),
          ...(rescheduleUid ? { rescheduleUid } : {}),
        }}
      />
    </div>
  )
}
