import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Mail } from 'lucide-react'

const exploreLinks = [
  { label: 'Home',          href: '/' },
  { label: 'Health Topics', href: '/health-topics' },
  { label: 'About',         href: '/about' },
  { label: 'Consult',       href: '/consult' },
  { label: 'Contact',       href: '/contact' },
]

const topicLinks = [
  { label: 'Nutrition',          href: '/health-topics?category=Nutrition' },
  { label: 'Mental Health',      href: '/health-topics?category=Mental Health' },
  { label: 'Screening',          href: '/health-topics?category=Screening' },
  { label: 'Medical Conditions', href: '/health-topics?category=Medical Conditions' },
  { label: 'Research',           href: '/health-topics?category=Research' },
  { label: 'Wellness',           href: '/health-topics?category=Wellness' },
]

export function Footer() {
  return (
    <footer className="bg-cream-50 border-t border-warm-200/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-8 h-8">
                <Image src="/logo-icon.svg" alt="Aliento" fill className="object-contain" />
              </div>
              <span className="font-display text-xl font-semibold text-warm-900">Aliento</span>
            </Link>
            <p className="text-sage-600 font-semibold text-sm italic mb-3 tracking-wide">
              &quot;Breathe, Screen, Live&quot;
            </p>
            <p className="text-warm-500 text-sm leading-relaxed">
              Health education, promotion, and expert-backed virtual care —
              available to every South African, wherever you are.
            </p>
          </div>

          {/* Explore */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-body font-semibold uppercase tracking-widest text-warm-900 mb-5">
                Explore
              </h4>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-warm-500 hover:text-sage-600 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-body font-semibold uppercase tracking-widest text-warm-900 mb-5">
                Health Topics
              </h4>
              <ul className="space-y-3">
                {topicLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-warm-500 hover:text-sage-600 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-body font-semibold uppercase tracking-widest text-warm-900 mb-5">
              Connect
            </h4>
            <a
              href="mailto:info@alientomedical.com"
              className="flex items-center gap-3 text-warm-500 hover:text-sage-600 transition-colors group mb-6"
            >
              <div className="w-9 h-9 rounded-full bg-sage-50 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
                <Mail size={15} className="text-sage-500" />
              </div>
              <span className="text-sm">info@alientomedical.com</span>
            </a>
            <p className="text-xs text-warm-400 leading-relaxed">
              For medical emergencies, please call 10177 (EMS) or visit your
              nearest emergency room. Aliento does not provide emergency care.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-warm-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-warm-400 text-xs">
            © {new Date().getFullYear()} Aliento. All rights reserved.
          </p>
          <p className="text-warm-400 text-xs italic">
            Not a substitute for professional medical advice.
          </p>
        </div>

      </div>
    </footer>
  )
}
