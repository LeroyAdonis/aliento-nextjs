'use client'

import Cal, { getCalApi } from '@calcom/embed-react'
import { useEffect } from 'react'

interface CalEmbedProps {
  calUsername?: string
  className?: string
}

export function CalEmbed({ calUsername, className }: CalEmbedProps) {
  const username = calUsername || process.env.NEXT_PUBLIC_CALCOM_USERNAME || 'leegale'

  useEffect(() => {
    ;(async () => {
      const cal = await getCalApi()
      cal('ui', {
        theme: 'light',
        styles: { branding: { brandColor: '#7db8f7' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    })()
  }, [])

  return (
    <div className={className}>
      <Cal
        calLink={username}
        style={{ width: '100%', height: '100%', overflow: 'scroll' }}
        config={{ layout: 'month_view', theme: 'light' }}
      />
    </div>
  )
}
