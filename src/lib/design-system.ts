/**
 * Aliento Design System v2 — Elevated Medical UI
 * 
 * Inspired by Awwwards, Godly, Mobbin design patterns
 * Techniques incorporated:
 * - Subtle glassmorphism effects (Awwwards trend)
 * - Micro-interactions and hover states (Godly)
 * - Mobile-first component patterns (Mobbin)
 * - Layered gradients for depth
 * - Premium feel through typography and spacing
 */

export const designSystem = {
  // === COLORS ===
  colors: {
    // Primary palette
    primary: {
      50:  '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#1a73e8',  // Main Aliento blue
      600: '#1557b0',
      700: '#1d4ed8',
      800: '#1e3a8a',
      900: '#1e2a5e',
    },
    secondary: {
      50:  '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#0d9488',  // Soft teal
      600: '#0f766e',
      700: '#115e59',
    },
    accent: {
      50:  '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',  // Coral accent
      600: '#ea580c',
    },
    // Neutrals (warm-tinted for medical warmth)
    neutral: {
      50:  '#faf9f7',
      100: '#f5f3f0',
      200: '#e8e5e0',
      300: '#d6d3cd',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
    },
    // Semantic colors
    success: { light: '#ecfdf5', main: '#10b981', dark: '#065f46' },
    warning: { light: '#fffbeb', main: '#f59e0b', dark: '#92400e' },
    error:   { light: '#fef2f2', main: '#ef4444', dark: '#991b1b' },
    info:    { light: '#eff6ff', main: '#3b82f6', dark: '#1e40af' },
  },

  // === TYPOGRAPHY ===
  typography: {
    fontFamily: {
      heading: "'Plus Jakarta Sans', system-ui, sans-serif",
      body: "'Inter', system-ui, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    // Fluid typography (Awwwards trend)
    fontSize: {
      xs:   'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
      sm:   'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
      base: 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
      lg:   'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
      xl:   'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
      '2xl':'clamp(1.5rem, 1.3rem + 1vw, 2rem)',
      '3xl':'clamp(2rem, 1.6rem + 2vw, 2.5rem)',
      '4xl':'clamp(2.5rem, 2rem + 2.5vw, 3.5rem)',
      '5xl':'clamp(3rem, 2.2rem + 4vw, 5rem)',
    },
    lineHeight: {
      tight: 1.15,
      snug: 1.3,
      normal: 1.6,
      relaxed: 1.75,
    },
  },

  // === SPACING ===
  spacing: {
    section: 'clamp(4rem, 3rem + 5vw, 8rem)',
    container: 'clamp(1rem, 0.5rem + 2.5vw, 2rem)',
  },

  // === BORDERS ===
  borderRadius: {
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },

  // === SHADOWS ===
  shadows: {
    // Soft, layered shadows (Godly/Awwwards trend)
    sm: '0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)',
    md: '0 2px 4px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 4px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.08)',
    xl: '0 8px 16px rgba(0,0,0,0.04), 0 16px 48px rgba(0,0,0,0.1)',
    // Glow shadows (medical/tech feel)
    glow: {
      primary: '0 0 20px rgba(26,115,232,0.15)',
      secondary: '0 0 20px rgba(13,148,136,0.15)',
    },
  },

  // === GLASSMORPHISM (Awwwards trend) ===
  glass: {
    light: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdrop: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
    },
    dark: {
      background: 'rgba(28, 25, 23, 0.8)',
      backdrop: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },

  // === ANIMATIONS ===
  animations: {
    // Smooth, medical-grade transitions
    fadeIn: { duration: 0.3, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    slideUp: { duration: 0.4, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    scale: { duration: 0.2, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
    // Hover effects (Godly-inspired)
    hover: {
      lift: 'translateY(-4px)',
      scale: 'scale(1.02)',
      glow: '0 0 24px rgba(26,115,232,0.2)',
    },
  },

  // === GRADIENTS ===
  gradients: {
    hero: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #f0fdfa 100%)',
    card: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    cta: 'linear-gradient(135deg, #1a73e8 0%, #0d9488 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)',
  },

  // === COMPONENTS ===
  components: {
    // Card patterns (Mobbin-inspired)
    card: {
      base: 'bg-white rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg hover:border-primary-200 transition-all duration-300',
      elevated: 'bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300',
      glass: 'bg-white/70 backdrop-blur-lg rounded-2xl border border-white/30 shadow-lg',
    },
    // Button patterns
    button: {
      primary: 'bg-primary-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 active:bg-primary-700 transition-all duration-200 shadow-sm hover:shadow-md',
      secondary: 'bg-neutral-100 text-neutral-700 px-6 py-3 rounded-xl font-semibold hover:bg-neutral-200 transition-all duration-200',
      ghost: 'text-neutral-600 px-4 py-2 rounded-lg hover:bg-neutral-100 transition-colors',
      outline: 'border-2 border-primary-500 text-primary-500 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200',
    },
    // Input patterns
    input: {
      base: 'w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all duration-200',
      error: 'border-error-main focus:ring-error-main/20',
    },
  },

  // === LAYOUT ===
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-16 md:py-24 lg:py-32',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8',
  },
} as const

export type DesignSystem = typeof designSystem
