/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
'use client'

import { motion } from 'framer-motion'
import { Heart, MapPin, Clock, Phone } from 'lucide-react'

const stats = [
  { icon: MapPin, number: 'JHB', label: 'South Africa', color: 'text-primary-500' },
  { icon: Clock, number: 'Mon–Fri', label: '8AM – 5PM', color: 'text-sage-500' },
  { icon: Phone, number: 'Call Us', label: 'Appointments & walk-ins', color: 'text-coral-500' },
  { icon: Heart, number: 'Patient', label: 'Centred care', color: 'text-primary-600' },
]

export function About() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-warm-50 via-primary-50/20 to-warm-50" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] organic-blob bg-sage-100/30 animate-breathe-slow" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 as const }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-primary-500" />
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">About Us</span>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-warm-900 mb-8 leading-[1.1]">
              Healthcare that<br />
              <span className="text-gradient-primary">actually</span> cares<br />
              about you.
            </h2>
            
            <div className="space-y-6 text-warm-600 text-lg leading-relaxed">
              <p>
                At Aliento, we believe healthcare should be more than just treating symptoms — 
                it's about understanding you as a person. Our patient-centred approach combines 
                cutting-edge medical technology with genuine human compassion.
              </p>
              <div className="editorial-quote">
                <p className="text-warm-700 italic text-lg">
                  "We don't just treat conditions — we partner with you on your health journey."
                </p>
              </div>
              <p>
                With over a decade of experience, our team is dedicated to providing 
                personalised care that empowers you to take control of your wellbeing.
              </p>
            </div>
          </motion.div>
          
          {/* Visual — Stats grid with floating elements */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 as const }}
            className="relative"
          >
            {/* Decorative circle */}
            <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full border border-primary-200/40 animate-breathe-slow" />
            
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="group bg-white rounded-3xl border border-warm-200/60 p-6 lg:p-8 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
                >
                  <stat.icon className={`${stat.color} mb-4 transition-transform duration-300 group-hover:scale-110`} size={28} />
                  <div className="text-4xl lg:text-5xl font-display font-bold text-warm-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-warm-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            {/* Floating accent */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 organic-blob bg-gradient-to-br from-coral-200/60 to-coral-300/40 animate-float" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
