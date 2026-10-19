import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  metadataBase: new URL('https://alientomd.com'),
  title: {
    default: 'Preventive Care & Online Doctor South Africa — from R500 | Aliento',
    template: '%s | Aliento',
  },
  description:
    'Preventive care and virtual consultations with a registered South African doctor — from R500 (20 min) or R700 (35 min). Sick notes and prescriptions R500, second opinions R250, all reviewed by Dr Leegale Adonis within 24 hours.',
  keywords: [
    'health promotion', 'health education', 'virtual consultation',
    'South Africa', 'preventive care', 'wellness', 'medical advice',
    'Dr Leegale Adonis', 'telemedicine',
  ],
  applicationName: 'Aliento',
  // The tab icon used to be Next's shipped default — the Vercel triangle — because `src/app/favicon.ico` was
  // never replaced. It is now the brand leaf, generated from `public/logo-icon.svg` by
  // `scripts/build-favicons.py`, and the apple/manifest icons are declared so iOS and Android do not fall back.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48 64x64 128x128 256x256' },
      { url: '/logo-icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/manifest.webmanifest',
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
        alt: "Aliento — Preventive Care & Virtual Consultations",
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

// themeColor lives on the viewport export in Next 16 — putting it in `metadata` is ignored without a warning.
// cream-50 is the site's own page background, so the mobile browser chrome matches the page instead of going
// black above a paper-coloured site.
export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fefcf8' },
    { media: '(prefers-color-scheme: dark)', color: '#1e2e24' },
  ],
  colorScheme: 'light',
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
