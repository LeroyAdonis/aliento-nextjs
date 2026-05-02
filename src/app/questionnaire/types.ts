import type {
  step1Schema, step2Schema, step3Schema, step4Schema,
  step5Schema, step6Schema, step7Schema, step8Schema,
  step9Schema, step10Schema,
} from './schema'
import type { z } from 'zod'

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step4Data = z.infer<typeof step4Schema>
export type Step5Data = z.infer<typeof step5Schema>
export type Step6Data = z.infer<typeof step6Schema>
export type Step7Data = z.infer<typeof step7Schema>
export type Step8Data = z.infer<typeof step8Schema>
export type Step9Data = z.infer<typeof step9Schema>
export type Step10Data = z.infer<typeof step10Schema>

export type FullFormData = Step1Data &
  Step2Data &
  Step3Data &
  Step4Data &
  Step5Data &
  Step6Data &
  Step7Data &
  Step8Data &
  Step9Data &
  Step10Data
