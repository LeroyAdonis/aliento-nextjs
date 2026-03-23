import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'Aliento Medical'
  const description = searchParams.get('description') || 'Empowering Personal Health'
  const category = searchParams.get('category') || ''

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #021a36 0%, #0a5dc2 50%, #3d8a3d 100%)',
          padding: '60px 80px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top corner logo */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 80,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Medical cross icon */}
          <div
            style={{
              width: 48,
              height: 48,
              background: 'white',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              <div style={{ width: 24, height: 4, background: '#0a5dc2', borderRadius: 2 }} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <div style={{ width: 4, height: 24, background: '#0a5dc2', borderRadius: 2 }} />
                <div style={{ width: 24, height: 24, background: '#0a5dc2', borderRadius: 12 }} />
                <div style={{ width: 4, height: 24, background: '#0a5dc2', borderRadius: 2 }} />
              </div>
              <div style={{ width: 24, height: 4, background: '#0a5dc2', borderRadius: 2 }} />
            </div>
          </div>
          <span
            style={{
              fontSize: 28,
              fontWeight: 600,
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            Aliento
          </span>
        </div>

        {/* Category badge */}
        {category && (
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '8px 20px',
              fontSize: 16,
              color: 'white',
              marginBottom: 16,
            }}
          >
            {category}
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 50 ? 48 : 56,
            fontWeight: 700,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: 20,
            maxWidth: '90%',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1.5,
            maxWidth: '80%',
          }}
        >
          {description}
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #0a5dc2, #3d8a3d, #ff6033)',
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
