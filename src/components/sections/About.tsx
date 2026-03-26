import Link from 'next/link'
import { ArrowRight, BookOpen, Heart, Users } from 'lucide-react'

const values = [
  {
    icon: BookOpen,
    title: 'Education First',
    body: 'Every article is evidence-based and written to be understood, not just impressed. We translate medicine into language that empowers you to act.',
  },
  {
    icon: Heart,
    title: 'Warm & Approachable',
    body: 'Healthcare should feel human. We ditch the jargon and the clipboard stare. Think of us as the medically qualified friend you\'ve always wanted.',
  },
  {
    icon: Users,
    title: 'Built for South Africans',
    body: 'Our content reflects South African realities — from public health challenges to the lifestyle pressures that shape our wellbeing every day.',
  },
]

export function About() {
  return (
    <div className="bg-cream-100">

      {/* Hero */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sage-50/60 to-cream-100 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
              About Aliento
            </span>
            <div className="w-8 h-px bg-sage-400" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-semibold text-warm-900 mb-7 leading-tight">
            We believe everyone deserves
            <br />
            <span className="text-gradient-primary italic">to understand their health.</span>
          </h1>
          <p className="text-xl text-warm-500 max-w-2xl mx-auto leading-relaxed">
            Aliento is a health promotion platform created by a medical professional
            who got tired of watching people suffer from conditions that could have been
            prevented — or at least better understood.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-20 bg-white/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Photo placeholder */}
            <div className="rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200/70 aspect-[4/5] max-w-sm mx-auto flex items-center justify-center">
              <span className="text-9xl opacity-25 select-none">👩‍⚕️</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-warm-900 mb-8 leading-[1.1]">
              Healthcare that<br />
              <span className="text-gradient-primary">actually</span> cares<br />
              about you.
            </h2>
            
            <div className="space-y-6 text-warm-600 text-lg leading-relaxed">
              <p>
                At Aliento, we believe healthcare should be more than just treating symptoms — 
                it&apos;s about understanding you as a person. Our patient-centred approach combines 
                cutting-edge medical technology with genuine human compassion.
              </p>
              <div className="editorial-quote">
                <p className="text-warm-700 italic text-lg">
                  &quot;We don&apos;t just treat conditions — we partner with you on your health journey.&quot;
                </p>
              </div>
              <blockquote className="editorial-quote mt-8 text-warm-700">
                <p>&quot;Breathe, Screen, Live — it&apos;s not just a tagline. It&apos;s a philosophy.&quot;</p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-10 text-center">
            What we stand for
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white/70 border border-warm-200/50 p-8">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-sage-500" />
                </div>
                <h3 className="font-display text-lg font-semibold text-warm-900 mb-3">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-16 bg-sage-50/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-5">
            What Aliento covers
          </h2>
          <p className="text-warm-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            This is an informational and educational platform. We do not replace your doctor or offer
            in-person care. We do offer clarity, context, and — when you need it — a virtual consultation
            with a qualified medical professional.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Health Promotion','Preventive Screening','Medical Conditions','Mental Wellness',
              'Nutrition','Novel Research','Chronic Care','Virtual Consultations'].map((tag) => (
              <span key={tag} className="text-sm font-body font-medium bg-sage-100 text-sage-700 px-4 py-2 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-5">
            Ready to take control of your health?
          </h2>
          <p className="text-warm-500 mb-8">
            Start with our Health Topics library — or book a virtual consultation to speak
            directly with a doctor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/health-topics"
              className="group inline-flex items-center gap-2 bg-sage-400 text-white px-7 py-3.5 rounded-full font-body font-medium text-sm hover:bg-sage-500 transition-all shadow-sm"
            >
              Explore Health Topics <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/consult"
              className="inline-flex items-center justify-center gap-2 border border-warm-300 text-warm-700 px-7 py-3.5 rounded-full font-body font-medium text-sm hover:border-blush-500 hover:text-blush-700 transition-all"
            >
              Book a Consult
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
