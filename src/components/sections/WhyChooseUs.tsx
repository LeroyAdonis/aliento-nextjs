'use client'

import { motion } from 'framer-motion'
import { Clock, MapPin, CreditCard, Users } from 'lucide-react'

const features = [
  { 
    icon: Clock, 
    title: 'Same-Day Appointments', 
    desc: 'No long waiting periods. Book and see a practitioner today.',
  },
  { 
    icon: MapPin, 
    title: 'Convenient Location', 
    desc: 'Easily accessible with ample parking.',
  },
  { 
    icon: CreditCard, 
    title: 'Transparent Pricing', 
    desc: 'No hidden costs. Know what you\'ll pay before your visit.',
  },
  { 
    icon: Users, 
    title: 'Experienced Team', 
    desc: 'Qualified healthcare professionals dedicated to your wellbeing.',
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] organic-blob bg-primary-50/30 animate-breathe-slow -translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400 mb-4 block">Why Aliento</span>
          <h2 className="text-3xl lg:text-5xl font-display font-bold text-warm-900 mb-4">
            Healthcare made <span className="text-gradient-primary">human.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="text-center group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110">
                <feature.icon size={28} className="text-primary-600" />
              </div>
              <h3 className="text-lg font-display font-semibold text-warm-900 mb-2">{feature.title}</h3>
              <p className="text-warm-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
