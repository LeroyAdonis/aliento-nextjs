import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'

const SITE_URL = 'https://aliento.africa'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Aliento Medical — Breathe, Screen, Live',
    template: '%s | Aliento Medical',
  },
  description:
    'Aliento Medical is a health promotion and education platform for South Africans. Expert-backed articles on nutrition, mental health, screenings, chronic care, and more — plus virtual medical consultations.',
  keywords: [
    'health promotion', 'health education', 'virtual consultation',
    'South Africa', 'preventive care', 'wellness', 'medical advice',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [{ url: '/logo-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_ZA',
    url: SITE_URL,
    siteName: 'Aliento Medical',
    title: 'Aliento Medical — Empowering Personal Health',
    description: 'Personalised healthcare with cutting-edge technology and genuine compassion.',
    images: [
      {
        url: `${SITE_URL}/api/og?title=Aliento%20Medical%20%E2%80%94%20Empowering%20Personal%20Health&description=Personalised%20healthcare%20with%20cutting-edge%20technology%20and%20genuine%20compassion.`,
        width: 1200,
        height: 630,
        alt: 'Aliento Medical',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aliento Medical — Empowering Personal Health',
    description: 'Personalised healthcare with cutting-edge technology and genuine compassion.',
    images: [`${SITE_URL}/api/og?title=Aliento%20Medical%20%E2%80%94%20Empowering%20Personal%20Health&description=Personalised%20healthcare%20with%20cutting-edge%20technology%20and%20genuine%20compassion.`],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Aliento Medical",
    "alternateName": "Aliento",
    "url": SITE_URL,
    "logo": `${SITE_URL}/logo-icon.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+27-76-236-7921",
      "contactType": "customer service",
      "areaServed": "ZA",
      "availableLanguage": ["English"],
    },
    "medicalSpecialty": ["GeneralPractice"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "ZA",
    },
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
