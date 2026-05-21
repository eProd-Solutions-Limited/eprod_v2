# Logo Bridge Animation — Design Spec

**Date:** 2026-05-21  
**Status:** Approved

---

## Overview

A slim animated strip placed between the "Meet the Founders" and "Our Story" sections on the About page. It serves as a pure visual bridge — no text, no interactivity — using the circular motifs from the eProd logo to create a branded transition moment.

---

## Placement

In [src/app/(frontend)/about/page.tsx](../../../src/app/(frontend)/about/page.tsx):

```tsx
<MeetTheFounders />
<LogoBridge />      {/* new */}
<OurStory />
```

---

## Component

**File:** `src/components/about/LogoBridge.tsx`

A single self-contained React component. No props. No external state. No new dependencies — animations are pure CSS.

---

## Visual Design

### Dimensions
- **Height:** 80px (fixed)
- **Width:** full viewport width

### Background
- `hsl(183, 38%, 92%)` — maps to the existing `--color-primary-lighter` CSS variable (`bg-primary-lighter` in Tailwind)

### Pulse rings
Three concentric rings animate outward from the center, staggered by 0.8s each:

| Ring | Color | Delay |
|------|-------|-------|
| 1 | `hsl(183, 97%, 18%)` — deep teal (primary) | 0s |
| 2 | `hsl(183, 38%, 42%)` — medium teal (primary-light) | 0.8s |
| 3 | `hsl(72, 51%, 53%)` — lime green (secondary) | 1.6s |

Each ring starts at `scale(0.35)` with `opacity: 0.9` and eases out to `scale(2.8)` at `opacity: 0` over 2.4s, looping infinitely.

### Core circle
- **Size:** 40px × 40px
- **Background:** `linear-gradient(135deg, hsl(183,97%,18%), hsl(183,38%,42%))`
- **Shadow:** `0 2px 12px rgba(7,92,92,0.3)`
- **Breathe animation:** scales between `1` and `1.07` on a 3s ease-in-out loop
- **Lime-green dot:** 12px circle in `hsl(72, 51%, 53%)`, positioned top-right of the core — references the dot inside the "o" in the eProd logo

### Background depth circles
Two static, faint circles (`hsl(183, 38%, 88%)`, 40–50% opacity) placed at the left and right edges to give the strip subtle depth. Not animated.

---

## Animation Spec

```
ringOut keyframe:
  0%   → scale(0.35), opacity 0.9
  100% → scale(2.8),  opacity 0
  duration: 2.4s, timing: ease-out, iteration: infinite

coreBreathe keyframe:
  0%, 100% → scale(1)
  50%      → scale(1.07)
  duration: 3s, timing: ease-in-out, iteration: infinite
```

---

## Accessibility

Respects `prefers-reduced-motion`: all animations are disabled, rings shown at static mid-scale (`scale(1.5)`, `opacity: 0.6`), core shown without the breathe.

```css
@media (prefers-reduced-motion: reduce) {
  .ring { animation: none; transform: scale(1.5); opacity: 0.6; }
  .core { animation: none; }
}
```

---

## Implementation Notes

- Pure CSS keyframes — no Framer Motion or additional libraries needed. The `ringOut` and `coreBreathe` keyframes are defined via a `<style>` JSX tag inside the component, keeping animation styles co-located with the component rather than in `globals.css`.
- The component is a Server Component (no `'use client'` needed — CSS animations run in the browser without React state).
- `.gitignore` should include `.superpowers/` if not already present.
