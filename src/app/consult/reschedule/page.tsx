import { Suspense } from 'react'
import RescheduleClient from './RescheduleClient'

export default function ReschedulePage() {
  return (
    <Suspense fallback={<div>Loading rescheduling...</div>}>
      <RescheduleClient />
    </Suspense>
  )
}
