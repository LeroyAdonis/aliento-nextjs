/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
import Link from 'next/link'
import { Phone, Mail, Clock, ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-300 relative overflow-hidden">
      {/* Decorative element */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] organic-blob bg-warm-800/50" />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-display font-bold text-white mb-4">Aliento</h3>
            <p className="text-warm-400 leading-relaxed mb-6">
              Empowering personal health through personalised care, 
              cutting-edge technology, and genuine compassion.
            </p>
            <p className="text-warm-500 text-sm italic">Aliento means "breath" in Spanish.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-500 mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-1 text-warm-400 hover:text-white transition-colors"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-500 mb-6">Services</h4>
            <ul className="space-y-3 text-warm-400">
              <li>Consultations</li>
              <li>Diagnostics</li>
              <li>Treatment Plans</li>
              <li>Preventive Care</li>
              <li>Mental Wellness</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-warm-500 mb-6">Get in Touch</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+27762367921" className="flex items-center gap-3 text-warm-400 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-warm-800 flex items-center justify-center group-hover:bg-warm-700 transition-colors">
                    <Phone size={16} />
                  </div>
                  <span>+27 76 236 7921</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@alientomd.com" className="flex items-center gap-3 text-warm-400 hover:text-white transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-warm-800 flex items-center justify-center group-hover:bg-warm-700 transition-colors">
                    <Mail size={16} />
                  </div>
                  <span>info@alientomd.com</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-warm-400">
                <div className="w-10 h-10 rounded-full bg-warm-800 flex items-center justify-center">
                  <Clock size={16} />
                </div>
                <span>Mon - Fri: 8AM - 5PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-warm-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-warm-500 text-sm">
            &copy; {new Date().getFullYear()} Aliento Medical. All rights reserved.
          </p>
          <p className="text-warm-600 text-sm">
            Designed with 💚 for your health
          </p>
        </div>
      </div>
    </footer>
  )
}
