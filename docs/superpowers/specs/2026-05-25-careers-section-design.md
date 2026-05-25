# Careers Section — Design Spec

**Date:** 2026-05-25
**Status:** Approved

## Overview

Add a Careers section to the existing About page (`/about`), positioned between `LeadershipTeam` and `AboutFAQ`. The section shows a culture pitch and a dynamic grid of open job listings fetched from Payload CMS. When no roles are active, it renders a playful empty state with a direct email CTA.

---

## Placement

In `src/app/(frontend)/about/page.tsx`:

```
<LeadershipTeam />
<CareersSection />   ← new
<AboutFAQ />
```

---

## Payload CMS — `jobs` Collection

New collection slug: `jobs`

| Field | Type | Notes |
|---|---|---|
| `title` | text | Required. Job title, e.g. "Backend Engineer" |
| `department` | text | Required. e.g. "Engineering", "Product", "Sales" |
| `location` | text | Required. e.g. "Nairobi", "Remote" |
| `type` | select | Options: `FULL_TIME`, `PART_TIME`, `CONTRACT`. Required. |
| `applyEmail` | email | Optional. Falls back to `careers@eprod-solutions.com` |
| `isActive` | checkbox | Default: `true`. Only active jobs are shown. |

---

## Component — `CareersSection`

**File:** `src/components/about/CareersSection.tsx`
**Type:** Async server component

### Data fetching

```ts
payload.find({
  collection: 'jobs',
  where: { isActive: { equals: true } },
  sort: 'department',
  limit: 100,
})
```

### Layout (Editorial Stack — Option A)

```
[ CAREERS overline ]
[ "Work With Us" heading ]
[ Culture subtitle paragraph ]
[ 🌱 Impact-driven  🌍 Pan-African  🚀 Fast-moving ]  ← pills
[ Job card grid — 1 col mobile / 2 col sm / 3 col md ]
```

### Job card

Each card (`<article>`) contains:
- Department tag (small uppercase label, `text-secondary`)
- Job title (`h3`, bold)
- Location + type line (`📍 Nairobi · Full-time`)
- Apply button: `<a href="mailto:{applyEmail || 'careers@eprod-solutions.com'}">` with `aria-label="Apply for {title}"`

### Empty state

When `jobs.length === 0`:

```
🌾
"No open roles right now — but great things grow slowly."
"Interested in joining us anyway? We'd love to hear from you."
[ Email us at careers@eprod-solutions.com → ]  ← mailto link
```

Rendered inside a dashed-border card, centered.

---

## SEO

One `<script type="application/ld+json">` block per active job injected into `about/page.tsx` using `dangerouslySetInnerHTML`, alongside the existing `aboutFaqSchema`. Each block uses the `JobPosting` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Backend Engineer",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "eProd Solutions"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "<location field>"
    }
  },
  "employmentType": "<type field — FULL_TIME | PART_TIME | CONTRACT>"
}
```

`CareersSection` renders its own `<script type="application/ld+json">` tags directly — one per active job — since it is a server component with access to the fetched jobs array. No changes needed in `about/page.tsx` for the structured data.

---

## Styling

Follows existing About page patterns:
- Section background: `bg-muted/30` (alternates with surrounding sections)
- Heading: `text-3xl md:text-4xl font-bold` with `gradient-primary-text` on "Us"
- Pills: `bg-secondary/10 text-secondary rounded-full` small tags
- Job cards: `bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition`
- Apply button: `rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground`

---

## Out of Scope

- Filtering jobs by department (no tabs/filters in this version)
- A dedicated `/careers` page
- Application form (candidates apply via email)
- Job description / detail page
