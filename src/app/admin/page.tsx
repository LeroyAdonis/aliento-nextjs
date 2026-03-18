import Link from 'next/link'
import { FileText, BarChart3, ArrowLeft } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <div className="bg-warm-900 text-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-2">
            <Link href="/" className="text-warm-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>
          </div>
          <p className="text-warm-400 ml-10">Manage your Aliento content</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/posts"
            className="group bg-white rounded-2xl border border-warm-200 p-8 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText size={24} className="text-primary-600" />
            </div>
            <h3 className="font-display font-semibold text-warm-900 text-xl mb-2">Articles</h3>
            <p className="text-warm-500">View, edit, and manage all blog posts</p>
          </Link>

          <Link
            href="/blog"
            className="group bg-white rounded-2xl border border-warm-200 p-8 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-sage-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText size={24} className="text-sage-600" />
            </div>
            <h3 className="font-display font-semibold text-warm-900 text-xl mb-2">View Blog</h3>
            <p className="text-warm-500">See your published articles</p>
          </Link>

          <div className="group bg-white rounded-2xl border border-warm-200 p-8 opacity-60">
            <div className="w-14 h-14 rounded-2xl bg-warm-100 flex items-center justify-center mb-6">
              <BarChart3 size={24} className="text-warm-500" />
            </div>
            <h3 className="font-display font-semibold text-warm-900 text-xl mb-2">Analytics</h3>
            <p className="text-warm-500">Coming soon — track page views</p>
          </div>
        </div>
      </div>
    </div>
  )
}
