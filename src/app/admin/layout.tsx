import type { Metadata } from 'next'
import Link from 'next/link'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Aliento Admin',
  robots: 'noindex, nofollow',
}

const navLinks = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/scripts', label: 'Scripts' },
  { href: '/admin/scripts/new', label: 'New Script' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Admin Top Nav */}
      <header className="border-b border-warm-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-bold text-warm-900 tracking-tight">
              Aliento <span className="text-blush-600">Admin</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-warm-600 hover:text-blush-600 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <Link
            href="/"
            className="text-xs text-warm-400 hover:text-warm-600 transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
