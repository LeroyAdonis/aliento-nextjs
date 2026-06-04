import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  metadataBase: new URL('https://alientomd.com'),
  title: {
    default:  'Aliento — Breathe, Screen, Live',
    template: '%s | Aliento',
  },
  description:
    'Health promotion and virtual medical consultations with Dr. Leegale Adonis. Expert-backed articles on nutrition, mental health, screenings, chronic care, and more — from the comfort of home.',
  keywords: [
    'health promotion', 'health education', 'virtual consultation',
    'South Africa', 'preventive care', 'wellness', 'medical advice',
    'Dr Leegale Adonis', 'telemedicine',
  ],
  icons: {
    icon: [{ url: '/logo-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: "https://alientomd.com",
    siteName: "Aliento",
    title: "Aliento — Breathe, Screen, Live",
    description: "Expert-backed health education and virtual consultations with Dr. Leegale Adonis. Book a consult or explore our health topics.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Aliento — Health Promotion & Virtual Consultations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliento — Breathe, Screen, Live",
    description: "Expert-backed health education and virtual consultations with Dr. Leegale Adonis.",
    images: ["/api/og"],
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
