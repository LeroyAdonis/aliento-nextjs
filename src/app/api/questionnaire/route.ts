export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { db } from '@/db'
import { questionnaires } from '@/db/schema'
import { sendEmail } from '@/lib/email'
import type { FullFormData } from '@/app/questionnaire/types'

interface RequestBody {
  bookingUid: string | null
  patientName: string
  patientEmail: string
  data: FullFormData
}

function buildEmailHtml(data: FullFormData, bookingUid: string | null): string {
  const row = (label: string, value: unknown) =>
    `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 12px;font-size:13px;color:#111827">${String(value ?? '—')}</td></tr>`

  const section = (title: string, rows: string) =>
    `<tr><td colspan="2" style="padding:16px 12px 6px;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af">${title}</td></tr>${rows}`

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;background:#f9fafb;padding:32px 0;color:#111827">
<div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08)">
  <div style="background:#4a7c59;padding:24px 32px">
    <h1 style="margin:0;color:#fff;font-size:20px;font-weight:600">New Questionnaire Submission</h1>
    <p style="margin:6px 0 0;color:#a7c4b0;font-size:14px">${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
  </div>
  <table style="width:100%;border-collapse:collapse">
    ${section('Patient', [
      row('Name', `${data.firstName} ${data.lastName}`),
      row('Email', data.email),
      row('Phone', data.phone),
      row('Age', data.age),
      row('Gender', data.gender),
      row('Booking UID', bookingUid ?? 'N/A'),
    ].join(''))}
    ${section('Body Metrics', [
      row('Current Weight', `${data.currentWeight} kg`),
      row('Height', `${data.currentHeight} cm`),
      row('Waist', `${data.waistCircumference} cm`),
      row('Goal Weight', `${data.goalWeight} kg`),
    ].join(''))}
    ${section('Medical History', [
      row('Diabetes', data.diabetes),
      row('Hypertension', data.hypertension),
      row('Cardiac disease', data.cardiacDisease),
      row('Asthma', data.asthma),
      row('COVID-19', data.hadCovid),
      row('COVID vaccination', data.covidVaccinationStatus),
      row('Allergies', data.allergies),
    ].join(''))}
    ${section('Medications', [
      row('Current medications', data.currentMedications),
      row('Types of medication', data.medicationType),
      row('Length of time on meds', data.medicationDuration),
      row('Side effects', data.medicationSideEffects),
    ].join(''))}
    ${section('Surgical History', [row('Procedures', data.surgicalHistory)].join(''))}
    ${section('Lifestyle', [
      row('Smokes', data.smokes),
      row('Alcohol >3×/week', data.drinksOver3xWeek),
      row('Recreational drugs', data.recreationalDrugs),
      row('Exercises regularly', data.exercisesDaily),
      row('Healthy diet', data.healthyDiet),
      row('Stress profile', Array.isArray(data.stressProfile) ? data.stressProfile.join(', ') : data.stressProfile),
    ].join(''))}
    ${section('Consent', [
      row('Research consent', data.consentResearch),
      row('POPIA', data.consentPOPI),
      row('Indemnity', data.consentIndemnity ? 'Accepted' : 'Not accepted'),
    ].join(''))}
  </table>
  <div style="padding:24px 32px;border-top:1px solid #e5e7eb">
    <p style="margin:0;font-size:12px;color:#9ca3af">Full response JSON attached as part of the database record.</p>
  </div>
</div>
</body>
</html>`
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody
    const { bookingUid, patientName, patientEmail, data } = body

    if (!patientName || !patientEmail || !data) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = crypto.randomUUID()

    await db.insert(questionnaires).values({
      id,
      patientName,
      patientEmail,
      rawData: JSON.stringify({ bookingUid, ...data }),
    })

    await sendEmail({
      purpose: 'questionnaire',
      subject: `New questionnaire from ${patientName}`,
      html: buildEmailHtml(data, bookingUid ?? null),
      replyTo: patientEmail,
    })

    return NextResponse.json({ success: true, id })
  } catch (err) {
    console.error('[questionnaire/POST]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
