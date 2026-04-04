import { NextResponse } from 'next/server'
import { getCalBookingByUid } from '@/lib/calcom'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookingUid: string }> }
) {
  try {
    const { bookingUid } = await params
    const booking = await getCalBookingByUid(bookingUid)
    return NextResponse.json({ ok: true, booking })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Reschedule lookup failed' },
      { status: 500 }
    )
  }
}
