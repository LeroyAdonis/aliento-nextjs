'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Video, Clock, Shield } from 'lucide-react'

const highlights = [
  { icon: Video,  label: 'Zoom & Teams',   detail: 'Your preferred platform' },
  { icon: Clock,  label: 'R500 / hour',    detail: '30 min or 1-hour sessions' },
  { icon: Shield, label: 'Visual consults', detail: 'Show rashes, lumps, swelling' },
]

export function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-blush-50 relative overflow-hidden">
      {/* Soft background shape */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] organic-blob bg-blush-100/60 animate-breathe-slow opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blush-500" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-blush-600">
                Virtual consultations
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-5 leading-snug">
              Have a health question?
              <br />
              <span className="italic text-blush-700">Talk to a real doctor.</span>
            </h2>

            <p className="text-warm-500 leading-relaxed mb-8 max-w-md">
              Book a face-to-face virtual consultation via Zoom or Microsoft Teams.
              Show rashes, lumps, swelling — all from the comfort of your home.
              No waiting rooms. No referrals needed.
            </p>

            <Link
              href="/consult"
              className="group inline-flex items-center gap-2 bg-blush-600 text-white px-7 py-3.5 rounded-full font-body font-medium text-sm hover:bg-blush-700 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Book a Consult
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right: highlights */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {highlights.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="flex items-center gap-5 bg-white/70 rounded-2xl p-5 border border-blush-200/50 backdrop-blur-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-blush-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-blush-600" />
                </div>
                <div>
                  <p className="font-body font-semibold text-warm-900 text-sm">{label}</p>
                  <p className="text-warm-400 text-xs mt-0.5">{detail}</p>
                </div>
              </div>
            ))}

            <p className="text-xs text-warm-400 mt-2 leading-relaxed">
              Payment is required upfront at time of booking. Credit card accepted.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
