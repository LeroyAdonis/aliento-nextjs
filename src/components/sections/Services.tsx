'use client'

import { motion } from 'framer-motion'
import { Stethoscope, Activity, Shield, Heart, Brain, Users, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const services = [
  { 
    icon: Stethoscope, 
    title: 'Consultations', 
    desc: 'Personalised one-on-one sessions with experienced practitioners who truly listen.',
    color: 'from-primary-500 to-primary-600',
    featured: true 
  },
  { 
    icon: Activity, 
    title: 'Diagnostics', 
    desc: 'Advanced diagnostic tools for accurate, timely health assessments.',
    color: 'from-sage-400 to-sage-500',
    featured: false 
  },
  { 
    icon: Shield, 
    title: 'Treatment Plans', 
    desc: 'Customised care plans tailored to your unique health needs.',
    color: 'from-coral-400 to-coral-500',
    featured: false 
  },
  { 
    icon: Heart, 
    title: 'Preventive Care', 
    desc: 'Stay ahead of health issues with proactive screening and wellness.',
    color: 'from-rose-400 to-rose-500',
    featured: true 
  },
  { 
    icon: Brain, 
    title: 'Mental Wellness', 
    desc: 'Compassionate support for your mental health and emotional wellbeing.',
    color: 'from-violet-400 to-violet-500',
    featured: false 
  },
  { 
    icon: Users, 
    title: 'Family Health', 
    desc: 'Comprehensive care for every member of your family.',
    color: 'from-amber-400 to-amber-500',
    featured: false 
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 as const } }
}

export function Services() {
  const featured = services.filter(s => s.featured)
  const regular = services.filter(s => !s.featured)

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden grain">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-warm-200 to-transparent" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] organic-blob bg-primary-100/20 animate-breathe-slow" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header — editorial style */}
        <div className="mb-16 lg:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-primary-500" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">Services</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-display font-bold text-warm-900 mb-6">
            Care that<br />
            <span className="text-gradient-primary">actually</span> cares.
          </h2>
          <p className="text-lg text-warm-500 max-w-xl">
            From routine check-ups to specialised treatments — everything you need, 
            delivered with genuine compassion.
          </p>
        </div>

        {/* Editorial asymmetric grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6"
        >
          {/* Featured card — large */}
          <motion.div variants={item} className="md:col-span-7 lg:col-span-8">
            <ServiceCard service={featured[0]} large />
          </motion.div>
          
          {/* Regular cards — smaller */}
          <motion.div variants={item} className="md:col-span-5 lg:col-span-4">
            <ServiceCard service={regular[0]} />
          </motion.div>
          
          <motion.div variants={item} className="md:col-span-4 lg:col-span-4">
            <ServiceCard service={regular[1]} />
          </motion.div>
          
          <motion.div variants={item} className="md:col-span-8 lg:col-span-8">
            <ServiceCard service={featured[1]} large />
          </motion.div>
          
          <motion.div variants={item} className="md:col-span-6 lg:col-span-5">
            <ServiceCard service={regular[2]} />
          </motion.div>
          
          <motion.div variants={item} className="md:col-span-6 lg:col-span-7">
            <ServiceCard service={regular[3]} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function ServiceCard({ service, large = false }: { service: typeof services[0], large?: boolean }) {
  return (
    <div className={`
      group relative overflow-hidden rounded-3xl bg-white border border-warm-200/60
      hover:border-warm-300 hover:shadow-xl transition-all duration-500
      ${large ? 'p-8 lg:p-12' : 'p-6 lg:p-8'}
    `}>
      {/* Gradient accent on hover */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-all duration-500 rounded-bl-[100px]`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`
          inline-flex items-center justify-center rounded-2xl bg-gradient-to-br ${service.color} 
          text-white mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
          ${large ? 'w-16 h-16' : 'w-12 h-12'}
        `}>
          <service.icon size={large ? 28 : 22} />
        </div>
        
        {/* Title */}
        <h3 className={`
          font-display font-semibold text-warm-900 mb-3 
          group-hover:text-primary-700 transition-colors
          ${large ? 'text-2xl lg:text-3xl' : 'text-xl'}
        `}>
          {service.title}
        </h3>
        
        {/* Description */}
        <p className={`text-warm-500 leading-relaxed ${large ? 'text-lg max-w-lg' : 'text-base'}`}>
          {service.desc}
        </p>
        
        {/* Link */}
        <div className={`
          mt-6 flex items-center gap-2 text-primary-500 font-medium text-sm
          opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
          transition-all duration-300
        `}>
          <span>Learn more</span>
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </div>
  )
}
