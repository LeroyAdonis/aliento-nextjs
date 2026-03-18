import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold font-heading mb-4">Aliento</h3>
            <p className="text-white/70 leading-relaxed mb-4">
              Empowering personal health through personalised care, cutting-edge 
              technology, and genuine compassion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-white/70">
              <li>Consultations</li>
              <li>Diagnostics</li>
              <li>Treatment Plans</li>
              <li>Follow-up Care</li>
              <li>Preventive Health</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-white/70">
                <Phone size={16} className="text-primary" />
                +27762367921
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail size={16} className="text-primary" />
                info@alientomedical.com
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Clock size={16} className="text-primary" />
                Mon-Fri: 8AM - 5PM
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center text-white/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Aliento Medical. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
