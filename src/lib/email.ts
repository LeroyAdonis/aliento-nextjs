import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || '')

type EmailPurpose = 'questionnaire' | 'contact' | 'notification' | 'booking'

const RECIPIENT = 'leegailadonis@gmail.com'

const FROM_ADDRESSES: Record<EmailPurpose, string> = {
  questionnaire: 'Aliento Health <notifications@alientomd.com>',
  contact: 'Aliento Health <contact@alientomd.com>',
  notification: 'Aliento Health <notifications@alientomd.com>',
  booking: 'Aliento Health <bookings@alientomd.com>',
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

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESSES[params.purpose],
    to: RECIPIENT,
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
