'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, Stethoscope, ClipboardCheck, Heart } from 'lucide-react'

const steps = [
  { 
    icon: CalendarCheck, 
    title: 'Book Online', 
    desc: 'Choose a time that works for you. Same-day appointments available.',
    color: 'bg-primary-100 text-primary-600'
  },
  { 
    icon: Stethoscope, 
    title: 'Consultation', 
    desc: 'Meet with your practitioner. We listen first, then we act.',
    color: 'bg-sage-100 text-sage-600'
  },
  { 
    icon: ClipboardCheck, 
    title: 'Your Plan', 
    desc: 'Receive a personalised care plan tailored to your needs.',
    color: 'bg-accent-100 text-accent-600'
  },
  { 
    icon: Heart, 
    title: 'Ongoing Care', 
    desc: 'We follow up and adjust as your health evolves.',
    color: 'bg-rose-100 text-rose-600'
  },
]

export function Process() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden grain">
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] organic-blob bg-primary-50/50 animate-breathe-slow -translate-y-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[2px] bg-primary-500" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">How It Works</span>
            <div className="w-8 h-[2px] bg-primary-500" />
          </div>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-warm-900 mb-4">
            Your health journey,<br />simplified.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="relative text-center group"
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-1 text-7xl font-display font-bold text-warm-100 group-hover:text-primary-50 transition-colors">
                {index + 1}
              </div>
              
              <div className={cn("relative w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110", step.color)}>
                <step.icon size={28} />
              </div>
              
              <h3 className="text-xl font-display font-semibold text-warm-900 mb-3">{step.title}</h3>
              <p className="text-warm-500 leading-relaxed">{step.desc}</p>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-px bg-warm-200" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
