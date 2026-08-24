import { Metadata } from 'next'
import { About } from '@/components/sections/About'

export const metadata: Metadata = {
  title: 'About Dr Leegale Adonis — Public Health Specialist, Johannesburg',
  description:
    'Aliento is a health promotion platform by Dr. Leegale Adonis — public health specialist, MBBCH, MBA, FCPHM (SA), MMed, Comm Health, PhD. Learn our story and values.',
  alternates: { canonical: 'https://alientomd.com/about' },
}

export default function AboutPage() {
  return <About />
}
