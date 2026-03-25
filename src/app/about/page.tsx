import { Metadata } from 'next'
import { About } from '@/components/sections/About'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Aliento is a health promotion platform built by a medical professional. Learn our story, our values, and what we cover.',
}

export default function AboutPage() {
  return <About />
}
