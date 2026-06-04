'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart, Shield, Users, DollarSign } from 'lucide-react'

const painPoints = [
  {
    icon: DollarSign,
    label: 'Medical aid is unaffordable',
    detail: 'Monthly premiums of R2 000+ are out of reach for millions of South Africans.',
  },
  {
    icon: Users,
    label: 'Government clinics feel overcrowded',
    detail: 'Long queues and limited time with a doctor make it hard to get real answers.',
  },
  {
    icon: Shield,
    label: 'Preventive care gets skipped',
    detail: 'Without easy access, small health concerns become big problems.',
  },
]

export function ForgottenMiddle() {
  return (
    <section className="py-20 lg:py-28 bg-warm-100/60 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] organic-blob bg-sage-100/30 animate-drift opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] organic-blob bg-blush-100/20 animate-breathe-slow opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
              For the forgotten middle
            </span>
            <div className="w-8 h-px bg-sage-400" />
          </div>

          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-6 leading-tight">
            Quality care for{' '}
            <span className="italic text-blush-700">the millions in between</span>
          </h2>

          <p className="text-lg text-warm-500 max-w-2xl mx-auto leading-relaxed">
            You work hard. You pay your taxes. But medical aid costs more than your car payment,
            and the local clinic is overcrowded and under-resourced. Where do you go?
          </p>
        </motion.div>

        {/* Pain points grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {painPoints.map(({ icon: Icon, label, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="bg-white/80 rounded-2xl p-7 border border-warm-200/60 backdrop-blur-sm hover:shadow-sm transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-blush-100 flex items-center justify-center mb-5">
                <Icon size={20} className="text-blush-600" />
              </div>
              <h3 className="font-display font-semibold text-warm-900 text-lg mb-2">{label}</h3>
              <p className="text-warm-500 text-sm leading-relaxed">{detail}</p>
            </motion.div>
          ))}
        </div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, delay: 0.3 }}
          className="bg-sage-50 rounded-3xl p-10 lg:p-14 border border-sage-200/60 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-3 mb-5">
            <Heart size={18} className="text-sage-500" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-600">
              Aliento&apos;s answer
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-4 leading-snug">
                Expert care.{' '}
                <span className="italic text-sage-600">No waiting room required.</span>
              </h3>
              <p className="text-warm-600 leading-relaxed mb-6">
                R250 for a 20-minute virtual consultation with a qualified doctor.
                No medical aid needed. No waiting lists. No referrals.
                Just clear, honest healthcare advice — from the comfort of your home.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/consult"
                  className="group inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full text-sm font-body font-medium hover:bg-sage-600 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  Book a Consult
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/health-topics"
                  className="inline-flex items-center justify-center gap-2 border border-sage-300 text-sage-700 px-6 py-3 rounded-full text-sm font-body font-medium hover:bg-sage-100 transition-all"
                >
                  Browse free articles
                </Link>
              </div>
            </div>

            <div className="bg-white/70 rounded-2xl p-6 border border-sage-200/50 max-w-sm mx-auto lg:ml-auto">
              <p className="text-xs text-warm-400 uppercase tracking-wider font-semibold mb-3">Compare</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blush-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-warm-900">Medical Aid</p>
                    <p className="text-xs text-warm-500">R2 000+ per month + waiting periods</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blush-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-warm-900">Government Clinic</p>
                    <p className="text-xs text-warm-500">Free but long queues, limited time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-sage-700">Aliento</p>
                    <p className="text-xs text-warm-500">R250 per consult, no queues, real access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
