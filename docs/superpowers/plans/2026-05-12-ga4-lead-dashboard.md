# GA4 + Lead Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add GA4 event tracking, lead persistence to Payload, and two management pages (lead dashboard + analytics reference) on top of the existing CTA email flow.

**Architecture:** The existing `send-cta-email` route is extended to also save submissions to a new `enquiries` Payload collection after sending the email. GA4 tracking is added via a shared utility (`ga-events.ts`) used by section components and the CTA form. Two new frontend pages (`/dashboard`, `/analytics`) and two API routes (`/api/enquiries`, `/api/enquiries/[id]`) complete the feature.

**Tech Stack:** Next.js 16, Payload 3, TypeScript, Tailwind CSS, `@next/third-parties/google` for GA4

---

## File Map

| File | Action |
|---|---|
| `src/collections/Enquiries.ts` | create — Payload collection definition |
| `src/payload.config.ts` | modify — add Enquiries to collections array |
| `src/app/api/send-cta-email/route.ts` | modify — add Payload save after email send |
| `src/lib/ga-events.ts` | create — typed GA4 event helpers |
| `src/app/(frontend)/layout.tsx` | modify — add GoogleAnalytics component |
| `src/components/CTASection.tsx` | modify — pass sourceSection + fire GA4 on success |
| 11 section components (listed in Task 6) | modify — add `'use client'` + viewPage useEffect |
| `src/app/api/enquiries/route.ts` | create — GET all enquiries |
| `src/app/api/enquiries/[id]/route.ts` | create — PATCH single enquiry |
| `src/app/(frontend)/analytics/page.tsx` | create — static analytics reference page |
| `src/app/(frontend)/dashboard/page.tsx` | create — lead management dashboard |
| `tests/int/enquiries.int.spec.ts` | create — integration tests for Enquiries collection |
| `tests/int/ga-events.int.spec.ts` | create — unit tests for ga-events utility |

---

## Task 1: Install @next/third-parties

**Files:**
- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install the package**

```
pnpm add @next/third-parties
```

Expected: package added, `pnpm-lock.yaml` updated, no errors.

- [ ] **Step 2: Verify installation**

```
pnpm list @next/third-parties
```

Expected output contains: `@next/third-parties`

- [ ] **Step 3: Commit**

```
git add package.json pnpm-lock.yaml
git commit -m "chore: add @next/third-parties for GA4"
```

---

## Task 2: Create Enquiries collection

**Files:**
- Create: `src/collections/Enquiries.ts`
- Create: `tests/int/enquiries.int.spec.ts`
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Write the failing integration test**

Create `tests/int/enquiries.int.spec.ts`:

```ts
import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Enquiries collection', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('creates an enquiry with default status "new"', async () => {
    const enquiry = await payload.create({
      collection: 'enquiries',
      data: {
        company: 'Test Agri Corp',
        email: 'test@example.com',
        challenge: 'efficiency',
        sourceSection: 'home_cta',
      },
    })
    expect(enquiry.company).toBe('Test Agri Corp')
    expect(enquiry.email).toBe('test@example.com')
    expect(enquiry.challenge).toBe('efficiency')
    expect(enquiry.status).toBe('new')
    expect(enquiry.createdAt).toBeDefined()
  })

  it('can update enquiry status to "contacted"', async () => {
    const created = await payload.create({
      collection: 'enquiries',
      data: {
        company: 'Update Corp',
        email: 'update@example.com',
        challenge: 'compliance',
      },
    })
    const updated = await payload.update({
      collection: 'enquiries',
      id: created.id,
      data: { status: 'contacted' },
      overrideAccess: true,
    })
    expect(updated.status).toBe('contacted')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```
pnpm test:int
```

Expected: FAIL with `collection "enquiries" not found` or similar.

- [ ] **Step 3: Create the Enquiries collection**

Create `src/collections/Enquiries.ts`:

```ts
import type { CollectionConfig } from 'payload'

export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  labels: { singular: 'Enquiry', plural: 'Enquiries' },
  admin: {
    useAsTitle: 'company',
    defaultColumns: ['company', 'email', 'challenge', 'status', 'createdAt'],
  },
  access: {
    create: () => true,
    read: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  fields: [
    {
      name: 'company',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'challenge',
      type: 'text',
      required: true,
    },
    {
      name: 'sourceSection',
      type: 'text',
      label: 'Source Section',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Qualified', value: 'qualified' },
        { label: 'Won', value: 'won' },
        { label: 'Lost', value: 'lost' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
    },
  ],
}
```

- [ ] **Step 4: Register Enquiries in payload.config.ts**

In `src/payload.config.ts`, add the import at the top with the other collection imports:

```ts
import { Enquiries } from './collections/Enquiries'
```

Then add `Enquiries` to the `collections` array:

```ts
collections: [Users, Media, Articles, CaseStudies, TeamPages, Team, CTAConfig, Popups, Categories, Enquiries],
```

- [ ] **Step 5: Regenerate Payload types**

```
pnpm payload generate:types
```

Expected: `src/payload-types.ts` updated with `Enquiry` type, no errors.

- [ ] **Step 6: Run test — verify it passes**

```
pnpm test:int
```

Expected: all tests PASS.

- [ ] **Step 7: Commit**

```
git add src/collections/Enquiries.ts src/payload.config.ts src/payload-types.ts tests/int/enquiries.int.spec.ts
git commit -m "feat: add Enquiries Payload collection"
```

---

## Task 3: Modify send-cta-email route to persist leads

**Files:**
- Modify: `src/app/api/send-cta-email/route.ts`

- [ ] **Step 1: Replace the route with the updated version**

The full updated `src/app/api/send-cta-email/route.ts`:

```ts
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'cta-config',
      limit: 1,
    })

    if (!docs?.length) {
      return NextResponse.json({ error: 'CTA config not found' }, { status: 500 })
    }

    const config = docs[0]
    const { to, subject, body: emailBody } = config.email

    let content = JSON.stringify(emailBody)
    content = content.replace(/{company}/g, body.company)
    content = content.replace(/{email}/g, body.email)
    content = content.replace(/{challenge}/g, body.challenge)

    await payload.sendEmail({ to, subject, html: content })

    try {
      await payload.create({
        collection: 'enquiries',
        data: {
          company: body.company,
          email: body.email,
          challenge: body.challenge,
          sourceSection: body.sourceSection ?? 'unknown',
          status: 'new',
        },
      })
    } catch (saveError) {
      console.error('Failed to save enquiry to Payload:', saveError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```
git add src/app/api/send-cta-email/route.ts
git commit -m "feat: persist CTA submissions to enquiries collection"
```

---

## Task 4: Create GA4 utility

**Files:**
- Create: `src/lib/ga-events.ts`
- Create: `tests/int/ga-events.int.spec.ts`

- [ ] **Step 1: Write the failing unit tests**

Create `tests/int/ga-events.int.spec.ts`:

```ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { gaEvents } from '@/lib/ga-events'

describe('gaEvents', () => {
  beforeEach(() => {
    vi.stubGlobal('gtag', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('viewPage fires page_engagement with provided section', () => {
    gaEvents.viewPage('home_hero', 'hero')
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_engagement', {
      page_name: 'home_hero',
      section: 'hero',
      timestamp: expect.any(String),
    })
  })

  it('viewPage defaults section to "general"', () => {
    gaEvents.viewPage('home_hero')
    expect(window.gtag).toHaveBeenCalledWith('event', 'page_engagement', {
      page_name: 'home_hero',
      section: 'general',
      timestamp: expect.any(String),
    })
  })

  it('formSubmitted fires lead_form_submission with company', () => {
    gaEvents.formSubmitted('cta_form', 'Acme Ltd')
    expect(window.gtag).toHaveBeenCalledWith('event', 'lead_form_submission', {
      form_name: 'cta_form',
      company: 'Acme Ltd',
      timestamp: expect.any(String),
    })
  })

  it('formSubmitted defaults company to "not_provided"', () => {
    gaEvents.formSubmitted('cta_form')
    expect(window.gtag).toHaveBeenCalledWith('event', 'lead_form_submission', {
      form_name: 'cta_form',
      company: 'not_provided',
      timestamp: expect.any(String),
    })
  })

  it('clickCTA fires cta_clicked event', () => {
    gaEvents.clickCTA('Get Started', 'home_cta')
    expect(window.gtag).toHaveBeenCalledWith('event', 'cta_clicked', {
      cta_text: 'Get Started',
      section: 'home_cta',
      target_url: '',
      timestamp: expect.any(String),
    })
  })

  it('does not throw when gtag is unavailable', () => {
    vi.unstubAllGlobals()
    expect(() => gaEvents.viewPage('home', 'hero')).not.toThrow()
    expect(() => gaEvents.formSubmitted('cta_form')).not.toThrow()
    expect(() => gaEvents.clickCTA('Get Started', 'home_cta')).not.toThrow()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```
pnpm test:int
```

Expected: FAIL with `Cannot find module '@/lib/ga-events'`.

- [ ] **Step 3: Create the ga-events utility**

Create `src/lib/ga-events.ts`:

```ts
declare global {
  interface Window {
    gtag?: (command: string, event: string, data?: Record<string, unknown>) => void
  }
}

export const gaEvents = {
  viewPage: (pageName: string, section?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_engagement', {
        page_name: pageName,
        section: section ?? 'general',
        timestamp: new Date().toISOString(),
      })
    }
  },

  clickCTA: (ctaText: string, section: string, targetUrl?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_clicked', {
        cta_text: ctaText,
        section,
        target_url: targetUrl ?? '',
        timestamp: new Date().toISOString(),
      })
    }
  },

  formSubmitted: (formName: string, company?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'lead_form_submission', {
        form_name: formName,
        company: company ?? 'not_provided',
        timestamp: new Date().toISOString(),
      })
    }
  },

  sectionViewed: (sectionName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'section_viewed', {
        section_name: sectionName,
        timestamp: new Date().toISOString(),
      })
    }
  },
}
```

- [ ] **Step 4: Run test — verify it passes**

```
pnpm test:int
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```
git add src/lib/ga-events.ts tests/int/ga-events.int.spec.ts
git commit -m "feat: add GA4 event utility"
```

---

## Task 5: Add GA4 to layout + update CTASection

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`
- Modify: `src/components/CTASection.tsx`

- [ ] **Step 1: Add GoogleAnalytics to layout.tsx**

In `src/app/(frontend)/layout.tsx`, add the import at the top:

```ts
import { GoogleAnalytics } from '@next/third-parties/google'
```

Then inside the `<body>` element, add `<GoogleAnalytics gaId="G-PLACEHOLDER" />` as the last child, just before `</body>`:

```tsx
<body className="min-h-full flex flex-col">
  <Navbar />
  {children}
  <Footer />
  <PopupClient popups={popups} />
  <GoogleAnalytics gaId="G-PLACEHOLDER" />
</body>
```

- [ ] **Step 2: Update CTASection.tsx**

In `src/components/CTASection.tsx`, add the import after the existing `useState` import:

```ts
import { gaEvents } from '@/lib/ga-events'
```

In the `handleSubmit` function, add `sourceSection` to the fetch body and fire the GA4 event on success. Replace the existing fetch call and success block:

```ts
const res = await fetch("/api/send-cta-email", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ ...form, sourceSection: "home_cta" }),
});

if (res.ok) {
  gaEvents.formSubmitted("cta_form", form.company);
  setMessage("Thank you! We'll be in touch soon.");
  setForm({ company: "", email: "", challenge: "" });
} else {
  setMessage("Error sending email. Please try again.");
}
```

- [ ] **Step 3: Commit**

```
git add src/app/(frontend)/layout.tsx src/components/CTASection.tsx
git commit -m "feat: add GA4 script to layout and CTA form submission tracking"
```

---

## Task 6: Add GA4 tracking to 11 section components

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/ProblemSection.tsx`
- Modify: `src/components/SolutionSection.tsx`
- Modify: `src/components/BankPartnershipsSection.tsx`
- Modify: `src/components/ProofSection.tsx`
- Modify: `src/components/HowItWorksSection.tsx`
- Modify: `src/components/TestimonialsSection.tsx`
- Modify: `src/components/DifferentiationSection.tsx`
- Modify: `src/components/FAQSection.tsx`
- Modify: `src/components/about/AboutHero.tsx`
- Modify: `src/components/about/AboutCTA.tsx`

Each component receives the same two changes:
1. Add `'use client'` as the very first line of the file
2. Add `useEffect` import and a mount-time `gaEvents.viewPage(...)` call

The pattern for each (add to top of file and inside the component function):

```ts
// Top of file — add these two lines (before existing imports)
'use client'
import { useEffect } from 'react'
import { gaEvents } from '@/lib/ga-events'

// Inside the component function, before the return statement
useEffect(() => {
  gaEvents.viewPage('<pageName>', '<section>')
}, [])
```

Apply to each component with these pageName/section values:

| File | pageName | section |
|---|---|---|
| `HeroSection.tsx` | `home_hero` | `hero` |
| `ProblemSection.tsx` | `home_problem` | `problem` |
| `SolutionSection.tsx` | `home_solution` | `solution` |
| `BankPartnershipsSection.tsx` | `home_bank_partnerships` | `bank_partnerships` |
| `ProofSection.tsx` | `home_proof` | `proof` |
| `HowItWorksSection.tsx` | `home_how_it_works` | `how_it_works` |
| `TestimonialsSection.tsx` | `home_testimonials` | `testimonials` |
| `DifferentiationSection.tsx` | `home_differentiation` | `differentiation` |
| `FAQSection.tsx` | `home_faq` | `faq` |
| `about/AboutHero.tsx` | `about_hero` | `hero` |
| `about/AboutCTA.tsx` | `about_cta` | `call_to_action` |

- [ ] **Step 1: Add tracking to all 11 components** (follow the pattern above for each file)

- [ ] **Step 2: Commit**

```
git add src/components/HeroSection.tsx src/components/ProblemSection.tsx src/components/SolutionSection.tsx src/components/BankPartnershipsSection.tsx src/components/ProofSection.tsx src/components/HowItWorksSection.tsx src/components/TestimonialsSection.tsx src/components/DifferentiationSection.tsx src/components/FAQSection.tsx src/components/about/AboutHero.tsx src/components/about/AboutCTA.tsx
git commit -m "feat: add GA4 section view tracking to all major sections"
```

---

## Task 7: Create enquiries API routes

**Files:**
- Create: `src/app/api/enquiries/route.ts`
- Create: `src/app/api/enquiries/[id]/route.ts`

- [ ] **Step 1: Create the GET route**

Create `src/app/api/enquiries/route.ts`:

```ts
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(_req: NextRequest) {
  try {
    const payload = await getPayload({ config: payloadConfig })
    const enquiries = await payload.find({
      collection: 'enquiries',
      sort: '-createdAt',
      limit: 1000,
      overrideAccess: true,
    })
    return NextResponse.json(enquiries)
  } catch (error) {
    console.error('Failed to fetch enquiries:', error)
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Create the PATCH route**

Create `src/app/api/enquiries/[id]/route.ts`:

```ts
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const payload = await getPayload({ config: payloadConfig })
    const updated = await payload.update({
      collection: 'enquiries',
      id,
      data: body,
      overrideAccess: true,
    })
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update enquiry:', error)
    return NextResponse.json({ error: 'Failed to update enquiry' }, { status: 500 })
  }
}
```

- [ ] **Step 3: Commit**

```
git add src/app/api/enquiries/route.ts "src/app/api/enquiries/[id]/route.ts"
git commit -m "feat: add enquiries GET and PATCH API routes"
```

---

## Task 8: Create analytics page

**Files:**
- Create: `src/app/(frontend)/analytics/page.tsx`

- [ ] **Step 1: Create the page**

Create `src/app/(frontend)/analytics/page.tsx`:

```tsx
export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Traffic Overview</h2>
          <p className="text-gray-600 mb-4">
            Visit your{' '}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google Analytics Dashboard
            </a>{' '}
            to view:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Page views and sessions</li>
            <li>User engagement by page</li>
            <li>CTA click-through rates</li>
            <li>Time spent on each section</li>
            <li>Traffic sources (organic, direct, referral)</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Events Tracked</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">page_engagement</span>
              <span className="font-mono text-xs">section mounts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">cta_clicked</span>
              <span className="font-mono text-xs">CTA button clicks</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">lead_form_submission</span>
              <span className="font-mono text-xs">CTA form submits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">section_viewed</span>
              <span className="font-mono text-xs">scroll depth</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold mb-3">Setup Remaining</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            Get your Measurement ID from the{' '}
            <a
              href="https://analytics.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              Google Analytics console
            </a>{' '}
            (format: G-XXXXXXXXXX)
          </li>
          <li>
            Replace{' '}
            <code className="bg-white px-1 rounded border text-sm">G-PLACEHOLDER</code> in{' '}
            <code className="bg-white px-1 rounded border text-sm">
              src/app/(frontend)/layout.tsx
            </code>
          </li>
          <li>Set up conversion goals for form submissions in GA4</li>
          <li>Wait 24 hours for data to populate</li>
        </ol>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```
git add "src/app/(frontend)/analytics/page.tsx"
git commit -m "feat: add analytics reference page"
```

---

## Task 9: Create lead dashboard page

**Files:**
- Create: `src/app/(frontend)/dashboard/page.tsx`

- [ ] **Step 1: Create the dashboard page**

Create `src/app/(frontend)/dashboard/page.tsx`:

```tsx
'use client'
import { useState, useEffect } from 'react'

interface Enquiry {
  id: string
  company: string
  email: string
  challenge: string
  status: 'new' | 'contacted' | 'qualified' | 'won' | 'lost'
  sourceSection: string
  notes: string
  createdAt: string
}

const STATUS_FILTERS = ['all', 'new', 'contacted', 'qualified', 'won', 'lost'] as const
type Filter = (typeof STATUS_FILTERS)[number]

const STATUS_STYLES: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-gray-100 text-gray-800',
  qualified: 'bg-yellow-100 text-yellow-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
}

export default function LeadDashboard() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Enquiry | null>(null)

  useEffect(() => {
    fetch('/api/enquiries')
      .then((r) => r.json())
      .then((data) => setEnquiries(data.docs ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: status as Enquiry['status'] } : e))
      )
      setSelected((prev) => (prev?.id === id ? { ...prev, status: status as Enquiry['status'] } : prev))
    }
  }

  const filtered = filter === 'all' ? enquiries : enquiries.filter((e) => e.status === filter)
  const stats = {
    total: enquiries.length,
    new: enquiries.filter((e) => e.status === 'new').length,
    qualified: enquiries.filter((e) => e.status === 'qualified').length,
    won: enquiries.filter((e) => e.status === 'won').length,
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Lead Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm">New</p>
          <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-gray-600 text-sm">Qualified</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.qualified}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-sm">Won</p>
          <p className="text-3xl font-bold text-green-600">{stats.won}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition capitalize ${
              filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-600 py-12">Loading enquiries...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-600 py-12">No enquiries found</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold">Company</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Challenge</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-left px-4 py-3 font-semibold">Date</th>
                <th className="text-left px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((enquiry) => (
                <tr key={enquiry.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{enquiry.company}</td>
                  <td className="px-4 py-3">
                    <a href={`mailto:${enquiry.email}`} className="text-primary underline">
                      {enquiry.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 capitalize">{enquiry.challenge}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[enquiry.status] ?? 'bg-gray-100 text-gray-800'}`}
                    >
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(enquiry)}
                      className="text-primary hover:underline text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{selected.company}</h2>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</p>
                <a href={`mailto:${selected.email}`} className="text-primary underline">
                  {selected.email}
                </a>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Challenge</p>
                <p className="capitalize">{selected.challenge}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Source</p>
                <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded inline-block">
                  {selected.sourceSection || '—'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date</p>
                <p>{new Date(selected.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="border-t pt-6 mb-6">
              <p className="text-sm font-medium mb-3">Update Status</p>
              <div className="flex gap-2 flex-wrap">
                {(['new', 'contacted', 'qualified', 'won', 'lost'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateStatus(selected.id, status)}
                    className={`px-4 py-2 rounded text-sm capitalize transition ${
                      selected.status === status
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelected(null)}
              className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```
git add "src/app/(frontend)/dashboard/page.tsx"
git commit -m "feat: add lead management dashboard"
```

---

## Done

After all tasks, verify end-to-end manually:

1. Run `pnpm dev`
2. Submit the CTA form at `/#cta` — check Payload admin at `/admin/collections/enquiries` for the new entry
3. Visit `/dashboard` — confirm the submission appears and status updates work
4. Visit `/analytics` — confirm the page renders with setup instructions
5. Open browser DevTools → Console → verify no errors; check Network tab for `gtag` calls after submitting the form

Replace `G-PLACEHOLDER` in `layout.tsx` with your real GA4 Measurement ID when ready.
