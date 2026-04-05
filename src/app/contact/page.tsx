import { Metadata } from 'next'
import ContactPage from './ContactClient'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aliento.africa'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Aliento Medical. Book a consultation, send a message, or learn about our virtual healthcare services.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/contact`,
    title: 'Contact Us | Aliento Medical',
    description: 'Get in touch with Aliento Medical. Book a consultation, send a message, or learn about our virtual healthcare services.',
    siteName: 'Aliento Medical',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Aliento Medical',
    description: 'Get in touch with Aliento Medical. Book a consultation, send a message, or learn about our virtual healthcare services.',
  },
}

export default function ContactServerPage() {
  return <ContactPage />
}
