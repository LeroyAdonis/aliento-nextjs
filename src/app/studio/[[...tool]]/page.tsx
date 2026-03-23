/**
 * Sanity Studio — accessible at /studio
 * This is where Leegail manages all blog content.
 * NOTE: Protect this route with Better Auth in Phase 2.
 */
'use client'

import dynamic from 'next/dynamic'
import config from '../../../../sanity.config'

// Disable SSR — Sanity Studio requires browser APIs (React context, etc.)
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
)

export default function StudioPage() {
  return <NextStudio config={config} />
}
