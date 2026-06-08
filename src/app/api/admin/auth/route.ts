import { NextRequest, NextResponse } from 'next/server'

const ADMIN_SECRET = process.env.ADMIN_SECRET || ''
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase())
const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 8 // 8 hours

export async function POST(request: NextRequest) {
  try {
    const { secret, email } = await request.json()

    if (!ADMIN_SECRET || secret !== ADMIN_SECRET) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    if (email && ADMIN_EMAILS.length > 0) {
      const normalized = email.toLowerCase().trim()
      if (!ADMIN_EMAILS.includes(normalized)) {
        return NextResponse.json({ error: 'Email not authorised for admin access' }, { status: 403 })
      }
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
