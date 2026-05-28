# Circular Design System — Design Spec

**Date:** 2026-05-28  
**Branch:** feature/circular-design-system  
**Scope:** Homepage (primary); section dividers site-wide

---

## Overview

Incorporate the circular/curved motif from the eProd logo into the website using three design primitives: drifting ambient blobs, scroll-triggered concentric ring accents, and corner-scoop section dividers. The intent is subtle brand reinforcement — circles feel intentional but never compete with content.

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Circle intensity | Subtle accents | Content stays front-and-centre |
| Section dividers | Corner scoop (CSS border-radius) | Directly mirrors the circular logo language; matches reference site |
| Scoop alternation | Left/right per section | Creates visual rhythm without repeating |
| Animations | Drifting blobs (always-on) | Ambient, non-distracting; no user interaction needed |
| Scroll reveals | Concentric ring accents | Purposeful appearance tied to reading progress |
| Implementation | CSS + IntersectionObserver | Zero new dependencies; native browser API |

---

## New Components

### 1. `SectionScoop`

A thin wrapper `div` that applies the alternating corner-scoop transition beneath a section. Accepts:

- `direction`: `"left" | "right"` — which corner to scoop
- `nextBg`: CSS color string — the background colour of the section below (used to draw the scoop shape)

Renders as an absolutely-positioned `div` (not `::after`) so it works correctly with Next.js SSR. Uses `border-radius` to create the arc. Height: `64px`. Sits flush at the bottom of its parent section, colour-matched to the following section's background.

**Usage pattern — alternating (verify each section's actual bg class before implementing):**
```
Hero (white)              → SectionScoop direction="right" nextBg="hsl(210 20% 97.5%)"
Problem (section-gray)    → SectionScoop direction="left"  nextBg="#ffffff"
Solution (white)          → SectionScoop direction="right" nextBg="hsl(210 20% 97.5%)"
BankPartnerships (gray)   → SectionScoop direction="left"  nextBg="#ffffff"
Proof (white)             → SectionScoop direction="right" nextBg="hsl(210 20% 97.5%)"
HowItWorks (gray)         → SectionScoop direction="left"  nextBg="#ffffff"
Testimonials (white)      → SectionScoop direction="right" nextBg="hsl(210 20% 97.5%)"
Differentiation (gray)    → SectionScoop direction="left"  nextBg="#ffffff"
FAQ (white)               → SectionScoop direction="right" nextBg="hsl(210 20% 97.5%)"
CTA (teal #02555a)        → no scoop (terminal section)
```

> Note: Confirm each section's background in the component before assigning `nextBg`. Use the CSS variable `hsl(var(--section-gray))` value (`hsl(210 20% 97.5%)`) for gray sections.

### 2. `CircleBackground`

An absolutely-positioned layer rendered inside a section. Contains 2–3 blurred circular `div`s that drift slowly via CSS `@keyframes`. Accepts:

- `variant`: `"light" | "dark"` — adjusts blob opacity (`light`: teal 9%, lime 11%; `dark`: white 5%, lime 10%)

Each blob has its own keyframe animation (`drift-1`, `drift-2`, `drift-3`) with durations between 8–14 seconds and `ease-in-out infinite`. Sizes range 70px–130px. Positions are fixed (not random) per variant to avoid layout shift.

**New keyframes added to `globals.css`:**
```css
@keyframes drift-1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(14px,-12px) scale(1.06)} 66%{transform:translate(-9px,7px) scale(0.96)} }
@keyframes drift-2 { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(-16px,9px) scale(1.04)} 80%{transform:translate(11px,-14px) scale(0.97)} }
@keyframes drift-3 { 0%,100%{transform:translate(0,0) scale(1)} 25%{transform:translate(9px,13px) scale(1.05)} 75%{transform:translate(-12px,-7px) scale(0.95)} }
```

Marked `aria-hidden="true"`, `pointer-events: none`, `position: absolute`, `inset: 0`, `overflow: hidden`, `z-index: 0`. Section content gets `position: relative; z-index: 1`.

### 3. `useCircleReveal` hook

```ts
function useCircleReveal(options?: { threshold?: number; delay?: number }): {
  ref: React.RefCallback<Element>;
  isVisible: boolean;
}
```

Wraps a single `IntersectionObserver` (threshold `0.25` by default). Returns a ref-callback and `isVisible` boolean. Once visible, stays visible (observer disconnects after first trigger). The optional `delay` (ms) is applied as an inline `transition-delay` style on the element — the hook returns it as a `style` object alongside `isVisible`.

**Scroll-reveal CSS classes added to `globals.css`:**
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

---

## Per-Section Changes

### HeroSection
- Wrap with `CircleBackground variant="light"` (3 blobs: teal top-right, lime bottom-left, teal centre-ambient)
- Add concentric ring accent (2 rings, no fill, `rgba(2,85,90,0.18)`) near the gradient heading — scroll-reveals on mount (delay 0ms, 150ms)
- Existing blur orbs on lines 48–50 of `HeroSection.tsx` replaced by `CircleBackground`
- Thin ring border around the hero image container (`inset: -10px`, `border-radius: 28px`, `rgba(2,85,90,0.10)`)
- `SectionScoop direction="right" nextBg="#f0f7f7"` at bottom

### ProblemSection
- Wrap with `CircleBackground variant="light"` (2 blobs)
- Ring accent next to section `<h2>` (scroll-reveal)
- Small ring (`24px`, `border: 1.5px solid rgba(2,85,90,0.18)`) on each card's top-right corner (static)
- `SectionScoop direction="left" nextBg="#ffffff"` at bottom

### SolutionSection, BankPartnershipsSection, ProofSection, TestimonialsSection, DifferentiationSection, FAQSection
- Each: `CircleBackground variant="light"` (2 blobs)
- Ring accent next to section `<h2>` (scroll-reveal)
- Alternating `SectionScoop` — continue the left/right pattern in document order

### HowItWorksSection
- `CircleBackground variant="light"` (2 blobs)
- Each step number gets two concentric rings (`step-r1`: `inset: -8px`; `step-r2`: `inset: -18px`) — both scroll-reveal with staggered delays (0.1s, 0.2s, 0.3s per step)
- `SectionScoop` at bottom (direction per pattern)

### CTASection
- `CircleBackground variant="dark"` (2 blobs: white-tint + lime)
- Three large static concentric rings centred in background (`300px`, `200px`, `120px` diameter; `rgba(255,255,255,0.07)`)
- No `SectionScoop` (terminal section)

---

## CSS-Only Scroll Consideration

`useCircleReveal` uses `IntersectionObserver`. For users with `prefers-reduced-motion: reduce`, blob animations are paused and ring reveals are instant (no transition). Add to `globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  [class*="drift-"] { animation: none; }
  .circle-reveal { transition: none; }
}
```

---

## File Plan

| File | Change |
|---|---|
| `src/app/(frontend)/globals.css` | Add `drift-1/2/3` keyframes, `.circle-reveal` classes, reduced-motion guard |
| `src/components/ui/SectionScoop.tsx` | New component |
| `src/components/ui/CircleBackground.tsx` | New component |
| `src/hooks/useCircleReveal.ts` | New hook |
| `src/components/HeroSection.tsx` | Add blobs, ring accents, scoop |
| `src/components/ProblemSection.tsx` | Add blobs, ring accents, card rings, scoop |
| `src/components/SolutionSection.tsx` | Add blobs, ring accent, scoop |
| `src/components/BankPartnershipsSection.tsx` | Add blobs, ring accent, scoop |
| `src/components/ProofSection.tsx` | Add blobs, ring accent, scoop |
| `src/components/HowItWorksSection.tsx` | Add blobs, step rings (scroll-reveal), scoop |
| `src/components/TestimonialsSection.tsx` | Add blobs, ring accent, scoop |
| `src/components/DifferentiationSection.tsx` | Add blobs, ring accent, scoop |
| `src/components/FAQSection.tsx` | Add blobs, ring accent, scoop |
| `src/components/CTASection.tsx` | Add dark blobs, static bg rings |

---

## Out of Scope

- Other pages (About, Solutions, Case Studies, Insights) — same primitives can be applied later in a follow-up
- Dark mode circle colours (inherit from existing dark mode CSS vars)
- Any change to navigation, typography, or content
