'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 as const } }
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grain pt-20">
      {/* Soft warm pastel background layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-warm-50 via-warm-100/50 to-warm-50" />
      
      {/* Background blobs — very soft pastels */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] organic-blob bg-gradient-to-br from-coral-100/40 to-sand-200/40 animate-drift opacity-60" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] organic-blob bg-gradient-to-br from-primary-100/50 to-sage-100/50 animate-breathe-slow opacity-60" />
      
      <div className="relative max-w-5xl mx-auto px-6 lg:px-12 py-24 text-center z-10">
        <motion.div 
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-warm-400" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-500">
              Aliento Medical
            </span>
            <div className="w-8 h-[1px] bg-warm-400" />
          </motion.div>
          
          {/* Headline - Centered, emotional, clean */}
          <motion.h1 
            variants={fadeUp}
            className="text-5xl sm:text-7xl lg:text-[5.5rem] font-display font-bold leading-[1.05] tracking-tight mb-8 text-warm-900"
          >
            Breathe, Screen, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 to-primary-500">Live.</span>
          </motion.h1>
          
          {/* Supporting text */}
          <motion.p 
            variants={fadeUp}
            className="text-xl lg:text-2xl text-warm-600 max-w-2xl leading-relaxed mb-12 font-light"
          >
            Health promotion, education, and virtual consultations. Expert-backed care that feels less like a clinic, and more like a conversation.
          </motion.p>
          
          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="group relative bg-warm-900 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-warm-800 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg hover:shadow-xl"
            >
              <span className="relative z-10">Book a Consultation</span>
              <ArrowRight size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/blog"
              className="group bg-white border border-warm-200 text-warm-800 px-8 py-4 rounded-full font-medium text-lg hover:border-warm-300 hover:bg-warm-50 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
            >
              Read the Blog
            </Link>
          </motion.div>
          
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap justify-center gap-6 sm:gap-12">
            {[ 
              { label: 'Virtual Consultations', icon: '💻' },
              { label: 'Health Education', icon: '📚' },
              { label: 'Preventive Screening', icon: '🩺' }
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-sm font-medium text-warm-600 bg-white/60 px-4 py-2 rounded-full border border-warm-200/50 backdrop-blur-sm">
                <span>{feature.icon}</span>
                <span>{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
