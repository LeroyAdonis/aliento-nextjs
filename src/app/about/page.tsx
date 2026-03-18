import { Metadata } from 'next'
import { About } from '@/components/sections/About'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Aliento Medical — your partner in personalised healthcare.',
}

export default function AboutPage() {
  return <About />
}
