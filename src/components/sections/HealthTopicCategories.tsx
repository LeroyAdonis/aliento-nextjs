import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name:        'Nutrition',
    icon:        '🥗',
    description: 'Food as medicine — what to eat and why it matters for long-term health.',
    slug:        'Nutrition',
    bg:          'bg-sage-50',
    iconBg:      'bg-sage-100',
    hover:       'hover:bg-sage-100',
  },
  {
    name:        'Mental Health',
    icon:        '🧠',
    description: 'Breaking the stigma around mental wellness in South Africa.',
    slug:        'Mental Health',
    bg:          'bg-blush-50',
    iconBg:      'bg-blush-100',
    hover:       'hover:bg-blush-100',
  },
  {
    name:        'Screening',
    icon:        '🩺',
    description: 'Know your numbers — the screenings that can save your life.',
    slug:        'Screening',
    bg:          'bg-cream-200/60',
    iconBg:      'bg-cream-300/80',
    hover:       'hover:bg-cream-300/60',
  },
  {
    name:        'Medical Conditions',
    icon:        '💊',
    description: 'Clear explanations of common diagnoses — what they mean and what to do.',
    slug:        'Medical Conditions',
    bg:          'bg-warm-100/60',
    iconBg:      'bg-warm-200/80',
    hover:       'hover:bg-warm-200/60',
  },
  {
    name:        'Research',
    icon:        '🔬',
    description: 'Novel techniques and medical breakthroughs, explained in plain language.',
    slug:        'Research',
    bg:          'bg-sage-50',
    iconBg:      'bg-sage-100',
    hover:       'hover:bg-sage-100',
  },
  {
    name:        'Wellness',
    icon:        '🌿',
    description: 'Lifestyle, prevention, and everyday habits for a healthier life.',
    slug:        'Wellness',
    bg:          'bg-blush-50',
    iconBg:      'bg-blush-100',
    hover:       'hover:bg-blush-100',
  },
]

export function HealthTopicCategories() {
  return (
    <section className="py-20 lg:py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Heading */}
        <div className="mb-12 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
              Browse by topic
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 leading-snug">
            What would you like to learn about?
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/health-topics?category=${encodeURIComponent(cat.slug)}`}
              className={`group rounded-2xl p-7 border border-warm-200/50 transition-all duration-250 hover:-translate-y-1 hover:shadow-md ${cat.bg} ${cat.hover}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${cat.iconBg}`}>
                {cat.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-warm-900 mb-2 group-hover:text-sage-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-warm-500 leading-relaxed mb-4">
                {cat.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-sage-600 uppercase tracking-wider group-hover:gap-2.5 transition-all">
                Browse articles <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
