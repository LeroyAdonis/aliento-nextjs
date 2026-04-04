import { NextResponse } from 'next/server'
import { getCalBookingByUid } from '@/lib/calcom'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ bookingUid: string }> }
) {
  try {
    const { bookingUid } = await params
    const booking = await getCalBookingByUid(bookingUid)
    return NextResponse.json(booking)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch booking' },
      { status: 500 }
    )
  }
}
