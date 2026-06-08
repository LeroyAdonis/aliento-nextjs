import { Metadata } from 'next'
import BookingsClient from './BookingsClient'

export const metadata: Metadata = {
  title: 'Manage Bookings | Aliento',
  description: 'View and manage your consultation bookings.',
}

export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-cream-100">
      <div className="max-w-5xl mx-auto px-6 py-10 lg:py-14">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-px bg-blush-400" />
          <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-blush-500">
            Admin
          </span>
          <div className="w-8 h-px bg-blush-400" />
        </div>
        <h1 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-2">
          Manage Bookings
        </h1>
        <p className="text-warm-500 mb-8">
          See all confirmed, pending, and past consultations at a glance.
        </p>
        <BookingsClient />
      </div>
    </main>
  )
}
