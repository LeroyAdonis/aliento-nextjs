import { inngest } from '@/inngest/client'

export async function reportAiFailure(payload: {
  feature: 'blog' | 'script' | 'sick-note'
  model: string
  errorMessage: string
  documentId?: string
}) {
  try {
    if (!process.env.INNGEST_EVENT_KEY) {
      console.warn('[reportAiFailure] INNGEST_EVENT_KEY not set — skipping')
      return
    }

    await inngest.send({
      name: 'aliento/ai.failed',
      data: payload,
    })
  } catch (err) {
    console.error('[reportAiFailure] failed to send event:', err)
  }
}
