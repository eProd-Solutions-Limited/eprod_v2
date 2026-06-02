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
