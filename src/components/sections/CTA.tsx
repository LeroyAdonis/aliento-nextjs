'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background — deep gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-900 via-warm-800 to-primary-900" />
      
      {/* Organic shapes */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] organic-blob bg-primary-500/10 animate-breathe-slow" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] organic-blob bg-sage-500/10 animate-float" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
          backgroundSize: '48px 48px' 
        }} 
      />
      
      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-8 h-[2px] bg-primary-400" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">
              Start Today
            </span>
            <div className="w-8 h-[2px] bg-primary-400" />
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-white mb-8 leading-[1.1]">
            Ready to breathe<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-sage-300">
              easier?
            </span>
          </h2>
          
          {/* Subtext */}
          <p className="text-xl text-warm-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Book a consultation with our experienced team and discover how 
            personalised healthcare can transform your life.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="group bg-white text-warm-900 px-8 py-4 rounded-full font-medium text-lg hover:bg-warm-100 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <span>Get in touch</span>
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="tel:+27762367921"
              className="border-2 border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/10 transition-all flex items-center justify-center"
            >
              📞 Call now
            </a>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t border-white/10">
            {['Free consultation', 'No referral needed', 'Same-day appointments'].map((badge) => (
              <span key={badge} className="text-warm-400 text-sm flex items-center gap-2">
                <span className="text-sage-400">✓</span>
                {badge}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
