const fs = require('fs');
const raw = fs.readFileSync('/root/aliento-nextjs/.env.local', 'utf8');

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

if (!apiKey || apiKey.indexOf('re_') !== 0) {
  console.log('Failed to get key');
  process.exit(1);
}

const { Resend } = require('resend');
const resend = new Resend(apiKey);

async function main() {
  // Try sending from resend.alientomd.com domain
  console.log('Trying to send from resend.alientomd.com...\n');
  
  const result = await resend.emails.send({
    from: 'Aliento Health <bookings@resend.alientomd.com>',
    to: 'mahendren4510@gmail.com',
    subject: 'Your Aliento Consultation Booking Link',
    html: [
      '<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:30px;">',
      '<div style="background:#5E8A70;padding:20px;border-radius:12px 12px 0 0;text-align:center;">',
      '<h1 style="color:white;margin:0;font-size:24px;">Aliento Health</h1>',
      '</div>',
      '<div style="background:#FDF8F0;padding:30px;border-radius:0 0 12px 12px;">',
      '<p style="color:#433E34;font-size:16px;">Hi Mahendren,</p>',
      '<p style="color:#433E34;font-size:16px;">Your payment of R250.00 for your consultation was successful.</p>',
      '<p style="color:#433E34;font-size:16px;">The booking calendar is unlocked. Pick a date and time:</p>',
      '<div style="text-align:center;margin:30px 0;">',
      '<a href="https://alientomd.com/consult" style="background:#5E8A70;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">',
      'Book Your Consultation Now',
      '</a></div>',
      '<p style="color:#433E34;font-size:14px;">Or visit: alientomd.com/consult</p>',
      '<hr style="border:none;border-top:1px solid #D8EAE0;margin:25px 0;">',
      '<p style="color:#857A6A;font-size:12px;">Dr. Leegale Adonis</p>',
      '</div></div>'
    ].join('\n')
  });
  
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => console.error('Error:', err));
