# Case Studies Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current CMS-driven listing+detail case studies with a single marketing page matching the `eprod-launchpad` design, keeping all content editable via Payload CMS.

**Architecture:** The `/case-studies` route becomes a single server component that fetches from three Payload sources — the `case-studies` collection, the `LogoWall` global, and the `VoiceOfCustomer` global — then passes data to six presentational components. `ImpactGrid` is the only client component (needs `useState` for the category filter). Detail pages are deleted entirely.

**Tech Stack:** Next.js 16, Payload 3.81, SQLite, TypeScript, Tailwind CSS v4, lucide-react

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/collections/CaseStudies.ts` | Simplified schema (drop blocks, add flat fields) |
| Create | `src/globals/LogoWall.ts` | Logo wall global config |
| Create | `src/globals/VoiceOfCustomer.ts` | Testimonials global config |
| Modify | `src/payload.config.ts` | Register globals |
| Rewrite | `src/seed/case-studies.ts` | Seed images + 3 case studies + 2 globals |
| Delete | `src/app/(frontend)/case-studies/[slug]/` | Detail pages removed |
| Rewrite | `src/app/(frontend)/case-studies/page.tsx` | Single marketing page, fetches all data |
| Create | `src/components/case-studies/CaseStudiesHero.tsx` | Static hero with bg image + 3 stat pills |
| Create | `src/components/case-studies/LogoWall.tsx` | Receives logo arrays from global |
| Create | `src/components/case-studies/ImpactGrid.tsx` | Client component, filterable card grid |
| Create | `src/components/case-studies/DifferentiatorBanner.tsx` | Static 3-column marketing banner |
| Create | `src/components/case-studies/VoiceOfCustomer.tsx` | Receives quotes array from global |
| Create | `src/components/case-studies/CaseStudiesCTA.tsx` | Static CTA section |

---

## Task 1: Copy seed images to public folder

**Files:**
- Create: `public/seed-images/case-hero.jpg`
- Create: `public/seed-images/case-poultry.jpg`
- Create: `public/seed-images/case-coffee.jpg`
- Create: `public/seed-images/case-dairy.jpg`

- [ ] **Step 1: Copy images from the cloned launchpad**

```bash
mkdir -p public/seed-images
cp /tmp/eprod-launchpad/src/assets/case-hero.jpg public/seed-images/
cp /tmp/eprod-launchpad/src/assets/case-poultry.jpg public/seed-images/
cp /tmp/eprod-launchpad/src/assets/case-coffee.jpg public/seed-images/
cp /tmp/eprod-launchpad/src/assets/case-dairy.jpg public/seed-images/
```

Expected: 4 files in `public/seed-images/`

- [ ] **Step 2: Commit**

```bash
git add public/seed-images/
git commit -m "chore: add seed images for case studies"
```

---

## Task 2: Rewrite `CaseStudies` collection

**Files:**
- Modify: `src/collections/CaseStudies.ts`

- [ ] **Step 1: Replace the entire file content**

```typescript
import { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'client', 'tag'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'client',
      type: 'text',
      admin: { description: 'e.g. "Novos Horizontes — Poultry Sector"' },
    },
    {
      name: 'tag',
      type: 'select',
      options: [
        { label: 'Financial Inclusion', value: 'Financial Inclusion' },
        { label: 'EUDR Traceability', value: 'EUDR Traceability' },
        { label: 'Operational Efficiency', value: 'Operational Efficiency' },
      ],
      admin: { description: 'Category shown in the filter bar' },
    },
    {
      name: 'headline',
      type: 'text',
      admin: { description: 'Bold card headline, e.g. "Unlocking $2M in Input Financing..."' },
    },
    {
      name: 'situation',
      type: 'textarea',
      admin: { description: 'Challenge — what problem did the client face?' },
    },
    {
      name: 'action',
      type: 'textarea',
      admin: { description: 'Solution — what did eProd implement?' },
    },
    {
      name: 'result',
      type: 'textarea',
      admin: { description: 'Impact — measurable outcome' },
    },
    {
      name: 'ctaLabel',
      type: 'text',
      defaultValue: 'Read Full Case Study',
    },
    {
      name: 'hasVideo',
      type: 'checkbox',
      defaultValue: false,
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/collections/CaseStudies.ts
git commit -m "feat: simplify CaseStudies collection schema for marketing page"
```

---

## Task 3: Create `LogoWall` global

**Files:**
- Create: `src/globals/LogoWall.ts`

- [ ] **Step 1: Create the file**

```typescript
import { GlobalConfig } from 'payload'

export const LogoWall: GlobalConfig = {
  slug: 'logo-wall',
  admin: {
    group: 'Case Studies Page',
  },
  fields: [
    {
      name: 'agribusinessLogos',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
      ],
    },
    {
      name: 'bankLogos',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
      ],
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/globals/LogoWall.ts
git commit -m "feat: add LogoWall global"
```

---

## Task 4: Create `VoiceOfCustomer` global

**Files:**
- Create: `src/globals/VoiceOfCustomer.ts`

- [ ] **Step 1: Create the file**

```typescript
import { GlobalConfig } from 'payload'

export const VoiceOfCustomer: GlobalConfig = {
  slug: 'voice-of-customer',
  admin: {
    group: 'Case Studies Page',
  },
  fields: [
    {
      name: 'quotes',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'role', type: 'text', required: true },
        { name: 'tag', type: 'text', required: true, admin: { description: 'e.g. "Bank Partner", "Agribusiness CEO"' } },
      ],
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/globals/VoiceOfCustomer.ts
git commit -m "feat: add VoiceOfCustomer global"
```

---

## Task 5: Register globals in `payload.config.ts`

**Files:**
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Add imports at the top of the file (after existing imports)**

Add these two lines after the existing collection imports:

```typescript
import { LogoWall } from './globals/LogoWall'
import { VoiceOfCustomer } from './globals/VoiceOfCustomer'
```

- [ ] **Step 2: Add `globals` array to the `buildConfig` call**

Inside `buildConfig({...})`, add a `globals` property after `collections`:

```typescript
globals: [LogoWall, VoiceOfCustomer],
```

The relevant section of `payload.config.ts` should look like:

```typescript
  collections: [Users, Media, Articles, CaseStudies, TeamPages, Team, CTAConfig, Popups],
  globals: [LogoWall, VoiceOfCustomer],
```

- [ ] **Step 3: Commit**

```bash
git add src/payload.config.ts
git commit -m "feat: register LogoWall and VoiceOfCustomer globals"
```

---

## Task 6: Regenerate Payload types and importmap

**Files:**
- Modify: `src/payload-types.ts` (auto-generated)
- Modify: `src/app/(payload)/admin/importMap.js` (auto-generated)

- [ ] **Step 1: Generate types**

```bash
pnpm generate:types
```

Expected: `src/payload-types.ts` updated with `CaseStudy`, `LogoWall`, `VoiceOfCustomer` types.

- [ ] **Step 2: Generate importmap**

```bash
pnpm generate:importmap
```

Expected: `src/app/(payload)/admin/importMap.js` updated.

- [ ] **Step 3: Commit generated files**

```bash
git add src/payload-types.ts src/app/(payload)/admin/importMap.js
git commit -m "chore: regenerate payload types and importmap"
```

---

## Task 7: Rewrite seed script

**Files:**
- Rewrite: `src/seed/case-studies.ts`

- [ ] **Step 1: Replace the entire file**

```typescript
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import payloadConfig from '../payload.config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMAGES_DIR = path.resolve(__dirname, '../../public/seed-images')

async function uploadImage(payload: Awaited<ReturnType<typeof getPayload>>, filename: string, alt: string) {
  const filePath = path.join(IMAGES_DIR, filename)
  const data = fs.readFileSync(filePath)
  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/jpeg', name: filename, size: data.length },
  })
  console.log(`  ✓ Uploaded ${filename} → id ${doc.id}`)
  return doc.id
}

async function seed() {
  const payload = await getPayload({ config: payloadConfig })

  console.log('\n── Uploading images ──')
  const heroId = await uploadImage(payload, 'case-hero.jpg', 'African agricultural landscape showing thriving farms')
  const poultryId = await uploadImage(payload, 'case-poultry.jpg', 'Poultry farm managed via eProd')
  const coffeeId = await uploadImage(payload, 'case-coffee.jpg', 'Coffee cooperative using eProd for EUDR compliance')
  const dairyId = await uploadImage(payload, 'case-dairy.jpg', 'Dairy operation scaled with eProd platform')

  console.log('\n── Seeding case studies ──')
  const studies = [
    {
      title: 'Unlocking $2M in Input Financing for 5,000 Poultry Farmers',
      coverImage: poultryId,
      client: 'Novos Horizontes — Poultry Sector',
      tag: 'Financial Inclusion',
      headline: 'Unlocking $2M in Input Financing for 5,000 Poultry Farmers',
      situation:
        'A major poultry aggregator struggled with high feed costs and poor feed conversion ratios (FCR) among its outgrower network, limiting their ability to secure bank financing.',
      action:
        "Implementing eProd's mobile ERP provided real-time tracking of FCR and mortality rates, creating a verifiable data trail.",
      result:
        'The transparent data de-risked the portfolio, allowing a partner bank to extend $2M in low-interest input financing, boosting overall production by 35%.',
      ctaLabel: 'Read Full Case Study',
      hasVideo: false,
    },
    {
      title: 'Achieving 100% EUDR Compliance Ahead of the 2026 Deadline',
      coverImage: coffeeId,
      client: 'Nyamirima — Coffee Sector',
      tag: 'EUDR Traceability',
      headline: 'Achieving 100% EUDR Compliance Ahead of the 2026 Deadline',
      situation:
        'A coffee exporting cooperative faced the threat of losing access to European markets due to an inability to prove zero-deforestation across its complex, multi-tiered supply chain.',
      action:
        "eProd's offline-first mobile app was deployed to map 1,000+ individual farm plots via GPS polygons, seamlessly integrating with the core ERP.",
      result:
        'The exporter achieved full, automated EUDR reporting compliance 18 months ahead of the deadline, securing long-term European contracts and a premium price point.',
      ctaLabel: 'Watch Video Interview',
      hasVideo: true,
    },
    {
      title: 'Scaling from 2,000 to 15,000 Farmers with Zero Added Overhead',
      coverImage: dairyId,
      client: 'Billys — Dairy Sector',
      tag: 'Operational Efficiency',
      headline: 'Scaling from 2,000 to 15,000 Farmers with Zero Added Overhead',
      situation:
        'A rapidly growing dairy company was drowning in spreadsheet management, leading to delayed farmer payments, high error rates, and an inability to scale operations efficiently.',
      action:
        "Transitioning to eProd's centralized platform automated milk collection data, quality testing, and mobile money payment integrations.",
      result:
        'The company scaled its farmer network by 750% without hiring additional administrative staff, while reducing payment processing time from 14 days to 24 hours.',
      ctaLabel: 'Download PDF Report',
      hasVideo: false,
    },
  ]

  for (const study of studies) {
    const existing = await payload.find({
      collection: 'case-studies',
      where: { title: { equals: study.title } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`  ↳ Skipping "${study.title}" (already exists)`)
      continue
    }
    await payload.create({ collection: 'case-studies', data: study as any })
    console.log(`  ✓ Created "${study.title}"`)
  }

  console.log('\n── Seeding LogoWall global ──')
  await payload.updateGlobal({
    slug: 'logo-wall',
    data: {
      agribusinessLogos: [
        { name: 'Miyonga Fresh Greens' },
        { name: 'Swahili Honey' },
        { name: 'Novos Horizontes' },
        { name: 'Billys Dairy' },
        { name: 'Nyamirima Coffee' },
        { name: 'Soy Bean Co-op' },
      ],
      bankLogos: [
        { name: 'I&M Bank' },
        { name: 'NCBA' },
        { name: 'Equity Bank' },
        { name: 'Rabobank' },
        { name: 'Mastercard' },
      ],
    },
  })
  console.log('  ✓ LogoWall global updated')

  console.log('\n── Seeding VoiceOfCustomer global ──')
  await payload.updateGlobal({
    slug: 'voice-of-customer',
    data: {
      quotes: [
        {
          quote:
            'eProd provides the data integrity and transparency we need to confidently deploy capital into agricultural value chains that were previously considered too risky.',
          name: 'Head of Agribusiness',
          role: 'Partner Bank',
          tag: 'Bank Partner',
        },
        {
          quote:
            'The platform didn\'t just digitize our operations; it completely changed our relationship with our buyers in Europe. We now sell traceability as a premium feature.',
          name: 'CEO',
          role: 'Nut Exporter',
          tag: 'Agribusiness CEO',
        },
        {
          quote:
            'Our farmers are paid faster and more accurately than ever before. eProd has built immense trust within our network.',
          name: 'Chairman',
          role: 'Dairy Cooperative',
          tag: 'Cooperative Leader',
        },
      ],
    },
  })
  console.log('  ✓ VoiceOfCustomer global updated')

  console.log('\nDone.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Commit**

```bash
git add src/seed/case-studies.ts
git commit -m "feat: rewrite seed script for new case studies schema and globals"
```

---

## Task 8: Run the seed

- [ ] **Step 1: Run the seed script**

```bash
pnpm tsx src/seed/case-studies.ts
```

Expected output:
```
── Uploading images ──
  ✓ Uploaded case-hero.jpg → id 1
  ✓ Uploaded case-poultry.jpg → id 2
  ✓ Uploaded case-coffee.jpg → id 3
  ✓ Uploaded case-dairy.jpg → id 4

── Seeding case studies ──
  ✓ Created "Unlocking $2M in Input Financing..."
  ✓ Created "Achieving 100% EUDR Compliance..."
  ✓ Created "Scaling from 2,000 to 15,000 Farmers..."

── Seeding LogoWall global ──
  ✓ LogoWall global updated

── Seeding VoiceOfCustomer global ──
  ✓ VoiceOfCustomer global updated

Done.
```

If there is an error about existing records, that is fine — the script skips duplicates. If media upload fails, verify the image files are in `public/seed-images/` and that the dev server is not running (local API does not need a running server).

---

## Task 9: Create `CaseStudiesHero` component

**Files:**
- Create: `src/components/case-studies/CaseStudiesHero.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { ArrowRight, Users, Globe2, Building2 } from 'lucide-react'
import Image from 'next/image'

export function CaseStudiesHero() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0">
        <Image
          src="/seed-images/case-hero.jpg"
          alt="African agricultural landscape showing thriving farms and processing facilities"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 gradient-primary opacity-90" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 mb-6">
            <Building2 size={16} className="text-secondary" />
            <span className="text-sm font-medium text-primary-foreground">Customer Success</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-primary-foreground leading-tight mb-6">
            1 Million+ Farmers. <span className="text-secondary">250+ Clients.</span> 20+ Countries.
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed mb-10 max-w-3xl">
            Leading agribusinesses and financial institutions across Africa trust eProd's enterprise-grade
            AgFinTech platform to digitize supply chains, ensure compliance, and drive sustainable growth.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl">
            {[
              { icon: Building2, label: 'Enterprise Clients', value: '250+' },
              { icon: Users, label: 'Farmers Managed', value: '1M+' },
              { icon: Globe2, label: 'Countries Active', value: '20+' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur px-4 py-3"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={18} className="text-secondary" />
                </div>
                <div>
                  <div className="text-xl font-black text-primary-foreground leading-none">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/70 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <a
            href="#impact-grid"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
          >
            Explore Success Stories
            <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/case-studies/CaseStudiesHero.tsx
git commit -m "feat: add CaseStudiesHero component"
```

---

## Task 10: Create `LogoWall` component

**Files:**
- Create: `src/components/case-studies/LogoWall.tsx`

- [ ] **Step 1: Create the file**

```tsx
interface LogoEntry {
  name: string
  id?: string | number
}

interface LogoWallProps {
  agribusinessLogos: LogoEntry[]
  bankLogos: LogoEntry[]
}

export function LogoWall({ agribusinessLogos, bankLogos }: LogoWallProps) {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            The Ecosystem We Power
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Trusted by Africa's{' '}
            <span className="gradient-primary-text">Leading Agribusinesses</span> &amp; Financial
            Institutions
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="mb-6">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Grid A</span>
              <h3 className="text-xl font-bold text-foreground mt-2 mb-1">Agribusiness Leaders</h3>
              <p className="text-sm text-muted-foreground">
                Digitalizing complex value chains from seed to export.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {agribusinessLogos.map((logo) => (
                <div
                  key={logo.id ?? logo.name}
                  className="h-20 rounded-lg bg-muted border border-border flex items-center justify-center px-3 text-center hover:border-primary/40 transition"
                >
                  <span className="text-xs font-bold text-muted-foreground">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 border border-border">
            <div className="mb-6">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Grid B</span>
              <h3 className="text-xl font-bold text-foreground mt-2 mb-1">Strategic Financial Partners</h3>
              <p className="text-sm text-muted-foreground">
                De-risking agricultural lending through verifiable data.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {bankLogos.map((logo) => (
                <div
                  key={logo.id ?? logo.name}
                  className="h-20 rounded-lg gradient-primary flex items-center justify-center px-3 text-center"
                >
                  <span className="text-xs font-bold text-primary-foreground">{logo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/case-studies/LogoWall.tsx
git commit -m "feat: add LogoWall component"
```

---

## Task 11: Create `ImpactGrid` component

**Files:**
- Create: `src/components/case-studies/ImpactGrid.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Play } from 'lucide-react'

type Category = 'All' | 'Financial Inclusion' | 'EUDR Traceability' | 'Operational Efficiency'

const FILTERS: Category[] = ['All', 'Financial Inclusion', 'EUDR Traceability', 'Operational Efficiency']

interface MediaDoc {
  url?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
}

export interface CaseStudyCard {
  id: string | number
  title: string
  coverImage?: MediaDoc | number | string | null
  client?: string | null
  tag?: string | null
  headline?: string | null
  situation?: string | null
  action?: string | null
  result?: string | null
  ctaLabel?: string | null
  hasVideo?: boolean | null
}

function getCoverUrl(coverImage: CaseStudyCard['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as MediaDoc).url ?? null
}

interface ImpactGridProps {
  stories: CaseStudyCard[]
}

export function ImpactGrid({ stories }: ImpactGridProps) {
  const [active, setActive] = useState<Category>('All')

  const visible = active === 'All' ? stories : stories.filter((s) => s.tag === active)

  return (
    <section id="impact-grid" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            Success Stories
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
            Measurable Results Across{' '}
            <span className="gradient-primary-text">Every Value Chain</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real outcomes from clients who transformed their operations into bankable, compliant,
            scalable businesses.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                active === f
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {visible.map((story) => {
            const coverUrl = getCoverUrl(story.coverImage)
            return (
              <article
                key={story.id}
                className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-primary/10">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={story.client ?? story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 gradient-primary" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                  {story.hasVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary-foreground/90 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <Play size={24} className="text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  {story.tag && (
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary text-xs font-bold text-secondary-foreground uppercase tracking-wider">
                      {story.tag}
                    </span>
                  )}
                </div>

                <div className="p-7 flex flex-col flex-1">
                  {story.client && (
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      {story.client}
                    </p>
                  )}
                  <h3 className="text-xl font-bold text-foreground leading-snug mb-5">
                    {story.headline ?? story.title}
                  </h3>

                  <dl className="space-y-3 mb-6 flex-1">
                    {[
                      { label: 'Challenge', text: story.situation },
                      { label: 'Solution', text: story.action },
                      { label: 'Impact', text: story.result },
                    ]
                      .filter((row) => row.text)
                      .map((row) => (
                        <div key={row.label} className="border-l-2 border-secondary pl-3">
                          <dt className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                            {row.label}
                          </dt>
                          <dd className="text-sm text-muted-foreground leading-relaxed">{row.text}</dd>
                        </div>
                      ))}
                  </dl>

                  <a
                    href="#cta"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
                  >
                    {story.ctaLabel ?? 'Read Full Case Study'}
                    <ArrowRight size={16} />
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/case-studies/ImpactGrid.tsx
git commit -m "feat: add ImpactGrid client component with category filter"
```

---

## Task 12: Create `DifferentiatorBanner` component

**Files:**
- Create: `src/components/case-studies/DifferentiatorBanner.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { ShieldCheck, TrendingUp, Database } from 'lucide-react'

const items = [
  {
    icon: Database,
    title: 'Verifiable Data Layer',
    text: 'Every transaction timestamped, geo-tagged, and audit-ready — the foundation of trust.',
  },
  {
    icon: ShieldCheck,
    title: 'Regulator-Ready',
    text: 'Built for EUDR, CSDDD, and GlobalGAP out of the box. Compliance isn\'t an add-on.',
  },
  {
    icon: TrendingUp,
    title: 'Capital Unlocked',
    text: 'Compliance data flows directly to partner banks — turning operations into credit scores.',
  },
]

export function DifferentiatorBanner() {
  return (
    <section className="relative overflow-hidden gradient-primary py-20">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            The eProd Difference
          </p>
          <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight mb-5">
            We Don't Just Manage Supply Chains.
            <br />
            <span className="text-secondary">We Make Them Bankable.</span>
          </h2>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Unlike generic agricultural software, eProd is built as an enterprise-grade AgFinTech engine.
            Our platform is uniquely designed to transform operational data into the rigorous, verifiable
            intelligence required by financial institutions and global regulators.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {items.map((item) => (
            <div
              key={item.title}
              className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mb-4">
                <item.icon size={22} className="text-secondary" />
              </div>
              <h3 className="text-lg font-bold text-primary-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-primary-foreground/80 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/case-studies/DifferentiatorBanner.tsx
git commit -m "feat: add DifferentiatorBanner component"
```

---

## Task 13: Create `VoiceOfCustomer` component

**Files:**
- Create: `src/components/case-studies/VoiceOfCustomer.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { Quote } from 'lucide-react'

interface QuoteEntry {
  id?: string | number
  quote: string
  name: string
  role: string
  tag: string
}

interface VoiceOfCustomerProps {
  quotes: QuoteEntry[]
}

export function VoiceOfCustomer({ quotes }: VoiceOfCustomerProps) {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            The Voice of the Customer
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            In Their <span className="gradient-primary-text">Own Words</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {quotes.map((q) => (
            <figure
              key={q.id ?? q.name}
              className="relative bg-card rounded-2xl p-8 border border-border hover:shadow-xl transition flex flex-col"
            >
              <Quote size={32} className="text-secondary mb-4" />
              <blockquote className="text-foreground leading-relaxed mb-6 flex-1 italic">
                "{q.quote}"
              </blockquote>
              <figcaption className="pt-5 border-t border-border">
                <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">
                  {q.tag}
                </div>
                <div className="font-bold text-foreground text-sm">{q.name}</div>
                <div className="text-xs text-muted-foreground">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/case-studies/VoiceOfCustomer.tsx
git commit -m "feat: add VoiceOfCustomer component"
```

---

## Task 14: Create `CaseStudiesCTA` component

**Files:**
- Create: `src/components/case-studies/CaseStudiesCTA.tsx`

- [ ] **Step 1: Create the file**

```tsx
import { ArrowRight, Layers } from 'lucide-react'

export function CaseStudiesCTA() {
  return (
    <section id="cta" className="relative overflow-hidden bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-10 md:p-16 max-w-6xl mx-auto">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-secondary blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight mb-5">
              Ready to Write Your{' '}
              <span className="text-secondary">Own Success Story?</span>
            </h2>
            <p className="text-lg text-primary-foreground/90 leading-relaxed mb-10">
              Stop managing your supply chain in spreadsheets. Start de-risking your operations and
              unlocking your capital today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-secondary px-7 py-3.5 text-base font-semibold text-secondary-foreground hover:brightness-110 transition shadow-lg"
              >
                Request a Custom ROI Assessment
                <ArrowRight size={18} />
              </a>
              <a
                href="/solutions"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-primary-foreground/30 bg-primary-foreground/5 backdrop-blur px-7 py-3.5 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10 transition"
              >
                <Layers size={18} />
                Explore the Platform
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/case-studies/CaseStudiesCTA.tsx
git commit -m "feat: add CaseStudiesCTA component"
```

---

## Task 15: Rewrite the case studies page

**Files:**
- Rewrite: `src/app/(frontend)/case-studies/page.tsx`

- [ ] **Step 1: Replace the entire file**

```tsx
import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { CaseStudiesHero } from '@/components/case-studies/CaseStudiesHero'
import { LogoWall } from '@/components/case-studies/LogoWall'
import { ImpactGrid } from '@/components/case-studies/ImpactGrid'
import { DifferentiatorBanner } from '@/components/case-studies/DifferentiatorBanner'
import { VoiceOfCustomer } from '@/components/case-studies/VoiceOfCustomer'
import { CaseStudiesCTA } from '@/components/case-studies/CaseStudiesCTA'
import type { CaseStudyCard } from '@/components/case-studies/ImpactGrid'

const getData = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })

  const [storiesResult, logoWall, voiceOfCustomer] = await Promise.all([
    payload.find({ collection: 'case-studies', limit: 50, depth: 1 }),
    payload.findGlobal({ slug: 'logo-wall' }),
    payload.findGlobal({ slug: 'voice-of-customer' }),
  ])

  return { storiesResult, logoWall, voiceOfCustomer }
})

export default async function CaseStudiesPage() {
  const { storiesResult, logoWall, voiceOfCustomer } = await getData()

  const stories = storiesResult.docs as unknown as CaseStudyCard[]
  const agribusinessLogos = (logoWall as any).agribusinessLogos ?? []
  const bankLogos = (logoWall as any).bankLogos ?? []
  const quotes = (voiceOfCustomer as any).quotes ?? []

  return (
    <main className="min-h-screen">
      <CaseStudiesHero />
      <LogoWall agribusinessLogos={agribusinessLogos} bankLogos={bankLogos} />
      <ImpactGrid stories={stories} />
      <DifferentiatorBanner />
      <VoiceOfCustomer quotes={quotes} />
      <CaseStudiesCTA />
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(frontend)/case-studies/page.tsx
git commit -m "feat: rewrite case studies page with launchpad design"
```

---

## Task 16: Delete the detail page folder

**Files:**
- Delete: `src/app/(frontend)/case-studies/[slug]/page.tsx` and its parent directory

- [ ] **Step 1: Remove the folder**

```bash
rm -rf "src/app/(frontend)/case-studies/[slug]"
```

- [ ] **Step 2: Commit**

```bash
git add -A src/app/
git commit -m "feat: remove case study detail pages"
```

---

## Task 17: Verify in browser

- [ ] **Step 1: Start the dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Open `http://localhost:3000/case-studies` and verify**

Check:
- Hero section renders with background image and stat pills
- Logo wall shows two grids (agribusiness + bank)
- Impact grid shows 3 cards
- Filter buttons work — clicking "Financial Inclusion" shows only the Novos Horizontes card
- Differentiator banner renders with 3 columns
- Testimonials section shows 3 quotes
- CTA section renders with two buttons
- No 404 errors in the console

- [ ] **Step 3: Open `http://localhost:3000/payload/admin` and verify**

Check:
- Case Studies collection shows new fields (tag, headline, situation, action, result)
- "Case Studies Page" group appears in the sidebar with LogoWall and VoiceOfCustomer globals
- Navigating to `/case-studies/[any-slug]` returns a 404 (detail pages are gone)
