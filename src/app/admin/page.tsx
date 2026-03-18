import Link from 'next/link'
import { FileText, Plus, Settings, BarChart3, ArrowLeft } from 'lucide-react'

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/admin/posts"
            className="group bg-white rounded-2xl border border-warm-200 p-8 hover:border-primary-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Plus size={24} className="text-primary-600" />
            </div>
            <h3 className="font-display font-semibold text-warm-900 text-xl mb-2">New Post</h3>
            <p className="text-warm-500">Create and publish a new blog article</p>
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

        {/* Info box */}
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
          <h3 className="font-display font-semibold text-primary-900 mb-2">📝 Admin Dashboard</h3>
          <p className="text-primary-700">
            This is the basic admin interface. In the next phase, we'll add:
          </p>
          <ul className="mt-4 space-y-2 text-primary-700">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Better Auth login (secure access)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Tiptap rich text editor
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              Image uploads (Cloudflare R2)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
              GitHub auto-commit on publish
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
