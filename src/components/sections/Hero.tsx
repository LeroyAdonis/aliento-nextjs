 
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75 } },
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grain pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-sage-50/40 to-cream-100" />

      {/* Organic blobs */}
      <div className="absolute top-1/4 right-1/3 w-[560px] h-[560px] organic-blob bg-gradient-to-br from-sage-100/50 to-sage-200/30 animate-drift opacity-70" />
      <div className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] organic-blob bg-gradient-to-br from-blush-100/40 to-blush-200/30 animate-breathe-slow opacity-60" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 py-24 text-center z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.22em] uppercase text-sage-500">
              Health Promotion & Education
            </span>
            <div className="w-8 h-px bg-sage-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-[5rem] font-display font-semibold leading-[1.08] tracking-tight mb-7 text-warm-900"
          >
            Your health,
            <br />
            <span className="text-gradient-primary italic">explained clearly.</span>
          </motion.h1>

          {/* Payoff line */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-sage-600 font-body font-medium tracking-wide mb-5 italic"
          >
            &quot;Breathe, Screen, Live&quot;
          </motion.p>

          {/* Supporting text */}
          <motion.p
            variants={fadeUp}
            className="text-lg lg:text-xl text-warm-500 max-w-2xl leading-relaxed mb-12 font-light"
          >
            Expert-backed health articles, preventive guidance, and virtual consultations
            — like having a knowledgeable friend who happens to be a doctor.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/health-topics"
              className="group relative bg-sage-400 text-white px-8 py-4 rounded-full font-body font-medium text-base hover:bg-sage-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Health Topics
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/consult"
              className="border border-warm-300 text-warm-700 bg-white/70 px-8 py-4 rounded-full font-body font-medium text-base hover:border-sage-400 hover:text-sage-600 hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Book a Virtual Consult
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: '🌿', label: 'Evidence-based' },
              { icon: '💻', label: 'Virtual consultations' },
              { icon: '🇿🇦', label: 'South African context' },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm font-body font-medium text-warm-600 bg-white/60 px-4 py-2 rounded-full border border-warm-200/60 backdrop-blur-sm"
              >
                <span>{item.icon}</span>
                {item.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
