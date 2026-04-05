import { Metadata } from 'next'
import { Services } from '@/components/sections/Services'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore Aliento Medical services — consultations, diagnostics, preventive care, and more.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/services`,
    title: 'Our Services | Aliento Medical',
    description: 'Explore Aliento Medical services — consultations, diagnostics, preventive care, and more.',
    siteName: 'Aliento Medical',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Our Services | Aliento Medical',
    description: 'Explore Aliento Medical services — consultations, diagnostics, preventive care, and more.',
  },
}

export default function ServicesPage() {
  return <Services />
}
