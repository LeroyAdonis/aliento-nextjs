'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Plus, Search, Filter, ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'

type Script = {
  id: string
  patientName: string
  patientEmail: string | null
  type: 'paid' | 'free'
  status: 'pending' | 'completed'
  medications: { name: string; dosage: string; quantity: string; refills: string }[]
  createdAt: string
  scriptPdfUrl: string | null
}

export default function AdminScriptsPage() {
  const router = useRouter()
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'paid' | 'free'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all')
  const [sortField, setSortField] = useState<'name' | 'date'>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  async function fetchScripts() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/scripts/list')
      if (!res.ok) throw new Error('Failed to load scripts')
      const data = await res.json()
      setScripts(data.scripts || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scripts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function load() {
      fetchScripts()
    }
    load()
  }, [])

  const filteredAndSorted = useMemo(() => {
    let result = [...scripts]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        s =>
          s.patientName.toLowerCase().includes(q) ||
          (s.patientEmail && s.patientEmail.toLowerCase().includes(q))
      )
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(s => s.type === filterType)
    }

    // Status filter
    if (filterStatus !== 'all') {
      result = result.filter(s => s.status === filterStatus)
    }

    // Sort
    result.sort((a, b) => {
      if (sortField === 'name') {
        return sortDir === 'asc'
          ? a.patientName.localeCompare(b.patientName)
          : b.patientName.localeCompare(a.patientName)
      }
      const da = new Date(a.createdAt).getTime()
      const db = new Date(b.createdAt).getTime()
      return sortDir === 'asc' ? da - db : db - da
    })

    return result
  }, [scripts, searchQuery, filterType, filterStatus, sortField, sortDir])

  function toggleSort(field: 'name' | 'date') {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const medicationCount = (meds: Script['medications']) =>
    meds.filter(m => m.name && m.name.trim() !== '').length

  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <header className="bg-white border-b border-warm-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-100 flex items-center justify-center">
              <FileText size={20} className="text-sage-600" />
            </div>
            <div>
              <h1 className="font-display font-bold text-warm-900 text-xl">Script Generator</h1>
              <p className="text-xs text-warm-400">{scripts.length} total scripts</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/admin/scripts/new')}
            className="flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
          >
            <Plus size={18} />
            New Script
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-warm-200 p-4 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400" />
            <input
              type="text"
              placeholder="Search by patient name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-cream-50 border border-warm-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-warm-700 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter size={16} className="text-warm-400" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as typeof filterType)}
              className="bg-cream-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 focus:outline-none focus:ring-2 focus:ring-sage-200"
            >
              <option value="all">All Types</option>
              <option value="paid">Paid</option>
              <option value="free">Free</option>
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
              className="bg-cream-50 border border-warm-200 rounded-xl px-3 py-2.5 text-sm text-warm-700 focus:outline-none focus:ring-2 focus:ring-sage-200"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-warm-200 p-12 text-center">
            <div className="w-8 h-8 border-2 border-sage-300 border-t-sage-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-warm-400">Loading scripts...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredAndSorted.length === 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-4">
              <FileText size={28} className="text-sage-400" />
            </div>
            <h3 className="font-display font-semibold text-warm-800 text-lg mb-1">No scripts found</h3>
            <p className="text-sm text-warm-400 mb-6">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first prescription script'}
            </p>
            <button
              onClick={() => router.push('/admin/scripts/new')}
              className="inline-flex items-center gap-2 bg-sage-600 hover:bg-sage-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
            >
              <Plus size={18} />
              New Script
            </button>
          </div>
        )}

        {/* Scripts table */}
        {!loading && filteredAndSorted.length > 0 && (
          <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-200 bg-cream-50">
                    <th className="text-left px-5 py-3.5">
                      <button
                        onClick={() => toggleSort('name')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-warm-500 uppercase tracking-wider hover:text-warm-700 transition-colors"
                      >
                        Patient Name
                        <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Type
                      </span>
                    </th>
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Status
                      </span>
                    </th>
                    <th className="text-left px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Medications
                      </span>
                    </th>
                    <th className="text-left px-5 py-3.5">
                      <button
                        onClick={() => toggleSort('date')}
                        className="flex items-center gap-1.5 text-xs font-semibold text-warm-500 uppercase tracking-wider hover:text-warm-700 transition-colors"
                      >
                        Created
                        <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="text-right px-5 py-3.5">
                      <span className="text-xs font-semibold text-warm-500 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.map(script => (
                    <tr
                      key={script.id}
                      className="border-b border-warm-100 hover:bg-cream-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-medium text-warm-800 text-sm">{script.patientName}</div>
                        {script.patientEmail && (
                          <div className="text-xs text-warm-400 mt-0.5">{script.patientEmail}</div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            script.type === 'paid'
                              ? 'bg-blush-100 text-blush-700'
                              : 'bg-sage-100 text-sage-700'
                          }`}
                        >
                          {script.type === 'paid' ? 'Paid' : 'Free'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            script.status === 'completed'
                              ? 'bg-sage-100 text-sage-700'
                              : 'bg-warm-100 text-warm-600'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              script.status === 'completed' ? 'bg-sage-500' : 'bg-warm-400'
                            }`}
                          />
                          {script.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-warm-600">
                          {medicationCount(script.medications)} items
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-warm-500">
                          {format(new Date(script.createdAt), 'dd MMM yyyy')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => router.push(`/admin/scripts/${script.id}`)}
                          className="text-sm font-medium text-sage-600 hover:text-sage-700 hover:underline transition-all"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
