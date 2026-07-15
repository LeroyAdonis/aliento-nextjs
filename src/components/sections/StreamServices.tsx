'use client'

import { motion, type Variants } from 'framer-motion'
import Link from 'next/link'
import {
  Video,
  Pill,
  FileText,
  ClipboardCheck,
} from 'lucide-react'

/* ── Stream config ── */
const streams = [
  {
    icon: Video,
    title: 'Virtual Consult',
    description:
      'Talk face-to-face with a healthcare professional from the comfort of your home.',
    price: 'R250 – R500',
    href: '/consult',
    cardBg: 'bg-sage-50/70',
    cardBorder: 'border-sage-200',
    iconBg: 'bg-sage-100',
    iconColor: 'text-sage-600',
    priceBg: 'bg-sage-200/60',
    priceText: 'text-sage-800',
    hoverBorder: 'group-hover:border-sage-300',
  },
  {
    icon: Pill,
    title: 'Get a Prescription',
    description:
      'Quick, online prescription renewals and new scripts for common conditions.',
    price: 'R250',
    href: '/prescription',
    cardBg: 'bg-blush-50/70',
    cardBorder: 'border-blush-200',
    iconBg: 'bg-blush-100',
    iconColor: 'text-blush-600',
    priceBg: 'bg-blush-200/60',
    priceText: 'text-blush-800',
    hoverBorder: 'group-hover:border-blush-300',
  },
  {
    icon: FileText,
    title: 'Sick Leave Assessment',
    description:
      'Get a valid medical certificate and return-to-work guidance — no clinic queues.',
    price: 'R250',
    href: '/sick-note',
    cardBg: 'bg-cream-50/70',
    cardBorder: 'border-cream-300',
    iconBg: 'bg-cream-200',
    iconColor: 'text-warm-700',
    priceBg: 'bg-cream-300/60',
    priceText: 'text-warm-800',
    hoverBorder: 'group-hover:border-cream-400',
  },
  {
    icon: ClipboardCheck,
    title: 'Second Opinion',
    description:
      'A fresh perspective on your diagnosis or treatment plan from an independent expert.',
    price: 'R250',
    href: '/second-opinion',
    cardBg: 'bg-sage-50/70',
    cardBorder: 'border-sage-200',
    iconBg: 'bg-sage-100',
    iconColor: 'text-sage-600',
    priceBg: 'bg-sage-200/60',
    priceText: 'text-sage-800',
    hoverBorder: 'group-hover:border-sage-300',
  },
]

/* ── Animation variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export function StreamServices() {
  return (
    <section id="services" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-sage-50/30 to-cream-100" />

      {/* Organic blob decoration */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] organic-blob bg-gradient-to-br from-sage-100/30 to-sage-200/20 animate-drift opacity-50" />
      <div className="absolute bottom-1/4 right-0 w-[380px] h-[380px] organic-blob bg-gradient-to-br from-blush-100/30 to-blush-200/20 animate-breathe-slow opacity-40" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-12">
        {/* Section heading */}
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="inline-block text-xs font-body font-semibold tracking-[0.22em] uppercase text-sage-500 mb-5"
          >
            Our Services
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-display font-semibold leading-[1.1] tracking-tight text-warm-900"
          >
            Healthcare that{' '}
            <span className="text-gradient-primary italic">fits your life.</span>
          </motion.h2>
        </div>

        {/* 2×2 Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8"
        >
          {streams.map((stream) => {
            const Icon = stream.icon
            return (
              <motion.div key={stream.title} variants={cardVariants}>
                <Link
                  href={stream.href}
                  className={`group block h-full rounded-2xl border ${stream.cardBorder} ${stream.cardBg} p-7 sm:p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] ${stream.hoverBorder}`}
                >
                  {/* Icon + Price row */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl ${stream.iconBg} flex items-center justify-center ${stream.iconColor} transition-colors duration-300`}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-semibold ${stream.priceBg} ${stream.priceText}`}
                    >
                      {stream.price}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-display font-semibold text-warm-900 mb-3">
                    {stream.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-warm-500 font-body leading-relaxed">
                    {stream.description}
                  </p>

                  {/* Link indicator */}
                  <div className="mt-5 flex items-center gap-1.5 text-sm font-body font-medium text-sage-500 group-hover:text-sage-600 transition-colors">
                    <span>Learn more</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      &rarr;
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
