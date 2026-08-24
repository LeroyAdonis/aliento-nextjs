import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Aliento — Online Doctor Support',
  description:
    'Questions about virtual consultations, prescriptions or sick notes? Email info@alientomd.com — Johannesburg-based, serving all of South Africa.',
  alternates: { canonical: 'https://alientomd.com/contact' },
}

export default function ContactLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children
}
