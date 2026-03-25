export const theme = {
  colors: {
    primary:    '#7C9E8A',  // Sage
    secondary:  '#D9896A',  // Blush Deep
    accent:     '#F2C4C4',  // Blush
    background: '#FDF8F0',  // Cream
    foreground: '#2E2A26',  // Warm text
    muted:      '#857A6A',  // Muted text
    border:     '#E5E1DB',  // Warm 200
  },
  fonts: {
    heading: 'Instrument Serif',
    body:    'Satoshi',
  },
} as const

export type Theme = typeof theme
