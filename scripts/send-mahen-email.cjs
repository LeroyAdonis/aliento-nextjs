const { sendEmail } = require('./src/lib/email');

async function main() {
  const result = await sendEmail({
    purpose: 'booking',
    subject: 'Your Aliento Consultation Booking Link',
    html: `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 30px;">
        <div style="background-color: #5E8A70; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Aliento Health</h1>
        </div>
        <div style="background-color: #FDF8F0; padding: 30px; border-radius: 0 0 12px 12px;">
            <p style="color: #433E34; font-size: 16px;">Hi Mahendren,</p>
            <p style="color: #433E34; font-size: 16px;">Your payment of <strong>R250.00</strong> for a <strong>20-Minute Medical Consultation</strong> was successful.</p>
            <p style="color: #433E34; font-size: 16px;">You can now book your appointment:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://alientomd.com/consult" 
                   style="background-color: #5E8A70; color: white; padding: 14px 32px; 
                          border-radius: 50px; text-decoration: none; font-size: 16px; font-weight: bold;
                          display: inline-block;">
                    Book Your Consultation Now
                </a>
            </div>
            <p style="color: #433E34; font-size: 14px;">Or visit: <a href="https://alientomd.com/consult" style="color: #5E8A70;">alientomd.com/consult</a></p>
            <hr style="border: none; border-top: 1px solid #D8EAE0; margin: 25px 0;">
            <p style="color: #857A6A; font-size: 12px;">Dr. Leegale Adonis — alientomd.com</p>
        </div>
    </div>
    `
  });
  
  console.log('Result:', JSON.stringify(result, null, 2));
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
