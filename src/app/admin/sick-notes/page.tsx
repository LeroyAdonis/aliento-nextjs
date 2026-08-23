export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { db } from '@/db'
import { questionnaires } from '@/db/schema'
import { desc, eq } from 'drizzle-orm'
import { format } from 'date-fns'
import { CalendarRange, Stethoscope } from 'lucide-react'

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

function formatLeavePeriod(data: Record<string, unknown>): string {
  const start = str(data.startDate)
  const end = str(data.endDate)
  if (!start && !end) return '—'
  try {
    if (start && end) {
      if (start === end) return format(new Date(start), 'dd MMM yyyy')
      return `${format(new Date(start), 'dd MMM')} – ${format(new Date(end), 'dd MMM yyyy')}`
    }
    return format(new Date(start || end), 'dd MMM yyyy')
  } catch {
    return [start, end].filter(Boolean).join(' – ')
  }
}

export default async function AdminSickNotesPage() {
  const rows = await db
    .select()
    .from(questionnaires)
    .where(eq(questionnaires.stream, 'sick-note'))
    .orderBy(desc(questionnaires.submittedAt))

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-warm-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <Stethoscope size={20} className="text-sage-600" />
            </div>
            <div>
              <h1 className="font-display font-bold text-warm-900 text-xl">Sick Notes</h1>
              <p className="text-xs text-warm-400">
                {rows.length} sick-leave questionnaire{rows.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Empty state */}
        {rows.length === 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4">
              <Stethoscope size={28} className="text-sage-400" />
            </div>
            <h3 className="font-display font-semibold text-warm-800 text-lg mb-1">
              No sick-leave questionnaires yet.
            </h3>
            <p className="text-sm text-warm-400">
              New submissions will appear here as patients complete the assessment.
            </p>
          </div>
        )}

        {/* Table */}
        {rows.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-200 bg-cream-50">
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Patient Name
                      </span>
                    </th>
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Email
                      </span>
                    </th>
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Leave Period
                      </span>
                    </th>
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Submitted
                      </span>
                    </th>
                    <th className="text-right px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => {
                    const data = parseRawData(row.rawData)
                    return (
                      <tr
                        key={row.id}
                        className="border-b border-warm-100 hover:bg-cream-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/admin/sick-notes/${row.id}`}
                            className="font-medium text-warm-800 text-sm hover:text-sage-700 hover:underline"
                          >
                            {row.patientName}
                          </Link>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-warm-600">{row.patientEmail}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-100 text-sage-700">
                            <CalendarRange size={12} />
                            {formatLeavePeriod(data)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-warm-500">
                            {format(new Date(row.submittedAt), 'dd MMM yyyy')}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/admin/sick-notes/${row.id}`}
                            className="text-sm font-medium text-sage-600 hover:text-sage-700 hover:underline transition-all"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
