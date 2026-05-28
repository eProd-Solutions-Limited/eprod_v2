# Inner Pages Circular Design System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply SectionScoop transitions and CircleBackground blobs to all inner pages (About, Solutions, Case Studies, Contact, Sectors, Insights) to match the circular design language established on the homepage.

**Architecture:** Two existing primitives — `SectionScoop` and `CircleBackground` — are applied to each section component and page-level layout. No new components are created. Gradient sections receive an internal overlay (same technique used in the homepage CTASection) instead of an external SectionScoop.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4. Both primitives are already in `src/components/ui/`.

---

## Conventions (read before starting any task)

### Standard section treatment (white or gray background)

Every non-gradient section gets these three changes:

**1. `<section>` tag** — add `relative overflow-hidden`:
```tsx
// before
<section className="bg-background py-20">
// after
<section className="bg-background py-20 relative overflow-hidden">
```

**2. First child inside `<section>`** — add `<CircleBackground />`:
```tsx
<section className="bg-background py-20 relative overflow-hidden">
  <CircleBackground />           {/* ← add this */}
  <div className="container ...">
```

**3. Inner container div** — add `relative z-10`:
```tsx
// before
<div className="container mx-auto px-4">
// after
<div className="container mx-auto px-4 relative z-10">
```

**4. Import** — add at top of file:
```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'
```

### Dark/image hero — bottom overlay

Dark heroes already have `relative overflow-hidden`. Add `<CircleBackground variant="dark" />` and a bottom overlay. The overlay creates the scoop transition into the next section without needing an external SectionScoop in page.tsx.

Pattern for bottom overlay (placed directly before the content container div):
```tsx
<CircleBackground variant="dark" />
<div
  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
  aria-hidden="true"
  style={{ backgroundColor: '<NEXT_SECTION_COLOR>', borderRadius: '60px 0 0 0' }}
/>
```
- `NEXT_SECTION_COLOR`: `hsl(0 0% 100%)` if next section is white, `hsl(210 20% 91%)` if gray.
- Also add `relative z-10` to the content container div.

### Closing gradient sections (CTA, ValueChainBlock)

Add `relative overflow-hidden` if missing, then add a top overlay (matches preceding section color) + `<CircleBackground variant="dark" />`. No external SectionScoop is placed before these sections in page.tsx.

Pattern for top overlay (placed as first child inside `<section>`):
```tsx
<div
  className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
  aria-hidden="true"
  style={{ backgroundColor: '<PREV_SECTION_COLOR>', borderRadius: '0 0 0 60px' }}
/>
<CircleBackground variant="dark" />
```
- `PREV_SECTION_COLOR`: `hsl(0 0% 100%)` if preceding section is white, `hsl(210 20% 91%)` if gray.
- Also add `relative z-10` to the content container div.

### ValueChainBlock (gradient sandwiched between white and gray)

Needs both a top overlay (white, from SectorCards) and a bottom overlay (gray, into SectorsFAQ):
```tsx
<section className="gradient-primary py-16 relative overflow-hidden" aria-label="...">
  <div
    className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
    aria-hidden="true"
    style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '0 0 0 60px' }}
  />
  <CircleBackground variant="dark" />
  <div
    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
    aria-hidden="true"
    style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '60px 0 0 0' }}
  />
  <div className="container mx-auto px-4 text-center relative z-10">
```

### Background normalization

These four components need a `className` change before the standard treatment:
- `MeetTheFounders`: `bg-muted/30` → `bg-background`
- `CareersSection`: `bg-muted/30` → `bg-background`
- `LogoWall` (case-studies): `bg-muted/40` → `section-gray`
- `VoiceOfCustomer` (case-studies): `bg-muted/40` → `section-gray`

### SectionScoop in page.tsx

```tsx
// Add at top of file alongside other imports:
import { SectionScoop } from "@/components/ui/SectionScoop"

// Add these constants inside the component/function body (or as module-level consts):
const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 91%)'

// White → gray transition (curves right):
<SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />

// Gray → white transition (curves left):
<SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
```

---

## File Structure

**Modified `page.tsx` files:**
- `src/app/(frontend)/about/page.tsx` — add SectionScoop import + 7 scoops
- `src/app/(frontend)/solutions/page.tsx` — add SectionScoop import + 4 scoops
- `src/app/(frontend)/case-studies/page.tsx` — add SectionScoop import + 2 scoops
- `src/app/(frontend)/insights/page.tsx` — add SectionScoop + CircleBackground inline

**Modified section components — About (11 files):**
- `src/components/about/AboutHero.tsx`
- `src/components/about/VisionMission.tsx`
- `src/components/about/OurStory.tsx`
- `src/components/about/MeetTheFounders.tsx` (+ bg normalization)
- `src/components/about/AgFintechIdentity.tsx`
- `src/components/about/MarketLeadership.tsx`
- `src/components/about/BankPartnersAbout.tsx`
- `src/components/about/LeadershipTeam.tsx`
- `src/components/about/CareersSection.tsx` (+ bg normalization)
- `src/components/about/AboutFAQ.tsx`
- `src/components/about/AboutCTA.tsx` (gradient + gray top overlay)

**Modified section components — Solutions (6 files):**
- `src/components/solutions/SolutionsHero.tsx` (dark hero + white bottom overlay)
- `src/components/solutions/PlatformArchitecture.tsx`
- `src/components/solutions/DataFlow.tsx`
- `src/components/solutions/SecurityCompliance.tsx`
- `src/components/solutions/Integrations.tsx`
- `src/components/solutions/SolutionsCTA.tsx` (gradient + gray top overlay, replaces existing blob div)

**Modified section components — Case Studies (6 files):**
- `src/components/case-studies/CaseStudiesHero.tsx` (dark hero + gray bottom overlay)
- `src/components/case-studies/LogoWall.tsx` (+ bg normalization)
- `src/components/case-studies/ImpactGrid.tsx`
- `src/components/case-studies/DifferentiatorBanner.tsx` (mid-page gradient, replaces existing blob div)
- `src/components/case-studies/VoiceOfCustomer.tsx` (+ bg normalization)
- `src/components/case-studies/CaseStudiesCTA.tsx`

**Modified section components — Contact (2 files):**
- `src/components/contact/ContactHero.tsx` (dark hero + white bottom overlay)
- `src/components/contact/ContactForm.tsx`

**Modified section components — Sectors (4 files):**
- `src/components/sectors/SectorsHero.tsx` (dark hero + white bottom overlay, replaces existing blob div)
- `src/components/sectors/SectorCards.tsx`
- `src/components/sectors/ValueChainBlock.tsx` (gradient + white top + gray bottom overlays)
- `src/components/sectors/SectorsFAQ.tsx`

---

## Task 1: About page — regular sections

**Files:**
- Modify: `src/components/about/AboutHero.tsx`
- Modify: `src/components/about/VisionMission.tsx`
- Modify: `src/components/about/OurStory.tsx`
- Modify: `src/components/about/AgFintechIdentity.tsx`
- Modify: `src/components/about/MarketLeadership.tsx`
- Modify: `src/components/about/BankPartnersAbout.tsx`
- Modify: `src/components/about/LeadershipTeam.tsx`
- Modify: `src/components/about/AboutFAQ.tsx`

- [ ] **Step 1: Apply standard treatment to AboutHero**

`src/components/about/AboutHero.tsx` — add import, add `relative overflow-hidden` to section, add `<CircleBackground />`, add `relative z-10` to container:

```tsx
'use client'

import { useEffect } from 'react'
import { gaEvents } from '@/lib/ga-events'
import { CircleBackground } from '@/components/ui/CircleBackground'

const AboutHero = () => {
  useEffect(() => {
    gaEvents.viewPage('about_hero', 'hero')
  }, [])

  return (
    <section className="bg-background relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary">
            About eProd
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground">
            We Are The Financial Bridge{" "}
            <span className="gradient-primary-text">for African Agribusiness</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            We integrate end-to-end supply chain traceability with leading financial institutions to de-risk loans, unlock working capital, and power the growth of Africa's most ambitious agribusinesses.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
```

- [ ] **Step 2: Apply standard treatment to the remaining 7 regular About sections**

For each file below, apply the **Standard section treatment** from the Conventions section above:
1. Read the file to get current content
2. Add `import { CircleBackground } from '@/components/ui/CircleBackground'`
3. Add `relative overflow-hidden` to the outermost `<section>` className
4. Add `<CircleBackground />` as first child inside `<section>`
5. Add `relative z-10` to the main container div (the one with `container mx-auto px-4`)

Files to update:
- `src/components/about/VisionMission.tsx` (section has `section-gray`)
- `src/components/about/OurStory.tsx` (section has `bg-background`)
- `src/components/about/AgFintechIdentity.tsx` (section has `section-gray`)
- `src/components/about/MarketLeadership.tsx` (section has `bg-background`)
- `src/components/about/BankPartnersAbout.tsx` (section has `section-gray`)
- `src/components/about/LeadershipTeam.tsx` (section has `bg-background`)
- `src/components/about/AboutFAQ.tsx` (section has `section-gray`)

- [ ] **Step 3: Commit regular sections**

```bash
git add src/components/about/AboutHero.tsx src/components/about/VisionMission.tsx src/components/about/OurStory.tsx src/components/about/AgFintechIdentity.tsx src/components/about/MarketLeadership.tsx src/components/about/BankPartnersAbout.tsx src/components/about/LeadershipTeam.tsx src/components/about/AboutFAQ.tsx
git commit -m "feat: add CircleBackground to About regular sections"
```

---

## Task 2: About page — special sections + page.tsx

**Files:**
- Modify: `src/components/about/MeetTheFounders.tsx`
- Modify: `src/components/about/CareersSection.tsx`
- Modify: `src/components/about/AboutCTA.tsx`
- Modify: `src/app/(frontend)/about/page.tsx`

- [ ] **Step 1: Normalize and apply standard treatment to MeetTheFounders**

`src/components/about/MeetTheFounders.tsx` — change `bg-muted/30` → `bg-background` on the section tag, then apply the standard treatment (CircleBackground import + relative overflow-hidden + CircleBackground child + relative z-10 on container). Read the file first to see the full current content, then make all changes.

- [ ] **Step 2: Normalize and apply standard treatment to CareersSection**

`src/components/about/CareersSection.tsx` — change `bg-muted/30` → `bg-background` on the section tag, then apply the standard treatment. Read the file first.

- [ ] **Step 3: Apply gradient treatment to AboutCTA**

`src/components/about/AboutCTA.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { ArrowRight } from "lucide-react";
import { gaEvents } from '@/lib/ga-events'
import { CircleBackground } from '@/components/ui/CircleBackground'

const AboutCTA = () => {
  useEffect(() => {
    gaEvents.viewPage('about_cta', 'call_to_action')
  }, [])

  return (
    <section className="gradient-primary py-20 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
        aria-hidden="true"
        style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '0 0 0 60px' }}
      />
      <CircleBackground variant="dark" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          Join Us in Building the Future of African Agriculture
        </h2>
        <p className="text-primary-foreground/70 text-base max-w-2xl mx-auto mb-8">
          We are more than a software company. We are a strategic partner, a market leader, and a team of dedicated experts committed to your success. Whether you are an agribusiness, a financial institution, or a development partner—we invite you to join us.
        </p>
        <a
          href="#cta"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-8 py-3.5 text-base font-bold text-secondary-foreground hover:brightness-110 transition shadow-lg"
        >
          Schedule a Strategic Consultation
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

export default AboutCTA;
```

- [ ] **Step 4: Add SectionScoops to about/page.tsx**

`src/app/(frontend)/about/page.tsx` — add the SectionScoop import and 7 scoop elements. The current return JSX:

```tsx
<div className="min-h-screen">
  <AboutHero />
  <VisionMission />
  <MeetTheFounders />
  <OurStory />
  <AgFintechIdentity />
  <MarketLeadership />
  <BankPartnersAbout bankLogos={bankLogos} />
  <LeadershipTeam />
  <CareersSection />
  <AboutFAQ />
  <AboutCTA />
</div>
```

Replace with:

```tsx
import { SectionScoop } from "@/components/ui/SectionScoop"

// Inside the component:
const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 91%)'

// return:
<div className="min-h-screen">
  <AboutHero />
  <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
  <VisionMission />
  <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
  <MeetTheFounders />
  <OurStory />
  <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
  <AgFintechIdentity />
  <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
  <MarketLeadership />
  <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
  <BankPartnersAbout bankLogos={bankLogos} />
  <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
  <LeadershipTeam />
  <CareersSection />
  <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
  <AboutFAQ />
  <AboutCTA />
</div>
```

The `BG_WHITE` and `BG_GRAY` constants go inside `AboutUs` (the async function), before the return statement. The `SectionScoop` import goes at the top of the file with the other imports.

- [ ] **Step 5: Visual verification**

Run the dev server and navigate to `http://localhost:3000/about`. Confirm:
- Curved scoop transitions appear between each alternating white/gray section
- Drifting color blobs are visible in the background of each section
- The AboutCTA (teal gradient at bottom) has a smooth curved transition from the gray FAQ section above it

```bash
npm run dev
```

- [ ] **Step 6: Commit**

```bash
git add src/components/about/MeetTheFounders.tsx src/components/about/CareersSection.tsx src/components/about/AboutCTA.tsx src/app/(frontend)/about/page.tsx
git commit -m "feat: apply circular design to About page"
```

---

## Task 3: Solutions page

**Files:**
- Modify: `src/components/solutions/SolutionsHero.tsx`
- Modify: `src/components/solutions/PlatformArchitecture.tsx`
- Modify: `src/components/solutions/DataFlow.tsx`
- Modify: `src/components/solutions/SecurityCompliance.tsx`
- Modify: `src/components/solutions/Integrations.tsx`
- Modify: `src/components/solutions/SolutionsCTA.tsx`
- Modify: `src/app/(frontend)/solutions/page.tsx`

- [ ] **Step 1: Apply dark hero treatment to SolutionsHero**

`src/components/solutions/SolutionsHero.tsx` — SolutionsHero already has `relative overflow-hidden`. Add `CircleBackground variant="dark"`, a white bottom overlay, and `relative z-10` to the content container. The white bottom overlay uses `hsl(0 0% 100%)` because PlatformArchitecture (next section) is white.

Find the content container div `<div className="container mx-auto px-4 relative">` and insert just before it:

```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'

// Inside the section JSX, after the existing <div className="absolute inset-0"> block:
<CircleBackground variant="dark" />
<div
  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
  aria-hidden="true"
  style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '60px 0 0 0' }}
/>
// Then the existing content container with z-10 added:
<div className="container mx-auto px-4 relative z-10">
```

Read the full file first to find the exact insertion point (after the last `</div>` of the `absolute inset-0` background block, before the content container div).

- [ ] **Step 2: Apply standard treatment to PlatformArchitecture, DataFlow, SecurityCompliance, Integrations**

For each file, apply the **Standard section treatment** from the Conventions section:
- `src/components/solutions/PlatformArchitecture.tsx` (section has `bg-background`)
- `src/components/solutions/DataFlow.tsx` (section has `section-gray`)
- `src/components/solutions/SecurityCompliance.tsx` (section has `bg-background`)
- `src/components/solutions/Integrations.tsx` (section has `section-gray`)

Read each file, then add: CircleBackground import + `relative overflow-hidden` on section + `<CircleBackground />` first child + `relative z-10` on container.

- [ ] **Step 3: Apply gradient treatment to SolutionsCTA**

`src/components/solutions/SolutionsCTA.tsx` — SolutionsCTA already has `relative overflow-hidden`. Replace the existing decorative blob div (the `div.absolute.inset-0.opacity-10` containing a single blur circle) with a gray top overlay + `CircleBackground variant="dark"`. Also add `z-10` to the container.

```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'

// section stays the same: className="gradient-primary py-20 relative overflow-hidden"
// Replace the existing:
//   <div className="absolute inset-0 opacity-10">
//     <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-secondary blur-3xl" />
//   </div>
// with:
<div
  className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
  aria-hidden="true"
  style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '0 0 0 60px' }}
/>
<CircleBackground variant="dark" />

// Change the container from:
//   <div className="container mx-auto px-4 relative">
// to:
<div className="container mx-auto px-4 relative z-10">
```

- [ ] **Step 4: Add SectionScoops to solutions/page.tsx**

`src/app/(frontend)/solutions/page.tsx` — current return:

```tsx
<div className="min-h-screen">
  <SolutionsHero />
  <PlatformArchitecture />
  <DataFlow />
  <SecurityCompliance />
  <Integrations />
  <SolutionsCTA />
</div>
```

Replace with (add SectionScoop import and BG_ constants at top of file):

```tsx
import { SectionScoop } from "@/components/ui/SectionScoop"

const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 91%)'

// return:
<div className="min-h-screen">
  <SolutionsHero />
  {/* SolutionsHero bottom overlay handles the gradient→white transition — no scoop here */}
  <PlatformArchitecture />
  <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
  <DataFlow />
  <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
  <SecurityCompliance />
  <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
  <Integrations />
  {/* SolutionsCTA top overlay handles the gray→gradient transition — no scoop here */}
  <SolutionsCTA />
</div>
```

Note: `solutions/page.tsx` is not async and has no data fetching, so `BG_WHITE`/`BG_GRAY` go as module-level constants (outside the component function).

- [ ] **Step 5: Visual verification**

Navigate to `http://localhost:3000/solutions`. Confirm:
- SolutionsHero (dark gradient) curves smoothly into PlatformArchitecture (white) at the bottom
- Four curved scoops appear between the alternating white/gray sections
- SolutionsCTA (dark gradient) curves smoothly from the gray Integrations section above

- [ ] **Step 6: Commit**

```bash
git add src/components/solutions/ src/app/(frontend)/solutions/page.tsx
git commit -m "feat: apply circular design to Solutions page"
```

---

## Task 4: Case Studies page

**Files:**
- Modify: `src/components/case-studies/CaseStudiesHero.tsx`
- Modify: `src/components/case-studies/LogoWall.tsx`
- Modify: `src/components/case-studies/ImpactGrid.tsx`
- Modify: `src/components/case-studies/DifferentiatorBanner.tsx`
- Modify: `src/components/case-studies/VoiceOfCustomer.tsx`
- Modify: `src/components/case-studies/CaseStudiesCTA.tsx`
- Modify: `src/app/(frontend)/case-studies/page.tsx`

- [ ] **Step 1: Apply dark hero treatment to CaseStudiesHero**

`src/components/case-studies/CaseStudiesHero.tsx` — already has `relative overflow-hidden`. The next section is LogoWall (gray), so the bottom overlay uses gray (`hsl(210 20% 91%)`).

Read the file, then add just before the content container div `<div className="container mx-auto px-4 relative">`:

```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'

// After the existing <div className="absolute inset-0"> block, add:
<CircleBackground variant="dark" />
<div
  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
  aria-hidden="true"
  style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '60px 0 0 0' }}
/>
// Update the content container:
<div className="container mx-auto px-4 relative z-10">
```

- [ ] **Step 2: Normalize and apply standard treatment to LogoWall and VoiceOfCustomer**

`src/components/case-studies/LogoWall.tsx`:
- Change `bg-muted/40` → `section-gray` on the section
- Apply standard treatment (CircleBackground import + relative overflow-hidden + CircleBackground child + relative z-10 on container)

`src/components/case-studies/VoiceOfCustomer.tsx`:
- Change `bg-muted/40` → `section-gray` on the section
- Apply standard treatment

Read each file first to locate the exact className strings.

- [ ] **Step 3: Apply standard treatment to ImpactGrid and CaseStudiesCTA**

For each, apply the **Standard section treatment** from the Conventions section:
- `src/components/case-studies/ImpactGrid.tsx` (section has `bg-background`)
- `src/components/case-studies/CaseStudiesCTA.tsx` (section has `bg-background`, already has `relative overflow-hidden` — just add CircleBackground import + `<CircleBackground />` child + `relative z-10` on container)

Read each file first.

- [ ] **Step 4: Apply mid-page gradient treatment to DifferentiatorBanner**

`src/components/case-studies/DifferentiatorBanner.tsx` — already has `relative overflow-hidden`. Replace the existing decorative blob div with `CircleBackground variant="dark"`. Add `relative z-10` to the container.

```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'

// section stays: className="relative overflow-hidden gradient-primary py-20"
// Replace the existing:
//   <div className="absolute inset-0 opacity-10">
//     <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl" />
//     <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
//   </div>
// with:
<CircleBackground variant="dark" />

// Update the container:
// from: <div className="container mx-auto px-4 relative">
// to:   <div className="container mx-auto px-4 relative z-10">
```

- [ ] **Step 5: Add SectionScoops to case-studies/page.tsx**

`src/app/(frontend)/case-studies/page.tsx` — current return:

```tsx
<main className="min-h-screen">
  <CaseStudiesHero />
  <LogoWall agribusinessLogos={agribusinessLogos} bankLogos={bankLogos} />
  <ImpactGrid stories={stories} />
  <DifferentiatorBanner />
  <VoiceOfCustomer quotes={quotes} />
  <CaseStudiesCTA />
</main>
```

Replace with:

```tsx
import { SectionScoop } from "@/components/ui/SectionScoop"

const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 91%)'

// return:
<main className="min-h-screen">
  <CaseStudiesHero />
  {/* CaseStudiesHero bottom overlay handles the dark→gray transition */}
  <LogoWall agribusinessLogos={agribusinessLogos} bankLogos={bankLogos} />
  <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
  <ImpactGrid stories={stories} />
  {/* No scoop around DifferentiatorBanner — it's a mid-page gradient */}
  <DifferentiatorBanner />
  <VoiceOfCustomer quotes={quotes} />
  <SectionScoop direction="left" fromBg={BG_GRAY} nextBg={BG_WHITE} />
  <CaseStudiesCTA />
</main>
```

The `BG_WHITE`/`BG_GRAY` constants go inside `CaseStudiesPage` (the async function), before the return statement. The `SectionScoop` import goes at the top.

- [ ] **Step 6: Visual verification**

Navigate to `http://localhost:3000/case-studies`. Confirm:
- CaseStudiesHero (dark image) curves smoothly into LogoWall (gray) at the bottom
- Two scoops appear: LogoWall→ImpactGrid and VoiceOfCustomer→CaseStudiesCTA
- DifferentiatorBanner (dark gradient) flows without scoops but has the blob animation inside

- [ ] **Step 7: Commit**

```bash
git add src/components/case-studies/ src/app/(frontend)/case-studies/page.tsx
git commit -m "feat: apply circular design to Case Studies page"
```

---

## Task 5: Contact page

**Files:**
- Modify: `src/components/contact/ContactHero.tsx`
- Modify: `src/components/contact/ContactForm.tsx`

No changes needed to `src/app/(frontend)/contact/page.tsx` — the hero handles its own transition via the bottom overlay.

- [ ] **Step 1: Apply dark hero treatment to ContactHero**

`src/components/contact/ContactHero.tsx` — currently has `relative` but missing `overflow-hidden`. The next section is ContactForm (white), so bottom overlay uses white.

```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'

// Update section: add overflow-hidden
<section
  className="relative overflow-hidden py-32 md:py-48 bg-cover bg-center bg-no-repeat"
  style={{ backgroundImage: "url('/steps/Optimize.png')" }}
>
  <div className="absolute inset-0 bg-black/50" />
  <CircleBackground variant="dark" />
  <div
    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
    aria-hidden="true"
    style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '60px 0 0 0' }}
  />
  <div className="relative z-10 container mx-auto px-4 text-center">
    {/* existing content unchanged */}
  </div>
</section>
```

- [ ] **Step 2: Apply standard treatment to ContactForm**

`src/components/contact/ContactForm.tsx` — apply the **Standard section treatment** (CircleBackground import + `relative overflow-hidden` on section + `<CircleBackground />` first child + `relative z-10` on container). Read the file first.

- [ ] **Step 3: Visual verification**

Navigate to `http://localhost:3000/contact`. Confirm:
- ContactHero (dark image) curves smoothly into ContactForm (white) at the bottom
- Blob animations visible behind the contact form

- [ ] **Step 4: Commit**

```bash
git add src/components/contact/ContactHero.tsx src/components/contact/ContactForm.tsx
git commit -m "feat: apply circular design to Contact page"
```

---

## Task 6: Sectors page

**Files:**
- Modify: `src/components/sectors/SectorsHero.tsx`
- Modify: `src/components/sectors/SectorCards.tsx`
- Modify: `src/components/sectors/ValueChainBlock.tsx`
- Modify: `src/components/sectors/SectorsFAQ.tsx`

No changes needed to `src/app/(frontend)/sectors/page.tsx` — all transitions are handled via internal overlays.

- [ ] **Step 1: Apply dark hero treatment to SectorsHero**

`src/components/sectors/SectorsHero.tsx` — already has `relative overflow-hidden`. Replace the existing decorative blob div with `CircleBackground variant="dark"`. Add white bottom overlay (next section SectorCards is white). Add `relative z-10` to content container.

Find and replace in the component JSX:
```tsx
// Remove this entire block:
{/* Decorative blobs */}
<div className="absolute inset-0 opacity-10" aria-hidden="true">
  <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-secondary blur-3xl" />
  <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
</div>

// Add these in its place (after the sector images div, before the dot grid div):
<CircleBackground variant="dark" />
<div
  className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
  aria-hidden="true"
  style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '60px 0 0 0' }}
/>
```

Also:
- Add `import { CircleBackground } from '@/components/ui/CircleBackground'` at the top
- Change `<div className="container mx-auto px-4 relative">` → `<div className="container mx-auto px-4 relative z-10">`

- [ ] **Step 2: Apply standard treatment to SectorCards and SectorsFAQ**

For each, apply the **Standard section treatment**:
- `src/components/sectors/SectorCards.tsx` (section has `bg-background`)
- `src/components/sectors/SectorsFAQ.tsx` (section has `section-gray`)

Read each file first, then add CircleBackground import + relative overflow-hidden + CircleBackground child + relative z-10 on container.

- [ ] **Step 3: Apply double-overlay gradient treatment to ValueChainBlock**

`src/components/sectors/ValueChainBlock.tsx` — currently has no `relative` or `overflow-hidden`. Apply the double-overlay pattern (white top, gray bottom) from the Conventions section:

```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'

const ValueChainBlock = () => (
  <section
    className="gradient-primary py-16 relative overflow-hidden"
    aria-label="Value chains supported by eProd"
  >
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-16 z-1"
      aria-hidden="true"
      style={{ backgroundColor: 'hsl(0 0% 100%)', borderRadius: '0 0 0 60px' }}
    />
    <CircleBackground variant="dark" />
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-16 z-1"
      aria-hidden="true"
      style={{ backgroundColor: 'hsl(210 20% 91%)', borderRadius: '60px 0 0 0' }}
    />
    <div className="container mx-auto px-4 text-center relative z-10">
      <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-4">Platform Reach</p>
      <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
        Value Chains Supported
      </h2>
      <p className="text-primary-foreground/80 mb-8 text-lg max-w-2xl mx-auto leading-relaxed">
        Coffee, Cocoa, Tea, Horticulture, Dairy, Seeds, Grains, Pulses, Spices, Nuts,
        Apiculture, Oil &amp; Tree Crops, Pisciculture, Poultry, and more.
      </p>
      <div
        className="flex flex-wrap justify-center gap-3"
        role="list"
        aria-label="Supported value chains"
      >
        {chains.map((chain) => (
          <span
            key={chain}
            role="listitem"
            className="px-4 py-2 rounded-full border border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground text-sm font-medium backdrop-blur"
          >
            {chain}
          </span>
        ))}
      </div>
    </div>
  </section>
)
```

- [ ] **Step 4: Visual verification**

Navigate to `http://localhost:3000/sectors`. Confirm:
- SectorsHero (dark image) curves smoothly into SectorCards (white)
- ValueChainBlock (dark gradient) curves smoothly from SectorCards (white) above AND into SectorsFAQ (gray) below
- Blob animations visible in all four sections

- [ ] **Step 5: Commit**

```bash
git add src/components/sectors/
git commit -m "feat: apply circular design to Sectors page"
```

---

## Task 7: Insights page

**Files:**
- Modify: `src/app/(frontend)/insights/page.tsx`

This page has inline sections in `page.tsx` — no separate component files to modify.

- [ ] **Step 1: Apply treatment to insights/page.tsx**

`src/app/(frontend)/insights/page.tsx` — add CircleBackground and SectionScoop imports, add BG_ constants, update the two inline sections.

Add to imports at top of file:
```tsx
import { CircleBackground } from '@/components/ui/CircleBackground'
import { SectionScoop } from '@/components/ui/SectionScoop'
```

Add constants inside `InsightsPage` (the async function), before the return statement:
```tsx
const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 91%)'
```

Update the return JSX. Change:
```tsx
<main className="min-h-screen">
  <section className="bg-background py-20">
    <div className="container mx-auto max-w-7xl px-4">
```
to:
```tsx
<main className="min-h-screen">
  <section className="bg-background py-20 relative overflow-hidden">
    <CircleBackground />
    <div className="container mx-auto max-w-7xl px-4 relative z-10">
```

Then between the two sections, add:
```tsx
    </section>
    <SectionScoop direction="right" fromBg={BG_WHITE} nextBg={BG_GRAY} />
    <section className="section-gray py-20 relative overflow-hidden">
      <CircleBackground />
      <div className="container mx-auto max-w-7xl px-4 relative z-10">
```

(The second section currently starts with `<section className="section-gray py-20">` and its container is `<div className="container mx-auto max-w-7xl px-4">` — update both.)

- [ ] **Step 2: Visual verification**

Navigate to `http://localhost:3000/insights`. Confirm:
- Curved scoop transition appears between the white hero section and the gray filter/grid section
- Blob animations visible in both sections

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/insights/page.tsx
git commit -m "feat: apply circular design to Insights page"
```

---

## Task 8: Final verification

- [ ] **Step 1: Run the existing test suite**

```bash
npx vitest run --reporter=verbose
```

Expected: all tests pass (no regressions — we only added components and CSS classes, no logic changes).

- [ ] **Step 2: Full site walkthrough**

With the dev server running, visit each page and confirm the circular design is consistent:
- `http://localhost:3000/about`
- `http://localhost:3000/solutions`
- `http://localhost:3000/case-studies`
- `http://localhost:3000/contact`
- `http://localhost:3000/sectors`
- `http://localhost:3000/insights`

Check on each page:
- No layout breaks or content obscured by overlays
- Scoops align correctly with surrounding section colors
- CircleBackground blobs are visible but subtle (not overwhelming)
- Gradient sections transition smoothly without color seams

- [ ] **Step 3: Final commit if any fixes needed**

If any visual issues are found during the walkthrough, fix them and commit:

```bash
git add -p
git commit -m "fix: adjust circular design transitions on inner pages"
```
