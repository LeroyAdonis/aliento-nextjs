import crypto from 'crypto'

// ── Payfast Config ──
export const PAYFAST_CONFIG = {
  merchantId: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID || '',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '',
  passphrase: process.env.PAYFAST_PASSPHRASE || '',
  sandboxMode: !process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID, // auto-sandbox if no creds
}

export const PAYFAST_URL = PAYFAST_CONFIG.sandboxMode
  ? 'https://sandbox.payfast.co.za/eng/process'
  : 'https://www.payfast.co.za/eng/process'

// ── Consultation Packages ──
export const CONSULTATION_PACKAGES = [
  {
    id: 'consult-20',
    name: '20-Minute Consultation',
    description: 'Quick virtual consultation via Zoom or Teams',
    amount: 250,
    duration: '20 min',
  },
  {
    id: 'consult-35',
    name: '35-Minute Consultation',
    description: 'Extended virtual consultation via Zoom or Teams',
    amount: 500,
    duration: '35 min',
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
  /** Package ID from CONSULTATION_PACKAGES. Omit to use custom amount/item. */
  packageId?: string
  buyerEmail: string
  buyerName: string
  returnUrl: string
  cancelUrl: string
  notifyUrl: string
  paymentId?: string
  /** Custom amount override (e.g. '50.00'). Required when packageId is omitted. */
  amount?: string
  /** Custom item name (e.g. 'PDF: My Article'). Required when packageId is omitted. */
  itemName?: string
  /** Custom item description. Falls back to itemName when omitted. */
  itemDescription?: string
}): Record<string, string> {
  const pkg = params.packageId
    ? CONSULTATION_PACKAGES.find((p) => p.id === params.packageId)
    : undefined
  if (params.packageId && !pkg) throw new Error(`Invalid package: ${params.packageId}`)

  const amount = params.amount ?? (pkg ? pkg.amount.toFixed(2) : undefined)
  const itemName = params.itemName ?? pkg?.name
  const itemDescription = params.itemDescription ?? pkg?.description
  const paymentId = params.paymentId || `${pkg?.id || 'custom'}-${Date.now()}`

  if (!amount || !itemName) {
    throw new Error('Either packageId or amount+itemName must be provided')
  }

  const data: Record<string, string> = {
    merchant_id: PAYFAST_CONFIG.merchantId,
    merchant_key: PAYFAST_CONFIG.merchantKey,
    return_url: params.returnUrl,
    cancel_url: params.cancelUrl,
    notify_url: params.notifyUrl,
    name_first: params.buyerName.split(' ')[0] || '',
    name_last: params.buyerName.split(' ').slice(1).join(' ') || '',
    email_address: params.buyerEmail,
    m_payment_id: paymentId,
    amount,
    item_name: itemName,
    item_description: itemDescription || itemName,
  }

  data.signature = generatePayfastSignature(data, PAYFAST_CONFIG.passphrase)
  return data
}
