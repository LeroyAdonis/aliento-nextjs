import { Metadata } from 'next'
import { Services } from '@/components/sections/Services'

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Explore Aliento Medical services — consultations, diagnostics, preventive care, and more.',
}

export default function ServicesPage() {
  return <Services />
}
