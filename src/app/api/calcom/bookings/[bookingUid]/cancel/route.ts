import { NextResponse } from 'next/server'
import { cancelCalBooking } from '@/lib/calcom'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingUid: string }> }
) {
  try {
    const { bookingUid } = await params
    const body = await req.json().catch(() => ({}))
    const result = await cancelCalBooking(bookingUid, body.reason)
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Cancel failed' },
      { status: 500 }
    )
  }
}
