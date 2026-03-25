# Aliento Health Promotion — Full Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fully redesign the Aliento website with a health-promotion identity — new brand colours (sage/cream/blush), new logo, updated navigation, rewritten content, and restructured pages. No Sanity or Cal.com integration changes.

**Architecture:** Replace the "precision medicine" visual identity with a warm, editorial health-promotion brand. Update colour tokens globally via `@theme {}` in `globals.css`, rewrite all section components, create a new `/health-topics` route (aliasing the blog), add a `/consult` page, and rewrite the `/about` page. Keep all API routes, Sanity integration, payment and Cal.com code entirely untouched.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS 4 (`@theme {}`), Framer Motion, Lucide React, TypeScript strict, Server + Client Components.

---

## Phase 1 — Design Tokens & Logo (run Tasks 1 and 2 in parallel)

### Task 1: Update Design Tokens

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/lib/theme.ts`

**Step 1: Replace the `@theme {}` block in `globals.css`**

The file starts with two `@import` rules — preserve that order exactly (Fontshare URL, then Google Fonts URL, then `@import "tailwindcss"`).

Replace the entire `globals.css` content with:

```css
@import url("https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap");
@import "tailwindcss";

@theme {
  /* ── Sage — primary health & nature colour ── */
  --color-sage-50:  #EEF5F0;
  --color-sage-100: #D8EAE0;
  --color-sage-200: #B8D5C4;
  --color-sage-300: #8FBD9F;
  --color-sage-400: #7C9E8A;
  --color-sage-500: #5E8A70;
  --color-sage-600: #4A7059;
  --color-sage-700: #3A5746;
  --color-sage-800: #2D4336;
  --color-sage-900: #1E2E24;

  /* ── Blush — warm accent ── */
  --color-blush-50:  #FDF5F5;
  --color-blush-100: #FAEAEA;
  --color-blush-200: #F5D0D0;
  --color-blush-300: #EDABAB;
  --color-blush-400: #F2C4C4;
  --color-blush-500: #E09090;
  --color-blush-600: #D9896A;
  --color-blush-700: #C0614A;
  --color-blush-800: #9E4A38;
  --color-blush-900: #7A3829;

  /* ── Cream — page background ── */
  --color-cream-50:  #FEFCF8;
  --color-cream-100: #FDF8F0;
  --color-cream-200: #FAF1E2;
  --color-cream-300: #F5E6CA;
  --color-cream-400: #EDD8B0;
  --color-cream-500: #D4BB8A;

  /* ── Warm neutrals — text & borders ── */
  --color-warm-50:  #FAF9F7;
  --color-warm-100: #F3F1ED;
  --color-warm-200: #E5E1DB;
  --color-warm-300: #CCC6BC;
  --color-warm-400: #A89F91;
  --color-warm-500: #857A6A;
  --color-warm-600: #635B4E;
  --color-warm-700: #433E34;
  --color-warm-800: #29251E;
  --color-warm-900: #2E2A26;

  /* ── Fonts ── */
  --font-display: "Instrument Serif", Georgia, serif;
  --font-body:    "Satoshi", system-ui, sans-serif;

  /* ── Spacing rhythm — 4px base ── */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
}

/* ── Base styles ── */
@layer base {
  body {
    background-color: var(--color-cream-100);
    color: var(--color-warm-700);
    font-family: var(--font-body);
    font-weight: 400;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 600;
    color: var(--color-warm-900);
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  * {
    border-color: var(--color-warm-200);
  }

  ::selection {
    background: var(--color-sage-100);
    color: var(--color-sage-800);
  }
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--color-warm-300); border-radius: 999px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-warm-400); }

html { scroll-behavior: smooth; }

:focus-visible {
  outline: 2px solid var(--color-sage-500);
  outline-offset: 2px;
}

/* ── Animations ── */
@keyframes breathe {
  0%, 100% { transform: scale(1);    opacity: 0.6; }
  50%       { transform: scale(1.08); opacity: 0.9; }
}
@keyframes breathe-slow {
  0%, 100% { transform: scale(1)    rotate(0deg); }
  50%      { transform: scale(1.05) rotate(2deg); }
}
@keyframes float {
  0%, 100% { transform: translateY(0px)  rotate(0deg); }
  33%      { transform: translateY(-15px) rotate(1deg); }
  66%      { transform: translateY(5px)  rotate(-1deg); }
}
@keyframes drift {
  0%, 100% { transform: translate(0, 0)     scale(1); }
  25%      { transform: translate(20px, -30px) scale(1.1); }
  50%      { transform: translate(-10px, -50px) scale(1); }
  75%      { transform: translate(-30px, -20px) scale(0.95); }
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0%   50%; }
  50%      { background-position: 100% 50%; }
}
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes reveal-scale {
  from { opacity: 0; transform: scale(0.9); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Utility classes ── */
.glass-card {
  background: rgba(253, 248, 240, 0.7);
  backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid rgba(124, 158, 138, 0.15);
}
.organic-blob { border-radius: 60% 40% 55% 45% / 45% 55% 40% 60%; }
.text-gradient-primary {
  background: linear-gradient(135deg, var(--color-sage-500), var(--color-blush-600));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.4;
}
.editorial-quote {
  border-left: 3px solid var(--color-sage-400);
  padding-left: 1.5rem;
  font-style: italic;
}
.hover-underline {
  position: relative;
}
.hover-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: currentColor;
  transition: width 0.3s ease;
}
.hover-underline:hover::after { width: 100%; }

.animate-breathe      { animation: breathe      6s  ease-in-out infinite; }
.animate-breathe-slow { animation: breathe-slow 10s ease-in-out infinite; }
.animate-float        { animation: float        8s  ease-in-out infinite; }
.animate-drift        { animation: drift        20s ease-in-out infinite; }
.animate-gradient     { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
.animate-reveal       { animation: reveal-up   0.8s ease forwards; }
.animate-reveal-scale { animation: reveal-scale 0.6s ease forwards; }

.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }
.delay-600 { animation-delay: 0.6s; }
.delay-700 { animation-delay: 0.7s; }
.delay-800 { animation-delay: 0.8s; }
```

**Step 2: Update `src/lib/theme.ts`**

Replace the entire file:

```ts
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
```

**Step 3: Verify lint passes**

```bash
cd C:\scratchpad\aliento-nextjs && npm run lint
```

Expected: no errors.

**Step 4: Commit**

```bash
git add src/app/globals.css src/lib/theme.ts
git commit -m "design: update colour tokens to sage/blush/cream palette

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Create Logo SVGs

**Files:**
- Create: `public/logo-icon.svg`
- Create: `public/logo-icon-white.svg`

**Step 1: Create `public/logo-icon.svg` (sage leaf + breath wave, for light backgrounds)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" fill="none">
  <!-- Leaf body -->
  <path d="M20 4 C 29 5 34 13 33 21 C 32 30 26 36 20 36 C 14 36 8 30 7 21 C 6 13 11 5 20 4Z" fill="#7C9E8A"/>
  <!-- Leaf centre vein -->
  <line x1="20" y1="7" x2="20" y2="33" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
  <!-- Breath / sine wave -->
  <path d="M9 20 C 12 15 15 15 18 20 C 21 25 24 25 27 20 C 30 15 32 17 31 20"
        stroke="white" stroke-width="1.8" stroke-linecap="round" fill="none"/>
</svg>
```

**Step 2: Create `public/logo-icon-white.svg` (all-white version for dark backgrounds)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" fill="none">
  <!-- Leaf body (white) -->
  <path d="M20 4 C 29 5 34 13 33 21 C 32 30 26 36 20 36 C 14 36 8 30 7 21 C 6 13 11 5 20 4Z" fill="white"/>
  <!-- Leaf centre vein -->
  <line x1="20" y1="7" x2="20" y2="33" stroke="rgba(0,0,0,0.1)" stroke-width="1"/>
  <!-- Breath / sine wave (sage on white) -->
  <path d="M9 20 C 12 15 15 15 18 20 C 21 25 24 25 27 20 C 30 15 32 17 31 20"
        stroke="#7C9E8A" stroke-width="1.8" stroke-linecap="round" fill="none"/>
</svg>
```

**Step 3: Commit**

```bash
git add public/logo-icon.svg public/logo-icon-white.svg
git commit -m "brand: add Aliento leaf/breath logo SVG icons

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 2 — Layout Components (run Tasks 3 and 4 in parallel, after Phase 1)

### Task 3: Rewrite Header

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Step 1: Replace entire file content**

The new header has:
- Single-row layout: logo (left) | nav links (centre) | "Book a Consult" CTA (right)
- No top contact bar
- Sticky on scroll with cream/white background transition
- Nav: Home | Health Topics | About | Consult | Contact
- Active link: sage-green pill background
- CTA: blush-deep rounded pill button
- Mobile: hamburger → full-screen overlay menu with sage background

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navItems = [
  { label: 'Home',          href: '/' },
  { label: 'Health Topics', href: '/health-topics' },
  { label: 'About',         href: '/about' },
  { label: 'Consult',       href: '/consult' },
  { label: 'Contact',       href: '/contact' },
]

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      {/* Desktop / Sticky nav */}
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-cream-100/95 backdrop-blur-xl border-b border-warm-200/60 shadow-sm py-1'
            : 'bg-cream-100 border-b border-transparent py-3'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-icon.svg"
                  alt="Aliento leaf mark"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-2xl font-semibold text-warm-900 tracking-tight">
                  Aliento
                </span>
                <span className="text-[9px] uppercase tracking-[0.22em] text-sage-500 font-body font-medium">
                  Health Promotion
                </span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    isActive(item.href)
                      ? 'bg-sage-400 text-white shadow-sm'
                      : 'text-warm-600 hover:text-warm-900 hover:bg-sage-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden lg:block">
              <Link
                href="/consult"
                className="px-6 py-2.5 rounded-full bg-blush-600 text-white text-sm font-medium shadow-sm hover:bg-blush-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                Book a Consult
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-sage-50 transition-colors"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <X size={22} className="text-warm-800" />
                : <Menu size={22} className="text-warm-800" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-sage-800 flex flex-col px-8 pt-28 pb-12 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'py-4 text-2xl font-display font-semibold border-b border-sage-700/50 transition-colors',
                isActive(item.href)
                  ? 'text-blush-300'
                  : 'text-cream-100 hover:text-blush-300'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/consult"
            className="mt-6 text-center bg-blush-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blush-500 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Book a Consult
          </Link>
        </div>
      )}
    </>
  )
}
```

**Step 2: Verify lint**

```bash
npm run lint
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: rewrite Header with new nav and sage/blush brand

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Rewrite Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Step 1: Replace entire file content**

The new footer is a 3-column layout on cream-50 background:
1. Brand column: logo + tagline + mission blurb
2. Explore column: nav links + health topic categories  
3. Connect column: email + social placeholder

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Mail } from 'lucide-react'

const exploreLinks = [
  { label: 'Home',          href: '/' },
  { label: 'Health Topics', href: '/health-topics' },
  { label: 'About',         href: '/about' },
  { label: 'Consult',       href: '/consult' },
  { label: 'Contact',       href: '/contact' },
]

const topicLinks = [
  { label: 'Nutrition',          href: '/health-topics?category=Nutrition' },
  { label: 'Mental Health',      href: '/health-topics?category=Mental Health' },
  { label: 'Screening',          href: '/health-topics?category=Screening' },
  { label: 'Medical Conditions', href: '/health-topics?category=Medical Conditions' },
  { label: 'Research',           href: '/health-topics?category=Research' },
  { label: 'Wellness',           href: '/health-topics?category=Wellness' },
]

export function Footer() {
  return (
    <footer className="bg-cream-50 border-t border-warm-200/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-8 h-8">
                <Image src="/logo-icon.svg" alt="Aliento" fill className="object-contain" />
              </div>
              <span className="font-display text-xl font-semibold text-warm-900">Aliento</span>
            </Link>
            <p className="text-sage-600 font-semibold text-sm italic mb-3 tracking-wide">
              "Breathe, Screen, Live"
            </p>
            <p className="text-warm-500 text-sm leading-relaxed">
              Health education, promotion, and expert-backed virtual care —
              available to every South African, wherever you are.
            </p>
          </div>

          {/* Explore */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-body font-semibold uppercase tracking-widest text-warm-900 mb-5">
                Explore
              </h4>
              <ul className="space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-warm-500 hover:text-sage-600 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-body font-semibold uppercase tracking-widest text-warm-900 mb-5">
                Health Topics
              </h4>
              <ul className="space-y-3">
                {topicLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-warm-500 hover:text-sage-600 transition-colors"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-body font-semibold uppercase tracking-widest text-warm-900 mb-5">
              Connect
            </h4>
            <a
              href="mailto:info@alientomedical.com"
              className="flex items-center gap-3 text-warm-500 hover:text-sage-600 transition-colors group mb-6"
            >
              <div className="w-9 h-9 rounded-full bg-sage-50 flex items-center justify-center group-hover:bg-sage-100 transition-colors">
                <Mail size={15} className="text-sage-500" />
              </div>
              <span className="text-sm">info@alientomedical.com</span>
            </a>
            <p className="text-xs text-warm-400 leading-relaxed">
              For medical emergencies, please call 10177 (EMS) or visit your
              nearest emergency room. Aliento does not provide emergency care.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-warm-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-warm-400 text-xs">
            © {new Date().getFullYear()} Aliento. All rights reserved.
          </p>
          <p className="text-warm-400 text-xs italic">
            Not a substitute for professional medical advice.
          </p>
        </div>

      </div>
    </footer>
  )
}
```

**Step 2: Verify lint**

```bash
npm run lint
```

Expected: no errors.

**Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: rewrite Footer with 3-column health-promotion layout

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 3 — Homepage Sections (run Tasks 5–10 in parallel, after Phase 1)

### Task 5: Rewrite Hero Section

**Files:**
- Modify: `src/components/sections/Hero.tsx`

**Step 1: Replace entire file**

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.75 } },
}

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden grain pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-sage-50/40 to-cream-100" />

      {/* Organic blobs */}
      <div className="absolute top-1/4 right-1/3 w-[560px] h-[560px] organic-blob bg-gradient-to-br from-sage-100/50 to-sage-200/30 animate-drift opacity-70" />
      <div className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] organic-blob bg-gradient-to-br from-blush-100/40 to-blush-200/30 animate-breathe-slow opacity-60" />

      <div className="relative max-w-4xl mx-auto px-6 lg:px-12 py-24 text-center z-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.22em] uppercase text-sage-500">
              Health Promotion & Education
            </span>
            <div className="w-8 h-px bg-sage-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl sm:text-6xl lg:text-[5rem] font-display font-semibold leading-[1.08] tracking-tight mb-7 text-warm-900"
          >
            Your health,
            <br />
            <span className="text-gradient-primary italic">explained clearly.</span>
          </motion.h1>

          {/* Payoff line */}
          <motion.p
            variants={fadeUp}
            className="text-lg sm:text-xl text-sage-600 font-body font-medium tracking-wide mb-5 italic"
          >
            "Breathe, Screen, Live"
          </motion.p>

          {/* Supporting text */}
          <motion.p
            variants={fadeUp}
            className="text-lg lg:text-xl text-warm-500 max-w-2xl leading-relaxed mb-12 font-light"
          >
            Expert-backed health articles, preventive guidance, and virtual consultations
            — like having a knowledgeable friend who happens to be a doctor.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/health-topics"
              className="group relative bg-sage-400 text-white px-8 py-4 rounded-full font-body font-medium text-base hover:bg-sage-500 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Health Topics
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/consult"
              className="border border-warm-300 text-warm-700 bg-white/70 px-8 py-4 rounded-full font-body font-medium text-base hover:border-sage-400 hover:text-sage-600 hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Book a Virtual Consult
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            variants={fadeUp}
            className="mt-12 flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: '🌿', label: 'Evidence-based' },
              { icon: '💻', label: 'Virtual consultations' },
              { icon: '🇿🇦', label: 'South African context' },
            ].map((item) => (
              <span
                key={item.label}
                className="flex items-center gap-2 text-sm font-body font-medium text-warm-600 bg-white/60 px-4 py-2 rounded-full border border-warm-200/60 backdrop-blur-sm"
              >
                <span>{item.icon}</span>
                {item.label}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Lint check**

```bash
npm run lint
```

**Step 3: Commit**

```bash
git add src/components/sections/Hero.tsx
git commit -m "feat: rewrite Hero with health-promotion messaging

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Create FeaturedArticle Section

**Files:**
- Create: `src/components/sections/FeaturedArticle.tsx`

**Step 1: Create file**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: { title: string }
  publishedAt?: string
  author?: string
}

interface FeaturedArticleProps {
  post: Post
}

const categoryColors: Record<string, string> = {
  Nutrition:           'bg-sage-100  text-sage-700',
  'Mental Health':     'bg-blush-100 text-blush-700',
  Screening:           'bg-cream-300 text-warm-700',
  'Medical Conditions':'bg-warm-100  text-warm-700',
  Research:            'bg-sage-50   text-sage-600',
  Wellness:            'bg-blush-50  text-blush-600',
  default:             'bg-cream-200 text-warm-600',
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  const category = post.category?.title ?? ''
  const badgeClass = categoryColors[category] ?? categoryColors.default

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-ZA', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : ''

  return (
    <section className="py-16 lg:py-20 bg-blush-50/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-6 h-px bg-sage-400" />
          <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
            Featured Read
          </span>
        </div>

        <Link
          href={`/health-topics/${post.slug.current}`}
          className="group block rounded-2xl overflow-hidden bg-white border border-warm-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
        >
          <div className="grid md:grid-cols-5 min-h-[280px]">

            {/* Illustrated placeholder */}
            <div className="md:col-span-2 bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center min-h-[180px] md:min-h-0">
              <span className="text-7xl opacity-40 select-none">🌿</span>
            </div>

            {/* Content */}
            <div className="md:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs font-body font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${badgeClass}`}>
                  {category || 'Health'}
                </span>
                {formattedDate && (
                  <span className="text-xs text-warm-400">{formattedDate}</span>
                )}
              </div>

              <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-4 leading-snug group-hover:text-sage-600 transition-colors">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="text-warm-500 leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <span className="inline-flex items-center gap-2 text-sm font-body font-medium text-sage-600 group-hover:gap-3 transition-all">
                Read article
                <ArrowRight size={15} />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}
```

**Step 2: Lint and commit**

```bash
git add src/components/sections/FeaturedArticle.tsx
git commit -m "feat: add FeaturedArticle section component

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Create HealthTopicCategories Section

**Files:**
- Create: `src/components/sections/HealthTopicCategories.tsx`

**Step 1: Create file**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    name:        'Nutrition',
    icon:        '🥗',
    description: 'Food as medicine — what to eat and why it matters for long-term health.',
    slug:        'Nutrition',
    bg:          'bg-sage-50',
    iconBg:      'bg-sage-100',
    hover:       'hover:bg-sage-100',
  },
  {
    name:        'Mental Health',
    icon:        '🧠',
    description: 'Breaking the stigma around mental wellness in South Africa.',
    slug:        'Mental Health',
    bg:          'bg-blush-50',
    iconBg:      'bg-blush-100',
    hover:       'hover:bg-blush-100',
  },
  {
    name:        'Screening',
    icon:        '🩺',
    description: 'Know your numbers — the screenings that can save your life.',
    slug:        'Screening',
    bg:          'bg-cream-200/60',
    iconBg:      'bg-cream-300/80',
    hover:       'hover:bg-cream-300/60',
  },
  {
    name:        'Medical Conditions',
    icon:        '💊',
    description: 'Clear explanations of common diagnoses — what they mean and what to do.',
    slug:        'Medical Conditions',
    bg:          'bg-warm-100/60',
    iconBg:      'bg-warm-200/80',
    hover:       'hover:bg-warm-200/60',
  },
  {
    name:        'Research',
    icon:        '🔬',
    description: 'Novel techniques and medical breakthroughs, explained in plain language.',
    slug:        'Research',
    bg:          'bg-sage-50',
    iconBg:      'bg-sage-100',
    hover:       'hover:bg-sage-100',
  },
  {
    name:        'Wellness',
    icon:        '🌿',
    description: 'Lifestyle, prevention, and everyday habits for a healthier life.',
    slug:        'Wellness',
    bg:          'bg-blush-50',
    iconBg:      'bg-blush-100',
    hover:       'hover:bg-blush-100',
  },
]

export function HealthTopicCategories() {
  return (
    <section className="py-20 lg:py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Heading */}
        <div className="mb-12 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
              Browse by topic
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 leading-snug">
            What would you like to learn about?
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/health-topics?category=${encodeURIComponent(cat.slug)}`}
              className={`group rounded-2xl p-7 border border-warm-200/50 transition-all duration-250 hover:-translate-y-1 hover:shadow-md ${cat.bg} ${cat.hover}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 ${cat.iconBg}`}>
                {cat.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-warm-900 mb-2 group-hover:text-sage-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-warm-500 leading-relaxed mb-4">
                {cat.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-sage-600 uppercase tracking-wider group-hover:gap-2.5 transition-all">
                Browse articles <ArrowRight size={12} />
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
```

**Step 2: Lint and commit**

```bash
git add src/components/sections/HealthTopicCategories.tsx
git commit -m "feat: add HealthTopicCategories section with 6 category cards

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: Create AboutDoctor Section

**Files:**
- Create: `src/components/sections/AboutDoctor.tsx`

**Step 1: Create file**

```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function AboutDoctor() {
  return (
    <section className="py-20 lg:py-28 bg-sage-50/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Illustration / photo placeholder */}
          <div className="relative order-2 md:order-1">
            <div className="rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200/70 aspect-[4/5] max-w-sm mx-auto flex items-center justify-center">
              <span className="text-8xl opacity-30 select-none">👩‍⚕️</span>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-2 md:right-8 bg-white rounded-2xl shadow-md p-5 border border-warm-200/60 max-w-[200px]">
              <p className="text-xs text-warm-400 uppercase tracking-wider font-body font-semibold mb-1">Mission</p>
              <p className="text-sm text-warm-700 leading-snug font-display italic">
                "Healthcare that feels human."
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-sage-400" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
                About Aliento
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-6 leading-snug">
              A knowledgeable friend
              <br />
              <span className="text-gradient-primary italic">who happens to be a doctor</span>
            </h2>

            <div className="space-y-4 text-warm-600 leading-relaxed">
              <p>
                Aliento was built on a simple belief: every person deserves to understand their own health.
                Not through confusing medical jargon or 2AM Google spirals — but through clear,
                honest conversations backed by real medical expertise.
              </p>
              <p>
                As a medical professional, I've seen how a lack of accessible health information leads to
                delayed diagnoses, unnecessary anxiety, and preventable illness. This site is my answer
                to that gap.
              </p>
              <p>
                Here you'll find evidence-based articles on everything from managing chronic conditions to
                understanding your screening results — written the way I'd explain it to a friend over
                a cup of tea.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 bg-sage-400 text-white px-6 py-3 rounded-full text-sm font-body font-medium hover:bg-sage-500 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                Learn more about us
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/consult"
                className="inline-flex items-center justify-center gap-2 border border-warm-300 text-warm-700 px-6 py-3 rounded-full text-sm font-body font-medium hover:border-sage-400 hover:text-sage-600 transition-all"
              >
                Book a consult
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
```

**Step 2: Lint and commit**

```bash
git add src/components/sections/AboutDoctor.tsx
git commit -m "feat: add AboutDoctor section with warm editorial layout

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 9: Create RecentArticles Section

**Files:**
- Create: `src/components/sections/RecentArticles.tsx`

**Step 1: Create file**

```tsx
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { BlogCard } from '@/components/blog/BlogCard'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  category?: { title: string }
  publishedAt?: string
  author?: string
}

interface RecentArticlesProps {
  posts: Post[]
}

export function RecentArticles({ posts }: RecentArticlesProps) {
  const recent = posts.slice(0, 3)

  return (
    <section className="py-20 lg:py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header row */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-sage-400" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
                Latest articles
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900">
              From the blog
            </h2>
          </div>
          <Link
            href="/health-topics"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-body font-medium text-sage-600 hover:text-sage-700 transition-colors group"
          >
            View all articles
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recent.map((post) => (
            <BlogCard key={post._id} post={post} basePath="/health-topics" />
          ))}
        </div>

        {/* Mobile "view all" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/health-topics"
            className="inline-flex items-center gap-2 text-sage-600 font-body font-medium text-sm"
          >
            View all articles <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  )
}
```

**Step 2: Update `src/components/blog/BlogCard.tsx` to accept an optional `basePath` prop**

Open `src/components/blog/BlogCard.tsx`. Find the `href` prop passed to the Link component (currently pointing to `/blog/${post.slug.current}`). Add a `basePath` prop with default `/health-topics`:

```tsx
interface BlogCardProps {
  post: Post
  basePath?: string
}

export function BlogCard({ post, basePath = '/health-topics' }: BlogCardProps) {
  // ...
  // Change the Link href from `/blog/${post.slug.current}` to:
  // `${basePath}/${post.slug.current}`
}
```

Make the minimum change needed: add the `basePath` prop and update the `href`. Do not change anything else in the component.

**Step 3: Lint and commit**

```bash
git add src/components/sections/RecentArticles.tsx src/components/blog/BlogCard.tsx
git commit -m "feat: add RecentArticles section, update BlogCard with basePath prop

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 10: Create ConsultCTA Section

**Files:**
- Modify: `src/components/sections/CTA.tsx`

**Step 1: Replace entire file**

```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Video, Clock, Shield } from 'lucide-react'

const highlights = [
  { icon: Video,  label: 'Zoom & Teams',   detail: 'Your preferred platform' },
  { icon: Clock,  label: 'R500 / hour',    detail: '30 min or 1-hour sessions' },
  { icon: Shield, label: 'Visual consults', detail: 'Show rashes, lumps, swelling' },
]

export function CTA() {
  return (
    <section className="py-20 lg:py-28 bg-blush-50 relative overflow-hidden">
      {/* Soft background shape */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] organic-blob bg-blush-100/60 animate-breathe-slow opacity-50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-6 h-px bg-blush-500" />
              <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-blush-600">
                Virtual consultations
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-display font-semibold text-warm-900 mb-5 leading-snug">
              Have a health question?
              <br />
              <span className="italic text-blush-700">Talk to a real doctor.</span>
            </h2>

            <p className="text-warm-500 leading-relaxed mb-8 max-w-md">
              Book a face-to-face virtual consultation via Zoom or Microsoft Teams.
              Show rashes, lumps, swelling — all from the comfort of your home.
              No waiting rooms. No referrals needed.
            </p>

            <Link
              href="/consult"
              className="group inline-flex items-center gap-2 bg-blush-600 text-white px-7 py-3.5 rounded-full font-body font-medium text-sm hover:bg-blush-700 transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
            >
              Book a Consult
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right: highlights */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {highlights.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="flex items-center gap-5 bg-white/70 rounded-2xl p-5 border border-blush-200/50 backdrop-blur-sm"
              >
                <div className="w-11 h-11 rounded-xl bg-blush-100 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-blush-600" />
                </div>
                <div>
                  <p className="font-body font-semibold text-warm-900 text-sm">{label}</p>
                  <p className="text-warm-400 text-xs mt-0.5">{detail}</p>
                </div>
              </div>
            ))}

            <p className="text-xs text-warm-400 mt-2 leading-relaxed">
              Payment is required upfront at time of booking. Credit card accepted.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
```

**Step 2: Lint and commit**

```bash
git add src/components/sections/CTA.tsx
git commit -m "feat: rewrite CTA as Virtual Consult section with blush palette

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 4 — Pages (after Phase 3)

### Task 11: Update Homepage Composition

**Files:**
- Modify: `src/app/page.tsx`

The homepage needs to fetch posts for FeaturedArticle and RecentArticles (server-side), then render all sections.

**Step 1: Replace entire file**

```tsx
import { getAllPosts } from '@/lib/sanity'
import { Hero } from '@/components/sections/Hero'
import { FeaturedArticle } from '@/components/sections/FeaturedArticle'
import { HealthTopicCategories } from '@/components/sections/HealthTopicCategories'
import { AboutDoctor } from '@/components/sections/AboutDoctor'
import { RecentArticles } from '@/components/sections/RecentArticles'
import { CTA } from '@/components/sections/CTA'

const fallbackPosts = [
  {
    _id: 'fb-3',
    title: 'The Power of Preventive Care: Why Waiting Costs You',
    slug: { current: 'the-power-of-preventive-care' },
    excerpt: 'A 20-minute screening can save your life and save you hundreds of thousands of rands. Here\'s why preventive care is the smartest health investment you\'ll ever make.',
    category: { title: 'Screening', slug: { current: 'screening' } },
    tags: ['preventive care', 'screenings'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-2',
    title: 'Mental Health Matters: Breaking the Stigma in South Africa',
    slug: { current: 'mental-health-matters-breaking-the-stigma' },
    excerpt: '1 in 4 South Africans will experience a mental health condition in their lifetime. Yet most never seek help.',
    category: { title: 'Mental Health', slug: { current: 'mental-health' } },
    tags: ['mental health', 'depression'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-1',
    title: 'How to Boost Your Immune System Naturally This Winter',
    slug: { current: 'how-to-boost-your-immune-system-naturally-this-winter' },
    excerpt: 'With flu season around the corner, supporting your immune system should be at the top of your health checklist.',
    category: { title: 'Nutrition', slug: { current: 'nutrition' } },
    tags: ['nutrition', 'immunity'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
]

export default async function Home() {
  let posts = fallbackPosts
  try {
    const sanityPosts = await getAllPosts()
    if (sanityPosts.length > 0) posts = sanityPosts
  } catch {
    // fallback to static posts
  }

  const featuredPost = posts[0]

  return (
    <>
      <Hero />
      {featuredPost && <FeaturedArticle post={featuredPost} />}
      <HealthTopicCategories />
      <AboutDoctor />
      <RecentArticles posts={posts} />
      <CTA />
    </>
  )
}
```

**Step 2: Lint and commit**

```bash
git add src/app/page.tsx
git commit -m "feat: update homepage to blog-first layout with new sections

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 12: Create Health Topics Pages

**Files:**
- Create directory: `src/app/health-topics/`
- Create: `src/app/health-topics/page.tsx`
- Create: `src/app/health-topics/[slug]/page.tsx`
- Create: `src/app/health-topics/[slug]/HealthTopicsPostContent.tsx`

**Step 1: Create `src/app/health-topics/page.tsx`**

This page wraps the existing `BlogClient` component with updated metadata and paths.

```tsx
import { Metadata } from 'next'
import { getAllPosts, getAllCategories } from '@/lib/sanity'
import BlogClient from '@/app/blog/BlogClient'

export const metadata: Metadata = {
  title: 'Health Topics',
  description: 'Browse expert-backed articles on nutrition, mental health, screening, medical conditions, research, and wellness.',
}

const fallbackPosts = [
  {
    _id: 'fb-1',
    title: 'How to Boost Your Immune System Naturally This Winter',
    slug: { current: 'how-to-boost-your-immune-system-naturally-this-winter' },
    excerpt: 'With flu season around the corner, supporting your immune system should be at the top of your health checklist.',
    category: { title: 'Nutrition', slug: { current: 'nutrition' } },
    tags: [],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-2',
    title: 'Mental Health Matters: Breaking the Stigma in South Africa',
    slug: { current: 'mental-health-matters-breaking-the-stigma' },
    excerpt: '1 in 4 South Africans will experience a mental health condition in their lifetime.',
    category: { title: 'Mental Health', slug: { current: 'mental-health' } },
    tags: ['mental health', 'depression'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-3',
    title: 'The Power of Preventive Care: Why Waiting Costs You',
    slug: { current: 'the-power-of-preventive-care' },
    excerpt: 'A 20-minute screening can save your life and save you hundreds of thousands of rands.',
    category: { title: 'Screening', slug: { current: 'screening' } },
    tags: ['preventive care', 'screenings'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-4',
    title: "Welcome to Aliento's Health Blog",
    slug: { current: 'welcome-to-aliento-health-blog' },
    excerpt: "Your health deserves more than a quick Google search.",
    category: { title: 'Wellness', slug: { current: 'wellness' } },
    tags: ['introduction', 'wellness'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-18',
  },
  {
    _id: 'fb-5',
    title: '5 Tips for Managing Chronic Conditions',
    slug: { current: '5-tips-for-managing-chronic-conditions' },
    excerpt: 'Over 60% of South Africans live with at least one chronic condition.',
    category: { title: 'Medical Conditions', slug: { current: 'medical-conditions' } },
    tags: ['chronic conditions', 'diabetes'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-17',
  },
  {
    _id: 'fb-6',
    title: 'Understanding Personalised Medicine: The Future of Healthcare',
    slug: { current: 'understanding-personalised-medicine' },
    excerpt: "Two patients. Same diagnosis. Different treatments.",
    category: { title: 'Research', slug: { current: 'research' } },
    tags: ['personalised medicine', 'genetics'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-15',
  },
  {
    _id: 'fb-7',
    title: 'When to See a Doctor: A Complete Guide',
    slug: { current: 'when-to-see-a-doctor' },
    excerpt: "That symptom you're ignoring? Here's exactly when it's time to book an appointment.",
    category: { title: 'Wellness', slug: { current: 'wellness' } },
    tags: ['check-ups', 'preventive care'],
    author: 'Dr. Aliento',
    publishedAt: '2026-03-10',
  },
]

const fallbackCategories = [
  'Nutrition', 'Mental Health', 'Screening',
  'Medical Conditions', 'Research', 'Wellness', 'Novel Techniques',
]

export default async function HealthTopicsPage() {
  let posts
  let categories

  try {
    const [sanityPosts, sanityCategories] = await Promise.all([
      getAllPosts(),
      getAllCategories(),
    ])
    posts = sanityPosts.length > 0 ? sanityPosts : fallbackPosts
    categories = sanityCategories.length > 0
      ? sanityCategories.map((c) => c.title)
      : fallbackCategories
  } catch {
    posts = fallbackPosts
    categories = fallbackCategories
  }

  return <BlogClient posts={posts} categories={categories} basePath="/health-topics" />
}
```

> Note: `BlogClient` currently does not accept a `basePath` prop. You need to add it in the next step.

**Step 2: Update `src/app/blog/BlogClient.tsx` to accept `basePath` prop**

Open `src/app/blog/BlogClient.tsx`. Add a `basePath?: string` prop (default `'/health-topics'`). Pass `basePath` down to each `<BlogCard>` component call. This is a minimal, non-breaking change.

Find the `interface` or component signature at the top and add the prop. Find every `<BlogCard post={...}` usage and add `basePath={basePath}`.

**Step 3: Create `src/app/health-topics/[slug]/page.tsx`**

```tsx
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllPosts } from '@/lib/sanity'
import BlogPostContent from '@/app/blog/[slug]/BlogPostContent'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    return posts.map((p) => ({ slug: p.slug.current }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPostBySlug(slug)
    if (!post) return { title: 'Article Not Found' }
    return {
      title: post.title,
      description: post.excerpt ?? '',
    }
  } catch {
    return { title: 'Article' }
  }
}

export default async function HealthTopicsPostPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = await getPostBySlug(slug)
  } catch {
    post = null
  }

  if (!post) notFound()

  return <BlogPostContent post={post} />
}
```

**Step 4: Lint and commit**

```bash
git add src/app/health-topics/ src/app/blog/BlogClient.tsx
git commit -m "feat: add /health-topics pages (blog index + slug), add basePath to BlogClient

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 13: Rewrite About Page

**Files:**
- Modify: `src/app/about/page.tsx`
- Modify: `src/components/sections/About.tsx`

**Step 1: Replace `src/components/sections/About.tsx` with full new content**

```tsx
import Link from 'next/link'
import { ArrowRight, BookOpen, Heart, Users } from 'lucide-react'

const values = [
  {
    icon: BookOpen,
    title: 'Education First',
    body: 'Every article is evidence-based and written to be understood, not just impressed. We translate medicine into language that empowers you to act.',
  },
  {
    icon: Heart,
    title: 'Warm & Approachable',
    body: 'Healthcare should feel human. We ditch the jargon and the clipboard stare. Think of us as the medically qualified friend you\'ve always wanted.',
  },
  {
    icon: Users,
    title: 'Built for South Africans',
    body: 'Our content reflects South African realities — from public health challenges to the lifestyle pressures that shape our wellbeing every day.',
  },
]

export function About() {
  return (
    <div className="bg-cream-100">

      {/* Hero */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sage-50/60 to-cream-100 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-sage-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-sage-500">
              About Aliento
            </span>
            <div className="w-8 h-px bg-sage-400" />
          </div>
          <h1 className="text-4xl lg:text-6xl font-display font-semibold text-warm-900 mb-7 leading-tight">
            We believe everyone deserves
            <br />
            <span className="text-gradient-primary italic">to understand their health.</span>
          </h1>
          <p className="text-xl text-warm-500 max-w-2xl mx-auto leading-relaxed">
            Aliento is a health promotion platform created by a medical professional
            who got tired of watching people suffer from conditions that could have been
            prevented — or at least better understood.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-20 bg-white/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Photo placeholder */}
            <div className="rounded-2xl bg-gradient-to-br from-sage-100 to-sage-200/70 aspect-[4/5] max-w-sm mx-auto flex items-center justify-center">
              <span className="text-9xl opacity-25 select-none">👩‍⚕️</span>
            </div>

            <div>
              <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-6">
                Why "Aliento"?
              </h2>
              <div className="space-y-4 text-warm-600 leading-relaxed">
                <p>
                  <em>Aliento</em> means "breath" in Spanish. We chose it because breath is the most fundamental
                  act of being alive — and because we want health to feel that natural and effortless.
                  Not a burden. Not a medical bill waiting to happen.
                </p>
                <p>
                  The name also captures our mission: to give people the information they need to
                  breathe easier about their health. To feel less anxious, more informed, and more
                  in control of their own bodies.
                </p>
                <p>
                  We cover everything from preventive screenings and chronic disease management to
                  mental health, nutrition, and the latest in medical research — all in plain language
                  that makes sense on a Tuesday morning.
                </p>
              </div>
              <blockquote className="editorial-quote mt-8 text-warm-700">
                <p>"Breathe, Screen, Live — it's not just a tagline. It's a philosophy."</p>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-10 text-center">
            What we stand for
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl bg-white/70 border border-warm-200/50 p-8">
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-sage-500" />
                </div>
                <h3 className="font-display text-lg font-semibold text-warm-900 mb-3">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we cover */}
      <section className="py-16 bg-sage-50/50">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-5">
            What Aliento covers
          </h2>
          <p className="text-warm-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            This is an informational and educational platform. We do not replace your doctor or offer
            in-person care. We do offer clarity, context, and — when you need it — a virtual consultation
            with a qualified medical professional.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Health Promotion','Preventive Screening','Medical Conditions','Mental Wellness',
              'Nutrition','Novel Research','Chronic Care','Virtual Consultations'].map((tag) => (
              <span key={tag} className="text-sm font-body font-medium bg-sage-100 text-sage-700 px-4 py-2 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-5">
            Ready to take control of your health?
          </h2>
          <p className="text-warm-500 mb-8">
            Start with our Health Topics library — or book a virtual consultation to speak
            directly with a doctor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/health-topics"
              className="group inline-flex items-center gap-2 bg-sage-400 text-white px-7 py-3.5 rounded-full font-body font-medium text-sm hover:bg-sage-500 transition-all shadow-sm"
            >
              Explore Health Topics <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/consult"
              className="inline-flex items-center justify-center gap-2 border border-warm-300 text-warm-700 px-7 py-3.5 rounded-full font-body font-medium text-sm hover:border-blush-500 hover:text-blush-700 transition-all"
            >
              Book a Consult
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
```

**Step 2: Update `src/app/about/page.tsx` metadata**

```tsx
import { Metadata } from 'next'
import { About } from '@/components/sections/About'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Aliento is a health promotion platform built by a medical professional. Learn our story, our values, and what we cover.',
}

export default function AboutPage() {
  return <About />
}
```

**Step 3: Lint and commit**

```bash
git add src/components/sections/About.tsx src/app/about/page.tsx
git commit -m "feat: rewrite About page with new health-promotion content

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 14: Create Consult Page

**Files:**
- Create: `src/app/consult/page.tsx`

**Step 1: Create file**

```tsx
import { Metadata } from 'next'
import Link from 'next/link'
import { Video, Clock, CreditCard, Monitor, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Book a Virtual Consultation',
  description:
    'Book a virtual face-to-face medical consultation via Zoom or Microsoft Teams. R500/hr, 30 min or 1-hour sessions, with visual assessment.',
}

const steps = [
  {
    step: '01',
    title: 'Choose a time',
    body: 'Select your preferred session length and date. 30-minute or 1-hour slots available.',
  },
  {
    step: '02',
    title: 'Pay securely upfront',
    body: 'Payment is captured at time of booking via secure credit card processing. R500/hr.',
  },
  {
    step: '03',
    title: 'Join your consult',
    body: 'Receive a Zoom or Teams link. Join from any device — phone, tablet, or laptop.',
  },
]

const included = [
  { icon: Video,       label: 'Face-to-face via video',  detail: 'Zoom or Microsoft Teams' },
  { icon: Monitor,     label: 'Visual assessment',        detail: 'Show rashes, lumps, or swelling on camera' },
  { icon: Clock,       label: 'Flexible sessions',        detail: '30-minute or 1-hour slots' },
  { icon: CreditCard,  label: 'Transparent pricing',      detail: 'R500 per hour, paid at booking' },
]

export default function ConsultPage() {
  return (
    <div className="bg-cream-100">

      {/* Hero */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-blush-50/60 to-cream-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] organic-blob bg-blush-100/40 animate-breathe-slow pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-blush-400" />
            <span className="text-xs font-body font-semibold tracking-[0.2em] uppercase text-blush-500">
              Virtual consultations
            </span>
            <div className="w-8 h-px bg-blush-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-semibold text-warm-900 mb-6 leading-tight">
            Expert medical care,
            <br />
            <span className="italic text-blush-700">from the comfort of home.</span>
          </h1>
          <p className="text-xl text-warm-500 max-w-2xl mx-auto leading-relaxed mb-8">
            Book a face-to-face virtual consultation with a qualified South African doctor via
            Zoom or Microsoft Teams. Visual assessment included — show rashes, lumps, swelling,
            and more. No referral needed.
          </p>

          {/* Booking CTA placeholder */}
          <div className="inline-block">
            <button
              disabled
              className="bg-blush-600/80 text-white px-8 py-4 rounded-full font-body font-medium text-base cursor-not-allowed opacity-70 shadow-sm"
              title="Online booking coming soon"
            >
              Book a Consult — Coming Soon
            </button>
            <p className="text-xs text-warm-400 mt-3">
              Online booking launching soon. In the meantime, email us to arrange a session.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-12 text-center">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-blush-100 flex items-center justify-center text-blush-600 font-display font-semibold text-lg mx-auto mb-5">
                  {step}
                </div>
                <h3 className="font-display text-lg font-semibold text-warm-900 mb-3">{title}</h3>
                <p className="text-warm-500 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className="py-20 bg-blush-50/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-display font-semibold text-warm-900 mb-10 text-center">
            What's included
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {included.map(({ icon: Icon, label, detail }) => (
              <div
                key={label}
                className="bg-white/80 rounded-2xl p-7 border border-blush-200/40 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-blush-100 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-blush-600" />
                </div>
                <h3 className="font-body font-semibold text-warm-900 text-sm mb-1">{label}</h3>
                <p className="text-warm-400 text-xs leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-md mx-auto px-6 text-center">
          <h2 className="text-2xl font-display font-semibold text-warm-900 mb-8">Simple pricing</h2>
          <div className="rounded-2xl bg-white border border-warm-200/60 shadow-sm p-8">
            <div className="text-5xl font-display font-semibold text-warm-900 mb-2">R500</div>
            <div className="text-warm-400 text-sm mb-6">per hour · R250 for 30 minutes</div>
            <ul className="text-sm text-warm-600 space-y-3 text-left mb-8">
              {[
                'Visual assessment via video',
                'Zoom or Microsoft Teams',
                'Medical advice & guidance',
                'Referral letters if needed',
                'Prescription guidance',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-sage-500">✓</span> {item}
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full bg-blush-600/80 text-white py-3.5 rounded-full font-body font-medium text-sm cursor-not-allowed opacity-70"
            >
              Book Now — Coming Soon
            </button>
            <p className="text-xs text-warm-400 mt-4">
              Payment required at time of booking. No refunds for missed sessions.
            </p>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-warm-100/40 border-t border-warm-200/50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-xs text-warm-400 leading-relaxed">
            Virtual consultations are for non-emergency medical guidance only.
            For medical emergencies, call 10177 (EMS) or go to your nearest emergency room.
            Aliento consultations do not replace your regular GP relationship.
          </p>
        </div>
      </section>

      {/* Secondary CTA */}
      <section className="py-16 bg-cream-100 text-center">
        <p className="text-warm-500 mb-4 text-sm">Prefer to browse first?</p>
        <Link
          href="/health-topics"
          className="group inline-flex items-center gap-2 text-sage-600 font-body font-medium text-sm hover:text-sage-700 transition-colors"
        >
          Explore our health articles <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </section>

    </div>
  )
}
```

**Step 2: Lint and commit**

```bash
git add src/app/consult/page.tsx
git commit -m "feat: add Consult page with pricing, steps, and placeholder booking CTA

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 5 — Routing & Metadata (after Phase 4)

### Task 15: Add /blog Redirects

**Files:**
- Modify: `next.config.ts`

**Step 1: Replace entire file**

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/health-topics',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/health-topics/:slug',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
```

**Step 2: Lint and commit**

```bash
git add next.config.ts
git commit -m "feat: add redirects from /blog to /health-topics and /services to /

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 16: Update Layout Metadata

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Replace metadata object**

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { Layout } from '@/components/layout/Layout'

export const metadata: Metadata = {
  title: {
    default:  'Aliento — Breathe, Screen, Live',
    template: '%s | Aliento',
  },
  description:
    'Aliento is a health promotion and education platform for South Africans. Expert-backed articles on nutrition, mental health, screenings, chronic care, and more — plus virtual medical consultations.',
  keywords: [
    'health promotion', 'health education', 'virtual consultation',
    'South Africa', 'preventive care', 'wellness', 'medical advice',
  ],
  icons: {
    icon: [{ url: '/logo-icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type:        'website',
    locale:      'en_ZA',
    siteName:    'Aliento',
    title:       'Aliento — Breathe, Screen, Live',
    description: 'Health promotion, education, and virtual consultations for South Africans.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: update site metadata for health-promotion brand

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Phase 6 — Build Verification

### Task 17: Full Lint and Build Check

**Step 1: Run lint**

```bash
cd C:\scratchpad\aliento-nextjs && npm run lint
```

Expected: `✔ No ESLint warnings or errors` (or exit 0).

**Step 2: Run build**

```bash
npm run build
```

The build runs `npm run prebuild` first (generates blog data from MDX), then Next.js build. Expected: compiled successfully with no TypeScript or build errors.

**Step 3: Fix any errors**

If lint errors → fix them in the relevant file before proceeding.

If TypeScript errors → these will be in component prop mismatches. Common ones:
- `BlogCard` `basePath` prop missing: ensure it was added in Task 9
- `BlogClient` `basePath` prop: ensure the prop was threaded through in Task 12

**Step 4: Final commit if fixes were needed**

```bash
git add -A
git commit -m "fix: resolve lint and TypeScript errors from redesign

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Parallel Execution Map

```
Phase 1:  Task 1 ─────────────────┐
          Task 2 ─────────────────┤
                                  ↓
Phase 2:  Task 3 ─────────────────┐
          Task 4 ─────────────────┤
                                  ↓
Phase 3:  Task 5  ────────────────┐
          Task 6  ────────────────┤
          Task 7  ────────────────┤
          Task 8  ────────────────┤
          Task 9  ────────────────┤
          Task 10 ────────────────┤
                                  ↓
Phase 4:  Task 11 ────────────────┐
          Task 12 ────────────────┤
          Task 13 ────────────────┤
          Task 14 ────────────────┤
                                  ↓
Phase 5:  Task 15 ────────────────┐
          Task 16 ────────────────┤
                                  ↓
Phase 6:  Task 17 (verify build)
```

Tasks within each Phase are independent and can run in parallel.
Tasks in Phase N+1 may depend on shared files changed in Phase N — do not start a later phase until the prior phase is complete and linted.

---

*Plan written: 2026-03-25. Design approved: 2026-03-25.*
