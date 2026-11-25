import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
const COOKIE_NAME = 'admin_session'

const isAuthenticated = (request: NextRequest): boolean => {
  if (!ADMIN_SECRET) {
    // Fail CLOSED in production: a missing ADMIN_SECRET used to return true here and make
    // every /admin route public. The open path is kept for local/dev convenience only.
    if (process.env.NODE_ENV === 'production') {
      console.error('[proxy] ADMIN_SECRET is not set — denying /admin access')
      return false
    }
    return true
  }
  const cookie = request.cookies.get(COOKIE_NAME)
  return cookie?.value === ADMIN_SECRET
}

// Personalised/funnel routes that must never enter the index
const NOINDEX_PATTERNS = [
  /^\/consult\/(book|bookings|reschedule|cancel|confirmed)/,
  /^\/questionnaire/,
  /^\/(sick-note|second-opinion)\/questionnaire/,
]

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

    // Admin URLs from the pre-Sanity / script-platform era. The Studio catches every
    // unknown /admin path and renders "Tool not found: <name>" — a dead end with no
    // route back to the blog. Bare /admin renders an empty Studio for the same reason.
    // Redirect them at the edge, after auth, so bookmarks and the old login default
    // still land somewhere that works.
    const legacyAdminRedirects: Array<[RegExp, string]> = [
      [/^\/admin\/?$/, '/admin/structure'],
      [/^\/admin\/scripts(\/.*)?$/, '/admin/structure'],
      [/^\/admin\/posts\/?$/, '/admin/structure'],
      [/^\/admin\/posts\/new\/?$/, '/admin/intent/create/type=post'],
      [/^\/admin\/posts\/edit(\/.*)?$/, '/admin/structure'],
    ]

    for (const [pattern, target] of legacyAdminRedirects) {
      if (pattern.test(pathname)) {
        return NextResponse.redirect(new URL(target, request.url), 307)
      }
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

  // Keep funnel/personalised routes out of the index
  if (NOINDEX_PATTERNS.some((re) => re.test(pathname))) {
    const noindexRes = NextResponse.next({
      request: { headers: requestHeaders },
    })
    noindexRes.headers.set('x-robots-tag', 'noindex, nofollow')
    return noindexRes
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/posts/:path*',
    '/api/upload',
    '/consult/:path*',
    '/questionnaire/:path*',
    '/sick-note/questionnaire/:path*',
    '/second-opinion/questionnaire/:path*',
  ],
}
