const fs = require('fs');
const raw = fs.readFileSync('/root/aliento-nextjs/.env.local', 'utf8');

// Find RESEND_API_KEY line
let apiKey = '';
for (const line of raw.split('\n')) {
  if (line.indexOf('RESEND_API_KEY') !== -1) {
    const parts = line.split('=');
    if (parts.length > 1) {
      apiKey = parts.slice(1).join('=').replace(/"/g, '').replace(/\\n/g, '').trim();
    }
    break;
  }
}

if (!apiKey || apiKey === '***' || apiKey.indexOf('re_') !== 0) {
  console.log('Failed to get valid RESEND_API_KEY. Got: ' + (apiKey ? apiKey.substring(0, 10) : 'nothing'));
  process.exit(1);
}

console.log('API key found: ' + apiKey.substring(0, 8) + '...');

const { Resend } = require('resend');
const resend = new Resend(apiKey);

async function main() {
  const result = await resend.emails.send({
    from: 'Aliento Health <bookings@alientomd.com>',
    to: 'mahendren4510@gmail.com',
    subject: 'Your Aliento Consultation Booking Link',
    html: [
      '<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:30px;">',
      '<div style="background:#5E8A70;padding:20px;border-radius:12px 12px 0 0;text-align:center;">',
      '<h1 style="color:white;margin:0;font-size:24px;">Aliento Health</h1>',
      '</div>',
      '<div style="background:#FDF8F0;padding:30px;border-radius:0 0 12px 12px;">',
      '<p style="color:#433E34;font-size:16px;">Hi Mahendren,</p>',
      '<p style="color:#433E34;font-size:16px;">Your payment of R250.00 for your 20-Minute Medical Consultation was successful.</p>',
      '<p style="color:#433E34;font-size:16px;">The booking calendar is now unlocked. Pick a date and time that works for you:</p>',
      '<div style="text-align:center;margin:30px 0;">',
      '<a href="https://alientomd.com/consult" style="background:#5E8A70;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">',
      'Book Your Consultation Now',
      '</a>',
      '</div>',
      '<p style="color:#433E34;font-size:14px;">Or visit: <a href="https://alientomd.com/consult" style="color:#5E8A70;">alientomd.com/consult</a></p>',
      '<hr style="border:none;border-top:1px solid #D8EAE0;margin:25px 0;">',
      '<p style="color:#857A6A;font-size:12px;">Dr. Leegale Adonis - alientomd.com</p>',
      '</div></div>'
    ].join('\n')
  });
  
  console.log('Sent!', JSON.stringify(result, null, 2));
}

main().catch(err => console.error('Error:', err));
