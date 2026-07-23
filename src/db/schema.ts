import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core'

export const payments = pgTable('payments', {
  paymentId: text('payment_id').primaryKey(),
  packageId: text('package_id').notNull(),
  buyerName: text('buyer_name').notNull(),
  buyerEmail: text('buyer_email').notNull(),
  status: text('status').notNull().default('pending'),
  stream: text('stream').notNull().default('consult'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  paidAt: timestamp('paid_at'),
})

export const questionnaires = pgTable('questionnaires', {
  id: text('id').primaryKey(),
  patientName: text('patient_name').notNull(),
  patientEmail: text('patient_email').notNull(),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  rawData: text('raw_data'),
  stream: text('stream').notNull().default('consult'),
})

export const scripts = pgTable('scripts', {
  id: text('id').primaryKey(),
  patientName: text('patient_name').notNull(),
  patientEmail: text('patient_email'),
  patientIdNumber: text('patient_id_number'),
  patientCell: text('patient_cell'),
  patientAddress: text('patient_address'),
  medications: jsonb('medications').notNull().default([]),
  type: text('type').notNull().default('free'),      // 'paid' | 'free'
  status: text('status').notNull().default('pending'), // 'pending' | 'completed'
  specialInstructions: text('special_instructions'),
  paymentId: text('payment_id'),
  questionnaireId: text('questionnaire_id'),
  scriptPdfUrl: text('script_pdf_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  completedAt: timestamp('completed_at'),
})
