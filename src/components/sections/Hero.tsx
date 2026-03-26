 
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 as const } }
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden grain">
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/30 to-sand-50" />
      
      {/* Organic breathing blobs */}
      <div className="absolute top-20 -right-20 w-[600px] h-[600px] organic-blob bg-gradient-to-br from-primary-200/40 to-sage-200/30 animate-drift" />
      <div className="absolute -bottom-32 -left-20 w-[500px] h-[500px] organic-blob bg-gradient-to-br from-coral-100/30 to-sand-200/40 animate-breathe-slow" />
      <div className="absolute top-1/2 right-1/4 w-[300px] h-[300px] organic-blob bg-gradient-to-br from-sage-200/20 to-primary-100/30 animate-float" />
      
      {/* Geometric accent (editorial touch) */}
      <div className="absolute top-32 left-20 w-24 h-24 border-2 border-primary-200/40 rounded-full animate-breathe" />
      <div className="absolute bottom-40 right-32 w-16 h-16 border border-coral-200/50 rotate-45 animate-breathe delay-300" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <motion.div 
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <div className="w-12 h-[2px] bg-gradient-to-r from-primary-500 to-coral-400" />
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-warm-500">
              Healthcare, Elevated
            </span>
          </motion.div>
          
          {/* Massive headline */}
          <motion.h1 
            variants={fadeUp}
            className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold leading-[0.95] tracking-tight mb-8"
          >
            <span className="block text-warm-900">Your health</span>
            <span className="block mt-2">
              <span className="text-gradient-primary">deserves</span>
            </span>
            <span className="block mt-2 text-warm-900">more.</span>
          </motion.h1>
          
          {/* Supporting text */}
          <motion.p 
            variants={fadeUp}
            className="text-xl lg:text-2xl text-warm-500 max-w-2xl leading-relaxed mb-12 font-light"
          >
            Experience healthcare that truly understands you. We combine cutting-edge 
            technology with genuine compassion — because you deserve nothing less.
          </motion.p>
          
          {/* CTAs */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="group relative bg-warm-900 text-white px-8 py-4 rounded-full font-medium text-base hover:bg-warm-800 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
            >
              <span className="relative z-10">Begin your journey</span>
              <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-sage-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
            <Link
              href="/about"
              className="group bg-transparent border-2 border-warm-300 text-warm-700 px-8 py-4 rounded-full font-medium text-base hover:border-warm-400 hover:bg-warm-100 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Discover more
            </Link>
          </motion.div>
          

        </motion.div>
      </div>
      
      {/* Floating visual element (right side on desktop) */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[45%] h-[70%]">
        <div className="relative w-full h-full">
          {/* Main visual card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 as const }}
            className="absolute right-8 top-1/2 -translate-y-1/2 w-80 glass-card p-8 rotate-2 hover:rotate-0 transition-transform duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-sage-500 flex items-center justify-center text-white text-xl font-display font-bold">
                A
              </div>
              <div>
                <div className="font-display font-semibold text-warm-900">Aliento</div>
                <div className="text-sm text-warm-400">Your health partner</div>
              </div>
            </div>
            <div className="space-y-3">
              {['Consultations available', 'Diagnostics in-house', 'Follow-up included'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-warm-600">
                  <div className="w-2 h-2 rounded-full bg-sage-400" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-warm-50 rounded-xl">
              <p className="text-sm text-warm-700 font-medium">📞 +27 76 236 7921</p>
            </div>
          </motion.div>
          
          {/* Floating accent */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2, type: "spring" }}
            className="absolute bottom-16 left-8 w-20 h-20 organic-blob bg-gradient-to-br from-coral-300/60 to-coral-400/40 animate-breathe flex items-center justify-center"
          >
            <span className="text-2xl">💚</span>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
