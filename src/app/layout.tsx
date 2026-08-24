import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  metadataBase: new URL('https://alientomd.com'),
  title: {
    default: 'Online Doctor South Africa — R250 Virtual GP Consultations | Aliento',
    template: '%s | Aliento',
  },
  description:
    'Consult a registered South African doctor online for R250. Sick notes, repeat prescriptions and second opinions reviewed by Dr Leegale Adonis within 24 hours.',
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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // Admin pages (Sanity Studio) need full viewport without site layout
  if (pathname.startsWith('/admin')) {
    return (
      <html lang="en">
        <body className="antialiased">{children}</body>
      </html>
    )
  }

  return (
    <html lang="en">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
