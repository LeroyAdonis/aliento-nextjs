import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core'

export const payments = pgTable('payments', {
  paymentId: text('payment_id').primaryKey(),
  packageId: text('package_id').notNull(),
  buyerName: text('buyer_name').notNull(),
  buyerEmail: text('buyer_email').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  paidAt: timestamp('paid_at'),
})

export const questionnaires = pgTable('questionnaires', {
  id: text('id').primaryKey(),
  patientName: text('patient_name').notNull(),
  patientEmail: text('patient_email').notNull(),
  submittedAt: timestamp('submitted_at').notNull().defaultNow(),
  rawData: text('raw_data'),
})