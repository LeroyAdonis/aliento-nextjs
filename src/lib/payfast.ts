import crypto from 'crypto'

// ── Payfast Config ──
export const PAYFAST_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
  merchantKey: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY || '',
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  sandboxMode: !process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID, // auto-sandbox if no creds
}

export const PAYFAST_URL = PAYFAST_CONFIG.sandboxMode
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process'

// ── Consultation Packages ──
export const CONSULTATION_PACKAGES = [
  {
    id: 'consult-30',
    name: '30-Minute Consultation',
    description: 'Virtual face-to-face consultation via Zoom or Teams',
    amount: 250,
    duration: '30 min',
  },
  {
    id: 'consult-60',
    name: '1-Hour Consultation',
    description: 'Extended virtual face-to-face consultation via Zoom or Teams',
    amount: 500,
    duration: '1 hour',
  },
] as const

// ── Signature Generation ──
export function generatePayfastSignature(
  data: Record<string, string>,
  passphrase?: string
): string {
  const params = Object.entries(data)
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, '+')}`)
    .join('&')

  const signatureString = passphrase ? `${params}&passphrase=${encodeURIComponent(passphrase)}` : params
  return crypto.createHash('md5').update(signatureString).digest('hex')
}

// ── Build Payfast Form Data ──
export function buildPayfastFormData(params: {
  packageId: string
  buyerEmail: string
  buyerName: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
}): Record<string, string> {
  const pkg = CONSULTATION_PACKAGES.find((p) => p.id === params.packageId)
  if (!pkg) throw new Error(`Invalid package: ${params.packageId}`)

  const data: Record<string, string> = {
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,
    return_url: params.returnUrl,
    cancel_url: params.cancelUrl,
    notify_url: params.notifyUrl,
    name_first: params.buyerName.split(' ')[0] || '',
    name_last: params.buyerName.split(' ').slice(1).join(' ') || '',
    email_address: params.buyerEmail,
    m_payment_id: `${pkg.id}-${Date.now()}`,
    amount: pkg.amount.toFixed(2),
    item_name: pkg.name,
    item_description: pkg.description,
  }

  data.signature = generatePayfastSignature(data, PAYFAST_CONFIG.passphrase)
  return data
}
