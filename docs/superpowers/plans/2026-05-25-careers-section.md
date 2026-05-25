# Careers Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Careers section to the About page showing a culture pitch and dynamic open job listings from a new Payload CMS `jobs` collection, with Schema.org `JobPosting` structured data for SEO.

**Architecture:** A new `Jobs` Payload collection stores job listings with title, department, location, employment type, optional apply email, and an active flag. A new `CareersSection` server component fetches active jobs at render time and renders the Editorial Stack layout (culture pills + 3-col card grid) or a playful empty state. The component also renders per-job `JobPosting` JSON-LD structured data inline. The About page gains one import and one JSX line.

**Tech Stack:** Next.js 15 (App Router), Payload CMS v3, TypeScript, Tailwind CSS, PostgreSQL (Neon on Vercel — migrations run at deploy time, not locally unless you have a local Postgres instance).

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/collections/Jobs.ts` | Payload collection config for job listings |
| Modify | `src/payload.config.ts` | Register `Jobs` collection |
| Create | `src/components/about/CareersSection.tsx` | Server component — fetches jobs, renders section + SEO |
| Modify | `src/app/(frontend)/about/page.tsx` | Import and render `<CareersSection />` |

---

## Task 1: Create the Jobs Payload collection

**Files:**
- Create: `src/collections/Jobs.ts`

- [ ] **Step 1: Create the file**

```ts
// src/collections/Jobs.ts
import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Open job listings shown on the About page.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Job Title',
    },
    {
      name: 'department',
      type: 'text',
      required: true,
      label: 'Department',
      admin: {
        description: 'e.g. Engineering, Product, Sales',
      },
    },
    {
      name: 'location',
      type: 'text',
      required: true,
      label: 'Location',
      admin: {
        description: 'e.g. Nairobi, Remote',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      label: 'Employment Type',
      options: [
        { label: 'Full-time', value: 'FULL_TIME' },
        { label: 'Part-time', value: 'PART_TIME' },
        { label: 'Contract', value: 'CONTRACT' },
      ],
    },
    {
      name: 'applyEmail',
      type: 'email',
      label: 'Apply Email',
      admin: {
        description: 'Optional. Defaults to careers@eprod-solutions.com if left blank.',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Uncheck to hide this role without deleting it.',
      },
    },
  ],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/collections/Jobs.ts
git commit -m "feat: add Jobs Payload collection"
```

---

## Task 2: Register Jobs collection and regenerate types

**Files:**
- Modify: `src/payload.config.ts`

- [ ] **Step 1: Add import at the top of `src/payload.config.ts`**

Find the existing imports block (around line 10–20). Add after the last collection import:

```ts
import { Jobs } from './collections/Jobs'
```

- [ ] **Step 2: Add `Jobs` to the collections array**

Find the line:
```ts
collections: [Users, Media, Articles, CaseStudies, Team, CTAConfig, Popups, Categories, Enquiries, CaseStudiesHeroCollection],
```

Replace with:
```ts
collections: [Users, Media, Articles, CaseStudies, Team, CTAConfig, Popups, Categories, Enquiries, CaseStudiesHeroCollection, Jobs],
```

- [ ] **Step 3: Regenerate Payload types**

```bash
pnpm payload generate:types
```

Expected: `src/payload-types.ts` is updated. You should see a `Job` type added.

> **Note on migrations:** Payload will create a migration file in `src/migrations/` when you first run the dev server or build. The migration runs automatically during `pnpm build` (via `payload migrate`) on Vercel. If you have a local Postgres instance, run `pnpm payload migrate` locally. If not, the migration runs on the next deploy.

- [ ] **Step 4: Commit**

```bash
git add src/payload.config.ts src/payload-types.ts
git commit -m "feat: register Jobs collection in Payload config"
```

---

## Task 3: Create the CareersSection component

**Files:**
- Create: `src/components/about/CareersSection.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/about/CareersSection.tsx
import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

const FALLBACK_EMAIL = 'careers@eprod-solutions.com'

const getJobs = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: 'jobs',
    where: { isActive: { equals: true } },
    sort: 'department',
    limit: 100,
  })
})

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
}

export default async function CareersSection() {
  const { docs: jobs } = await getJobs()

  const jobPostingSchemas = jobs.map((job: any) => ({
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    hiringOrganization: {
      '@type': 'Organization',
      name: 'eProd Solutions',
      sameAs: 'https://eprod-solutions.com',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    employmentType: job.type,
  }))

  return (
    <section className="bg-muted/30 py-20">
      {jobPostingSchemas.map((schema: any, i: number) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">
            Careers
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Work With <span className="gradient-primary-text">Us</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto mb-6">
            We&apos;re a mission-driven team building the infrastructure for African agriculture. Join us.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="bg-secondary/10 text-secondary rounded-full px-4 py-1.5 text-sm font-semibold">
              🌱 Impact-driven
            </span>
            <span className="bg-secondary/10 text-secondary rounded-full px-4 py-1.5 text-sm font-semibold">
              🌍 Pan-African
            </span>
            <span className="bg-secondary/10 text-secondary rounded-full px-4 py-1.5 text-sm font-semibold">
              🚀 Fast-moving
            </span>
          </div>
        </div>

        {jobs.length === 0 ? (
          <div className="max-w-md mx-auto text-center border-2 border-dashed border-border rounded-xl p-10">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              No open roles right now — but great things grow slowly.
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              Interested in joining us anyway? We&apos;d love to hear from you.
            </p>
            <a
              href={`mailto:${FALLBACK_EMAIL}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
            >
              Email us at {FALLBACK_EMAIL} →
            </a>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {jobs.map((job: any) => (
              <article
                key={job.id}
                className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-2">
                  {job.department}
                </p>
                <h3 className="text-lg font-bold text-foreground mb-1">{job.title}</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  📍 {job.location} · {TYPE_LABELS[job.type] ?? job.type}
                </p>
                <a
                  href={`mailto:${job.applyEmail || FALLBACK_EMAIL}?subject=Application for ${encodeURIComponent(job.title)}`}
                  aria-label={`Apply for ${job.title}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 transition"
                >
                  Apply →
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/about/CareersSection.tsx
git commit -m "feat: add CareersSection component with SEO structured data"
```

---

## Task 4: Wire CareersSection into the About page

**Files:**
- Modify: `src/app/(frontend)/about/page.tsx`

- [ ] **Step 1: Add the import**

Open `src/app/(frontend)/about/page.tsx`. Find the existing imports block (lines 1–15). Add after the `LeadershipTeam` import:

```ts
import CareersSection from "@/components/about/CareersSection";
```

- [ ] **Step 2: Add the JSX**

Find the JSX section in `AboutUs`. Locate:

```tsx
<LeadershipTeam />
<AboutFAQ />
```

Replace with:

```tsx
<LeadershipTeam />
<CareersSection />
<AboutFAQ />
```

- [ ] **Step 3: Run the dev server and verify**

```bash
pnpm dev
```

Open `http://localhost:3000/about` in your browser.

**Verify — empty state:**
- Scroll to the Careers section (between LeadershipTeam and FAQ)
- Confirm the 🌾 empty state message appears if no jobs exist in the DB
- Confirm the mailto link reads `careers@eprod-solutions.com`

**Verify — with jobs (add a test role in Payload admin first):**
- Open `http://localhost:3000/admin`, create a job with `isActive: true`
- Hard refresh `/about`
- Confirm the job card appears with the correct department tag, title, location/type, and Apply button
- Click Apply — confirm it opens `mailto:careers@eprod-solutions.com?subject=Application for <title>`

**Verify — SEO:**
- View page source (`Ctrl+U`) and search for `"@type":"JobPosting"` — confirm one block per active job

- [ ] **Step 4: Commit**

```bash
git add src/app/(frontend)/about/page.tsx
git commit -m "feat: add CareersSection to About page"
```

---

## Migration Note

A Payload migration file will be auto-generated in `src/migrations/` when Payload starts up with the new `jobs` collection registered. Commit that file:

```bash
git add src/migrations/
git commit -m "chore: add Payload migration for jobs collection"
```

The migration runs automatically during `pnpm build` on Vercel (the build script already calls `payload migrate`). No manual migration step is needed on deploy.
