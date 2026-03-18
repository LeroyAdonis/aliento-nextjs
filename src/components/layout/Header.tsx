'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X, Phone, Mail } from 'lucide-react'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <>
      <div className="bg-warm-900 text-warm-200 py-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+27762367921" className="flex items-center gap-2 hover:text-white transition">
              <Phone size={14} />
              +27 76 236 7921
            </a>
            <span className="hidden sm:inline text-warm-600">|</span>
            <a href="mailto:info@alientomedical.com" className="hidden sm:flex items-center gap-2 hover:text-white transition">
              <Mail size={14} />
              info@alientomedical.com
            </a>
          </div>
          <span className="hidden md:inline text-warm-500 text-xs tracking-wider uppercase">
            Empowering Personal Health
          </span>
        </div>
      </div>

      <nav className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-warm-50/80 backdrop-blur-xl border-b border-warm-200/50 shadow-sm'
          : 'bg-warm-50 border-b border-warm-100'
      )}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
                <Image src="/images/aliento-icon.svg" alt="Aliento" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-display font-bold text-warm-900 tracking-tight leading-none">Aliento</span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-warm-400 font-medium">Medical</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium rounded-full transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-warm-900 text-white shadow-sm'
                      : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100/80'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className={cn(
                  'ml-4 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5',
                  isActive('/contact')
                    ? 'bg-primary-600 text-white'
                    : 'bg-warm-900 text-white hover:bg-warm-800'
                )}
              >
                Book Appointment
              </Link>
            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-warm-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} className="text-warm-700" /> : <Menu size={24} className="text-warm-700" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden pb-6 border-t border-warm-200/60 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block py-3 px-4 rounded-xl font-medium transition-all',
                    isActive(item.href)
                      ? 'bg-warm-900 text-white'
                      : 'text-warm-600 hover:text-warm-900 hover:bg-warm-100'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block mt-4 bg-warm-900 text-white px-6 py-3 rounded-full font-semibold text-center hover:bg-warm-800 transition-all shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
