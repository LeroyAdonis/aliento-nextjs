import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Aliento Admin',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-hidden bg-white">
      {children}
    </div>
  )
}
