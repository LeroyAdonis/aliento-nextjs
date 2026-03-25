import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutDoctor() {
  return (
    <section className="py-20 lg:py-28 bg-sage-50/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Illustration / photo placeholder */}
          <div className="relative order-2 md:order-1">
            <div className="rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200/70 aspect-[4/5] max-w-sm mx-auto flex items-center justify-center">
              <span className="text-8xl opacity-30 select-none">👩‍⚕️</span>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-2 md:right-8 bg-white rounded-2xl shadow-md p-5 border border-warm-200/60 max-w-[200px]">
              <p className="text-xs text-warm-400 uppercase tracking-wider font-body font-semibold mb-1">Mission</p>
              <p className="text-sm text-warm-700 leading-snug font-display italic">
                &quot;Healthcare that feels human.&quot;
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-sage-400" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
                About Aliento
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-6 leading-snug">
              A knowledgeable friend
              <br />
              <span className="text-gradient-primary italic">who happens to be a doctor</span>
            </h2>

            <div className="space-y-4 text-warm-600 leading-relaxed">
              <p>
                Aliento was built on a simple belief: every person deserves to understand their own health.
                Not through confusing medical jargon or 2AM Google spirals — but through clear,
                honest conversations backed by real medical expertise.
              </p>
              <p>
                As a medical professional, I&apos;ve seen how a lack of accessible health information leads to
                delayed diagnoses, unnecessary anxiety, and preventable illness. This site is my answer
                to that gap.
              </p>
              <p>
                Here you&apos;ll find evidence-based articles on everything from managing chronic conditions to
                understanding your screening results — written the way I&apos;d explain it to a friend over
                a cup of tea.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 bg-sage-400 text-white px-6 py-3 rounded-full text-sm font-body font-medium hover:bg-sage-500 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                Learn more about us
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/consult"
                className="inline-flex items-center justify-center gap-2 border border-warm-300 text-warm-700 px-6 py-3 rounded-full text-sm font-body font-medium hover:border-sage-400 hover:text-sage-600 transition-all"
              >
                Book a consult
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
