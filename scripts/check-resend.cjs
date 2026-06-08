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

const https = require('https');

function apiCall(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.resend.com',
      path: path,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer *** + apiKey
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e) { resolve({ raw: data }); }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function main() {
  console.log('=== Resend Account Info ===');
  const domains = await apiCall('/domains');
  console.log('Domains:', JSON.stringify(domains, null, 2));
  
  console.log('\n=== API Key Info ===');
  const apiKeys = await apiCall('/api-keys');
  console.log('API Keys:', JSON.stringify(apiKeys, null, 2));
}

main().catch(err => console.error('Error:', err));
