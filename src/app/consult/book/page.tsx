import { Suspense } from 'react'
import { BookingContent } from './BookingContent'

export default function ConsultBookPage() {
  return (
    <Suspense fallback={<div>Loading booking...</div>}>
      <BookingContent />
    </Suspense>
  )
}
