export const theme = {
  colors: {
    primary: '#1a73e8',    // Aliento Blue
    secondary: '#0d9488',  // Soft Teal
    accent: '#f97316',     // Coral
    background: '#f8fafc', // Light gray
    foreground: '#1e293b', // Dark text
    muted: '#64748b',      // Muted text
    border: '#e2e8f0',     // Border color
  },
  fonts: {
    heading: 'Plus Jakarta Sans',
    body: 'Inter',
  },
} as const

export type Theme = typeof theme
