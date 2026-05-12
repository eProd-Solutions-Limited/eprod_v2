# GA4 + Lead Dashboard Design

**Date:** 2026-05-12
**Source doc:** `EPROD_GA4_LEAD_IMPLEMENTATION.md`

---

## Overview

Three additions to the existing site:
1. GA4 user activity tracking across all major sections and pages
2. Lead persistence — every CTA form submission is saved to Payload alongside the existing email notification
3. Two new frontend pages: a lead management dashboard and a GA4 analytics reference page

The existing CTA form fields (`company`, `email`, `challenge`) and the `send-cta-email` API route are preserved unchanged in behaviour. New capabilities are layered on top.

---

## Section 1: Data Layer

### New Payload collection — `enquiries`

**File:** `src/collections/Enquiries.ts`

| Field | Type | Required | Notes |
|---|---|---|---|
| `company` | text | yes | from form |
| `email` | email | yes | from form |
| `challenge` | text | yes | from form |
| `sourceSection` | text | no | e.g. `home_cta`, passed by the form component |
| `status` | select | no | new / contacted / qualified / won / lost, defaults to `new` |
| `notes` | textarea | no | internal team notes |
| `createdAt` | date | no | auto-set on create via `beforeValidate` hook |

Access rules: `create` is public (form submissions), `read/update/delete` require an authenticated user.

Admin defaults: columns `company`, `email`, `challenge`, `status`, `createdAt`.

**File:** `src/payload.config.ts` — import `Enquiries` and add to the `collections` array.

### Modified `send-cta-email/route.ts`

**File:** `src/app/api/send-cta-email/route.ts`

The existing email sending logic is unchanged. After a successful email send, the route also calls:

```ts
await payload.create({
  collection: 'enquiries',
  data: { company, email, challenge, sourceSection, status: 'new', createdAt: new Date() },
})
```

`sourceSection` is read from the request body (optional field — defaults to `'unknown'` if absent).

Error handling: email and save are independent. A save failure logs the error but does not affect the success response returned to the client. This preserves the current user-facing behaviour.

**`CTASection.tsx`** — add `sourceSection: 'home_cta'` to the fetch body. No other changes to the form.

---

## Section 2: GA4 Tracking Layer

### GA4 utility

**File:** `src/lib/ga-events.ts` — new file

Typed wrapper around `window.gtag`. All functions are no-ops if `window` or `window.gtag` is unavailable (SSR/missing script safety).

| Function | GA4 event name | Used by |
|---|---|---|
| `viewPage(pageName, section?)` | `page_engagement` | section useEffects |
| `clickCTA(ctaText, section)` | `cta_clicked` | CTA button handlers |
| `formSubmitted(formName, company?)` | `lead_form_submission` | CTASection on success |
| `sectionViewed(sectionName)` | `section_viewed` | scroll depth tracking |

### Layout

**File:** `src/app/(frontend)/layout.tsx`

Add `<GoogleAnalytics gaId="G-PLACEHOLDER" />` from `@next/third-parties/google` as the last child of `<body>`. Install `@next/third-parties` if not already present.

### Section components

The following components are converted from server to client components (`'use client'` added) and gain a `useEffect` that fires `gaEvents.viewPage(pageName, section)` on mount. None do server-side data fetching so conversion is safe.

| Component | pageName | section |
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
| `AboutHero.tsx` | `about_hero` | `hero` |
| `AboutCTA.tsx` | `about_cta` | `call_to_action` |

**`CTASection.tsx`** — already `'use client'`. On successful submit, fire `gaEvents.formSubmitted('cta_form', form.company)`.

---

## Section 3: Dashboard Pages

### Enquiries API routes

**File:** `src/app/api/enquiries/route.ts`
- `GET` — `payload.find({ collection: 'enquiries', sort: '-createdAt', limit: 1000 })`

**File:** `src/app/api/enquiries/[id]/route.ts`
- `PATCH` — `payload.update({ collection: 'enquiries', id, data: body })`

### Analytics page

**File:** `src/app/(frontend)/analytics/page.tsx`

Static client page at `/analytics`. Shows what GA4 tracks, links to the Google Analytics console, and lists next setup steps (get Measurement ID, set up conversion goals, etc.).

### Lead dashboard

**File:** `src/app/(frontend)/dashboard/page.tsx`

Client component. On mount fetches `/api/enquiries`.

Features:
- Stats row: total, new, qualified, won counts
- Filter bar: all / new / contacted / qualified / won / lost
- Table columns: company, email, challenge, status badge, date, view button
- Detail modal: full enquiry fields + status update buttons that PATCH `/api/enquiries/[id]`

No frontend auth — the Payload `/admin` interface handles authenticated management. This page is a convenience view.

---

## Package to Install

`@next/third-parties` is not currently in `package.json` and must be added before the layout change:

```
pnpm add @next/third-parties
```

---

## Files to Create

| File | Action |
|---|---|
| `src/collections/Enquiries.ts` | create |
| `src/lib/ga-events.ts` | create |
| `src/app/api/enquiries/route.ts` | create |
| `src/app/api/enquiries/[id]/route.ts` | create |
| `src/app/(frontend)/analytics/page.tsx` | create |
| `src/app/(frontend)/dashboard/page.tsx` | create |

## Files to Modify

| File | Change |
|---|---|
| `src/payload.config.ts` | import + add Enquiries collection |
| `src/app/api/send-cta-email/route.ts` | add Payload save after email send |
| `src/app/(frontend)/layout.tsx` | add GoogleAnalytics component |
| `src/components/CTASection.tsx` | add sourceSection to fetch body + GA4 event on success |
| 11 section components (see table above) | add `'use client'` + viewPage useEffect |
