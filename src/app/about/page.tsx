import { Metadata } from 'next'
import { About } from '@/components/sections/About'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Aliento is a health promotion platform by Dr. Leegale Adonis — public health specialist, MBBCH, MBA, FCPHM (SA), MMed, Comm Health, PhD. Learn our story and values.',
}

export default function AboutPage() {
  return <About />
}
