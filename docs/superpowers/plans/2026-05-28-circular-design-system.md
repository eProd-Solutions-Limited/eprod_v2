# Circular Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the eProd logo's circular motif to every homepage section via drifting blob backgrounds, scroll-reveal ring accents, and alternating corner-scoop section dividers.

**Architecture:** Three new primitives (`SectionScoop`, `CircleBackground`, and reuse of the existing `useInView` hook) are applied consistently across all 10 homepage sections. Scoops are placed in `page.tsx` between sections where background colour changes. Each section gets `CircleBackground` and a heading ring accent.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind v4, CSS @keyframes, IntersectionObserver (native via existing `useInView` hook), Vitest + @testing-library/react

---

### Task 1: CSS Foundations

**Files:**
- Modify: `src/app/(frontend)/globals.css`

- [ ] **Step 1: Add drift keyframes and animation classes**

Append the following inside `@layer utilities` in `src/app/(frontend)/globals.css`, after the existing `.animate-fade-in-up` block:

```css
  .animate-drift-1 {
    animation: drift-1 8s ease-in-out infinite;
  }
  .animate-drift-2 {
    animation: drift-2 11s ease-in-out infinite;
  }
  .animate-drift-3 {
    animation: drift-3 13s ease-in-out infinite;
  }
```

And add these keyframes in the top-level CSS (after the existing `@keyframes fadeInUp` block):

```css
@keyframes drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(14px, -12px) scale(1.06); }
  66%       { transform: translate(-9px, 7px) scale(0.96); }
}

@keyframes drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40%      { transform: translate(-16px, 9px) scale(1.04); }
  80%      { transform: translate(11px, -14px) scale(0.97); }
}

@keyframes drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  25%      { transform: translate(9px, 13px) scale(1.05); }
  75%      { transform: translate(-12px, -7px) scale(0.95); }
}
```

- [ ] **Step 2: Add scroll-reveal classes**

Append inside `@layer components` in `globals.css`:

```css
  .circle-reveal {
    opacity: 0;
    transform: scale(0.55);
    transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.34, 1.2, 0.64, 1);
  }

  .circle-reveal.is-visible {
    opacity: 1;
    transform: scale(1);
  }
```

- [ ] **Step 3: Add reduced-motion guard**

Append at the end of `globals.css` (outside all `@layer` blocks):

```css
@media (prefers-reduced-motion: reduce) {
  .animate-drift-1,
  .animate-drift-2,
  .animate-drift-3 {
    animation: none;
  }
  .circle-reveal {
    transition: none;
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/(frontend)/globals.css
git commit -m "feat: add circle design system CSS foundations (keyframes, reveal classes)"
```

---

### Task 2: SectionScoop Component

**Files:**
- Create: `src/components/ui/SectionScoop.tsx`
- Create: `tests/int/circle-components.int.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/int/circle-components.int.spec.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { SectionScoop } from '@/components/ui/SectionScoop'

// jsdom does not ship IntersectionObserver
beforeEach(() => {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })) as unknown as typeof IntersectionObserver
})

describe('SectionScoop', () => {
  it('renders with aria-hidden="true"', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="white" nextBg="gray" />
    )
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
  })

  it('inner div gets borderRadius "60px 0 0 0" for direction right', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="white" nextBg="gray" />
    )
    const inner = container.querySelector('div > div') as HTMLElement
    expect(inner.style.borderRadius).toBe('60px 0 0 0')
  })

  it('inner div gets borderRadius "0 60px 0 0" for direction left', () => {
    const { container } = render(
      <SectionScoop direction="left" fromBg="white" nextBg="gray" />
    )
    const inner = container.querySelector('div > div') as HTMLElement
    expect(inner.style.borderRadius).toBe('0 60px 0 0')
  })

  it('applies nextBg as backgroundColor on inner div', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="white" nextBg="hsl(210 20% 97.5%)" />
    )
    const inner = container.querySelector('div > div') as HTMLElement
    expect(inner.style.backgroundColor).toBe('hsl(210 20% 97.5%)')
  })

  it('applies fromBg as backgroundColor on outer div', () => {
    const { container } = render(
      <SectionScoop direction="right" fromBg="hsl(0 0% 100%)" nextBg="gray" />
    )
    expect((container.firstChild as HTMLElement).style.backgroundColor).toBe('hsl(0 0% 100%)')
  })
})
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test:int
```

Expected: FAIL with "Cannot find module '@/components/ui/SectionScoop'"

- [ ] **Step 3: Implement SectionScoop**

Create `src/components/ui/SectionScoop.tsx`:

```tsx
interface Props {
  direction: 'left' | 'right'
  fromBg: string
  nextBg: string
}

export function SectionScoop({ direction, fromBg, nextBg }: Props) {
  return (
    <div
      className="relative h-16 overflow-hidden"
      aria-hidden="true"
      style={{ backgroundColor: fromBg }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: nextBg,
          borderRadius: direction === 'right' ? '60px 0 0 0' : '0 60px 0 0',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 4: Run test to confirm it passes**

```bash
pnpm test:int
```

Expected: all `SectionScoop` tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/SectionScoop.tsx tests/int/circle-components.int.spec.ts
git commit -m "feat: add SectionScoop component with tests"
```

---

### Task 3: CircleBackground Component

**Files:**
- Create: `src/components/ui/CircleBackground.tsx`
- Modify: `tests/int/circle-components.int.spec.ts`

- [ ] **Step 1: Write the failing tests**

Append to `tests/int/circle-components.int.spec.ts` (after the SectionScoop describe block):

```typescript
import { CircleBackground } from '@/components/ui/CircleBackground'

describe('CircleBackground', () => {
  it('renders with aria-hidden="true"', () => {
    const { container } = render(<CircleBackground />)
    expect((container.firstChild as HTMLElement).getAttribute('aria-hidden')).toBe('true')
  })

  it('has pointer-events-none class', () => {
    const { container } = render(<CircleBackground />)
    expect((container.firstChild as HTMLElement).classList.contains('pointer-events-none')).toBe(true)
  })

  it('renders two blob divs for light variant', () => {
    const { container } = render(<CircleBackground variant="light" />)
    const blobs = container.querySelectorAll('div > div')
    expect(blobs.length).toBe(2)
  })

  it('renders two blob divs for dark variant', () => {
    const { container } = render(<CircleBackground variant="dark" />)
    const blobs = container.querySelectorAll('div > div')
    expect(blobs.length).toBe(2)
  })

  it('light variant blob uses teal color', () => {
    const { container } = render(<CircleBackground variant="light" />)
    const firstBlob = container.querySelector('div > div') as HTMLElement
    expect(firstBlob.style.background).toContain('rgba(2, 85, 90')
  })

  it('dark variant first blob uses white color', () => {
    const { container } = render(<CircleBackground variant="dark" />)
    const firstBlob = container.querySelector('div > div') as HTMLElement
    expect(firstBlob.style.background).toContain('rgba(255, 255, 255')
  })
})
```

Also add the import for `CircleBackground` at the top of the file alongside the existing imports.

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test:int
```

Expected: FAIL with "Cannot find module '@/components/ui/CircleBackground'"

- [ ] **Step 3: Implement CircleBackground**

Create `src/components/ui/CircleBackground.tsx`:

```tsx
interface Props {
  variant?: 'light' | 'dark'
}

export function CircleBackground({ variant = 'light' }: Props) {
  const isLight = variant === 'light'
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="animate-drift-1 absolute rounded-full"
        style={{
          top: '8%',
          right: '6%',
          width: 110,
          height: 110,
          background: isLight ? 'rgba(2, 85, 90, 0.09)' : 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(30px)',
        }}
      />
      <div
        className="animate-drift-2 absolute rounded-full"
        style={{
          bottom: '12%',
          left: '5%',
          width: 80,
          height: 80,
          background: isLight ? 'rgba(139, 180, 58, 0.11)' : 'rgba(139, 180, 58, 0.10)',
          filter: 'blur(24px)',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 4: Run tests to confirm they pass**

```bash
pnpm test:int
```

Expected: all `CircleBackground` tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/CircleBackground.tsx tests/int/circle-components.int.spec.ts
git commit -m "feat: add CircleBackground component with tests"
```

---

### Task 4: Wire Scoops in page.tsx

**Files:**
- Modify: `src/app/(frontend)/page.tsx`

Scoops are placed only where the section background colour changes. Background key:
- `BG_WHITE = 'hsl(0 0% 100%)'` — used by: Hero, Solution, HowItWorks, Differentiation, FAQ (ProofSection 2nd subsection)
- `BG_GRAY = 'hsl(210 20% 97.5%)'` — used by: Problem, BankPartnerships, Testimonials (ProofSection 1st subsection)
- `BG_TEAL = 'hsl(183 97% 18%)'` — used by: CTA

- [ ] **Step 1: Add constants and SectionScoop imports**

At the top of `src/app/(frontend)/page.tsx`, add the import:

```tsx
import { SectionScoop } from "@/components/ui/SectionScoop"
```

Just after the last import and before `export const dynamic`, add:

```tsx
const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 97.5%)'
const BG_TEAL  = 'hsl(183 97% 18%)'
```

- [ ] **Step 2: Insert SectionScoop between sections**

Replace the `return (...)` JSX in `IndexPage` with the version below. Only add scoops between sections where the background colour changes. Sections with the same background as their neighbour get no scoop.

```tsx
return (
  <div className="min-h-screen">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <HeroSection />
    {/* white → gray */}
    <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
    <ProblemSection />
    {/* gray → white */}
    <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
    <SolutionSection />
    {/* white → gray */}
    <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
    <BankPartnershipsSection bankLogos={bankLogos} />
    {/* BankPartnerships (gray) → ProofSection first subsection (gray) — same bg, no scoop */}
    <ProofSection agribusinessLogos={agribusinessLogos} />
    {/* ProofSection second subsection (white) → HowItWorks (white) — same bg, no scoop */}
    <HowItWorksSection />
    {/* white → gray */}
    <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
    <TestimonialsSection quotes={vocQuotes} />
    {/* gray → white */}
    <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
    <DifferentiationSection />
    {/* Differentiation (white) → FAQ (white) — same bg, no scoop */}
    <FAQSection />
    {/* white → teal */}
    <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_TEAL} />
    <CTASection />
  </div>
)
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/page.tsx
git commit -m "feat: wire SectionScoop dividers between homepage sections"
```

---

### Task 5: HeroSection

**Files:**
- Modify: `src/components/HeroSection.tsx`

- [ ] **Step 1: Update imports**

Replace the existing import block at the top of `src/components/HeroSection.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { ArrowRight } from "lucide-react"
import heroImage from "@/assets/Homepage image.jpg.jpeg"
import Image from "next/image"
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
```

- [ ] **Step 2: Add useInView hook call inside the component**

After the existing `useEffect` call, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 3: Update the section and add CircleBackground**

Replace the opening `<section>` tag and its `<div>` container. The full updated return is:

```tsx
return (
  <section id="home" className="bg-background relative">
    <CircleBackground />
    <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          {/* Ring accent on heading — reveals when heading enters viewport */}
          <div ref={headingRef} className="relative">
            <div
              className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
              style={{ transitionDelay: '0ms' }}
              aria-hidden="true"
            />
            <div
              className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
              style={{ transitionDelay: '150ms' }}
              aria-hidden="true"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground">
              De-Risk Your Supply Chain.{" "}
              <span className="gradient-primary-text">Unlock Your Capital.</span>
            </h1>
          </div>
          <h2 className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            eProd helps agribusinesses manage 1,000+ farmers, ensure traceability, de-risk lending for financial partners, and reduce waste—all in one affordable platform.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="#cta"
              className="inline-flex items-center justify-center gap-2 rounded-full gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground hover:brightness-110 transition shadow-lg"
            >
              Request a Demo
              <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={heroImage}
              alt="African farmer using mobile technology in a green agricultural field with digital data overlays"
              className="w-full h-auto object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              placeholder="blur"
              priority
            />
          </div>
          {/* Subtle ring outline around the image */}
          <div
            className="pointer-events-none absolute -inset-2.5 rounded-3xl border border-primary/10"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </section>
)
```

Note: The two existing decorative blur orbs (lines 48–50 in the original) are removed — `CircleBackground` replaces them.

- [ ] **Step 4: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: add circle design to HeroSection"
```

---

### Task 6: ProblemSection

**Files:**
- Modify: `src/components/ProblemSection.tsx`

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import ledgerImg from '@/assets/Ledger.jpg'
import euMarketImg from '@/assets/EU-market.webp'
import marginErosionImg from '@/assets/margin erosin.png'
```

Inside `ProblemSection`, after the existing `useEffect`, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 2: Update the return JSX**

Replace the full `return` block:

```tsx
return (
  <section className="section-gray py-20 relative">
    <CircleBackground />
    <div className="container mx-auto px-4 relative z-10">
      <div ref={headingRef} className="relative mb-4">
        <div
          className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
          style={{ transitionDelay: '0ms' }}
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
          style={{ transitionDelay: '150ms' }}
          aria-hidden="true"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          The Challenge: Managing Agricultural Supply Chains{" "}
          <span className="gradient-primary-text">at Scale</span>
        </h2>
        <p className="text-center md:text-2xl text-muted-foreground mb-14 max-w-2xl mx-auto">
          Agribusinesses face growing complexity every day. Here are the three biggest pain points.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {problems.map((p) => (
          <div
            key={p.title}
            className="relative bg-card rounded-xl overflow-hidden shadow-sm border border-border hover:shadow-md transition group"
          >
            {/* Small ring accent on card top-right corner */}
            <div
              className="pointer-events-none absolute -top-2.5 -right-2.5 h-7 w-7 rounded-full border border-primary/20 z-10"
              aria-hidden="true"
            />
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                className={`${p.contain ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-500`}
              />
            </div>
            <div className="p-8">
              <h3 className="text-xl font-bold text-foreground mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProblemSection.tsx
git commit -m "feat: add circle design to ProblemSection"
```

---

### Task 7: SolutionSection

**Files:**
- Modify: `src/components/SolutionSection.tsx`

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect } from 'react'
import { Database, ClipboardCheck, BarChart3 } from "lucide-react"
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
```

Inside `SolutionSection`, after the existing `useEffect`, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 2: Update the return JSX**

Replace the full `return` block:

```tsx
return (
  <section className="bg-background py-20 relative">
    <CircleBackground />
    <div className="container mx-auto px-4 relative z-10">
      <div ref={headingRef} className="relative mb-4">
        <div
          className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
          style={{ transitionDelay: '0ms' }}
          aria-hidden="true"
        />
        <div
          className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
          style={{ transitionDelay: '150ms' }}
          aria-hidden="true"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          Introducing eProd: The{" "}
          <span className="gradient-primary-text">System of Record</span> for Your Supply Chain
        </h2>
        <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
          A purpose-built platform that turns chaos into clarity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {solutions.map((s, i) => (
          <div
            key={s.title}
            className="relative bg-card rounded-xl p-8 shadow-sm border border-border hover:shadow-md transition group overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 gradient-primary-horizontal opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-5">
              <s.icon size={24} className="text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">{s.text}</p>
            <p className="text-sm font-semibold text-primary">{s.outcome}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SolutionSection.tsx
git commit -m "feat: add circle design to SolutionSection"
```

---

### Task 8: BankPartnershipsSection

**Files:**
- Modify: `src/components/BankPartnershipsSection.tsx`

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect } from 'react'
import { ShieldCheck, Landmark, TrendingUp, Handshake } from "lucide-react"
import { LogoCell } from '@/components/LogoCell'
import type { LogoEntry } from '@/components/LogoCell'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
```

Inside `BankPartnershipsSection`, after the existing `useEffect`, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 2: Update the section opening and heading**

Replace `<section className="section-gray py-20">` with `<section className="section-gray py-20 relative">`.

Add `<CircleBackground />` as the first child inside the section.

Add `relative z-10` to `<div className="container mx-auto px-4">` → `<div className="container mx-auto px-4 relative z-10">`.

Wrap the heading block (the `<h2>` and `<p>` below it) in the ring accent wrapper:

```tsx
<div ref={headingRef} className="relative mb-4">
  <div
    className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '0ms' }}
    aria-hidden="true"
  />
  <div
    className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '150ms' }}
    aria-hidden="true"
  />
  <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
    De-Risk Lending.{" "}
    <span className="gradient-primary-text">Unlock Capital.</span>
  </h2>
  <p className="text-center text-muted-foreground mb-14 max-w-2xl mx-auto">
    eProd bridges the gap between agribusinesses and financial institutions by providing verified, real-time supply chain data that de-risks agricultural loans.
  </p>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BankPartnershipsSection.tsx
git commit -m "feat: add circle design to BankPartnershipsSection"
```

---

### Task 9: ProofSection

**Files:**
- Modify: `src/components/ProofSection.tsx`

ProofSection renders a React Fragment with two `<section>` elements. Add `CircleBackground` to each and add a `SectionScoop` between them (gray → white internal transition).

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { QRCodeSVG } from 'qrcode.react'
import { LogoCell } from '@/components/LogoCell'
import type { LogoEntry } from '@/components/LogoCell'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { SectionScoop } from '@/components/ui/SectionScoop'
import eudrLogo from '@/assets/EUDR.png'
import organicLogo from '@/assets/eu-organic-logo-600x400_0.png'
import fairtradeLogoSrc from '@/assets/Fairtrade-Logo.jpg'
import financeImage from '@/assets/Finance-2.png'
import supplyChainImage from '@/assets/supply-chain-digitalisation.png'
```

Inside `ProofSection`, after the existing `useEffect`, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 2: Update both subsections**

**First `<section>` (Trust & Metrics — `section-gray`):**

```tsx
<section className="section-gray py-20 relative">
  <CircleBackground />
  <div className="container mx-auto px-4 relative z-10">
    <div ref={headingRef} className="relative mb-4">
      <div
        className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
        style={{ transitionDelay: '0ms' }}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
        style={{ transitionDelay: '150ms' }}
        aria-hidden="true"
      />
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
        Trusted by <span className="gradient-primary-text">250+ Agribusinesses</span> to manage
        1M+ farmers Across 20 Countries
      </h2>
    </div>
    {/* keep the rest of the first section's content unchanged */}
    ...
  </div>
</section>
```

Add the internal scoop between the two `<section>` elements (inside the Fragment):

```tsx
{/* gray → white internal transition */}
<SectionScoop direction="left" fromBg="hsl(210 20% 97.5%)" nextBg="hsl(0 0% 100%)" />
```

**Second `<section>` (Value Proposition — `bg-background`):** add `relative` to the section and `CircleBackground` + `relative z-10` to the container div. No ring accent needed (it uses column sub-headings, not a single `<h2>`):

```tsx
<section className="bg-background py-20 relative">
  <CircleBackground />
  <div className="container mx-auto px-4 relative z-10">
    {/* all existing content unchanged */}
  </div>
</section>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ProofSection.tsx
git commit -m "feat: add circle design to ProofSection with internal scoop"
```

---

### Task 10: HowItWorksSection

**Files:**
- Modify: `src/components/HowItWorksSection.tsx`

Steps have 4 cards. Each step badge (number circle) gets two concentric scroll-reveal rings. A single `useInView` on the steps grid triggers all rings with staggered delays.

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
```

Inside `HowItWorksSection`, after the existing `useEffect`, add:

```tsx
const { ref: stepsRef, inView: stepsInView } = useInView({ threshold: 0.2 })
```

- [ ] **Step 2: Update the return JSX**

Replace the full `return` block:

```tsx
return (
  <section className="bg-background py-20 relative">
    <CircleBackground />
    <div className="container mx-auto px-4 relative z-10">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-14">
        Get Started in <span className="gradient-primary-text">4 Simple Steps</span>
      </h2>

      <div
        ref={stepsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-6 lg:gap-0 items-start mb-10"
      >
        {steps.map((step, i) => (
          <>
            <div
              key={step.title}
              className="group bg-card border border-border rounded-2xl overflow-hidden shadow-md hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 transition-all duration-200"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Number badge with concentric scroll-reveal rings */}
                <div className="absolute top-4 left-4">
                  <div className="relative flex items-center justify-center">
                    <div
                      className={`pointer-events-none absolute -inset-2 rounded-full border border-white/25 circle-reveal${stepsInView ? ' is-visible' : ''}`}
                      style={{ transitionDelay: `${i * 100}ms` }}
                      aria-hidden="true"
                    />
                    <div
                      className={`pointer-events-none absolute -inset-4 rounded-full border border-white/15 circle-reveal${stepsInView ? ' is-visible' : ''}`}
                      style={{ transitionDelay: `${i * 100 + 100}ms` }}
                      aria-hidden="true"
                    />
                    <span className="relative w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-black text-base shadow-lg">
                      {i + 1}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <span className="inline-block text-xs font-bold rounded-full bg-secondary/20 text-secondary px-3 py-1 mb-3">
                  {step.time}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            </div>

            {i < steps.length - 1 && (
              <div key={`arrow-${i}`} className="hidden lg:flex items-center justify-center px-2 pt-20">
                <ArrowRight size={20} className="text-primary/40" />
              </div>
            )}
          </>
        ))}
      </div>

      <div className="text-center">
        <p className="inline-block rounded-full bg-secondary/15 px-6 py-3 text-secondary font-semibold text-sm">
          ⚡ Most customers see results within 30 days of launch.
        </p>
      </div>
    </div>
  </section>
)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HowItWorksSection.tsx
git commit -m "feat: add circle design to HowItWorksSection with step ring reveals"
```

---

### Task 11: TestimonialsSection

**Files:**
- Modify: `src/components/TestimonialsSection.tsx`

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { Quote } from 'lucide-react'
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
```

Inside `TestimonialsSection`, after the two existing `useEffect` calls, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 2: Update the section opening**

Replace `<section className="section-gray py-20" ...>` with `<section className="section-gray py-20 relative" ...>`.

Add `<CircleBackground />` as the first child inside the section.

Add `relative z-10` to `<div className="container mx-auto px-4">`.

Wrap the `<h2>` in the ring accent wrapper:

```tsx
<div ref={headingRef} className="relative mb-14">
  <div
    className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '0ms' }}
    aria-hidden="true"
  />
  <div
    className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '150ms' }}
    aria-hidden="true"
  />
  <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
    Real Results from <span className="gradient-primary-text">Real Customers</span>
  </h2>
</div>
```

Note: Remove `mb-14` from the `<h2>` (moved to the wrapper div).

- [ ] **Step 3: Commit**

```bash
git add src/components/TestimonialsSection.tsx
git commit -m "feat: add circle design to TestimonialsSection"
```

---

### Task 12: DifferentiationSection

**Files:**
- Modify: `src/components/DifferentiationSection.tsx`

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect } from 'react'
import { Globe, Smartphone, Tag, Trophy, Check, X } from "lucide-react"
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
```

Inside `DifferentiationSection`, after the existing `useEffect`, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 2: Update the section opening**

Replace `<section className="bg-background py-20">` with `<section className="bg-background py-20 relative">`.

Add `<CircleBackground />` as the first child inside the section.

Add `relative z-10` to `<div className="container mx-auto px-4">`.

Wrap the `<h2>` in the ring accent wrapper:

```tsx
<div ref={headingRef} className="relative mb-14">
  <div
    className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '0ms' }}
    aria-hidden="true"
  />
  <div
    className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '150ms' }}
    aria-hidden="true"
  />
  <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground">
    Why eProd <span className="gradient-primary-text">Stands Out</span>
  </h2>
</div>
```

Note: Remove `mb-14` from the `<h2>` (moved to the wrapper div).

- [ ] **Step 3: Commit**

```bash
git add src/components/DifferentiationSection.tsx
git commit -m "feat: add circle design to DifferentiationSection"
```

---

### Task 13: FAQSection

**Files:**
- Modify: `src/components/FAQSection.tsx`

- [ ] **Step 1: Update imports and add hook**

Replace the import block:

```tsx
'use client'

import { useEffect } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
import { CircleBackground } from '@/components/ui/CircleBackground'
import { faqs } from '@/data/faqs'
```

Inside `FAQSection`, after the existing `useEffect`, add:

```tsx
const { ref: headingRef, inView: headingInView } = useInView({ threshold: 0.25 })
```

- [ ] **Step 2: Update the section opening**

Replace `<section className="bg-background py-20">` with `<section className="bg-background py-20 relative">`.

Add `<CircleBackground />` as the first child inside the section.

Add `relative z-10` to `<div className="container mx-auto px-4">`.

Wrap the heading block in the ring accent wrapper:

```tsx
<div ref={headingRef} className="relative mb-4">
  <div
    className={`pointer-events-none absolute left-6 top-0 h-9 w-9 rounded-full border border-primary/20 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '0ms' }}
    aria-hidden="true"
  />
  <div
    className={`pointer-events-none absolute left-2 -top-2 h-14 w-14 rounded-full border border-primary/15 circle-reveal${headingInView ? ' is-visible' : ''}`}
    style={{ transitionDelay: '150ms' }}
    aria-hidden="true"
  />
  <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
    Frequently Asked{" "}
    <span className="gradient-primary-text">Questions</span>
  </h2>
  <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">
    Everything you need to know about eProd and how it transforms agricultural supply chains.
  </p>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/FAQSection.tsx
git commit -m "feat: add circle design to FAQSection"
```

---

### Task 14: CTASection

**Files:**
- Modify: `src/components/CTASection.tsx`

CTASection uses a dark teal gradient. It gets `CircleBackground variant="dark"` and three large static concentric rings centred in the background. No `useInView` needed — purely decorative static elements.

- [ ] **Step 1: Update imports**

Replace the import block:

```tsx
"use client"
import { useState } from "react"
import { gaEvents } from "@/lib/ga-events"
import { CircleBackground } from '@/components/ui/CircleBackground'
```

- [ ] **Step 2: Update the return JSX**

Replace `<section id="cta" className="gradient-primary py-20">` with:

```tsx
<section id="cta" className="gradient-primary py-20 relative overflow-hidden">
  <CircleBackground variant="dark" />
  {/* Static concentric rings centred in background */}
  <div
    className="pointer-events-none absolute inset-0 flex items-center justify-center"
    aria-hidden="true"
  >
    <div className="absolute h-[300px] w-[300px] rounded-full border border-white/[0.07]" />
    <div className="absolute h-[200px] w-[200px] rounded-full border border-white/[0.07]" />
    <div className="absolute h-[120px] w-[120px] rounded-full border border-white/[0.12]" />
  </div>
  <div className="container mx-auto px-4 relative z-10">
    {/* all existing content unchanged — h2, p, form, etc. */}
```

Close the original `</section>` at the end as usual.

- [ ] **Step 3: Commit**

```bash
git add src/components/CTASection.tsx
git commit -m "feat: add circle design to CTASection"
```

---

### Task 15: Create feature branch

This task should have been done first. If you are starting fresh, run this before Task 1:

```bash
git checkout -b feature/circular-design-system
```

If you have already committed to `main`, create the branch now and it will include all commits since branching:

```bash
git checkout -b feature/circular-design-system
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Covered by |
|---|---|
| Drifting blobs in every section | Tasks 5–14 via `CircleBackground` |
| `CircleBackground variant="dark"` for CTA | Task 14 |
| Corner-scoop dividers, alternating L/R | Task 4 |
| Internal scoop in ProofSection (gray→white) | Task 9 |
| Ring accent on section headings (scroll-reveal) | Tasks 5–9, 11–13 |
| Step number rings with stagger in HowItWorks | Task 10 |
| Small ring on card corners in ProblemSection | Task 6 |
| Thin ring outline around hero image | Task 5 |
| Large faint static rings in CTA background | Task 14 |
| CSS keyframes + scroll-reveal classes | Task 1 |
| `prefers-reduced-motion` guard | Task 1 |
| `aria-hidden="true"` on all decorative elements | Tasks 2, 3, 5–14 |
| Zero new npm dependencies | All tasks |
| `useInView` reused (not a new hook) | Tasks 5–13 |

**All spec requirements have a corresponding task. No gaps.**
