'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-500 text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+27762367921" className="flex items-center gap-1.5 hover:text-white/80 transition font-medium">
              <Phone size={14} />
              +27762367921
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <a href="mailto:info@alientomedical.com" className="hidden sm:flex items-center gap-1.5 hover:text-white/80 transition font-medium">
              <Mail size={14} />
              info@alientomedical.com
            </a>
          </div>
          <span className="hidden md:inline text-white/70 text-xs tracking-wide uppercase">
            Empowering Personal Health
          </span>
        </div>
      </div>

      {/* Main nav — glassmorphism on scroll */}
      <nav className={cn(
        'sticky top-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-neutral-200/50'
          : 'bg-white border-b border-neutral-100'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/aliento-logo.svg"
                  alt="Aliento"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="text-2xl md:text-3xl font-heading font-bold text-primary-500 tracking-tight">
                  Aliento
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium -mt-1">
                  Medical
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-all duration-200"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="ml-4 bg-primary-500 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
              >
                Book Appointment
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-6 border-t border-neutral-100 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3 px-4 text-neutral-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="block mt-4 bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold text-center hover:bg-primary-600 transition-all shadow-md"
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
