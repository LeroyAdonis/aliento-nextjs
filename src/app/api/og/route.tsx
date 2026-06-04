import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const SAGE_GREEN = '#7C9E8A'
const SAGE_DARK = '#5B7D69'
const WARM_900 = '#1e293b'
const WARM_600 = '#64748b'
const CREAM = '#FFF8F0'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Aliento'
  const description = searchParams.get('description') || 'Breathe, Screen, Live'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: CREAM,
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background shapes */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(124, 158, 138, 0.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            left: -60,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'rgba(124, 158, 138, 0.06)',
          }}
        />

        {/* Top section */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            padding: '48px 64px 0',
          }}
        >
          {/* Leaf icon */}
          <svg width="52" height="52" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4 C 29 5 34 13 33 21 C 32 30 26 36 20 36 C 14 36 8 30 7 21 C 6 13 11 5 20 4Z" fill={SAGE_GREEN} />
            <line x1="20" y1="7" x2="20" y2="33" stroke="rgba(255,255,255,0.25)" stroke-width="1.2" />
            <path d="M9 20 C 12 15 15 15 18 20 C 21 25 24 25 27 20 C 30 15 32 17 31 20"
                  stroke="white" stroke-width="2" stroke-linecap="round" fill="none" />
          </svg>
          <span
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: WARM_900,
              letterSpacing: '-0.02em',
            }}
          >
            Aliento
          </span>
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 64px',
          }}
        >
          {title !== 'Aliento' && (
            <div
              style={{
                background: SAGE_GREEN,
                alignSelf: 'flex-start',
                borderRadius: 20,
                padding: '6px 18px',
                fontSize: 14,
                fontWeight: 600,
                color: 'white',
                marginBottom: 16,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {title}
            </div>
          )}

          <div
            style={{
              fontSize: title !== 'Aliento' ? 44 : 56,
              fontWeight: 700,
              color: WARM_900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: '85%',
              marginBottom: 16,
            }}
          >
            {title === 'Aliento' ? 'Health Promotion &\nVirtual Consultations' : title}
          </div>

          <div
            style={{
              fontSize: 22,
              color: WARM_600,
              lineHeight: 1.5,
              maxWidth: '75%',
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom bar with branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '32px 64px 40px',
            borderTop: `1px solid rgba(124, 158, 138, 0.15)`,
          }}
        >
          <span style={{ fontSize: 14, color: WARM_600, fontWeight: 500 }}>
            alientomd.com
          </span>
          <span style={{ fontSize: 13, color: SAGE_GREEN, fontWeight: 600, fontStyle: 'italic' }}>
            &quot;Breathe, Screen, Live&quot;
          </span>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${SAGE_GREEN}, #A8C5B4, ${SAGE_DARK})`,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
