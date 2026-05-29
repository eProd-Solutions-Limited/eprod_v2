# Google Analytics — Event Tracking & Internal Dashboard

**Date:** 2026-05-29
**Status:** Approved

## Overview

Add comprehensive Google Analytics 4 event tracking across the eProd site, and rebuild the internal `/dashboard` page into a real analytics dashboard. Lead metrics come from the Payload CMS `Enquiries` collection (real-time, no lag). Content engagement metrics come from the GA4 Data API (hourly cache). The dashboard is protected by Payload CMS session auth.

## Goals

- Track the full acquisition-to-conversion funnel: content engagement (awareness) → demo requests and contact form submissions (leads)
- Surface lead metrics at a glance on an internal dashboard without leaving the site
- Give the GA4 console richer, more actionable data through improved event coverage

## Architecture

### Data Sources

| Data | Source | Freshness |
|---|---|---|
| Lead counts (demo + contact) | Payload `Enquiries` collection | Real-time |
| Recent leads list | Payload `Enquiries` collection | Real-time |
| Weekly lead trend | Payload `Enquiries` collection | Real-time |
| Top pages by views | GA4 Data API | Hourly (Next.js `revalidate: 3600`) |
| Site visitor count | GA4 Data API | Hourly |

### Auth

The `/dashboard` page is a Next.js server component. It calls `getPayload()` and checks for a valid Payload session cookie. If no session exists, it redirects to `/admin/login`. No separate auth mechanism is added.

### GA4 Data API

- A Google Cloud **service account** is created and shared with the GA4 property as Viewer.
- The service account credentials JSON is stored as the env var `GOOGLE_SA_CREDENTIALS`.
- A new utility `src/lib/ga-reporting.ts` handles auth and typed fetch calls to the GA4 Data API.
- Requests are cached with `next: { revalidate: 3600 }` to limit API quota usage.

### GA Measurement ID

Replace `G-PLACEHOLDER` in `src/app/(frontend)/layout.tsx` (line 62) with the real `G-XXXXXXXXXX` from the GA4 console. This is a prerequisite for all event tracking to function.

## GA Event Tracking

### Existing Events (in `ga-events.ts`) — Need Wiring

| Event name | Helper | Where to wire |
|---|---|---|
| `cta_clicked` | `gaEvents.clickCTA()` | `CTASection`, all CTA buttons |
| `section_viewed` | `gaEvents.sectionViewed()` | All major section components via `useInView` hook |
| `page_engagement` | `gaEvents.viewPage()` | Already fires on route; confirm coverage |
| `lead_form_submission` | `gaEvents.formSubmitted()` | `ContactForm`, `DemoRequestFAB` form |

### New Events to Add to `ga-events.ts`

| Event name | Parameters | Trigger |
|---|---|---|
| `demo_request_clicked` | `source` (fab/cta) | DemoRequestFAB button click |
| `demo_request_submitted` | `company?` | DemoRequestFAB form successful submit |
| `contact_form_submitted` | `company?` | ContactForm successful submit |
| `popup_shown` | `popup_title`, `popup_id` | PopupClient becomes visible |
| `popup_cta_clicked` | `popup_title`, `cta_text` | CTA inside PopupClient clicked |
| `video_played` | `video_title` | VideoHighlightsSection video starts |
| `video_completed` | `video_title` | VideoHighlightsSection reaches 90%+ |
| `faq_opened` | `question`, `section` | Accordion item expanded in FAQSection / AboutFAQ / SectorsFAQ |
| `article_read` | `slug`, `depth` (25/50/75/100) | Scroll depth milestones on `/articles/[slug]` |
| `case_study_viewed` | `slug` | User selects a specific case study in the carousel |

### Wiring Approach

- All client-side events use `gaEvents.*()` helpers from `src/lib/ga-events.ts`.
- Scroll-based events (`section_viewed`, `article_read`) use the existing `useInView` hook in `src/hooks/useInView.ts`.
- Video events use the HTML5 `video` element's `play` and `timeupdate` events.
- FAQ events attach to the Radix accordion's `onValueChange` callback.

## Dashboard Page

**Route:** `/dashboard`
**Auth:** Payload session required → redirects to `/admin/login` if unauthenticated

### Layout

The existing `DashboardClient.tsx` is a full lead management component with status filtering (new/contacted/qualified/won/lost) and a per-lead detail modal with status updates. It is kept as-is. The new `page.tsx` server component adds an analytics header above it.

**Analytics header (server-rendered, above DashboardClient):**

Stat cards (top row):
- Total leads this month (vs last month delta)
- Demo requests this month (vs last month delta)
- Contact form submissions this month (vs last month delta)
- Site visitors this month (from GA4 API, vs last month delta)

Two-column section:
- Left: Weekly lead trend bar chart — last 8 weeks, computed from Enquiries grouped by ISO week
- Right: Top 5 pages by views this month — from GA4 Data API

**Below analytics header:**
- Existing `DashboardClient` component (lead table with status management) — unchanged

### Implementation Notes

- `page.tsx` is an async server component. It runs the Payload query and GA4 API call in parallel via `Promise.all`, then renders stat cards and top content above `<DashboardClient />`.
- `DashboardClient.tsx` is unchanged — it continues to fetch from `/api/enquiries` client-side for status management.
- The bar chart is rendered in pure HTML/CSS (no charting library dependency).

## Files Changed / Created

| File | Change |
|---|---|
| `src/app/(frontend)/layout.tsx` | Replace `G-PLACEHOLDER` with real GA ID |
| `src/lib/ga-events.ts` | Add 10 new event helpers |
| `src/lib/ga-reporting.ts` | New — GA4 Data API utility with service account auth |
| `src/app/(frontend)/dashboard/page.tsx` | Rebuild as real analytics dashboard server component |
| `src/app/(frontend)/dashboard/DashboardClient.tsx` | Keep unchanged — retains lead table with status filtering and update modal |
| `src/app/(frontend)/analytics/page.tsx` | Update to reflect live event list, remove "setup remaining" section |
| `src/components/DemoRequestFAB.tsx` | Wire demo_request_clicked + demo_request_submitted |
| `src/components/PopupClient.tsx` | Wire popup_shown + popup_cta_clicked |
| `src/components/VideoHighlightsSection.tsx` | Wire video_played + video_completed |
| `src/components/FAQSection.tsx` | Wire faq_opened |
| `src/components/about/AboutFAQ.tsx` | Wire faq_opened |
| `src/components/sectors/SectorsFAQ.tsx` | Wire faq_opened |
| `src/components/contact/ContactForm.tsx` | Wire contact_form_submitted |
| `src/app/(frontend)/articles/[slug]/page.tsx` | Wire article_read scroll depth |
| All major section components | Wire section_viewed via useInView |

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_SA_CREDENTIALS` | Google Cloud service account JSON (stringified) |

## Out of Scope

- Real-time websocket updates on the dashboard (hourly cache is sufficient)
- Custom GA4 dimensions or funnels (configured in GA console, not code)
- A/B testing or feature flags
- Email reports or scheduled exports
