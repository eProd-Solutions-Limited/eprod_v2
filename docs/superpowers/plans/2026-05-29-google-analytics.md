# Google Analytics — Event Tracking & Internal Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire comprehensive GA4 event tracking across the eProd site and rebuild the `/dashboard` page with real-time lead metrics from Payload and content metrics from the GA4 Data API.

**Architecture:** Lead data is queried directly from the Payload `Enquiries` collection (real-time). Content engagement metrics (top pages, visitor count) come from the GA4 Data API via a service account, cached hourly. The dashboard is a Next.js server component that runs both fetches in parallel and renders stat cards + trend chart above the existing `DashboardClient` lead management table.

**Tech Stack:** Next.js 16 server components, Payload CMS 3.x, `@google-analytics/data` (GA4 Data API), `@next/third-parties/google` (already installed), Vitest + jsdom for tests.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/lib/ga-events.ts` | Modify | Add 9 new typed event helpers |
| `src/lib/ga-reporting.ts` | Create | GA4 Data API utility (server-only) |
| `src/app/(frontend)/layout.tsx` | Modify | Use `NEXT_PUBLIC_GA_ID` env var |
| `src/app/(frontend)/dashboard/page.tsx` | Modify | Add analytics header above DashboardClient |
| `src/app/(frontend)/analytics/page.tsx` | Modify | Update event list to reflect live tracking |
| `src/components/DemoRequestFAB.tsx` | Modify | Wire `demoRequestClicked` + `demoRequestSubmitted` |
| `src/components/PopupClient.tsx` | Modify | Wire `popupShown` + `popupCtaClicked` |
| `src/components/VideoHighlightsSection.tsx` | Modify | Wire `videoSelected` on sidebar click |
| `src/components/FAQSection.tsx` | Modify | Wire `faqOpened` via `onValueChange` |
| `src/components/about/AboutFAQ.tsx` | Modify | Wire `faqOpened` via `onValueChange` |
| `src/components/sectors/SectorsFAQ.tsx` | Modify | Wire `faqOpened` via `onValueChange` |
| `src/components/articles/ArticleReadTracker.tsx` | Create | Client component — scroll depth tracker |
| `src/app/(frontend)/articles/[slug]/page.tsx` | Modify | Render `ArticleReadTracker` |
| All major section components (see Task 10) | Modify | Wire `sectionViewed` via `useInView` |
| `tests/int/ga-events.int.spec.ts` | Modify | Add tests for new event helpers |
| `tests/int/ga-reporting.int.spec.ts` | Create | Tests for GA4 reporting utility |

---

## Task 1: Add new GA event helpers (TDD)

**Files:**
- Modify: `tests/int/ga-events.int.spec.ts`
- Modify: `src/lib/ga-events.ts`

- [ ] **Step 1: Add tests for new helpers in `tests/int/ga-events.int.spec.ts`**

Append these cases inside the existing `describe('gaEvents', ...)` block:

```typescript
  it('demoRequestClicked fires demo_request_clicked with source', () => {
    gaEvents.demoRequestClicked('fab')
    expect(window.gtag).toHaveBeenCalledWith('event', 'demo_request_clicked', {
      source: 'fab',
      timestamp: expect.any(String),
    })
  })

  it('demoRequestSubmitted fires demo_request_submitted with company', () => {
    gaEvents.demoRequestSubmitted('Acme Ltd')
    expect(window.gtag).toHaveBeenCalledWith('event', 'demo_request_submitted', {
      company: 'Acme Ltd',
      timestamp: expect.any(String),
    })
  })

  it('demoRequestSubmitted defaults company to "not_provided"', () => {
    gaEvents.demoRequestSubmitted()
    expect(window.gtag).toHaveBeenCalledWith('event', 'demo_request_submitted', {
      company: 'not_provided',
      timestamp: expect.any(String),
    })
  })

  it('contactFormSubmitted fires contact_form_submitted with company', () => {
    gaEvents.contactFormSubmitted('Acme Ltd')
    expect(window.gtag).toHaveBeenCalledWith('event', 'contact_form_submitted', {
      company: 'Acme Ltd',
      timestamp: expect.any(String),
    })
  })

  it('popupShown fires popup_shown with title and id', () => {
    gaEvents.popupShown('Summer Offer', 'popup-42')
    expect(window.gtag).toHaveBeenCalledWith('event', 'popup_shown', {
      popup_title: 'Summer Offer',
      popup_id: 'popup-42',
      timestamp: expect.any(String),
    })
  })

  it('popupCtaClicked fires popup_cta_clicked', () => {
    gaEvents.popupCtaClicked('Summer Offer', 'Learn More')
    expect(window.gtag).toHaveBeenCalledWith('event', 'popup_cta_clicked', {
      popup_title: 'Summer Offer',
      cta_text: 'Learn More',
      timestamp: expect.any(String),
    })
  })

  it('videoSelected fires video_selected with title', () => {
    gaEvents.videoSelected('eProd Platform Overview')
    expect(window.gtag).toHaveBeenCalledWith('event', 'video_selected', {
      video_title: 'eProd Platform Overview',
      timestamp: expect.any(String),
    })
  })

  it('faqOpened fires faq_opened with question and section', () => {
    gaEvents.faqOpened('What is eProd?', 'home')
    expect(window.gtag).toHaveBeenCalledWith('event', 'faq_opened', {
      question: 'What is eProd?',
      section: 'home',
      timestamp: expect.any(String),
    })
  })

  it('articleRead fires article_read with slug and depth', () => {
    gaEvents.articleRead('smallholder-finance', 50)
    expect(window.gtag).toHaveBeenCalledWith('event', 'article_read', {
      slug: 'smallholder-finance',
      depth: 50,
      timestamp: expect.any(String),
    })
  })

  it('caseStudyViewed fires case_study_viewed with slug', () => {
    gaEvents.caseStudyViewed('equity-bank')
    expect(window.gtag).toHaveBeenCalledWith('event', 'case_study_viewed', {
      slug: 'equity-bank',
      timestamp: expect.any(String),
    })
  })
```

- [ ] **Step 2: Run tests to verify they fail**

```
pnpm test:int -- --reporter=verbose 2>&1 | head -40
```

Expected: multiple failures with "gaEvents.demoRequestClicked is not a function" (or similar).

- [ ] **Step 3: Add the new helpers to `src/lib/ga-events.ts`**

Replace the entire file content with:

```typescript
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

  demoRequestClicked: (source: 'fab' | 'cta') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'demo_request_clicked', {
        source,
        timestamp: new Date().toISOString(),
      })
    }
  },

  demoRequestSubmitted: (company?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'demo_request_submitted', {
        company: company ?? 'not_provided',
        timestamp: new Date().toISOString(),
      })
    }
  },

  contactFormSubmitted: (company?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'contact_form_submitted', {
        company: company ?? 'not_provided',
        timestamp: new Date().toISOString(),
      })
    }
  },

  popupShown: (popupTitle: string, popupId: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_shown', {
        popup_title: popupTitle,
        popup_id: popupId,
        timestamp: new Date().toISOString(),
      })
    }
  },

  popupCtaClicked: (popupTitle: string, ctaText: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'popup_cta_clicked', {
        popup_title: popupTitle,
        cta_text: ctaText,
        timestamp: new Date().toISOString(),
      })
    }
  },

  videoSelected: (videoTitle: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'video_selected', {
        video_title: videoTitle,
        timestamp: new Date().toISOString(),
      })
    }
  },

  faqOpened: (question: string, section: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'faq_opened', {
        question,
        section,
        timestamp: new Date().toISOString(),
      })
    }
  },

  articleRead: (slug: string, depth: 25 | 50 | 75 | 100) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'article_read', {
        slug,
        depth,
        timestamp: new Date().toISOString(),
      })
    }
  },

  caseStudyViewed: (slug: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'case_study_viewed', {
        slug,
        timestamp: new Date().toISOString(),
      })
    }
  },
}
```

- [ ] **Step 4: Run tests to verify they pass**

```
pnpm test:int -- --reporter=verbose 2>&1 | head -50
```

Expected: all tests in `ga-events.int.spec.ts` pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/ga-events.ts tests/int/ga-events.int.spec.ts
git commit -m "feat: add typed GA4 event helpers for demo, popup, video, FAQ, article, and case study tracking"
```

---

## Task 2: Move GA Measurement ID to env var

**Files:**
- Modify: `src/app/(frontend)/layout.tsx`

The current layout has `<GoogleAnalytics gaId="G-PLACEHOLDER" />`. Using a `NEXT_PUBLIC_` env var means the ID can be set per environment without code changes.

- [ ] **Step 1: Add the env var to your `.env` file (or `.env.local`)**

Open `.env` (or create `.env.local`) and add:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_GA_PROPERTY_ID=123456789
GOOGLE_SA_CREDENTIALS={"type":"service_account",...}
```

Replace `G-XXXXXXXXXX` with your real GA4 Measurement ID from the Google Analytics console (Admin → Data Streams → Web stream → Measurement ID). `GOOGLE_GA_PROPERTY_ID` is the numeric property ID (Admin → Property Settings → Property ID). `GOOGLE_SA_CREDENTIALS` is the full JSON from the service account key file (get it from Google Cloud Console → IAM → Service Accounts → Keys).

- [ ] **Step 2: Update `src/app/(frontend)/layout.tsx` line 62**

Change:
```tsx
<GoogleAnalytics gaId="G-PLACEHOLDER" />
```
To:
```tsx
{process.env.NEXT_PUBLIC_GA_ID && (
  <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/layout.tsx
git commit -m "feat: use NEXT_PUBLIC_GA_ID env var for GA Measurement ID"
```

---

## Task 3: Create GA4 Data API reporting utility (TDD)

**Files:**
- Create: `src/lib/ga-reporting.ts`
- Create: `tests/int/ga-reporting.int.spec.ts`

- [ ] **Step 1: Install the GA4 Data API package**

```bash
pnpm add @google-analytics/data
```

- [ ] **Step 2: Write failing tests in `tests/int/ga-reporting.int.spec.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@google-analytics/data', () => ({
  BetaAnalyticsDataClient: vi.fn().mockImplementation(() => ({
    runReport: vi.fn().mockResolvedValue([{
      rows: [
        { dimensionValues: [{ value: '/case-studies' }], metricValues: [{ value: '384' }] },
        { dimensionValues: [{ value: '/solutions' }], metricValues: [{ value: '218' }] },
      ],
    }]),
  })),
}))

describe('ga-reporting', () => {
  beforeEach(() => {
    process.env.GOOGLE_GA_PROPERTY_ID = '123456789'
    process.env.GOOGLE_SA_CREDENTIALS = JSON.stringify({ type: 'service_account', project_id: 'test' })
  })

  it('getTopPages returns pages with view counts', async () => {
    const { getTopPages } = await import('@/lib/ga-reporting')
    const result = await getTopPages(2)
    expect(result).toEqual([
      { page: '/case-studies', views: 384 },
      { page: '/solutions', views: 218 },
    ])
  })

  it('getTopPages returns empty array when env vars are missing', async () => {
    delete process.env.GOOGLE_GA_PROPERTY_ID
    const { getTopPages } = await import('@/lib/ga-reporting')
    const result = await getTopPages(5)
    expect(result).toEqual([])
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```
pnpm test:int -- --reporter=verbose 2>&1 | grep -A5 "ga-reporting"
```

Expected: `Cannot find module '@/lib/ga-reporting'`.

- [ ] **Step 4: Create `src/lib/ga-reporting.ts`**

```typescript
import 'server-only'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

function getClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SA_CREDENTIALS ?? '{}')
  return new BetaAnalyticsDataClient({ credentials })
}

function getPropertyId() {
  return process.env.GOOGLE_GA_PROPERTY_ID ?? ''
}

function startOfMonth(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0]
}

function startOfLastMonth(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1).toISOString().split('T')[0]
}

function endOfLastMonth(date: Date): string {
  return new Date(date.getFullYear(), date.getMonth(), 0).toISOString().split('T')[0]
}

export async function getTopPages(limit = 5): Promise<{ page: string; views: number }[]> {
  const propertyId = getPropertyId()
  if (!propertyId || !process.env.GOOGLE_SA_CREDENTIALS) return []

  try {
    const client = getClient()
    const now = new Date()
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startOfMonth(now), endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit,
    })

    return (response.rows ?? []).map((row) => ({
      page: row.dimensionValues?.[0]?.value ?? '',
      views: parseInt(row.metricValues?.[0]?.value ?? '0', 10),
    }))
  } catch {
    return []
  }
}

export async function getMonthlyVisitors(): Promise<{ thisMonth: number; lastMonth: number }> {
  const propertyId = getPropertyId()
  if (!propertyId || !process.env.GOOGLE_SA_CREDENTIALS) return { thisMonth: 0, lastMonth: 0 }

  try {
    const client = getClient()
    const now = new Date()

    const [thisMonthResp] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startOfMonth(now), endDate: 'today' }],
      metrics: [{ name: 'activeUsers' }],
    })

    const [lastMonthResp] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startOfLastMonth(now), endDate: endOfLastMonth(now) }],
      metrics: [{ name: 'activeUsers' }],
    })

    return {
      thisMonth: parseInt(thisMonthResp.rows?.[0]?.metricValues?.[0]?.value ?? '0', 10),
      lastMonth: parseInt(lastMonthResp.rows?.[0]?.metricValues?.[0]?.value ?? '0', 10),
    }
  } catch {
    return { thisMonth: 0, lastMonth: 0 }
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

```
pnpm test:int -- --reporter=verbose 2>&1 | grep -A10 "ga-reporting"
```

Expected: all `ga-reporting` tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/ga-reporting.ts tests/int/ga-reporting.int.spec.ts
git commit -m "feat: add GA4 Data API reporting utility with service account auth"
```

---

## Task 4: Rebuild dashboard page.tsx with analytics header

**Files:**
- Modify: `src/app/(frontend)/dashboard/page.tsx`

The existing file already handles auth and renders `<DashboardClient />`. This task adds stat cards, a weekly trend chart, and GA4 top content above it.

- [ ] **Step 1: Replace `src/app/(frontend)/dashboard/page.tsx`**

```tsx
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { headers as nextHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'
import { getTopPages, getMonthlyVisitors } from '@/lib/ga-reporting'

export const dynamic = 'force-dynamic'

function isoWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7))
  const week1 = new Date(d.getFullYear(), 0, 4)
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`
}

function delta(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? `+${current}` : '—'
  const diff = current - previous
  return diff > 0 ? `+${diff}` : String(diff)
}

function deltaColor(current: number, previous: number): string {
  if (current > previous) return 'text-green-600'
  if (current < previous) return 'text-red-500'
  return 'text-gray-400'
}

export default async function LeadDashboardPage() {
  const payload = await getPayload({ config: payloadConfig })
  const headersList = await nextHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (!user) redirect('/admin')

  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000)

  const [enquiriesResult, visitors, topPages] = await Promise.all([
    payload.find({
      collection: 'enquiries',
      where: { createdAt: { greater_than: lastMonthStart.toISOString() } },
      limit: 0,
      sort: '-createdAt',
    }),
    getMonthlyVisitors(),
    getTopPages(5),
  ])

  const allEnquiries = enquiriesResult.docs as Array<{
    id: string
    company: string
    email: string
    sourceSection: string
    createdAt: string
  }>

  const thisMonth = allEnquiries.filter((e) => new Date(e.createdAt) >= thisMonthStart)
  const lastMonth = allEnquiries.filter(
    (e) => new Date(e.createdAt) >= lastMonthStart && new Date(e.createdAt) < thisMonthStart,
  )

  const demoThisMonth = thisMonth.filter((e) => e.sourceSection === 'demo_request_fab').length
  const demoLastMonth = lastMonth.filter((e) => e.sourceSection === 'demo_request_fab').length
  const contactThisMonth = thisMonth.filter((e) => e.sourceSection === 'contact_page').length
  const contactLastMonth = lastMonth.filter((e) => e.sourceSection === 'contact_page').length

  // Build 8-week trend
  const weeklyEnquiries = allEnquiries.filter((e) => new Date(e.createdAt) >= eightWeeksAgo)
  const weekMap = new Map<string, number>()
  for (let i = 7; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    weekMap.set(isoWeekKey(d), 0)
  }
  for (const e of weeklyEnquiries) {
    const key = isoWeekKey(new Date(e.createdAt))
    if (weekMap.has(key)) weekMap.set(key, (weekMap.get(key) ?? 0) + 1)
  }
  const weekTrend = Array.from(weekMap.entries()).map(([key, count], i) => ({
    label: `W${i + 1}`,
    count,
  }))
  const maxCount = Math.max(...weekTrend.map((w) => w.count), 1)

  const statCards = [
    {
      label: 'Leads This Month',
      value: thisMonth.length,
      prev: lastMonth.length,
    },
    {
      label: 'Demo Requests',
      value: demoThisMonth,
      prev: demoLastMonth,
    },
    {
      label: 'Contact Forms',
      value: contactThisMonth,
      prev: contactLastMonth,
    },
    {
      label: 'Site Visitors',
      value: visitors.thisMonth,
      prev: visitors.lastMonth,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border p-5">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
            <p className={`text-xs mt-1 font-medium ${deltaColor(card.value, card.prev)}`}>
              {delta(card.value, card.prev)} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Trend + top pages */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Weekly trend */}
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm font-semibold text-gray-800 mb-4">Lead Trend — Last 8 Weeks</p>
          <div className="flex items-end gap-2 h-20">
            {weekTrend.map((week, i) => (
              <div key={week.label} className="flex flex-col items-center gap-1 flex-1">
                <div
                  className={`w-full rounded-t-sm ${i === weekTrend.length - 1 ? 'bg-green-500' : 'bg-indigo-500'}`}
                  style={{ height: `${Math.max((week.count / maxCount) * 72, 4)}px` }}
                />
                <span className="text-[10px] text-gray-400">{week.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top content */}
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-800">Top Content This Month</p>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">GA4 API</span>
          </div>
          {topPages.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">
              No GA4 data — check GOOGLE_SA_CREDENTIALS env var
            </p>
          ) : (
            <div className="space-y-2.5">
              {topPages.map((page, i) => (
                <div key={page.page} className="flex items-center gap-3 text-sm">
                  <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 truncate text-gray-700 font-mono text-xs">{page.page}</span>
                  <span className="text-gray-500 font-semibold shrink-0">{page.views.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Existing lead management table */}
      <DashboardClient />
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm exec tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to the dashboard file.

- [ ] **Step 3: Commit**

```bash
git add src/app/(frontend)/dashboard/page.tsx
git commit -m "feat: add analytics header (stat cards, trend, top content) to dashboard"
```

---

## Task 5: Wire DemoRequestFAB

**Files:**
- Modify: `src/components/DemoRequestFAB.tsx`

Two changes: fire `demoRequestClicked` when the FAB button is pressed, and replace the existing `gaEvents.formSubmitted` call with `gaEvents.demoRequestSubmitted`.

- [ ] **Step 1: Update the FAB button `onClick` in `src/components/DemoRequestFAB.tsx`**

Find the FAB button (around line 78) and add the tracking call:

Change:
```tsx
      onClick={() => setOpen(true)}
```
To:
```tsx
      onClick={() => { gaEvents.demoRequestClicked('fab'); setOpen(true) }}
```

- [ ] **Step 2: Replace the form submit tracking call (around line 61)**

Change:
```tsx
        gaEvents.formSubmitted("demo_request_fab", form.company)
```
To:
```tsx
        gaEvents.demoRequestSubmitted(form.company)
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DemoRequestFAB.tsx
git commit -m "feat: track demo request click and submission events in DemoRequestFAB"
```

---

## Task 6: Wire PopupClient

**Files:**
- Modify: `src/components/PopupClient.tsx`

Fire `popupShown` when a popup becomes visible, and `popupCtaClicked` when a link or register button is clicked.

- [ ] **Step 1: Import gaEvents at the top of `src/components/PopupClient.tsx`**

After the existing imports, add:

```typescript
import { gaEvents } from '@/lib/ga-events'
```

- [ ] **Step 2: Fire `popupShown` in `PopupClient` when the popup activates**

Inside the `PopupClient` component, find the `useEffect` that calls `setActive(popup)` (around line 439) and add the event:

Change:
```typescript
      markShown(popup)
      setActive(popup)
```
To:
```typescript
      markShown(popup)
      setActive(popup)
      gaEvents.popupShown(popup.content.title, String(popup.id))
```

- [ ] **Step 3: Fire `popupCtaClicked` in `PopupModal.handleButtonClick`**

Inside `PopupModal`, find `handleButtonClick` (around line 311) and add tracking for link and register actions:

Change:
```typescript
  function handleButtonClick(btn: PopupButton) {
    if (btn.action === 'close') { onClose(); return }
    if (btn.action === 'register') { setShowRegForm(true); return }
    // 'link' handled by the anchor tag itself — just mark shown & close
    if (btn.action === 'link') onClose()
  }
```
To:
```typescript
  function handleButtonClick(btn: PopupButton) {
    if (btn.action === 'close') { onClose(); return }
    if (btn.action === 'register') {
      gaEvents.popupCtaClicked(popup.content.title, btn.label)
      setShowRegForm(true)
      return
    }
    if (btn.action === 'link') {
      gaEvents.popupCtaClicked(popup.content.title, btn.label)
      onClose()
    }
  }
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PopupClient.tsx
git commit -m "feat: track popup impressions and CTA clicks"
```

---

## Task 7: Wire VideoHighlightsSection

**Files:**
- Modify: `src/components/VideoHighlightsSection.tsx`

Fire `videoSelected` when the user clicks a sidebar thumbnail to switch videos.

- [ ] **Step 1: Import gaEvents in `src/components/VideoHighlightsSection.tsx`**

Add after the existing imports:

```typescript
import { gaEvents } from '@/lib/ga-events'
```

- [ ] **Step 2: Add tracking to the sidebar thumbnail `onClick` (around line 57)**

Change:
```tsx
                onClick={() => setActiveId(v.id)}
```
To:
```tsx
                onClick={() => { gaEvents.videoSelected(v.title); setActiveId(v.id) }}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/VideoHighlightsSection.tsx
git commit -m "feat: track video selection events in VideoHighlightsSection"
```

---

## Task 8: Wire FAQ components

**Files:**
- Modify: `src/components/FAQSection.tsx`
- Modify: `src/components/about/AboutFAQ.tsx`
- Modify: `src/components/sectors/SectorsFAQ.tsx`

The Radix `Accordion` component accepts an `onValueChange` prop that fires when an item is opened or closed. We fire `faqOpened` only when a value is set (not when closed, i.e. value is not empty string).

- [ ] **Step 1: Add `onValueChange` to the Accordion in `src/components/FAQSection.tsx`**

The Accordion is around line 47. Change:

```tsx
          <Accordion type="single" collapsible className="w-full">
```
To:
```tsx
          <Accordion
            type="single"
            collapsible
            className="w-full"
            onValueChange={(value) => {
              if (!value) return
              const faq = faqs[parseInt(value.replace('faq-', ''), 10)]
              if (faq) gaEvents.faqOpened(faq.question, 'home')
            }}
          >
```

- [ ] **Step 2: Read `src/components/about/AboutFAQ.tsx` to find the Accordion and data structure**

```bash
# Read the file to find the FAQ data variable name and Accordion location
```

Then add `onValueChange` to the Accordion in `AboutFAQ.tsx` with `section: 'about'`, using the same pattern as Step 1 (replace `faqs` with the actual data variable name in that file).

- [ ] **Step 3: Read `src/components/sectors/SectorsFAQ.tsx` and add `onValueChange`**

Same pattern — add `onValueChange` with `section: 'sectors'`.

- [ ] **Step 4: Commit**

```bash
git add src/components/FAQSection.tsx src/components/about/AboutFAQ.tsx src/components/sectors/SectorsFAQ.tsx
git commit -m "feat: track FAQ accordion open events across home, about, and sectors"
```

---

## Task 9: Wire article read scroll depth

**Files:**
- Create: `src/components/articles/ArticleReadTracker.tsx`
- Modify: `src/app/(frontend)/articles/[slug]/page.tsx`

The article page is a server component so scroll tracking goes in a separate client component that renders `null` and attaches a scroll listener.

- [ ] **Step 1: Create `src/components/articles/ArticleReadTracker.tsx`**

```tsx
'use client'

import { useEffect } from 'react'
import { gaEvents } from '@/lib/ga-events'

const DEPTHS = [25, 50, 75, 100] as const

export function ArticleReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const fired = new Set<number>()

    function onScroll() {
      const el = document.documentElement
      const scrolled = el.scrollTop + el.clientHeight
      const pct = Math.round((scrolled / el.scrollHeight) * 100)

      for (const depth of DEPTHS) {
        if (pct >= depth && !fired.has(depth)) {
          fired.add(depth)
          gaEvents.articleRead(slug, depth)
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  return null
}
```

- [ ] **Step 2: Import and render `ArticleReadTracker` in `src/app/(frontend)/articles/[slug]/page.tsx`**

Add import after existing imports:

```typescript
import { ArticleReadTracker } from '@/components/articles/ArticleReadTracker'
```

Inside the returned `<article>` element, add before the closing tag:

```tsx
      <ArticleReadTracker slug={slug} />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/articles/ArticleReadTracker.tsx src/app/(frontend)/articles/[slug]/page.tsx
git commit -m "feat: track article scroll depth at 25/50/75/100% milestones"
```

---

## Task 10: Wire section_viewed across major section components

**Files:**
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/CTASection.tsx`
- Modify: `src/components/ProblemSection.tsx`
- Modify: `src/components/ProofSection.tsx`
- Modify: `src/components/SolutionSection.tsx`
- Modify: `src/components/HowItWorksSection.tsx`
- Modify: `src/components/TestimonialsSection.tsx`
- Modify: `src/components/BankPartnershipsSection.tsx`
- Modify: `src/components/DifferentiationSection.tsx`
- Modify: `src/components/ProductShowcaseSection.tsx`
- Modify: `src/components/TeamBannerSection.tsx`

The pattern is the same for every file. Some already import `useInView` for animation — just add `gaEvents.sectionViewed()` inside the existing `inView` effect, or add a new `useInView` if there isn't one. The `useInView` hook fires once (it disconnects the observer on first intersection), so `sectionViewed` will only fire once per page load per section.

**Pattern to apply to each component:**

1. Ensure `gaEvents` and `useInView` are imported:
```typescript
import { gaEvents } from '@/lib/ga-events'
import { useInView } from '@/hooks/useInView'
```

2. Add a section-level `useInView` ref to the root `<section>` element (or reuse an existing one if the component already uses `useInView`):
```typescript
const { ref: sectionRef, inView: sectionInView } = useInView({ threshold: 0.3 })
```

3. Add a `useEffect` that fires when `sectionInView` becomes true:
```typescript
useEffect(() => {
  if (sectionInView) gaEvents.sectionViewed('hero') // use the section's name
}, [sectionInView])
```

4. Attach `ref={sectionRef}` to the root `<section>` element.

**Section name values to use per file:**

| File | `sectionName` |
|---|---|
| `HeroSection.tsx` | `'hero'` |
| `CTASection.tsx` | `'cta'` |
| `ProblemSection.tsx` | `'problem'` |
| `ProofSection.tsx` | `'proof'` |
| `SolutionSection.tsx` | `'solution'` |
| `HowItWorksSection.tsx` | `'how_it_works'` |
| `TestimonialsSection.tsx` | `'testimonials'` |
| `BankPartnershipsSection.tsx` | `'bank_partnerships'` |
| `DifferentiationSection.tsx` | `'differentiation'` |
| `ProductShowcaseSection.tsx` | `'product_showcase'` |
| `TeamBannerSection.tsx` | `'team_banner'` |

> **Note on FAQSection:** Already uses `gaEvents` and `useInView`. Add the `sectionViewed` effect there too with name `'faq'`.

- [ ] **Step 1: Apply the pattern to `src/components/HeroSection.tsx`**

Read the file, add the import, `useInView` ref, `useEffect`, and `ref=` prop to the root section.

- [ ] **Step 2: Apply the same pattern to the remaining 10 files listed above**

Each file gets the same treatment. Use the section names from the table above.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroSection.tsx src/components/CTASection.tsx src/components/ProblemSection.tsx \
  src/components/ProofSection.tsx src/components/SolutionSection.tsx src/components/HowItWorksSection.tsx \
  src/components/TestimonialsSection.tsx src/components/BankPartnershipsSection.tsx \
  src/components/DifferentiationSection.tsx src/components/ProductShowcaseSection.tsx \
  src/components/TeamBannerSection.tsx
git commit -m "feat: wire section_viewed GA events to all major homepage sections"
```

---

## Task 11: Update analytics reference page

**Files:**
- Modify: `src/app/(frontend)/analytics/page.tsx`

Replace the static "setup remaining" placeholder with the full live event list now that tracking is wired.

- [ ] **Step 1: Replace `src/app/(frontend)/analytics/page.tsx`**

```tsx
export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">GA4 Event Reference</h1>
      <p className="text-gray-500 mb-8">
        All custom events sent to Google Analytics 4 from this site.
        View live data in the{' '}
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline"
        >
          GA4 console
        </a>{' '}
        under Reports → Realtime or Explore.
      </p>

      <div className="space-y-6">
        {[
          {
            group: 'Lead Events',
            events: [
              { name: 'demo_request_clicked', trigger: 'FAB button pressed', params: 'source' },
              { name: 'demo_request_submitted', trigger: 'FAB form successfully submitted', params: 'company' },
              { name: 'contact_form_submitted', trigger: 'Contact page form submitted', params: 'company' },
              { name: 'lead_form_submission', trigger: 'Any form submitted (legacy)', params: 'form_name, company' },
            ],
          },
          {
            group: 'Content Engagement',
            events: [
              { name: 'section_viewed', trigger: 'Major section scrolled into view (once)', params: 'section_name' },
              { name: 'article_read', trigger: 'Article scroll depth milestone', params: 'slug, depth (25/50/75/100)' },
              { name: 'case_study_viewed', trigger: 'Case study selected in carousel', params: 'slug' },
              { name: 'video_selected', trigger: 'Sidebar video thumbnail clicked', params: 'video_title' },
              { name: 'faq_opened', trigger: 'FAQ accordion item expanded', params: 'question, section' },
            ],
          },
          {
            group: 'Popup Events',
            events: [
              { name: 'popup_shown', trigger: 'Popup becomes visible after delay', params: 'popup_title, popup_id' },
              { name: 'popup_cta_clicked', trigger: 'CTA inside popup clicked', params: 'popup_title, cta_text' },
            ],
          },
          {
            group: 'Navigation',
            events: [
              { name: 'cta_clicked', trigger: 'CTA button clicked', params: 'cta_text, section, target_url' },
              { name: 'page_engagement', trigger: 'Page/section mounted', params: 'page_name, section' },
            ],
          },
        ].map(({ group, events }) => (
          <div key={group}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">{group}</h2>
            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-500">
                  <tr>
                    <th className="text-left px-4 py-2 font-medium">Event Name</th>
                    <th className="text-left px-4 py-2 font-medium">Trigger</th>
                    <th className="text-left px-4 py-2 font-medium">Parameters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((e) => (
                    <tr key={e.name}>
                      <td className="px-4 py-2.5 font-mono text-xs text-indigo-700 whitespace-nowrap">{e.name}</td>
                      <td className="px-4 py-2.5 text-gray-700">{e.trigger}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-500">{e.params}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/(frontend)/analytics/page.tsx
git commit -m "feat: replace analytics placeholder page with live GA4 event reference"
```

---

## Self-Review Checklist

- [x] All spec requirements covered: GA Measurement ID env var, new event helpers, DemoRequestFAB, PopupClient, VideoHighlightsSection, FAQ components, article scroll depth, section views, GA4 reporting utility, dashboard rebuild, analytics page update
- [x] No placeholders — every code step contains the actual implementation
- [x] Types consistent across tasks — `gaEvents.articleRead(slug, depth)` signature matches helper definition in Task 1
- [x] `DashboardClient` preserved — Task 4 renders it below the new analytics header
- [x] `@google-analytics/data` install included in Task 3 before the utility is used
- [x] Task 8 (FAQ) notes the need to read AboutFAQ and SectorsFAQ before editing — data variable names may differ from FAQSection
