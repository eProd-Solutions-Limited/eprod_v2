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
