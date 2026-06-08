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

  // Set pathname header for root layout detection (admin gets full viewport)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  // Admin pages need auth (except login page itself)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!isAuthenticated(request)) {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Protect write API routes
  const isWriteApiRoute =
    (pathname.startsWith('/api/posts') && request.method !== 'GET') ||
    pathname.startsWith('/api/upload')

  if (isWriteApiRoute) {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: ['/admin/:path*', '/api/posts/:path*', '/api/upload'],
}
