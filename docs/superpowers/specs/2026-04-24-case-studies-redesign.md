# Case Studies Redesign — Design Spec
**Date:** 2026-04-24

## Overview

Replace the current CMS-driven listing + detail page case studies with a single marketing page matching the layout from `github.com/mokay16/eprod-launchpad`. All content remains editable via Payload CMS. Individual detail pages are dropped.

---

## Data Layer

### `case-studies` collection (simplified)

Remove from current schema:
- `slug`
- `publishedAt`
- `excerpt`
- `content` (blocks)

Keep:
- `title`
- `coverImage` (upload → media)
- `client`

Rename / repurpose:
- `industry` → rename to `tag` (used for ImpactGrid category filter)

Add:
- `headline` (text) — bold card headline
- `situation` (textarea) — Challenge
- `action` (textarea) — Solution
- `result` (textarea) — Impact
- `ctaLabel` (text, default: "Read Full Case Study")
- `hasVideo` (checkbox)

### `LogoWall` Global

```
agribusinessLogos: array of { name: text }
bankLogos: array of { name: text }
```

### `VoiceOfCustomer` Global

```
quotes: array of { quote: textarea, name: text, role: text, tag: text }
```

---

## Seed Data

Seed script at `src/seed/case-studies.ts` populates:

**Case studies (3):**
1. Novos Horizontes — Poultry Sector (`tag: Financial Inclusion`)
2. Nyamirima — Coffee Sector (`tag: EUDR Traceability`)
3. Billys — Dairy Sector (`tag: Operational Efficiency`)

**LogoWall Global:**
- Agribusiness: Miyonga Fresh Greens, Swahili Honey, Novos Horizontes, Billys Dairy, Nyamirima Coffee, Soy Bean Co-op
- Banks: I&M Bank, NCBA, Equity Bank, Rabobank, Mastercard

**VoiceOfCustomer Global:**
- 3 quotes sourced from launchpad `VoiceOfCustomer.tsx`

**Images:** `case-hero.jpg`, `case-poultry.jpg`, `case-coffee.jpg`, `case-dairy.jpg` copied from launchpad into `public/seed-images/` and uploaded to Payload media collection during seed.

---

## Frontend

### Deleted
- `src/app/(frontend)/case-studies/[slug]/` — full folder

### Kept
- `src/components/RichTextRenderer.tsx` — kept (used or potentially used elsewhere)

### Rewritten
- `src/app/(frontend)/case-studies/page.tsx` — server component; fetches case studies collection + both globals; renders 6 sections in order

### New components (`src/components/case-studies/`)
| File | Type | Data source |
|---|---|---|
| `CaseStudiesHero.tsx` | Static | None (hardcoded stats + hero image) |
| `LogoWall.tsx` | Dynamic | `LogoWall` Global |
| `ImpactGrid.tsx` | Dynamic + client filter | `case-studies` collection |
| `DifferentiatorBanner.tsx` | Static | None |
| `VoiceOfCustomer.tsx` | Dynamic | `VoiceOfCustomer` Global |
| `CaseStudiesCTA.tsx` | Static | None |

`ImpactGrid.tsx` is a client component (`'use client'`) for the category filter buttons. It receives pre-fetched stories as props. Filter categories: `All`, `Financial Inclusion`, `EUDR Traceability`, `Operational Efficiency`.

---

## What Changes in `payload.config.ts`

- Remove `CaseStudies` collection fields that are dropped (slug, publishedAt, excerpt, content)
- Add new fields to `CaseStudies` collection
- Register `LogoWall` global
- Register `VoiceOfCustomer` global

---

## Constraints / Notes

- Images served via `/api/media/file/...` (Payload media endpoint), consistent with rest of project
- `DifferentiatorBanner` and `CaseStudiesHero` stats (250+ clients, 1M+ farmers, 20+ countries) are hardcoded — no CMS needed for those marketing claims
- The `ImpactGrid` filter bar uses hardcoded category strings that match the `tag` values seeded into the collection
