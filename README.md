# Aliento Next.js

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Required environment variables

### Cal.com
- `NEXT_PUBLIC_CALCOM_USERNAME` — Cal.com username/org handle
- `NEXT_PUBLIC_CALCOM_EVENT_SLUG_30` — event slug for 30-minute consult
- `NEXT_PUBLIC_CALCOM_EVENT_SLUG_60` — event slug for 60-minute consult
- `CALCOM_API_KEY` — server-side API key (never expose client-side)
- `CALCOM_WEBHOOK_SECRET` — webhook signing secret for `x-cal-signature-256`

### Site
- `NEXT_PUBLIC_SITE_URL` — public site URL used for callback URLs

### PayFast
- `NEXT_PUBLIC_PAYFAST_MERCHANT_ID`
- `NEXT_PUBLIC_PAYFAST_MERCHANT_KEY`
- `PAYFAST_PASSPHRASE`

## Consult booking flow

1. User goes to `/consult` and selects 30min or 60min.
2. User pays via PayFast.
3. `/api/payment/notify` marks payment as paid.
4. User is redirected to `/consult/book?paymentId=...`.
5. Gate waits for paid status, then unlocks Cal.com embed.
6. Booking confirmation page is `/consult/confirmed/[bookingUid]`.

## Cal.com webhook endpoint

- URL: `/api/webhooks/calcom`
- Signature header: `x-cal-signature-256`
- Current behavior: validates signature + structured logging for lifecycle events.

For local webhook testing, expose your dev server through a tunnel (ngrok/cloudflared) and set webhook URL to `https://<tunnel>/api/webhooks/calcom`.
