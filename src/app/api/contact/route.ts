import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    // Store the inquiry - for now log it, can be extended to email/DB
    const inquiry = {
      name,
      email,
      phone: phone || '',
      message,
      date: new Date().toISOString(),
      read: false
    }

    // Log to console for now
    console.log('NEW CONTACT INQUIRY:', JSON.stringify(inquiry, null, 2))

    // If Resend is configured, send notification email
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Aliento <noreply@alientomedical.com>',
            to: ['info@alientomedical.com'],
            subject: `New Contact: ${name}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Message:</strong></p>
              <p>${message.replace(/\n/g, '<br>')}</p>
              <hr>
              <p style="color: #666; font-size: 12px;">Received: ${new Date().toLocaleString()}</p>
            `
          })
        })
      } catch (emailErr) {
        console.error('Email send failed:', emailErr)
      }
    }

    return NextResponse.json({ success: true, message: 'Inquiry received' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
