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

Blog posts. The `content` field uses `type: 'blocks'` — authors compose articles from a set of typed blocks: `richText`, `image`, `video`, `gif`, `quote`, `columns`, and `profileQuote`. There is no single Lexical editor for the whole body.

**Key fields:** `title`, `slug`, `excerpt`, `publishedAt`, `author` (relation to Users), `coverImage` (relation to Media), `category` (relation to Categories), `content` (blocks — see above).

**Frontend:** `/insights` (listing page) and `/articles/[slug]` (article detail page — the slug field drives the URL).

### Case Studies (`case-studies`)

Client success stories. SEO plugin enabled. Supports an optional video URL and a CTA link for each case study.

**Key fields:** `title`, `client`, `industry`, `challenge`, `solution`, `results` (Lexical rich text), `heroImage` (relation to Media), `videoUrl`, `ctaLink`, SEO tab.

**Frontend:** `/case-studies` — all case studies are listed on this single page.

### Case Studies Hero (`case-studies-hero`)

Hero banner images for the case studies page. Separate collection from Media to allow Vercel Blob to handle these images independently.

**Frontend:** Hero section at the top of `/case-studies`.

### Team (`team`)

Team member profiles displayed on the About page.

**Key fields:** `name`, `title` (job title), `bio`, `photo` (relation to Media), `linkedin`, `isLeadership` (checkbox — ticked members appear in the Leadership section; unticked in the general Team section), `order` (controls display order).

**Frontend:** `/about` team section → `TeamBannerSection` and `TeamAndEventsSection` components.

### Categories (`categories`)

Tags/categories for articles. Simple collection with a `name` field.

**Frontend:** Article filters on the articles listing.

### Enquiries (`enquiries`)

Contact form submissions. Records are created indirectly via `POST /api/send-cta-email`, which sends a notification email and then saves the enquiry to this collection. Admins can view and manage submissions in the admin panel.

**Key fields:** `company`, `email`, `challenge`, `sourceSection` (which form/section submitted the enquiry), `status` (select: `new` / `contacted` / `qualified` / `won` / `lost`), `notes` (internal notes), `createdAt`.

**Frontend:** Contact form at `/contact` → `POST /api/send-cta-email`.

### Events (`events`)

Company events, conferences, and webinars. Uses Lexical rich text for event description. SEO plugin enabled.

**Key fields:** `title`, `date`, `location`, `description` (Lexical), `image` (relation to Media), SEO tab.

**Frontend:** `/events` (listing) and `/events/[id]` (detail page).

### Jobs (`jobs`)

Open job listings.

**Key fields:** `title`, `department`, `location`, `type` (select: `FULL_TIME` / `PART_TIME` / `CONTRACT`), `description` (textarea), `applyEmail` (optional — defaults to `careers@eprod-solutions.com`), `isActive` (checkbox — uncheck to hide without deleting).

**Frontend:** Jobs/careers section (rendered via the Payload REST API).

### Popups (`popups`)

Configurable site-wide modal popups shown to visitors. The schema is organized into configuration groups:

- **Identity:** `name` (internal label, not visible to visitors), `isActive` (checkbox — only active popups are shown).
- **Scheduling:** `scheduling.startDate` and `scheduling.endDate` — optionally limit when the popup is shown; leave both empty to always show it while active.
- **Display Rules:** `display.pages` (all / homepage / specific), `display.specificPaths` (array of path strings, shown when pages = specific), `display.delay` (seconds before showing), `display.frequency` (every-visit / once-per-session / once-per-day / once-per-week / once-ever).
- **Content:** `content.badge` (small label above the title), `content.title`, `content.body` (rich text), `content.image` (relation to Media).
- **Buttons:** `buttons` — array of action buttons, each with `label`, `action` (link / register / close), `url`, `openInNewTab`, and `style` (primary / secondary / outline / ghost).
- **Registration Settings:** `registration.notifyEmail`, `registration.emailSubject`, `registration.collectName`, `registration.collectPhone`, `registration.collectOrganization`, `registration.successMessage` — configures the form shown when a visitor clicks a Register button.
- **Appearance:** `appearance.size` (sm / md / lg), `appearance.showCloseButton`, `appearance.closeOnOverlayClick`, `appearance.badgeColor`.

**Frontend:** `PopupClient` component on the homepage.

### Popup Registrations (`popup-registrations`)

Form submissions from popups. Created via `POST /api/popup-register`.

**Key fields:** `email`, `name`, `popup` (relation to Popups), `createdAt`.

### CTA Config (`cta-config`)

Configures where enquiry form submissions are delivered — editable without a code deploy. The `POST /api/send-cta-email` route reads the first active record to determine the destination address.

**Key fields:** `title` (internal label, e.g. "Main Enquiries"), `to` (email address that receives enquiry notifications).

**Frontend:** Used server-side by the `POST /api/send-cta-email` route; not directly rendered as a UI component.

---

## Globals

Globals are singleton documents — there is only one per global, edited directly in the admin panel.

### Logo Wall (`logo-wall`)

Partner and client logos displayed on the case studies page. There are two separate arrays:

- `agribusinessLogos` — logos for agribusiness partners.
- `bankLogos` — logos for bank partners.

Each entry has: `name`, `image` (relation to Media), `link` (optional URL — opens in a new tab), `active` (checkbox — uncheck to hide without deleting).

**Frontend:** `LogoCell` component in the homepage partner logos section.

### Voice of Customer (`voice-of-customer`)

Customer testimonials/quotes displayed on the case studies page.

**Key fields:** `quotes` — array of `{ quote, name, role, tag }`. The `tag` field is a short category label shown alongside the quote (e.g. "Bank Partner", "Agribusiness CEO").

**Frontend:** `TestimonialsSection` component.
