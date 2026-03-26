/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, Send, ArrowRight } from 'lucide-react'

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState)
      })
    } catch (err) {
      console.error('Submit error:', err)
    }
    setSubmitted(true)
    setSubmitting(false)
  }

  return (
    <>
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden grain">
        <div className="absolute inset-0 bg-gradient-to-br from-warm-50 via-primary-50/20 to-warm-50" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] organic-blob bg-primary-100/30 animate-breathe-slow" />
        
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-[2px] bg-primary-500" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-warm-400">Get in Touch</span>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-display font-bold text-warm-900 mb-6 leading-[1.1]">
            Let's start your<br />
            <span className="text-gradient-primary">health journey.</span>
          </h1>
          
          <p className="text-xl text-warm-500 leading-relaxed max-w-2xl">
            Have a question or ready to book? We'd love to hear from you. 
            Reach out and our team will get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              {submitted ? (
                <div className="bg-sage-50 border border-sage-200 rounded-3xl p-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sage-100 flex items-center justify-center">
                    <Send size={28} className="text-sage-600" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-warm-900 mb-2">Message sent!</h3>
                  <p className="text-warm-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">Name</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-700 mb-2">Email</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                        placeholder="you@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all"
                      placeholder="+27 xxx xxx xxx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-2">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-warm-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all resize-none"
                      placeholder="How can we help you?"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto bg-warm-900 text-white px-8 py-4 rounded-full font-medium hover:bg-warm-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Sending...' : 'Send Message'}
                    {!submitting && <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-warm-900 mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <a href="tel:+27762367921" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                      <Phone size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-warm-900">Phone</p>
                      <p className="text-warm-500">+27 76 236 7921</p>
                    </div>
                  </a>
                  
                  <a href="mailto:info@alientomd.com" className="flex items-start gap-4 group">
                    <div className="w-12 h-12 rounded-2xl bg-sage-100 flex items-center justify-center flex-shrink-0 group-hover:bg-sage-200 transition-colors">
                      <Mail size={20} className="text-sage-600" />
                    </div>
                    <div>
                      <p className="font-medium text-warm-900">Email</p>
                      <p className="text-warm-500">info@alientomd.com</p>
                    </div>
                  </a>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-coral-100 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-coral-600" />
                    </div>
                    <div>
                      <p className="font-medium text-warm-900">Location</p>
                      <p className="text-warm-500">Cape Town, South Africa</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-warm-100 flex items-center justify-center flex-shrink-0">
                      <Clock size={20} className="text-warm-600" />
                    </div>
                    <div>
                      <p className="font-medium text-warm-900">Hours</p>
                      <p className="text-warm-500">Monday - Friday: 8AM - 5PM</p>
                      <p className="text-warm-400 text-sm">Weekend emergencies: Call us</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="aspect-[4/3] rounded-3xl bg-warm-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={32} className="text-warm-400 mx-auto mb-2" />
                  <p className="text-warm-500 text-sm">Map coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
