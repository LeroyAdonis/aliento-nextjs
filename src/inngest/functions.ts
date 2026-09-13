import { inngest } from './client'
import { Resend } from 'resend'

const FEATURE_LABELS: Record<string, string> = {
  blog: 'Blog',
  script: 'Script',
  'sick-note': 'Sick Note',
}

export const aiFailureAlert = inngest.createFunction(
  {
    id: 'ai-failure-alert',
    triggers: [{ event: 'aliento/ai.failed' }],
    onFailure: async ({ error }) => {
      console.error('[Inngest] aiFailureAlert itself failed:', error)
    },
  },
  async ({ event, step }) => {
    await step.run('send-alert-email', async () => {
      const { feature, model, errorMessage, documentId } = event.data
      const label = FEATURE_LABELS[feature] ?? feature
      const resendKey = process.env.RESEND_API_KEY

      if (!resendKey) {
        console.warn('[Inngest] RESEND_API_KEY not set — skipping alert email')
        return
      }

      const to = process.env.AI_ALERT_EMAIL || 'leroyadonis3@gmail.com'
      const resend = new Resend(resendKey)

      const html = [
        '<h2>AI Draft Failure Alert</h2>',
        '<table style="border-collapse:collapse;margin:16px 0">',
        '<tr><td style="padding:4px 12px;font-weight:bold">Feature</td><td style="padding:4px 12px">' + label + '</td></tr>',
        '<tr><td style="padding:4px 12px;font-weight:bold">Model</td><td style="padding:4px 12px">' + model + '</td></tr>',
        '<tr><td style="padding:4px 12px;font-weight:bold">Document ID</td><td style="padding:4px 12px">' + (documentId || 'N/A') + '</td></tr>',
        '<tr><td style="padding:4px 12px;font-weight:bold">Time</td><td style="padding:4px 12px">' + new Date().toISOString() + '</td></tr>',
        '</table>',
        '<h3>Error</h3>',
        '<pre style="background:#f5f5f5;padding:12px;border-radius:4px;overflow-x:auto">' + errorMessage + '</pre>',
      ].join('\n')

      const { error } = await resend.emails.send({
        from: 'Aliento Health <notifications@alientomd.com>',
        to,
        subject: '[Aliento] AI draft failed — ' + label,
        html,
      })

      if (error) {
        console.error('[Inngest] Alert email failed:', error)
      }
    })
  }
)