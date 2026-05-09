import { Resend } from 'resend'

type EmailPurpose = 'questionnaire' | 'contact' | 'notification'

const RECIPIENTS: Record<EmailPurpose, string> = {
  questionnaire: 'leegale@alientomd.com',
  contact: 'leegale@alientomd.com',
  notification: 'leegale@alientomd.com',
}

export async function sendEmail(params: {
  purpose: EmailPurpose
  subject: string
  html: string
  replyTo?: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping send')
    return { success: false, reason: 'no_api_key' }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const { data, error } = await resend.emails.send({
    from: 'Aliento Health <notifications@alientomd.com>',
    to: RECIPIENTS[params.purpose],
    subject: params.subject,
    html: params.html,
    replyTo: params.replyTo,
  })

  if (error) {
    console.error('[Email] Send failed:', error)
    return { success: false, error }
  }

  return { success: true, data }
}