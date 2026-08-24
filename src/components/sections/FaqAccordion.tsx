'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export type FaqItem = {
  question: string
  answer: string
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={item.question}
            className={`rounded-2xl border bg-white/80 transition-colors duration-300 ${
              isOpen ? 'border-sage-300' : 'border-warm-200'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${index}`}
              id={`faq-button-${index}`}
              className="w-full flex items-center justify-between gap-4 text-left px-6 py-5 cursor-pointer"
            >
              <span className="font-display font-semibold text-warm-900 text-base lg:text-lg leading-snug">
                {item.question}
              </span>
              <ChevronDown
                size={20}
                className={`flex-shrink-0 text-sage-600 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-button-${index}`}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-warm-500 text-sm leading-relaxed">{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
