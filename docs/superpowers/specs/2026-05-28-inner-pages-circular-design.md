# Inner Pages Circular Design System — Design Spec

## Goal

Apply the circular design system (SectionScoop transitions + CircleBackground blobs) to all inner pages, matching the visual language established on the homepage.

## Architecture

Two existing primitives handle everything:
- `SectionScoop` (`src/components/ui/SectionScoop.tsx`) — curved section dividers placed in `page.tsx` between white↔gray section transitions
- `CircleBackground` (`src/components/ui/CircleBackground.tsx`) — drifting blob animation placed inside section components

No ring-reveal animations (those are homepage-only). No new primitives needed.

## Tech Stack

Next.js 15 App Router, TypeScript, Tailwind CSS v4. All components are already in the codebase.

---

## Pattern Rules

### Standard sections (white or gray background)

1. Add `relative overflow-hidden` to the `<section>` element
2. Add `<CircleBackground />` as the first child inside `<section>` (variant `"light"` for both white and gray)
3. Add `relative z-10` to the inner container div

### Dark/image heroes (SolutionsHero, CaseStudiesHero, ContactHero, SectorsHero)

Same as above but `variant="dark"`. Because these are full-bleed dark sections, the transition out of them cannot use an external SectionScoop. Instead, add an **internal bottom overlay** — a `pointer-events-none absolute inset-x-0 bottom-0 h-16` div whose `backgroundColor` matches the *next* section's color and `borderRadius` creates the corner cut.

### Closing gradient sections (AboutCTA, SolutionsCTA)

These already use `gradient-primary`. Add `CircleBackground variant="dark"`. Add an **internal top overlay** — same technique as the homepage CTASection — whose `backgroundColor` matches the *preceding* section's color. No external SectionScoop before these sections.

### Mid-page gradient section (DifferentiatorBanner — Case Studies)

Add `CircleBackground variant="dark"`. Skip SectionScoop on both sides.

### Sectors ValueChainBlock (gradient, sandwiched between white and gray)

Add `CircleBackground variant="dark"`. White overlay at top (from SectorCards = white), gray overlay at bottom (into SectorsFAQ = gray).

---

## Background Normalization

These classes are near-transparent overlays that visually match solid colors but break the two-color alternation. Change them:

| Component | Current | Change to |
|---|---|---|
| MeetTheFounders | `bg-muted/30` | `bg-background` |
| CareersSection | `bg-muted/30` | `bg-background` |
| LogoWall (case-studies) | `bg-muted/40` | `section-gray` |
| VoiceOfCustomer (case-studies) | `bg-muted/40` | `section-gray` |

---

## Color Constants

All pages use the same two values (match the homepage constants):

```tsx
const BG_WHITE = 'hsl(0 0% 100%)'
const BG_GRAY  = 'hsl(210 20% 91%)'
```

---

## Pages — Section Maps

### About (`src/app/(frontend)/about/page.tsx`)

7 SectionScoops in `page.tsx`. Internal overlay in AboutCTA (gray top).

| # | Section | Background | Scoop after |
|---|---|---|---|
| 1 | AboutHero | white | → gray (right) |
| 2 | VisionMission | gray | → white (left) |
| 3 | OurStory | white | — |
| 4 | MeetTheFounders | white (normalized) | → gray (right) |
| 5 | AgFintechIdentity | gray | → white (left) |
| 6 | MarketLeadership | white | → gray (right) |
| 7 | BankPartnersAbout | gray | → white (left) |
| 8 | LeadershipTeam | white | — |
| 9 | CareersSection | white (normalized) | → gray (right) |
| 10 | AboutFAQ | gray | — (overlay inside CTA) |
| 11 | AboutCTA | gradient | gray top overlay |

### Solutions (`src/app/(frontend)/solutions/page.tsx`)

4 SectionScoops. Bottom overlay in SolutionsHero (white). Gray top overlay in SolutionsCTA.

| # | Section | Background | Scoop after |
|---|---|---|---|
| 1 | SolutionsHero | gradient (dark) | — (white bottom overlay) |
| 2 | PlatformArchitecture | white | → gray (right) |
| 3 | DataFlow | gray | → white (left) |
| 4 | SecurityCompliance | white | → gray (right) |
| 5 | Integrations | gray | — (overlay inside CTA) |
| 6 | SolutionsCTA | gradient | gray top overlay |

### Case Studies (`src/app/(frontend)/case-studies/page.tsx`)

2 SectionScoops. Bottom overlay in CaseStudiesHero (gray, since LogoWall is gray). No scoops around DifferentiatorBanner.

| # | Section | Background | Scoop after |
|---|---|---|---|
| 1 | CaseStudiesHero | dark image | — (gray bottom overlay) |
| 2 | LogoWall | gray (normalized) | → white (left) |
| 3 | ImpactGrid | white | — |
| 4 | DifferentiatorBanner | gradient | — (skip both sides) |
| 5 | VoiceOfCustomer | gray (normalized) | → white (left) |
| 6 | CaseStudiesCTA | white | — |

### Contact (`src/app/(frontend)/contact/page.tsx`)

0 SectionScoops. White bottom overlay inside ContactHero.

| # | Section | Background |
|---|---|---|
| 1 | ContactHero | dark image (white bottom overlay) |
| 2 | ContactForm | white |

### Sectors (`src/app/(frontend)/sectors/page.tsx`)

0 external SectionScoops. Overlays handle all transitions.

| # | Section | Background | Notes |
|---|---|---|---|
| 1 | SectorsHero | solid teal (dark) | white bottom overlay |
| 2 | SectorCards | white | — |
| 3 | ValueChainBlock | gradient | white top + gray bottom overlays |
| 4 | SectorsFAQ | gray | — |

### Insights (`src/app/(frontend)/insights/page.tsx`)

1 SectionScoop. Both sections are inline in `page.tsx` (no separate component files to modify).

| # | Section | Background | Scoop after |
|---|---|---|---|
| 1 | Hero section | white | → gray (right) |
| 2 | Filter + grid section | gray | — |

### Articles (`src/app/(frontend)/articles/[slug]/page.tsx`)

— Skipped. Reading layout with no section bands; circular design primitives don't apply.

---

## Files Affected

**Modified `page.tsx` files** (add SectionScoop calls + BG_ constants):
- `src/app/(frontend)/about/page.tsx`
- `src/app/(frontend)/solutions/page.tsx`
- `src/app/(frontend)/case-studies/page.tsx`
- `src/app/(frontend)/contact/page.tsx`
- `src/app/(frontend)/sectors/page.tsx`
- `src/app/(frontend)/insights/page.tsx`

**Modified section components** (add relative, CircleBackground, z-10, normalizations, overlays):
- `src/components/about/` — AboutHero, VisionMission, OurStory, MeetTheFounders, AgFintechIdentity, MarketLeadership, BankPartnersAbout, LeadershipTeam, CareersSection, AboutFAQ, AboutCTA
- `src/components/solutions/` — SolutionsHero, PlatformArchitecture, DataFlow, SecurityCompliance, Integrations, SolutionsCTA
- `src/components/case-studies/` — CaseStudiesHero, LogoWall, ImpactGrid, DifferentiatorBanner, VoiceOfCustomer, CaseStudiesCTA
- `src/components/contact/` — ContactHero, ContactForm
- `src/components/sectors/` — SectorsHero, SectorCards, ValueChainBlock, SectorsFAQ

---

## Out of Scope

- Ring-reveal heading animations (homepage only)
- Articles detail page
- Any layout, copy, or functionality changes
