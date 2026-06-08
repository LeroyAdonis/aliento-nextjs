'use client'

import { useEffect, useState, useCallback } from 'react'
import { CalendarDays, Clock, User, Mail, Loader2, AlertCircle, RefreshCw, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'

type BookingStatus = 'upcoming' | 'past' | 'cancelled'

interface Booking {
  uid: string
  title?: string
  startTime?: string
  endTime?: string
  status?: string
  attendees?: { name?: string; email?: string }[]
  responses?: { name?: string; email?: string; notes?: string }
  cancellationReason?: string
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatTime(iso?: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleTimeString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function calcDuration(start?: string, end?: string): string {
  if (!start || !end) return '—'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  const min = Math.round(ms / 60000)
  return `${min} min`
}

function statusBadge(status?: string): { label: string; class: string } {
  switch (status) {
    case 'ACCEPTED':
    case 'confirmed':
      return { label: 'Confirmed', class: 'bg-sage-100 text-sage-700 border-sage-200' }
    case 'PENDING':
    case 'pending':
      return { label: 'Pending', class: 'bg-amber-50 text-amber-700 border-amber-200' }
    case 'CANCELLED':
    case 'cancelled':
      return { label: 'Cancelled', class: 'bg-blush-50 text-blush-600 border-blush-200' }
    case 'REJECTED':
      return { label: 'Rejected', class: 'bg-red-50 text-red-600 border-red-200' }
    default:
      return { label: status || 'Unknown', class: 'bg-warm-50 text-warm-500 border-warm-200' }
  }
}

function BookingCard({ booking }: { booking: Booking }) {
  const badge = statusBadge(booking.status)
  const attendee = booking.attendees?.[0] || booking.responses
  const cancelled = booking.status === 'CANCELLED' || booking.status === 'cancelled'

  return (
    <div className={`rounded-2xl border ${cancelled ? 'bg-blush-50/40 border-blush-100' : 'bg-white border-warm-200'} p-5 transition-all hover:shadow-sm`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display font-semibold text-warm-900 text-sm truncate">
              {attendee?.name || 'Unknown patient'}
            </h3>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${badge.class}`}>
              {badge.label}
            </span>
          </div>
          <p className="text-xs text-warm-400 truncate">{booking.title || 'Consultation'}</p>
        </div>
      </div>

      <div className="space-y-1.5 text-xs text-warm-500">
        <div className="flex items-center gap-2">
          <CalendarDays size={12} className="shrink-0 text-sage-400" />
          <span>{formatDate(booking.startTime)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="shrink-0 text-sage-400" />
          <span>{formatTime(booking.startTime)} – {formatTime(booking.endTime)} ({calcDuration(booking.startTime, booking.endTime)})</span>
        </div>
        {attendee?.email && (
          <div className="flex items-center gap-2">
            <Mail size={12} className="shrink-0 text-sage-400" />
            <span className="truncate">{attendee.email}</span>
          </div>
        )}
        {booking.responses?.notes && (
          <div className="flex items-start gap-2 mt-2">
            <AlertCircle size={12} className="shrink-0 mt-0.5 text-warm-400" />
            <span className="text-warm-400 italic">{booking.responses.notes}</span>
          </div>
        )}
        {booking.cancellationReason && (
          <div className="flex items-start gap-2 mt-2">
            <XCircle size={12} className="shrink-0 mt-0.5 text-blush-400" />
            <span className="text-blush-500">Reason: {booking.cancellationReason}</span>
          </div>
        )}
      </div>

      {!cancelled && booking.uid && (
        <div className="mt-3 pt-3 border-t border-warm-100">
          <span className="text-[10px] font-mono text-warm-300">ID: {booking.uid.slice(0, 12)}…</span>
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-16">
      <CalendarDays size={40} className="mx-auto text-warm-300 mb-4" />
      <p className="text-warm-500 text-sm">{message}</p>
    </div>
  )
}

export default function BookingsClient() {
  const [tab, setTab] = useState<BookingStatus>('upcoming')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBookings = useCallback(async (status: BookingStatus) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/cal/bookings?status=${status}&limit=50`)
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `HTTP ${res.status}` }))
        throw new Error(errData.error || 'Failed to fetch')
      }
      const data = await res.json()
      setBookings(data.data || [])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings(tab)
  }, [tab, fetchBookings])

  const tabs: { id: BookingStatus; label: string; icon: React.ReactNode }[] = [
    { id: 'upcoming', label: 'Upcoming', icon: <CalendarDays size={14} /> },
    { id: 'past', label: 'Past', icon: <Clock size={14} /> },
    { id: 'cancelled', label: 'Cancelled', icon: <XCircle size={14} /> },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-2 mb-6 border-b border-warm-200 pb-4">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition-all ${
              tab === id
                ? 'bg-warm-900 text-white shadow-sm'
                : 'bg-white text-warm-500 border border-warm-200 hover:border-warm-300 hover:text-warm-700'
            }`}
          >
            {icon}
            {label}
          </button>
        ))}

        <button
          onClick={() => fetchBookings(tab)}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-warm-400 hover:text-warm-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-sage-400" />
          <span className="ml-3 text-sm text-warm-400">Loading bookings...</span>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-blush-200 bg-blush-50 p-6 text-sm text-warm-700">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5 text-blush-500" />
            <div>
              <p className="font-medium mb-1">Couldn't load bookings</p>
              <p className="text-warm-500 text-xs">
                {error.includes('CALCOM_API_KEY') 
                  ? 'Calendar API key not configured. Contact the admin to set up CALCOM_API_KEY.'
                  : error.includes('401') || error.includes('403')
                  ? 'Calendar authentication failed. The API key may need renewal.'
                  : error
                }
              </p>
            </div>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <EmptyState
          message={
            tab === 'upcoming'
              ? 'No upcoming consultations. Patients will appear here once they book.'
              : tab === 'past'
              ? 'No past consultations yet.'
              : 'No cancelled consultations.'
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking.uid} booking={booking} />
          ))}
        </div>
      )}

      {/* Info footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-warm-400">
          This page shows all bookings from your Cal.com account. 
          Bookings made through the site will appear here automatically.
        </p>
      </div>
    </div>
  )
}
