import { NextResponse } from 'next/server'
import { listCalBookings } from '@/lib/calcom'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = (searchParams.get('status') || 'upcoming') as 'upcoming' | 'past' | 'cancelled'
    const limit = searchParams.get('limit') || '50'

    const result = await listCalBookings({
      status,
      limit: parseInt(limit, 10) || 50,
    })

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
