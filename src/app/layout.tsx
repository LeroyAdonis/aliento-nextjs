import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: {
    default:  'Aliento — Breathe, Screen, Live',
    template: '%s | Aliento',
  },
  description:
    'Aliento is a health promotion and education platform for South Africans. Expert-backed articles on nutrition, mental health, screenings, chronic care, and more — plus virtual medical consultations.',
  keywords: [
    'health promotion', 'health education', 'virtual consultation',
    'South Africa', 'preventive care', 'wellness', 'medical advice',
  ],
  icons: {
    icon: [{ url: '/logo-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type:        'website',
    locale:      'en_ZA',
    siteName:    'Aliento',
    title:       'Aliento — Breathe, Screen, Live',
    description: 'Health promotion, education, and virtual consultations for South Africans.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
