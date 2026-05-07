# Insights Page — Design Spec

**Date:** 2026-05-07  
**Status:** Approved

---

## Overview

A public-facing Insights page at `/insights` that aggregates company blog posts (imported from WordPress), company news, events, and culture content into a single browsable feed. Visitors can search by keyword and filter by category. Clicking a post opens the existing article detail page at `/articles/[slug]`.

---

## Routing & URL Structure

- **Page route:** `src/app/(frontend)/insights/page.tsx` — Next.js server component
- **Search params:**
  - `category` — slug of the active category filter (optional; omit for "All")
  - `q` — free-text search string (optional)
  - `page` — page number, integer, defaults to `1`
- **Article detail:** existing `src/app/(frontend)/articles/[slug]/page.tsx` — no changes required
- **Navbar:** add "Insights" link to the existing `Navbar.tsx`

Example URL: `/insights?category=company-news&q=funding&page=2`

---

## Data Model

### New: `Categories` collection

**File:** `src/collections/Categories.ts`

| Field | Type | Notes |
|---|---|---|
| `name` | text | Required. Display label shown in UI and filter pills |
| `slug` | text | Required, unique. Auto-generated from `name`. Used in URL params |

Seeded on first run with four defaults:

| name | slug |
|---|---|
| Articles | `articles` |
| Company News | `company-news` |
| Events | `events` |
| Culture | `culture` |

Editors can add, rename, or remove categories freely via the Payload admin UI. New categories automatically appear as filter pills on the Insights page with no code changes.

### Modified: `Articles` collection

Add one field to the existing `src/collections/Articles.ts`:

| Field | Type | Notes |
|---|---|---|
| `category` | relationship → Categories | Required. Defaults to the "Articles" category on creation |

All existing fields (title, slug, excerpt, publishedAt, author, content blocks) are unchanged.

---

## WordPress Import

**File:** `src/app/api/seed-wordpress/route.ts` — a GET endpoint.

**Behaviour:**
1. Reads `eprodsolutions.WordPress.2026-05-07 (1).xml` from the project root
2. Parses each `<item>` where `wp:post_type` is `post` and `wp:status` is `publish`
3. Maps WordPress category domains to Payload Category slugs:

| WordPress `domain="category"` value | → Payload category slug |
|---|---|
| News & Events | `company-news` |
| Recent Activities | `events` |
| Anything else (General, Field administration, Capacity building, etc.) | `articles` |

4. If a mapped slug does not yet exist in the Categories collection, creates it on the fly
5. Strips WordPress block comment syntax (`<!-- wp:paragraph -->` etc.) from `content:encoded`
6. Inserts each post via `payload.create('articles', {...})` — skips posts whose slug already exists (idempotent, safe to re-run)
7. Returns a JSON summary: `{ imported: N, skipped: N }`

**Fields mapped from XML:**

| Payload field | WordPress source |
|---|---|
| `title` | `<title>` CDATA |
| `slug` | `<wp:post_name>` |
| `excerpt` | `<excerpt:encoded>` CDATA |
| `publishedAt` | `<wp:post_date_gmt>` |
| `author` | `<dc:creator>` — matched to existing Payload Users by login name |
| `content` | `<content:encoded>` — converted to a single RichText block |
| `category` | mapped per table above |

---

## Page Components

### `InsightsHero`

**Location:** `src/components/insights/InsightsHero.tsx` — client component (carousel state)

- Receives the 5 most recent articles (any category) as props from the server page
- Full-width card with brand teal (`hsl(183 97% 18%)`) gradient background; cover image as background if available
- Each slide shows: category badge (pill), title, excerpt (truncated to 2 lines), date, estimated read time, "Read More →" CTA linking to `/articles/[slug]`
- Auto-advances every 5 seconds; pauses on hover
- Dot indicators at the bottom for manual navigation; left/right arrow buttons on desktop
- Uses `shadcn/ui` components where applicable (Button, etc.)

### `InsightsFilterBar`

**Location:** `src/components/insights/InsightsFilterBar.tsx` — client component

- Rendered between the hero and the masonry grid
- Left side: text input (`placeholder="Search articles..."`) debounced 300 ms; on change, updates the `q` URL param and resets `page` to 1
- Right side: category pill buttons — one "All" pill plus one pill per Category fetched from Payload. Active pill uses primary teal fill; inactive uses muted style
- Pill click updates the `category` URL param and resets `page` to 1
- Both actions use `router.push()` to trigger a server re-render; the current `q` and `category` values are read from `useSearchParams()`

### `InsightsMasonryGrid`

**Location:** `src/components/insights/InsightsMasonryGrid.tsx` — server component

- Receives paginated articles as props
- Repeating 3-post pattern rendered as a CSS grid (`grid-template-columns: 1.5fr 1fr`):
  - Post 1 (odd group): large card spanning 2 rows on the left
  - Posts 2 & 3: two smaller cards stacked on the right
- Each card shows: cover image (placeholder teal gradient if absent), category badge, title, 2-line excerpt, publication date, author name
- Entire card is a link to `/articles/[slug]`
- Empty state: if no posts match the current filter/search, shows a centered "No articles found" message with a "Clear filters" link back to `/insights`

### `InsightsPagination`

**Location:** `src/components/insights/InsightsPagination.tsx` — server component

- Receives `currentPage`, `totalPages`, active `category`, and active `q` as props
- Renders: Previous link, up to 5 page number links, Next link
- Each link constructs the full URL preserving the active `category` and `q` params
- Current page number is highlighted; Previous/Next are disabled at the boundaries

---

## Data Fetching

`insights/page.tsx` runs two Payload queries in parallel via `Promise.all`:

```ts
const [{ docs: categories }, { docs: articles, totalDocs }] = await Promise.all([
  payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
  payload.find({
    collection: 'articles',
    limit: 9,
    page: currentPage,
    sort: '-publishedAt',
    where: buildWhere(category, q), // omits clauses when params are absent
  }),
])
```

`buildWhere` constructs:
- `category.slug.equals: category` when `category` param is present
- `or: [{ title: { like: q } }, { excerpt: { like: q } }]` when `q` param is present
- Both combined with `and` when both params are present

The 5 hero posts require a third parallel query — a separate `payload.find` with no `category` or `q` filter, `limit: 5`, sorted by `-publishedAt`. This keeps the hero showing the 5 latest posts regardless of what the visitor is currently filtering.

---

## `.gitignore` Update

Add `.superpowers/` to `.gitignore` to exclude brainstorm session files.

---

## Out of Scope

- Article detail page changes (existing `/articles/[slug]` is sufficient)
- Comments or social sharing on articles
- RSS feed
- Multi-language filtering (French posts in the WordPress export will be imported as-is under the `articles` category)
