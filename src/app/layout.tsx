import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  metadataBase: new URL('https://aliento-nextjs.vercel.app'),
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
    type: "website",
    locale: "en_ZA",
    url: "https://aliento-nextjs.vercel.app",
    siteName: "Aliento Medical",
    title: "Aliento — Empowering Personal Health",
    description: "Personalised healthcare with cutting-edge technology and genuine compassion.",
    images: [
      {
        url: "/api/og?title=Aliento%20%E2%80%94%20Empowering%20Personal%20Health&description=Personalised%20healthcare%20with%20cutting-edge%20technology%20and%20genuine%20compassion.",
        width: 1200,
        height: 630,
        alt: "Aliento Medical",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aliento — Empowering Personal Health",
    description: "Personalised healthcare with cutting-edge technology and genuine compassion.",
    images: ["/api/og?title=Aliento%20%E2%80%94%20Empowering%20Personal%20Health&description=Personalised%20healthcare%20with%20cutting-edge%20technology%20and%20genuine%20compassion."],
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
