import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
// filter(Boolean) matters: an unset/empty ADMIN_EMAILS used to parse to [''],
// so length > 0 was always true and EVERY email was rejected with a 403 —
// a hard lockout for all admins. Empty list now means "no email allow-list".
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(e => e.trim().toLowerCase())
  .filter(Boolean)
const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

export async function POST(request: NextRequest) {
  try {
    const { secret, email } = await request.json()

    // The secret check runs first so a wrong passcode never reveals allow-list information.
    if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // An email is REQUIRED. Without this, a POST of {secret} alone skipped the allow-list
    // entirely and still issued a valid admin cookie.
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    if (!normalizedEmail) {
      return NextResponse.json(
        { error: 'Email is required for admin access' },
        { status: 400 }
      )
    }

    // Fail closed: an empty allow-list means the deployment is misconfigured, not that
    // every email is welcome.
    if (ADMIN_EMAILS.length === 0) {
      console.error('[admin/auth] ADMIN_EMAILS is empty — refusing all admin logins')
      return NextResponse.json(
        { error: 'Admin allow-list not configured' },
        { status: 500 }
      )
    }

    if (!ADMIN_EMAILS.includes(normalizedEmail)) {
      return NextResponse.json({ error: 'Email not authorised for admin access' }, { status: 403 })
    }

    const response = NextResponse.json({ success: true, email })
    response.cookies.set(COOKIE_NAME, ADMIN_SECRET, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete(COOKIE_NAME)
  return response
}
