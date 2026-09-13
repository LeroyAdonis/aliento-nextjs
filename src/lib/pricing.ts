export const PRICES = {
  consultation: 700,
  prescription: 500,
  sickNote: 500,
  secondOpinion: 250,
} as const

export function formatRand(amount: number): string {
  return `R${amount}`
}

export interface ServicePackage {
  id: string
  name: string
  description: string
  amount: number
  displayPrice: string
}

export const SERVICE_PACKAGES: ServicePackage[] = [
  { id: 'consult', name: 'Medical Consultation', description: '35-minute virtual consultation with Dr Leegale Adonis via Zoom or Teams', amount: PRICES.consultation, displayPrice: formatRand(PRICES.consultation) },
  { id: 'prescription-1', name: 'Prescription Request', description: 'Repeat prescription request reviewed by a medical doctor', amount: PRICES.prescription, displayPrice: formatRand(PRICES.prescription) },
  { id: 'sicknote-1', name: 'Sick Note Assessment', description: 'Sick leave assessment and medical certificate', amount: PRICES.sickNote, displayPrice: formatRand(PRICES.sickNote) },
  { id: 'secondopinion-1', name: 'Second Opinion Review', description: 'Independent second opinion on your diagnosis and treatment plan', amount: PRICES.secondOpinion, displayPrice: formatRand(PRICES.secondOpinion) },
]

export function getPackage(id: string): ServicePackage | undefined {
  return SERVICE_PACKAGES.find((p) => p.id === id)
}

export function getDisplayPrice(id: string): string {
  return getPackage(id)?.displayPrice ?? ''
}
