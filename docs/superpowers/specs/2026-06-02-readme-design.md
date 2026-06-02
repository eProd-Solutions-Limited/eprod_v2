# README Documentation Design

**Date:** 2026-06-02
**Status:** Approved

## Goal

Replace the generic Payload blank template README with complete, accurate documentation for the eProd Solutions marketing website. Target audience is internal developers and new team members onboarding to the project.

## Approach

Option B: short root `README.md` for setup and quick navigation, with deep-dive content split into three dedicated docs under `docs/`.

```
README.md
docs/
  cms.md
  deployment.md
  analytics.md
```

The existing `docs/superpowers/` directory is unaffected.

---

## File 1: `README.md`

A short, scannable root file. Sections:

1. **Project overview** — what eProd Solutions is (agri-tech company digitizing agricultural supply chains in Africa) and what this repo is (the company marketing website)
2. **Tech stack** — one-liner per technology:
   - Next.js 16 (App Router)
   - Payload CMS 3.x (headless CMS, embedded in Next.js)
   - PostgreSQL via Neon (database)
   - Vercel Blob Storage (media uploads)
   - Tailwind CSS v4 + shadcn/ui (styling)
   - Google Analytics 4 (tracking + internal reporting dashboard)
   - Vitest (integration tests) + Playwright (E2E tests)
3. **Prerequisites** — Node `^18.20.2 || >=20.9.0`, pnpm `^9 || ^10`, a PostgreSQL connection string (Neon recommended)
4. **Local setup** — step-by-step:
   - Clone repo
   - `cp .env.example .env` and fill in required vars
   - `pnpm install`
   - `pnpm dev`
   - Open `http://localhost:3000`
5. **Environment variables table** — columns: Variable | Required | Description. Covers all vars from `.env.example`:
   - `DATABASE_URL` — required — PostgreSQL connection string
   - `PAYLOAD_SECRET` — required — random secret for Payload auth
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` — optional — email sending (contact form, CTA emails)
   - `NEXT_PUBLIC_SITE_URL` — optional — used by sitemap and robots.txt (default: `https://www.eprod-solutions.com`)
   - `NEXT_PUBLIC_GA_ID` — optional — GA4 Measurement ID for frontend tracking
   - `GOOGLE_GA_PROPERTY_ID` — optional — GA4 Property ID for reporting API
   - `GOOGLE_SA_CREDENTIALS` — optional — stringified service account JSON for reporting API
   - `BLOB_READ_WRITE_TOKEN` — optional — Vercel Blob Storage token for media uploads (note: missing from `.env.example` — must be added as part of implementation)
6. **Available scripts** — table: Script | Description:
   - `pnpm dev` — start dev server
   - `pnpm devsafe` — clear `.next` cache then start dev server
   - `pnpm build` — run migrations then Next.js production build
   - `pnpm start` — start production server
   - `pnpm test` — run all tests (integration + E2E)
   - `pnpm test:int` — Vitest integration tests only
   - `pnpm test:e2e` — Playwright E2E tests only
   - `pnpm seed` — seed case studies data
   - `pnpm generate:types` — regenerate `payload-types.ts` after schema changes
   - `pnpm lint` — run ESLint
7. **Project structure** — key directories with one-line descriptions:
   - `src/app/(frontend)/` — Next.js frontend pages
   - `src/app/(payload)/` — Payload CMS admin panel and API routes
   - `src/app/api/` — custom Next.js API routes (enquiries, popup registrations, emails, seed endpoints)
   - `src/collections/` — Payload collection definitions
   - `src/globals/` — Payload global definitions
   - `src/components/` — React components
   - `src/lib/` — shared utilities, Payload client, GA helpers
   - `src/migrations/` — Payload database migrations
   - `tests/` — Vitest integration tests and Playwright E2E tests
8. **Further reading** — links to:
   - `docs/cms.md` — CMS collections and globals reference
   - `docs/deployment.md` — Vercel, Docker, and self-hosted deployment
   - `docs/analytics.md` — GA4 tracking and reporting API setup

---

## File 2: `docs/cms.md`

**Overview paragraph:** Payload v3 runs embedded inside Next.js. The admin panel is at `/admin`. Schema is defined in TypeScript (`src/collections/`, `src/globals/`). After any schema change, run `pnpm generate:types` to keep `payload-types.ts` in sync and `pnpm payload migrate:create` to generate the migration.

**Collections** — one subsection each:

| Collection | Slug | Purpose | Frontend connection |
|---|---|---|---|
| Users | `users` | Admin panel access; authentication-enabled | Admin only |
| Media | `media` | Image/file uploads; pre-configured sizes and focal point | All pages via Vercel Blob URLs |
| Articles | `articles` | Blog posts with Lexical rich text; SEO-enabled | `/articles/[slug]` |
| Case Studies | `case-studies` | Client success stories; SEO-enabled; supports video and CTA link | `/case-studies` |
| Case Studies Hero | `case-studies-hero` | Hero image/banner for the case studies page | `/case-studies` hero section |
| Team | `team` | Team member profiles (name, role, bio, photo) | `/about` team section |
| Categories | `categories` | Tags/categories for articles | Article filters |
| Enquiries | `enquiries` | Contact form submissions | Created via `POST /api/enquiries` |
| Events | `events` | Company events with Lexical rich text; SEO-enabled | `/events`, `/events/[id]` |
| Jobs | `jobs` | Open job listings | Jobs/careers section |
| Popups | `popups` | Configurable site-wide modal popups with form | Homepage popup |
| Popup Registrations | `popup-registrations` | Form submissions from popups | Created via `POST /api/popup-register` |
| CTA Config | `cta-config` | Dynamic call-to-action button content and links | CTASection component |

**Globals:**

| Global | Slug | Purpose | Frontend connection |
|---|---|---|---|
| Logo Wall | `logo-wall` | Partner/client logos shown on homepage | `LogoCell` component |
| Voice of Customer | `voice-of-customer` | Testimonials/quotes from customers | `TestimonialsSection` component |

**Running migrations:**
- Create: `pnpm payload migrate:create`
- Run: `pnpm payload migrate` (also runs automatically during `pnpm build`)
- Migration files live in `src/migrations/`

---

## File 3: `docs/deployment.md`

Three subsections:

### Vercel (primary)
- Required env vars to configure in the Vercel dashboard (all from `.env.example`)
- Vercel Blob Storage: create a Blob store in the Vercel dashboard, link it to the project, copy the `BLOB_READ_WRITE_TOKEN` to env vars
- Build command: `pnpm run build` (this runs `payload migrate` then `next build` — migrations run automatically on every deploy)
- `DATABASE_URL` must point to a Neon (or other SSL-enabled) PostgreSQL instance; SSL is pre-configured in `payload.config.ts` with `rejectUnauthorized: false`
- The admin panel is available at `https://your-domain.com/admin` after first deploy

### Docker (local / staging)
- The provided `docker-compose.yml` spins up a PostgreSQL instance only — the Next.js app still runs via Node
- Steps:
  1. Set `DATABASE_URL=postgresql://127.0.0.1/<dbname>` in `.env`
  2. `docker-compose up` (add `-d` for background)
  3. `pnpm install && pnpm dev`
- Note: Vercel Blob Storage is not available locally unless `BLOB_READ_WRITE_TOKEN` is set. Without it, media uploads are disabled (the plugin checks for the token and disables itself when absent)

### Self-hosted (raw server)
- Node version: `^18.20.2 || >=20.9.0`; pnpm: `^9 || ^10`
- Build: `pnpm install && pnpm run build`
- Start: `pnpm start` (runs `next start` on port 3000)
- Recommended: PM2 for process management (`pm2 start "pnpm start" --name eprod`)
- Nginx reverse proxy config snippet (proxy port 3000, set `X-Forwarded-Proto` header)
- Reminder: `payload migrate` is part of the build script and runs automatically; ensure `DATABASE_URL` is set before building

---

## File 4: `docs/analytics.md`

### GA4 Event Tracking (frontend)
- What: page views and user interactions tracked via `@next/third-parties` Google Analytics
- Required env var: `NEXT_PUBLIC_GA_ID` — the `G-XXXXXXXXXX` Measurement ID
- Where to find it: GA4 Admin → Data Streams → Web stream → Measurement ID
- Custom events: defined in `src/lib/ga-events.ts`; GA reporting helpers in `src/lib/ga-reporting.ts`

### GA4 Reporting API (internal dashboard at `/analytics`)
- What: pulls live traffic data (sessions, page views, top pages) from the GA4 Data API into the internal dashboard
- Required env vars:
  - `GOOGLE_GA_PROPERTY_ID` — numeric property ID (GA4 Admin → Property Settings → Property ID)
  - `GOOGLE_SA_CREDENTIALS` — full service account JSON, stringified into a single line
- Service account setup (step-by-step):
  1. Go to Google Cloud Console → IAM & Admin → Service Accounts
  2. Create a new service account
  3. Create a JSON key and download it
  4. In GA4: Admin → Property Access Management → add the service account email with Viewer role
  5. Stringify the JSON: `JSON.stringify(require('./service-account.json'))` and set as `GOOGLE_SA_CREDENTIALS`
- Security note: the `/analytics` route has no authentication in the application layer. For production, restrict access via Vercel password protection or IP allowlist.
