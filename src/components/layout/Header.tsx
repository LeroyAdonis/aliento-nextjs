'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'

/* ── Navigation groups ── */
type NavItem = { label: string; href: string }

const mainNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Health Topics', href: '/health-topics' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const serviceItems: NavItem[] = [
  { label: 'Virtual Consult', href: '/consult' },
  { label: 'Get a Prescription', href: '/prescription' },
  { label: 'Sick Leave Assessment', href: '/sick-note' },
  { label: 'Second Opinion', href: '/second-opinion' },
]

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Close dropdown on outside click */
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setServicesOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isServiceActive = serviceItems.some((s) => pathname.startsWith(s.href))

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
            <Link
              href="/"
              className="flex items-center gap-3 group flex-shrink-0"
            >
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
            <nav className="hidden lg:block" aria-label="Main navigation">
              <ul className="flex items-center gap-1">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link
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
                  </li>
                ))}

                {/* Services dropdown */}
                <li
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => setServicesOpen((o) => !o)}
                    className={cn(
                      'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                      isServiceActive
                        ? 'bg-sage-400 text-white shadow-sm'
                        : 'text-warm-600 hover:text-warm-900 hover:bg-sage-50'
                    )}
                    aria-expanded={servicesOpen}
                    aria-haspopup="true"
                  >
                    Services
                    <ChevronDown
                      size={14}
                      className={cn(
                        'transition-transform duration-200',
                        servicesOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {/* Dropdown */}
                  {servicesOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-cream-100 border border-warm-200/70 shadow-lg backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="py-2">
                        {serviceItems.map((svc) => (
                          <Link
                            key={svc.href}
                            href={svc.href}
                            className={cn(
                              'block px-5 py-2.5 text-sm font-body font-medium transition-colors',
                              pathname.startsWith(svc.href)
                                ? 'text-sage-600 bg-sage-50'
                                : 'text-warm-600 hover:text-warm-900 hover:bg-sage-50'
                            )}
                            onClick={() => setServicesOpen(false)}
                          >
                            {svc.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              </ul>
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
              {mobileOpen ? (
                <X size={22} className="text-warm-800" />
              ) : (
                <Menu size={22} className="text-warm-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu — flat, no dropdown */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-sage-800 flex flex-col px-8 pt-28 pb-12 gap-2 overflow-y-auto">
          {/* Main nav items */}
          {mainNav.map((item) => (
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

          {/* Services heading (flat label) */}
          <span className="py-4 text-2xl font-display font-semibold text-cream-100 border-b border-sage-700/50">
            Services
          </span>

          {/* Service items flat under Services heading */}
          {serviceItems.map((svc) => (
            <Link
              key={svc.href}
              href={svc.href}
              className={cn(
                'pl-6 py-3.5 text-lg font-display font-medium border-b border-sage-700/30 transition-colors',
                pathname.startsWith(svc.href)
                  ? 'text-blush-300'
                  : 'text-cream-100/80 hover:text-blush-300'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {svc.label}
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
