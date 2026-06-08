const fs = require('fs');
const raw = fs.readFileSync('/root/aliento-nextjs/.env.local', 'utf8');
let apiKey = '';
for (const line of raw.split('\n')) {
  if (line.indexOf('RESEND_API_KEY') !== -1) {
    apiKey = line.split('=').slice(1).join('=').replace(/"/g, '').replace(/\\n/g, '').trim();
    break;
  }
}

const { Resend } = require('resend');
const resend = new Resend(apiKey);

async function main() {
  const result = await resend.emails.send({
    from: 'Ricky (Aliento) <test@nozar.co.za>',
    to: 'info@alientomd.com',
    subject: 'Test - Aliento email forwarding check',
    html: '<p>Hey Lee!</p><p>This is a test to confirm ImprovMX is forwarding emails to your inbox.</p><p>If you got this, <strong>info@alientomd.com is working!</strong> 🎉</p><p>- Ricky 🤙</p>'
  });
  console.log(JSON.stringify(result, null, 2));
}

main().catch(err => console.error('Error:', err));
