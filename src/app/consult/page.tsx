import { Metadata } from 'next'
import ConsultPage from './ConsultClient'

export const metadata: Metadata = {
  title: 'Book a Virtual Consultation',
  description: 'Book a face-to-face virtual consultation with Aliento\'s medical team via Zoom or Microsoft Teams. R250 for 30 min · R500 for 1 hour.',
}

export default function Consult() {
  return <ConsultPage />
}

