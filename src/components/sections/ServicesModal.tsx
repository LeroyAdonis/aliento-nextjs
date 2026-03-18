'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'

interface ServiceData {
  title: string
  description: string
  details: string[]
  cta: string
}

const serviceDetails: Record<string, ServiceData> = {
  'Consultations': {
    title: 'Personalised Consultations',
    description: 'Your health is unique — your consultations should be too. Our practitioners take the time to truly understand you, your history, and your goals before recommending any course of action.',
    details: [
      'One-on-one sessions with experienced healthcare professionals',
      'Comprehensive health history review — we listen before we act',
      'Personalised recommendations based on your unique needs',
      'Follow-up support to track your progress',
      'Same-day appointments available for urgent concerns'
    ],
    cta: 'Book your consultation today'
  },
  'Diagnostics': {
    title: 'Advanced Diagnostics',
    description: 'Accurate diagnosis is the foundation of effective treatment. Our state-of-the-art diagnostic tools help us understand what\'s happening inside — so we can address the root cause, not just the symptoms.',
    details: [
      'In-house laboratory testing — results faster',
      'Advanced imaging and screening equipment',
      'Comprehensive blood work and panels',
      'Genetic testing for personalised treatment plans',
      'Digital results delivered securely to your phone'
    ],
    cta: 'Get your results faster'
  },
  'Treatment Plans': {
    title: 'Tailored Treatment Plans',
    description: 'No two patients are alike. Your treatment plan should reflect your specific condition, lifestyle, and health goals — not a textbook template.',
    details: [
      'Customised treatment protocols for your condition',
      'Evidence-based approaches with proven outcomes',
      'Regular plan adjustments as you progress',
      'Integration of conventional and complementary therapies',
      'Clear milestones and expected timelines'
    ],
    cta: 'Start your personalised plan'
  },
  'Preventive Care': {
    title: 'Preventive Health Screenings',
    description: 'The best time to catch a health issue is before it becomes one. Regular screenings and preventive care can detect problems early — when they\'re easier and less expensive to treat.',
    details: [
      'Annual health assessments and check-ups',
      'Age-appropriate screening programmes',
      'Cardiovascular risk assessment',
      'Cancer screening referrals',
      'Lifestyle and wellness counselling'
    ],
    cta: 'Book your screening'
  },
  'Mental Wellness': {
    title: 'Mental Health & Wellness',
    description: 'Your mental health matters just as much as your physical health. Our compassionate team provides confidential support in a safe, judgment-free environment.',
    details: [
      'Confidential mental health assessments',
      'Stress and anxiety management',
      'Depression screening and support',
      'Referrals to specialist psychologists when needed',
      'Holistic mind-body wellness approaches'
    ],
    cta: 'Take the first step'
  },
  'Family Health': {
    title: 'Family Health Services',
    description: 'From toddlers to grandparents, we provide comprehensive care for every stage of life. One healthcare partner for your whole family means continuity, convenience, and peace of mind.',
    details: [
      'Paediatric check-ups and vaccinations',
      'Women\'s and men\'s health services',
      'Senior health monitoring and care',
      'Family health history tracking',
      'Coordinated care across all ages'
    ],
    cta: 'Care for your whole family'
  }
}

export function ServicesModal({ 
  isOpen, 
  onClose, 
  service 
}: { 
  isOpen: boolean
  onClose: () => void
  service: string | null
}) {
  if (!service || !serviceDetails[service]) return null
  
  const data = serviceDetails[service]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-warm-900/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] overflow-auto bg-white rounded-3xl shadow-2xl z-50"
          >
            <div className="p-8 lg:p-10">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-warm-100 hover:bg-warm-200 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-warm-600" />
              </button>

              {/* Content */}
              <div className="mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-medium mb-4">
                  Our Services
                </span>
                <h2 className="text-3xl lg:text-4xl font-display font-bold text-warm-900 mb-4 leading-tight">
                  {data.title}
                </h2>
                <p className="text-warm-600 text-lg leading-relaxed">
                  {data.description}
                </p>
              </div>

              {/* Details */}
              <ul className="space-y-3 mb-8">
                {data.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-3 text-warm-700">
                    <span className="w-6 h-6 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-sage-600 text-sm">✓</span>
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="flex-1 bg-warm-900 text-white px-6 py-4 rounded-full font-medium hover:bg-warm-800 transition-all flex items-center justify-center gap-2 group"
                >
                  {data.cta}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="tel:+27762367921"
                  onClick={onClose}
                  className="flex-1 border-2 border-warm-200 text-warm-700 px-6 py-4 rounded-full font-medium hover:border-warm-300 hover:bg-warm-50 transition-all flex items-center justify-center gap-2"
                >
                  <Phone size={18} />
                  Call us
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
