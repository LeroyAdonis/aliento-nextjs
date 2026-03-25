'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Home',          href: '/' },
  { label: 'Health Topics', href: '/health-topics' },
  { label: 'About',         href: '/about' },
  { label: 'Consult',       href: '/consult' },
  { label: 'Contact',       href: '/contact' },
]

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* Desktop / Sticky nav */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-cream-100/95 backdrop-blur-xl border-b border-warm-200/60 shadow-sm py-1'
            : 'bg-cream-100 border-b border-transparent py-3'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-icon.svg"
                  alt="Aliento leaf mark"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-semibold text-warm-900 tracking-tight">
                  Aliento
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-sage-500 font-body font-medium">
                  Health Promotion
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-sage-400 text-white shadow-sm'
                      : 'text-warm-600 hover:text-warm-900 hover:bg-sage-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link
                href="/consult"
                className="px-6 py-2.5 rounded-full bg-blush-600 text-white text-sm font-medium shadow-sm hover:bg-blush-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Book a Consult
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-sage-50 transition-colors"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <X size={22} className="text-warm-800" />
                : <Menu size={22} className="text-warm-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-sage-800 flex flex-col px-8 pt-28 pb-12 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'py-4 text-2xl font-display font-semibold border-b border-sage-700/50 transition-colors',
                isActive(item.href)
                  ? 'text-blush-300'
                  : 'text-cream-100 hover:text-blush-300'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/consult"
            className="mt-6 text-center bg-blush-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blush-500 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Book a Consult
          </Link>
        </div>
      )}
    </>
  )
}
