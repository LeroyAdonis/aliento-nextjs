import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
const COOKIE_NAME = 'admin_session'

function isAuthenticated(request: NextRequest): boolean {
 if (!ADMIN_SECRET) return true
 const cookie = request.cookies.get(COOKIE_NAME)
 return cookie?.value === ADMIN_SECRET
}

export function proxy(request: NextRequest) {
 const { pathname } = request.nextUrl

 if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
 if (!isAuthenticated(request)) {
 const studioUrl = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.sanity.studio`
 return NextResponse.redirect(studioUrl)
 }
 }

 const isWriteApiRoute =
 (pathname.startsWith('/api/posts') && request.method !== 'GET') ||
 pathname.startsWith('/api/upload')

 if (isWriteApiRoute) {
 if (!isAuthenticated(request)) {
 return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
 }
 }

 return NextResponse.next()
}

export const config = {
 matcher: ['/admin/:path*', '/api/posts/:path*', '/api/upload'],
}
