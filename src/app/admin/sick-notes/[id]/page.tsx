export const dynamic = 'force-dynamic'

import { db } from '@/db'
import { questionnaires } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { format } from 'date-fns'
import { Resend } from 'resend'
import Link from 'next/link'
import {
  ArrowLeft,
  CalendarRange,
  FileText,
  Mail,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react'
import SickNoteEditor from './SickNoteEditor'

function parseRawData(rawData: string | null): Record<string, unknown> {
  if (!rawData) return {}
  try {
    const parsed = JSON.parse(rawData)
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

function str(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

function formatDateOrDash(value: string): string {
  if (!value) return '—'
  try {
    return format(new Date(value), 'dd MMM yyyy')
  } catch {
    return value
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function emailPatient(input: {
  patientEmail: string
  patientName: string
  symptoms: string
  reason: string
}): Promise<{ success: boolean; error?: string }> {
  'use server'

  if (!input.patientEmail) {
    return { success: false, error: 'This questionnaire has no patient email address.' }
  }

  if (!process.env.RESEND_API_KEY) {
    console.warn('[admin/sick-notes] RESEND_API_KEY not set — skipping send')
    return { success: false, error: 'Email is not configured (missing RESEND_API_KEY).' }
  }

  const name = escapeHtml(input.patientName)
  const symptoms = escapeHtml(input.symptoms).replace(/\n/g, '<br/>')
  const reason = escapeHtml(input.reason).replace(/\n/g, '<br/>')

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const patientResult = await resend.emails.send({
      from: 'Aliento Health <notifications@alientomd.com>',
      to: input.patientEmail,
      subject: 'Your sick note from Aliento Health',
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/><title>Sick Leave Note — ${name}</title></head>
<body style="font-family:system-ui,-apple-system,sans-serif;background:#f3f4f6;margin:0;padding:32px 0;color:#111827">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
    <div style="background:#4a7c59;padding:24px 32px;text-align:center">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700">Sick Leave Note — ${name}</h1>
      <p style="margin:6px 0 0;color:#a7c4b0;font-size:14px">Aliento Health</p>
    </div>
    <div style="padding:32px">
      <p style="font-size:15px;margin:0 0 20px">Dear <strong>${name}</strong>,</p>
      <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#6b7280">Symptoms</h2>
      <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 20px">${symptoms}</p>
      <h2 style="margin:0 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.06em;color:#6b7280">Reason for Sick Leave</h2>
      <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 24px">${reason}</p>
      <p style="font-size:14px;color:#4b5563;line-height:1.6;margin:0">
        Kind regards,<br/>
        Dr Leegale Adonis<br/>
        Aliento Health
      </p>
    </div>
    <div style="padding:16px 32px;background:#f9fafb;text-align:center">
      <p style="margin:0;font-size:12px;color:#9ca3af">Aliento Health · This sick note was issued following an online assessment.</p>
    </div>
  </div>
</body>
</html>`,
    })

    if (patientResult.error) {
      console.error('[admin/sick-notes] Failed to send to patient:', patientResult.error)
      return { success: false, error: 'Failed to send the email. Please try again.' }
    }

    // Practice copy for records — same pattern as /api/scripts/send.
    // Dynamically imported: '@/lib/email' instantiates Resend at module scope,
    // which throws when RESEND_API_KEY is unset. Lazy-loading keeps the page
    // itself renderable in unconfigured environments (guarded above).
    const { sendEmail } = await import('@/lib/email')
    await sendEmail({
      purpose: 'notification',
      subject: `Sick Leave Note Sent — ${input.patientName}`,
      html: `<h2>Sick Leave Note Sent</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Patient</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(input.patientName)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Sent to</td><td style="padding:8px;border:1px solid #ddd;">${escapeHtml(input.patientEmail)}</td></tr>
        </table>`,
    })

    return { success: true }
  } catch (err) {
    console.error('[admin/sick-notes] emailPatient failed', err)
    return { success: false, error: 'Failed to send the email. Please try again.' }
  }
}

export default async function SickNoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [row] = await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.id, id))
    .limit(1)

  if (!row) {
    return (
      <div className="min-h-screen bg-cream-100">
        <header className="bg-white border-b border-warm-200">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <Link
              href="/admin/sick-notes"
              className="w-9 h-9 rounded-xl bg-cream-50 border border-warm-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
            >
              <ArrowLeft size={18} className="text-warm-500" />
            </Link>
            <h1 className="font-display font-bold text-warm-900 text-xl">Sick Note Not Found</h1>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-red-400" />
          </div>
          <p className="text-warm-600 mb-6">This questionnaire could not be found.</p>
          <Link
            href="/admin/sick-notes"
            className="inline-flex items-center gap-2 text-sm font-medium text-sage-600 hover:text-sage-700"
          >
            <ArrowLeft size={16} />
            Back to Sick Notes
          </Link>
        </main>
      </div>
    )
  }

  const data = parseRawData(row.rawData)
  const phone = str(data.phone)
  const startDate = str(data.startDate)
  const endDate = str(data.endDate)
  const submittedSymptoms = str(data.symptoms)
  const submittedReason = str(data.reason)
  const leavePeriod =
    startDate && endDate
      ? `${formatDateOrDash(startDate)} – ${formatDateOrDash(endDate)}`
      : formatDateOrDash(startDate || endDate)

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-warm-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/sick-notes"
              className="w-9 h-9 rounded-xl bg-cream-50 border border-warm-200 flex items-center justify-center hover:bg-cream-100 transition-colors"
            >
              <ArrowLeft size={18} className="text-warm-500" />
            </Link>
            <div>
              <h1 className="font-display font-bold text-warm-900 text-xl">Sick Leave Note</h1>
              <p className="text-xs text-warm-400">
                Submitted {format(new Date(row.submittedAt), 'dd MMM yyyy, HH:mm')}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
            New Request
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Patient Details Card */}
        <section className="bg-white rounded-2xl border border-warm-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <User size={18} className="text-sage-500" />
            <h2 className="font-display font-semibold text-warm-800 text-lg">Patient Details</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <DetailField icon={<User size={16} />} label="Full Name" value={row.patientName} />
            <DetailField icon={<Mail size={16} />} label="Email" value={row.patientEmail} />
            <DetailField icon={<Phone size={16} />} label="Phone" value={phone || '—'} />
            <DetailField
              icon={<CalendarRange size={16} />}
              label="Leave Period"
              value={leavePeriod}
            />
          </div>
        </section>

        {/* Submitted Questionnaire Card */}
        <section className="bg-white rounded-2xl border border-warm-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <Stethoscope size={18} className="text-sage-500" />
            <h2 className="font-display font-semibold text-warm-800 text-lg">
              Questionnaire — As Submitted
            </h2>
          </div>
          <div className="space-y-4">
            <SubmittedField label="Start Date" value={formatDateOrDash(startDate)} />
            <SubmittedField label="End Date" value={formatDateOrDash(endDate)} />
            <SubmittedField label="Symptoms" value={submittedSymptoms || '—'} prewrap />
            <SubmittedField label="Reason for Sick Leave" value={submittedReason || '—'} prewrap />
          </div>
        </section>

        {/* Editable note + AI draft + actions */}
        <SickNoteEditor
          questionnaireId={row.id}
          patientName={row.patientName}
          patientEmail={row.patientEmail}
          initialSymptoms={submittedSymptoms}
          initialReason={submittedReason}
          emailAction={emailPatient}
        />
      </main>
    </div>
  )
}

function DetailField({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-cream-50 border border-warm-200 flex items-center justify-center shrink-0 text-warm-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-warm-400 font-medium">{label}</p>
        <p className="text-sm text-warm-800 font-medium truncate">{value}</p>
      </div>
    </div>
  )
}

function SubmittedField({
  label,
  value,
  prewrap = false,
}: {
  label: string
  value: string
  prewrap?: boolean
}) {
  return (
    <div>
      <p className="text-xs text-warm-400 font-medium mb-1">{label}</p>
      <p
        className={`text-sm text-warm-800 bg-cream-50 border border-warm-100 rounded-xl px-4 py-3 ${
          prewrap ? 'whitespace-pre-wrap' : ''
        }`}
      >
        {value}
      </p>
    </div>
  )
}
