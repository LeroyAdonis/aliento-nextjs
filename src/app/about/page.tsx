import { Metadata } from 'next'
import { About } from '@/components/sections/About'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Aliento is a health promotion platform built by a medical professional. Learn our story, our values, and what we cover.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/about`,
    title: 'About Us | Aliento Medical',
    description: 'Aliento is a health promotion platform built by a medical professional. Learn our story, our values, and what we cover.',
    siteName: 'Aliento Medical',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Aliento Medical',
    description: 'Aliento is a health promotion platform built by a medical professional. Learn our story, our values, and what we cover.',
  },
}

export default function AboutPage() {
  return <About />
}
