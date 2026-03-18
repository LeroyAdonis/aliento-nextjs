'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const conditions = [
  { name: 'Diabetes Management', desc: 'Blood sugar monitoring, lifestyle guidance, medication management.' },
  { name: 'Hypertension', desc: 'Blood pressure tracking, cardiovascular risk assessment.' },
  { name: 'Respiratory Conditions', desc: 'Asthma, allergies, and breathing difficulties.' },
  { name: 'Mental Health', desc: 'Anxiety, depression, stress management, counselling referrals.' },
  { name: 'Women\'s Health', desc: 'Reproductive health, screenings, wellness checks.' },
  { name: 'Family Medicine', desc: 'Paediatric care, adult health, senior wellness.' },
]

export function Conditions() {
  return (
    <section className="py-24 lg:py-32 bg-warm-50 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] organic-blob bg-sage-100/30 animate-float" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400 mb-4 block">Conditions We Treat</span>
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-warm-900 mb-6 leading-tight">
              Comprehensive care for<br />
              <span className="text-gradient-primary">every stage of life.</span>
            </h2>
            <p className="text-lg text-warm-500 leading-relaxed mb-8">
              From common ailments to chronic condition management, our team provides 
              evidence-based care that puts you first.
            </p>
            <Link 
              href="/services" 
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 group"
            >
              View all services
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {conditions.map((condition, index) => (
              <motion.div
                key={condition.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-white rounded-2xl border border-warm-200/60 p-6 hover:border-primary-200 hover:shadow-lg transition-all duration-300 group"
              >
                <h3 className="font-display font-semibold text-warm-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {condition.name}
                </h3>
                <p className="text-warm-500 text-sm leading-relaxed">{condition.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
