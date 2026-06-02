# README Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Payload blank template README with complete, accurate documentation for internal developers and new team members onboarding to the eProd Solutions marketing website.

**Architecture:** Option B — short root `README.md` for quick-start and navigation, with deep content in three dedicated files (`docs/cms.md`, `docs/deployment.md`, `docs/analytics.md`). The existing `docs/superpowers/` directory is untouched.

**Tech Stack:** Next.js 16, Payload CMS 3.x, PostgreSQL/Neon, Vercel Blob Storage, Tailwind CSS v4, shadcn/ui, Google Analytics 4, Vitest, Playwright.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `.env.example` | Add missing `BLOB_READ_WRITE_TOKEN` variable |
| Overwrite | `README.md` | Project overview, setup, env vars, scripts, structure, links |
| Create | `docs/cms.md` | Payload collections and globals reference |
| Create | `docs/deployment.md` | Vercel, Docker, and self-hosted deployment guides |
| Create | `docs/analytics.md` | GA4 tracking and reporting API setup |

---

## Task 1: Add BLOB_READ_WRITE_TOKEN to .env.example

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add the missing env var**

Open `.env.example` and append the following block at the end:

```
# Vercel Blob Storage — create a Blob store in the Vercel dashboard and copy the token
# Without this, media uploads are disabled (the plugin disables itself gracefully)
BLOB_READ_WRITE_TOKEN=
```

- [ ] **Step 2: Verify the file looks correct**

Read `.env.example` — it should now have all 9 variables: `DATABASE_URL`, `PAYLOAD_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`, `GOOGLE_GA_PROPERTY_ID`, `GOOGLE_SA_CREDENTIALS`, `BLOB_READ_WRITE_TOKEN`.

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add BLOB_READ_WRITE_TOKEN to .env.example"
```

---

## Task 2: Write docs/cms.md

**Files:**
- Create: `docs/cms.md`

- [ ] **Step 1: Create the file with the full content below**

Write the following content exactly to `docs/cms.md`:

````markdown
# CMS Reference

eProd Solutions uses [Payload CMS v3](https://payloadcms.com/docs) embedded inside Next.js. The admin panel runs at `/admin`. All schema is defined in TypeScript — collections in `src/collections/`, globals in `src/globals/`.

After any schema change:
1. Run `pnpm generate:types` to regenerate `src/payload-types.ts`
2. Run `pnpm payload migrate:create` to generate the migration file
3. Run `pnpm payload migrate` to apply it (or let the next `pnpm build` run it automatically)

---

## Collections

### Users (`users`)

Admin panel access. Authentication-enabled — only users in this collection can log in to `/admin`. There is no public registration; accounts must be created by an existing admin.

### Media (`media`)

Image and file uploads. Pre-configured with multiple sizes and focal point support. In production, files are stored in Vercel Blob Storage (requires `BLOB_READ_WRITE_TOKEN`). Without the token the plugin disables itself and uploads fail — this is expected in local development unless you provide a token.

### Articles (`articles`)

Blog posts. Uses Lexical rich text editor. SEO plugin is enabled — each article has a dedicated SEO tab for meta title, description, and OG image.

**Key fields:** `title`, `slug`, `excerpt`, `content` (Lexical), `categories` (relation), `publishedAt`, `featuredImage` (relation to Media), SEO tab.

**Frontend:** `/articles/[slug]` — the slug field drives the URL.

### Case Studies (`case-studies`)

Client success stories. SEO plugin enabled. Supports an optional video URL and a CTA link for each case study.

**Key fields:** `title`, `client`, `industry`, `challenge`, `solution`, `results` (Lexical rich text), `heroImage` (relation to Media), `videoUrl`, `ctaLink`, SEO tab.

**Frontend:** `/case-studies` — all case studies are listed on this single page.

### Case Studies Hero (`case-studies-hero`)

Hero banner images for the case studies page. Separate collection from Media to allow Vercel Blob to handle these images independently.

**Frontend:** Hero section at the top of `/case-studies`.

### Team (`team`)

Team member profiles displayed on the About page.

**Key fields:** `name`, `role`, `bio`, `photo` (relation to Media), `order` (controls display order).

**Frontend:** `/about` team section → `TeamBannerSection` and `TeamAndEventsSection` components.

### Categories (`categories`)

Tags/categories for articles. Simple collection with a `name` field.

**Frontend:** Article filters on the articles listing.

### Enquiries (`enquiries`)

Contact form submissions. Records are created via `POST /api/enquiries` — Payload's REST API is not used directly for this. Admins can view submissions in the admin panel.

**Key fields:** `name`, `email`, `company`, `message`, `createdAt`.

**Frontend:** Contact form at `/contact` → `POST /api/enquiries`.

### Events (`events`)

Company events, conferences, and webinars. Uses Lexical rich text for event description. SEO plugin enabled.

**Key fields:** `title`, `date`, `location`, `description` (Lexical), `image` (relation to Media), SEO tab.

**Frontend:** `/events` (listing) and `/events/[id]` (detail page).

### Jobs (`jobs`)

Open job listings.

**Key fields:** `title`, `department`, `location`, `type` (full-time/contract/etc.), `description` (Lexical), `applyUrl`.

**Frontend:** Jobs/careers section (rendered via the Payload REST API).

### Popups (`popups`)

Configurable site-wide modal popups shown to visitors. Contains a form that captures registrations.

**Key fields:** `title`, `body`, `ctaLabel`, `active` (boolean controls whether the popup shows).

**Frontend:** `PopupClient` component on the homepage.

### Popup Registrations (`popup-registrations`)

Form submissions from popups. Created via `POST /api/popup-register`.

**Key fields:** `email`, `name`, `popup` (relation to Popups), `createdAt`.

### CTA Config (`cta-config`)

Dynamic call-to-action button content and links, editable without a code deploy.

**Key fields:** `label`, `url`, `active`.

**Frontend:** `CTASection` component throughout the site.

---

## Globals

Globals are singleton documents — there is only one per global, edited directly in the admin panel.

### Logo Wall (`logo-wall`)

Partner and client logos displayed on the homepage.

**Key fields:** `logos` — array of `{ image (relation to Media), link (URL), active (boolean) }`.

**Frontend:** `LogoCell` component in the homepage partner logos section.

### Voice of Customer (`voice-of-customer`)

Customer testimonials/quotes.

**Key fields:** `testimonials` — array of `{ quote, author, company, photo (relation to Media) }`.

**Frontend:** `TestimonialsSection` component.
````

- [ ] **Step 2: Verify the file was created**

Run: `cat docs/cms.md | head -5`
Expected output: `# CMS Reference`

- [ ] **Step 3: Commit**

```bash
git add docs/cms.md
git commit -m "docs: add CMS collections and globals reference"
```

---

## Task 3: Write docs/deployment.md

**Files:**
- Create: `docs/deployment.md`

- [ ] **Step 1: Create the file with the full content below**

Write the following content exactly to `docs/deployment.md`:

````markdown
# Deployment

---

## Vercel (primary)

This is the production deployment target. The app is built and served by Vercel, with Neon as the PostgreSQL provider and Vercel Blob for media storage.

### Environment variables

Set all of the following in the Vercel dashboard under **Settings → Environment Variables**:

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Neon connection string — SSL is pre-configured |
| `PAYLOAD_SECRET` | Yes | Any long random string; use `openssl rand -hex 32` |
| `BLOB_READ_WRITE_TOKEN` | Yes | From Vercel Blob store (see below) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production domain, no trailing slash (e.g. `https://www.eprod-solutions.com`) |
| `SMTP_HOST` | No | Required for contact form emails and CTA emails |
| `SMTP_PORT` | No | Defaults to `587` |
| `SMTP_USER` | No | SMTP auth username |
| `SMTP_PASS` | No | SMTP auth password |
| `SMTP_FROM` | No | From address (defaults to `noreply@eprod.io`) |
| `NEXT_PUBLIC_GA_ID` | No | GA4 Measurement ID for frontend tracking |
| `GOOGLE_GA_PROPERTY_ID` | No | GA4 Property ID for the `/analytics` dashboard |
| `GOOGLE_SA_CREDENTIALS` | No | Stringified service account JSON for the reporting API |

### Vercel Blob Storage setup

1. Go to your Vercel project → **Storage** tab
2. Click **Create Database** → select **Blob**
3. Name it (e.g. `eprod-media`) and create
4. Go to the Blob store's **Settings** → copy the `BLOB_READ_WRITE_TOKEN`
5. Add it to your project's environment variables

### Build and deploy

The build command is `pnpm run build`, which does two things in sequence:

```bash
payload migrate   # runs any pending database migrations
next build        # compiles the Next.js app
```

Migrations run automatically on every deploy — no manual step needed. Ensure `DATABASE_URL` is set before the first deploy.

The admin panel is available at `https://your-domain.com/admin` after the first deploy. Create your first admin user on that page.

---

## Docker (local / staging)

The provided `docker-compose.yml` spins up a PostgreSQL database only. The Next.js app still runs via Node on your machine.

### Steps

1. Copy and fill in `.env`:
   ```bash
   cp .env.example .env
   ```

2. Set the database URL to point at the Docker container:
   ```
   DATABASE_URL=postgresql://postgres:postgres@127.0.0.1/eprod
   ```

3. Start the database:
   ```bash
   docker-compose up -d
   ```

4. Install dependencies and start the dev server:
   ```bash
   pnpm install
   pnpm dev
   ```

5. Open `http://localhost:3000`

### Notes

- Vercel Blob Storage is not available in local development unless you provide a `BLOB_READ_WRITE_TOKEN`. Without it, the plugin disables itself gracefully — media uploads will fail but the rest of the app works fine.
- To stop the database: `docker-compose down`
- To wipe the database volume: `docker-compose down -v`

---

## Self-hosted (raw server)

For running the app on a VPS, dedicated server, or any non-Vercel environment.

### Requirements

- Node.js `^18.20.2 || >=20.9.0`
- pnpm `^9 || ^10`
- PostgreSQL database (Neon, Supabase, Railway, or self-hosted)

### Install and build

```bash
# Install dependencies
pnpm install

# Build (runs migrations then next build)
pnpm run build
```

Ensure all required environment variables are set before running the build (see the Vercel table above — same variables apply). `DATABASE_URL` and `PAYLOAD_SECRET` are the minimum required to build.

### Start the app

```bash
pnpm start
```

This runs `next start` on port 3000.

### Process management with PM2

Install PM2 globally and use it to keep the app running:

```bash
npm install -g pm2

# Start
pm2 start "pnpm start" --name eprod

# Auto-restart on server reboot
pm2 save
pm2 startup
```

### Nginx reverse proxy

Put this in your Nginx site config to forward traffic from port 80/443 to the app:

```nginx
server {
    listen 80;
    server_name www.eprod-solutions.com eprod-solutions.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Use [Certbot](https://certbot.eff.org/) to add SSL:

```bash
sudo certbot --nginx -d www.eprod-solutions.com -d eprod-solutions.com
```
````

- [ ] **Step 2: Verify the file was created**

Run: `cat docs/deployment.md | head -5`
Expected output: `# Deployment`

- [ ] **Step 3: Commit**

```bash
git add docs/deployment.md
git commit -m "docs: add deployment guide for Vercel, Docker, and self-hosted"
```

---

## Task 4: Write docs/analytics.md

**Files:**
- Create: `docs/analytics.md`

- [ ] **Step 1: Create the file with the full content below**

Write the following content exactly to `docs/analytics.md`:

````markdown
# Analytics

There are two separate analytics systems in this project.

---

## 1. GA4 Event Tracking (frontend)

Tracks page views and user interactions across the site using Google Analytics 4.

### Setup

Add your GA4 Measurement ID to `.env`:

```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Where to find it:** GA4 Admin → Data Streams → select your web stream → **Measurement ID** (starts with `G-`).

### How it works

The `@next/third-parties` package injects the GA4 script into every page via the root layout (`src/app/(frontend)/layout.tsx`). No code changes are needed — adding the env var is sufficient.

### Custom events

Custom event names are defined in `src/lib/ga-events.ts`. To add a new event, add its name as a constant there and call `window.gtag('event', ...)` from the relevant component.

---

## 2. GA4 Reporting API (internal dashboard)

Pulls live traffic data from the GA4 Data API and displays it at `/analytics`. This is for internal team use and requires a Google service account.

### Required environment variables

| Variable | Description |
|---|---|
| `GOOGLE_GA_PROPERTY_ID` | Numeric GA4 Property ID (not the Measurement ID) |
| `GOOGLE_SA_CREDENTIALS` | Full service account JSON, stringified to a single line |

**Where to find the Property ID:** GA4 Admin → Property Settings → **Property ID** (a plain number like `123456789`, not `G-XXXXXXXX`).

### Service account setup (step by step)

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **IAM & Admin → Service Accounts**
2. Click **Create Service Account** — give it a name (e.g. `eprod-ga-reader`)
3. Skip role assignment on the Cloud Console side — permissions are granted in GA4 directly
4. Once created, click the service account → **Keys** tab → **Add Key → Create new key → JSON**
5. Download the JSON file (keep this secret — treat it like a password)
6. In GA4: **Admin → Property Access Management** → click **+** → add the service account email address with **Viewer** role
7. Stringify the JSON for use as an env var:
   ```bash
   # In your terminal (replace with your actual filename)
   node -e "console.log(JSON.stringify(require('./service-account.json')))"
   ```
8. Copy the output and set it as `GOOGLE_SA_CREDENTIALS` in your `.env` or Vercel dashboard

### Reporting implementation

The reporting logic lives in `src/lib/ga-reporting.ts`, which uses the `@google-analytics/data` package to query the GA4 Data API. The admin package (`@google-analytics/admin`) is also installed for property management queries.

### Security note

The `/analytics` route has no authentication at the application level. In production, restrict access at the infrastructure level:

- **Vercel:** use [Password Protection](https://vercel.com/docs/security/password-protection) or configure an allowlist via Vercel Firewall
- **Self-hosted:** add HTTP basic auth in your Nginx config for the `/analytics` path
````

- [ ] **Step 2: Verify the file was created**

Run: `cat docs/analytics.md | head -5`
Expected output: `# Analytics`

- [ ] **Step 3: Commit**

```bash
git add docs/analytics.md
git commit -m "docs: add GA4 tracking and reporting API setup guide"
```

---

## Task 5: Rewrite README.md

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Overwrite README.md with the full content below**

Replace the entire contents of `README.md` with:

````markdown
# eProd Solutions — Marketing Website

The company website for [eProd Solutions](https://www.eprod-solutions.com) — an agri-tech company digitizing agricultural supply chains across Africa. Built with Next.js and Payload CMS.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| CMS | [Payload CMS 3.x](https://payloadcms.com/) (embedded in Next.js) |
| Database | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) |
| Media storage | [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Analytics | [Google Analytics 4](https://analytics.google.com/) (tracking + internal reporting) |
| Testing | [Vitest](https://vitest.dev/) (integration) + [Playwright](https://playwright.dev/) (E2E) |

---

## Prerequisites

- **Node.js** `^18.20.2 || >=20.9.0`
- **pnpm** `^9 || ^10` — install with `npm install -g pnpm`
- **PostgreSQL connection string** — [Neon](https://neon.tech/) (free tier works)

---

## Local Setup

```bash
# 1. Clone the repo
git clone <repo-url>
cd eProd_v2

# 2. Copy and fill in environment variables
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL and PAYLOAD_SECRET

# 3. Install dependencies
pnpm install

# 4. Start the dev server
pnpm dev

# 5. Open the app
open http://localhost:3000
# Admin panel: http://localhost:3000/admin
```

On first run, the admin panel will prompt you to create your first admin user.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (e.g. from Neon) |
| `PAYLOAD_SECRET` | Yes | Random secret for Payload auth — use `openssl rand -hex 32` |
| `NEXT_PUBLIC_SITE_URL` | No | Production domain, no trailing slash. Used by sitemap and robots.txt |
| `BLOB_READ_WRITE_TOKEN` | No | Vercel Blob Storage token. Without it, media uploads are disabled |
| `SMTP_HOST` | No | SMTP server host for sending emails (contact form, CTA emails) |
| `SMTP_PORT` | No | SMTP port (default: `587`) |
| `SMTP_USER` | No | SMTP auth username |
| `SMTP_PASS` | No | SMTP auth password |
| `SMTP_FROM` | No | From address (default: `noreply@eprod.io`) |
| `NEXT_PUBLIC_GA_ID` | No | GA4 Measurement ID (`G-XXXXXXXXXX`) for frontend event tracking |
| `GOOGLE_GA_PROPERTY_ID` | No | GA4 Property ID (numeric) for the `/analytics` reporting dashboard |
| `GOOGLE_SA_CREDENTIALS` | No | Stringified service account JSON for the GA4 Reporting API |

See `.env.example` for the full template.

---

## Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the development server |
| `pnpm devsafe` | Clear `.next` cache then start dev server (use when hot reload breaks) |
| `pnpm build` | Run pending DB migrations, then build for production |
| `pnpm start` | Start the production server (run `pnpm build` first) |
| `pnpm test` | Run all tests (integration + E2E) |
| `pnpm test:int` | Run Vitest integration tests only |
| `pnpm test:e2e` | Run Playwright E2E tests only |
| `pnpm seed` | Seed case studies data into the database |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after CMS schema changes |
| `pnpm lint` | Run ESLint |

---

## Project Structure

```
src/
  app/
    (frontend)/       # Public-facing Next.js pages
    (payload)/        # Payload admin panel and API routes
    api/              # Custom API routes (enquiries, popup registrations, email sending)
  collections/        # Payload CMS collection definitions
  globals/            # Payload CMS global definitions (logo wall, testimonials)
  components/         # React components
  lib/                # Shared utilities, Payload client, GA helpers
  migrations/         # Payload database migrations
tests/
  e2e/                # Playwright end-to-end tests
  int/                # Vitest integration tests
docs/
  cms.md              # CMS collections and globals reference
  deployment.md       # Deployment guide (Vercel, Docker, self-hosted)
  analytics.md        # GA4 tracking and reporting API setup
```

---

## Further Reading

- [CMS Reference](docs/cms.md) — Payload collections and globals, what each one does and which page it feeds
- [Deployment Guide](docs/deployment.md) — Vercel (primary), Docker (local), and self-hosted setup
- [Analytics Setup](docs/analytics.md) — GA4 event tracking and the internal reporting dashboard
````

- [ ] **Step 2: Verify the file looks correct**

Run: `head -3 README.md`
Expected output:
```
# eProd Solutions — Marketing Website

The company website for [eProd Solutions](https://www.eprod-solutions.com)...
```

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for eProd Solutions marketing website"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Add `BLOB_READ_WRITE_TOKEN` to `.env.example` | Task 1 |
| README: project overview | Task 5 |
| README: tech stack | Task 5 |
| README: prerequisites | Task 5 |
| README: local setup steps | Task 5 |
| README: env vars table | Task 5 |
| README: scripts table | Task 5 |
| README: project structure | Task 5 |
| README: links to sub-docs | Task 5 |
| `docs/cms.md`: overview + admin panel location | Task 2 |
| `docs/cms.md`: all 13 collections with purpose + frontend connection | Task 2 |
| `docs/cms.md`: both globals | Task 2 |
| `docs/cms.md`: generate:types + migrations instructions | Task 2 |
| `docs/deployment.md`: Vercel with env vars + Blob setup + build notes | Task 3 |
| `docs/deployment.md`: Docker steps + local media note | Task 3 |
| `docs/deployment.md`: self-hosted with PM2 + Nginx | Task 3 |
| `docs/analytics.md`: GA4 tracking setup + where to find Measurement ID | Task 4 |
| `docs/analytics.md`: Reporting API step-by-step service account setup | Task 4 |
| `docs/analytics.md`: security note on `/analytics` route | Task 4 |

**Placeholder scan:** None found. All file paths, env var names, script names, collection slugs, and component names are verified against the actual codebase.

**Type consistency:** N/A — documentation only, no types or method signatures.
