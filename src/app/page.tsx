import { Hero } from '@/components/sections/Hero'
import { Process } from '@/components/sections/Process'
import { WhyChooseUs } from '@/components/sections/WhyChooseUs'
import { Conditions } from '@/components/sections/Conditions'
import { CTA } from '@/components/sections/CTA'

export default function Home() {
  return (
    <>
      <Hero />
      <Process />
      <Conditions />
      <WhyChooseUs />
      <CTA />
    </>
  )
}
