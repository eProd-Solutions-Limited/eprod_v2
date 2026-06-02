# WordPress + Elementor Migration Plan (Updated)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the eProd Next.js marketing site to WordPress + Elementor so a non-technical person can own and edit the design going forward.

**Architecture:** All 10 marketing pages are recreated as Elementor-built WordPress pages. Dynamic content (logo walls, team, testimonials, case studies, events, blog posts) uses WordPress Custom Post Types managed via ACF. The `/analytics` and `/dashboard` pages are internal app pages and are NOT migrated. The floating DemoRequest form and site-wide popup become Elementor Popups.

**Tech Stack:** WordPress (latest), Elementor Pro, Hello Elementor theme, Advanced Custom Fields (ACF) Pro, WPForms Pro, Yoast SEO, WP Rocket, Site Kit by Google, Smush, Redirection.

---

## What Changed Since the Previous Plan

These are net-new items that were not in the May 2026 plan:

| New Item | Where it appears | WordPress equivalent |
|---|---|---|
| `SectionScoop` wave dividers | Every page, between sections | Elementor built-in Shape Divider |
| `ProductShowcaseSection` | Home | New Elementor section |
| `VideoHighlightsSection` (3 YouTube videos) | Home | Elementor Video Carousel / Tabs |
| `TeamAndEventsSection` | Home | Elementor section pulling Events CPT |
| `CareersSection` | About | New Elementor section |
| `Sectors` page + `SectorCards`, `ValueChainBlock`, `SectorsFAQ` | `/sectors` | New WordPress page |
| `Events` listing page | `/events` | Events Custom Post Type archive |
| `Events` detail page | `/events/[id]` | Events CPT single template |
| `ImpactGrid` (case studies CPT cards) | Case Studies | Elementor Posts widget on CPT |
| `DemoRequestFAB` (floating form, site-wide) | All pages | Elementor Popup with WPForms |
| `PopupClient` (marketing popup) | All pages | Elementor Popup |
| `MeetTheFounders` section **removed** from About | — | Do not recreate |

---

## Pages to Migrate

| Page | URL | Status |
|---|---|---|
| Home | `/` | Updated — 3 new sections added |
| About | `/about` | Updated — CareersSection added, MeetTheFounders removed |
| Solutions | `/solutions` | Unchanged from previous plan |
| Case Studies | `/case-studies` | Updated — ImpactGrid replaces old carousel |
| Sectors | `/sectors` | NEW |
| Events listing | `/events` | NEW |
| Event detail | `/events/[id]` | NEW |
| Insights (Blog) | `/insights` | Unchanged from previous plan |
| Article | `/articles/[slug]` | Unchanged from previous plan |
| Contact | `/contact` | Unchanged from previous plan |

**Not migrated:** `/analytics`, `/dashboard`

---

## Phase 1 — Preparation

### Task 1: Extract All Copy & Assets

- [ ] **Step 1: Copy all text content from every page**

Open each page in the live site and copy every heading, paragraph, stat, label, and button text into a shared Google Doc, organized by page → section. Cover all 10 pages. Include:
- All hero headings and subheadings
- All body copy paragraphs
- Stat numbers (e.g. "250+ clients", "20+ countries", "1M+ farmer records")
- Button labels and their destination URLs
- All FAQ questions and answers (Home FAQ, About FAQ, Sectors FAQ)
- All sector names and descriptions from `/sectors`
- All video titles and YouTube IDs from the VideoHighlightsSection (IDs: `K60ZdON-xO0`, `2ipMHeav6go`, `H8JB5GRUyE4`)
- CareersSection copy
- DemoRequestFAB form field labels
- PopupClient headline and CTA text

- [ ] **Step 2: Download all images and logos from Payload CMS**

From the Payload admin at `/admin`, download and organize into folders:
```
wp-migration-assets/
  logos/agribusiness/     ← agribusiness logo wall
  logos/banks/            ← bank logo wall
  team/                   ← team headshots
  case-studies/           ← case study images
  events/                 ← event photos
  sectors/                ← any sector illustrations
  misc/                   ← hero images, product screenshots
```

- [ ] **Step 3: Export all Events from Payload CMS**

In Payload admin → Events collection, for each event record copy:
- Event name
- Venue
- Start date and end date
- Description (rich text)
- All photos with their labels
- Status (upcoming / ongoing / past)

- [ ] **Step 4: Export all Case Studies from Payload CMS**

In Payload admin → Case Studies collection, for each record copy:
- Client name
- Industry / sector
- Challenge description
- Results / impact stats
- Featured image

- [ ] **Step 5: Export all Blog Posts (Articles) from Payload**

For each article:
- Title, slug, publication date
- Author name
- Featured image
- Full body content (copy rendered HTML from the browser or paste from Payload editor)
- Category / tags

- [ ] **Step 6: Record brand colors and fonts**

Open `src/app/globals.css`. Copy these exact CSS custom property values:
- `--primary` (the brand green)
- `--secondary`
- `--background`
- `--foreground`
- `--muted-foreground`
- `--card`
- `--border`

Also note the font family used (check `src/app/layout.tsx` for Google Font imports).

---

## Phase 2 — WordPress & Plugin Setup

### Task 2: Install WordPress and Core Plugins

- [ ] **Step 1: Provision WordPress hosting**

Recommended hosts (all have 1-click WordPress install):
- **WP Engine** — best for client handover (managed, secure, staging environment)
- **Kinsta** — alternative
- **SiteGround** — budget option

Create a site. Get the WP Admin URL (`https://yourdomain.com/wp-admin`).

- [ ] **Step 2: Install Hello Elementor theme**

WP Admin → Appearance → Themes → Add New → search "Hello Elementor" → Install → Activate.

- [ ] **Step 3: Install Elementor Pro**

Purchase at elementor.com. WP Admin → Plugins → Add New → Upload Plugin → upload the `.zip` → Install → Activate → enter license key.

- [ ] **Step 4: Install Advanced Custom Fields Pro**

Purchase at advancedcustomfields.com. Same upload process as above.

- [ ] **Step 5: Install remaining plugins**

WP Admin → Plugins → Add New → install and activate each:

| Plugin | Purpose | Cost |
|---|---|---|
| Yoast SEO | Meta tags, structured data | Free |
| WPForms Pro | Contact + Demo request forms | ~$199/yr |
| WP Rocket | Page caching, performance | ~$49/yr |
| Smush | Image compression | Free |
| Redirection | 301 redirect management | Free |
| Site Kit by Google | GA4 tracking + Search Console | Free |
| Custom Post Type UI | Register Events + Case Studies CPTs | Free |

- [ ] **Step 6: Set permalink structure**

WP Admin → Settings → Permalinks → select "Post name" → Save Changes.

---

## Phase 3 — Custom Post Types

### Task 3: Register Events Custom Post Type

Events are currently stored in Payload CMS. In WordPress, they become a Custom Post Type.

- [ ] **Step 1: Register Events CPT via Custom Post Type UI plugin**

WP Admin → CPT UI → Add/Edit Post Types:
- Post Type Slug: `events`
- Plural Label: `Events`
- Singular Label: `Event`
- Has Archive: Yes
- Rewrite Slug: `events`
- Supports: Title, Editor, Thumbnail

- [ ] **Step 2: Add ACF field group for Events**

WP Admin → ACF → Field Groups → Add New. Name it "Event Details". Add these fields:

| Field Label | Field Name | Field Type | Notes |
|---|---|---|---|
| Venue | `venue` | Text | Required |
| Start Date | `start_date` | Date Picker | Required |
| End Date | `end_date` | Date Picker | Optional |
| Status | `status` | Select | Choices: upcoming, ongoing, past |
| Event Photos | `event_photos` | Repeater | Sub-field: `photo` (Image), `caption` (Text) |

Set Location rule: Post Type = Event.

- [ ] **Step 3: Enter all events**

WP Admin → Events → Add New. For each event from the export in Task 1 Step 3:
- Set title = event name
- Set body = event description
- Upload featured image (first photo)
- Fill in all ACF fields (venue, start_date, end_date, status)
- Add all photos in the Event Photos repeater

### Task 4: Register Case Studies Custom Post Type

- [ ] **Step 1: Register Case Studies CPT**

WP Admin → CPT UI → Add/Edit Post Types:
- Post Type Slug: `case-studies`
- Plural Label: `Case Studies`
- Singular Label: `Case Study`
- Has Archive: No (the `/case-studies` page is a manually built Elementor page)
- Supports: Title, Editor, Thumbnail

- [ ] **Step 2: Add ACF field group for Case Studies**

WP Admin → ACF → Field Groups → Add New. Name it "Case Study Details". Add:

| Field Label | Field Name | Field Type |
|---|---|---|
| Client Name | `client_name` | Text |
| Sector | `sector` | Text |
| Challenge | `challenge` | Textarea |
| Impact Stat 1 Label | `stat_1_label` | Text |
| Impact Stat 1 Value | `stat_1_value` | Text |
| Impact Stat 2 Label | `stat_2_label` | Text |
| Impact Stat 2 Value | `stat_2_value` | Text |
| Impact Stat 3 Label | `stat_3_label` | Text |
| Impact Stat 3 Value | `stat_3_value` | Text |

Set Location rule: Post Type = Case Study.

- [ ] **Step 3: Enter all case studies**

WP Admin → Case Studies → Add New. For each case study from Task 1 Step 4:
- Title = client name / project name
- Featured image = case study image
- Fill in all ACF fields

---

## Phase 4 — Global Design & Templates

### Task 5: Configure Global Colors and Fonts

- [ ] **Step 1: Set Elementor global colors**

Open any page with Elementor → hamburger menu → Global Colors. Add:

| Name | CSS value (from your Task 1 Step 6 notes) |
|---|---|
| Brand Green | value of `--primary` |
| Secondary | value of `--secondary` |
| Background | value of `--background` |
| Text Primary | value of `--foreground` |
| Text Muted | value of `--muted-foreground` |
| Card | value of `--card` |
| Border | value of `--border` |

- [ ] **Step 2: Set Elementor global fonts**

Elementor → hamburger → Global Fonts. Set Primary and Secondary to the font family from `src/app/layout.tsx`.

If it is a Google Font, go to Elementor → Site Settings → Custom Fonts OR just paste the Google Fonts `@import` URL in Elementor → Site Settings → Custom CSS.

- [ ] **Step 3: Set content width**

Elementor → Site Settings → Layout → Content Width: `1280` (or match the `container` max-width from the current site's Tailwind config).

### Task 6: Build the Header (Navbar)

Reference: `src/components/Navbar.tsx`

Contains: Logo left, nav links center/right (Home, Solutions, Sectors, Case Studies, Events, Insights, About, Contact), "Book a Demo" CTA button right.

- [ ] **Step 1: Create header template**

WP Admin → Templates → Theme Builder → Add New → select "Header" → name it "Main Header".

- [ ] **Step 2: Build the navbar in Elementor**

Layout: 2-column section (sticky, 100% width, white background, border-bottom).
- Left column: Image widget → upload eProd logo → link to homepage
- Right column: Nav Menu widget (assign the menu from Step 3) + Button widget ("Book a Demo", links to `/contact`)

- [ ] **Step 3: Create the WordPress navigation menu**

WP Admin → Appearance → Menus → Create New → name "Main Navigation". Add pages:
Home, Solutions, Sectors, Case Studies, Events, Insights, About, Contact.

Return to the Elementor header template and assign this menu to the Nav Menu widget.

- [ ] **Step 4: Publish with conditions**

Publish → Set Conditions → Include: Entire Site.

### Task 7: Build the Footer

Reference: `src/components/Footer.tsx`

- [ ] **Step 1: Create footer template**

WP Admin → Templates → Theme Builder → Add New → "Footer" → name "Main Footer".

- [ ] **Step 2: Build footer in Elementor**

4-column section:
- Col 1: Image widget (logo) + Text Editor widget (tagline + address)
- Col 2: Heading ("Solutions") + Icon List widget (links to Solutions, Sectors, Case Studies)
- Col 3: Heading ("Company") + Icon List widget (links to About, Events, Insights, Contact)
- Col 4: Heading ("Follow Us") + Social Icons widget (LinkedIn, Twitter/X, YouTube)

Bottom bar: 1-column section, Text Editor widget ("© 2026 eProd Solutions Limited. All rights reserved.").

- [ ] **Step 3: Publish with conditions**

Publish → Set Conditions → Include: Entire Site.

---

## Phase 5 — Site-Wide Overlays

### Task 8: DemoRequestFAB → Elementor Popup

The floating "Book a Demo" form (`src/components/DemoRequestFAB.tsx`) appears on every page. Recreate as an Elementor Popup triggered by a floating button.

- [ ] **Step 1: Build the demo request form in WPForms**

WP Admin → WPForms → Add New → name "Demo Request". Add fields:
- Company Name (Single Line Text, required)
- Email Address (Email, required)
- Phone Number (Phone, optional)
- Main Challenge (Dropdown with options: Farmer Data Management, Compliance & Traceability, Access to Finance, Payments, Other)
- Message (Paragraph Text, optional)

Notifications: set "Send To" to the business email address.
Confirmations: set a success message: "Thank you! We'll be in touch within 24 hours."

- [ ] **Step 2: Create Elementor Popup for the form**

WP Admin → Templates → Popups → Add New → name "Demo Request Popup".
- Build layout: Heading ("Request a Demo") + Text ("Fill in your details and we'll get back to you within 24 hours") + WPForms widget (select "Demo Request" form)
- Popup Settings: width 480px, overlay background black 60% opacity, close button enabled

- [ ] **Step 3: Add a floating button to trigger the popup**

In the Main Footer template (or a dedicated global section):
Add a Button widget: label "Book a Demo", style = fixed position (bottom-right). Set the button's link to `#` and apply an Elementor Popup trigger action pointing to the Demo Request popup.

Alternatively use Elementor's built-in Floating Bar template to create a sticky button.

- [ ] **Step 4: Set popup conditions**

Popup → Settings → Conditions: Include → Entire Site.

### Task 9: PopupClient → Elementor Marketing Popup

Reference: `src/components/PopupClient.tsx`

- [ ] **Step 1: Create Elementor Popup for marketing**

WP Admin → Templates → Popups → Add New → name "Marketing Popup".
Build the layout matching the current popup: headline, subtext, CTA button.

- [ ] **Step 2: Configure trigger and display rules**

Popup → Settings:
- Trigger: On Page Load, after 5 seconds
- Conditions: Include → Entire Site
- Display Conditions: Show once per session (Advanced → Frequency: Once per session)

---

## Phase 6 — Recreate Each Page

### Task 10: Home Page

Reference: `src/app/(frontend)/page.tsx`

**Sections in order:**
Hero → SectionScoop → Problem → SectionScoop → Solution → SectionScoop → BankPartnerships → Proof → HowItWorks → SectionScoop → Testimonials → SectionScoop → Differentiation → ProductShowcase → VideoHighlights → TeamAndEvents → FAQ → CTA

> **SectionScoop note:** Replicate the wave transition between sections using Elementor's built-in Shape Divider. On the *bottom* of a white section going into gray: Section → Style → Shape Divider → Bottom → choose "Wave" → flip = yes → color = `hsl(210 20% 91%)`. On the *bottom* of a gray section going into white: color = `hsl(0 0% 100%)`.

- [ ] **Step 1: Create the Home page**

WP Admin → Pages → Add New → title "Home" → Edit with Elementor.

- [ ] **Step 2: Hero section**

Reference: `src/components/HeroSection.tsx`

Full-width section, gradient primary background (or brand green). Add:
- Heading widget: main headline
- Text Editor widget: subheading paragraph
- Button widgets: primary CTA + secondary CTA
- Image widget: any hero illustration/screenshot

- [ ] **Step 3: Problem section**

Reference: `src/components/ProblemSection.tsx`

Gray background section. Add:
- Heading widget: section title
- 3-column inner section with Icon Box widgets (one per problem point: icon + title + description)

Add Shape Divider (Wave) on the top of this section (coming from white) and bottom (going to white).

- [ ] **Step 4: Solution section**

Reference: `src/components/SolutionSection.tsx`

White background. Add:
- Heading widget: section title
- Grid of Image Box or Card widgets for each solution feature

- [ ] **Step 5: Bank Partnerships section**

Reference: `src/components/BankPartnershipsSection.tsx`

Gray background. Add:
- Heading widget: section title
- Image Carousel widget: upload all bank logos from Task 1 Step 2

- [ ] **Step 6: Proof / Logo Wall section**

Reference: `src/components/ProofSection.tsx`

Two subsections:
1. Stats row: Counter widgets (or Heading widgets) for each key stat — "250+", "20+", "1M+"
2. Logo carousel: Image Carousel widget with agribusiness logos

- [ ] **Step 7: How It Works section**

Reference: `src/components/HowItWorksSection.tsx`

White background. Numbered steps layout:
- Heading widget: "How It Works"
- Steps: use Icon Box widgets in a horizontal row — numbered icons + title + description for each step

- [ ] **Step 8: Testimonials section**

Reference: `src/components/TestimonialsSection.tsx`

Gray background. Add:
- Heading widget
- Slides widget (Elementor Pro): one slide per testimonial quote from the Voice of Customer export

- [ ] **Step 9: Differentiation section**

Reference: `src/components/DifferentiationSection.tsx`

White background. Add:
- Heading widget: section headline
- Comparison or feature list: Icon List widget or a 2-column layout comparing eProd vs alternatives

- [ ] **Step 10: Product Showcase section**

Reference: `src/components/ProductShowcaseSection.tsx`

This section has a gradient/primary-color background. Add:
- Heading widget: section headline
- Image widget(s): product screenshots
- Text + Button widgets for each showcase item

Add Shape Divider on top (wave from white → gradient) and bottom (wave from gradient → white).

- [ ] **Step 11: Video Highlights section**

Reference: `src/components/VideoHighlightsSection.tsx` — contains 3 YouTube videos:
- `K60ZdON-xO0` — "eProd Platform Overview"
- `2ipMHeav6go` — "Supply Chain Digitalization with eProd"
- `H8JB5GRUyE4` — "eProd in Action — Farmer Management"

Add:
- Heading widget: "Watch eProd in Action" (or current heading text from site)
- Tabs widget (Elementor Pro): one tab per video → inside each tab, add a Video widget pointing to the YouTube URL
  - Tab 1: label "Platform Overview" → Video URL: `https://www.youtube.com/watch?v=K60ZdON-xO0`
  - Tab 2: label "Supply Chain" → Video URL: `https://www.youtube.com/watch?v=2ipMHeav6go`
  - Tab 3: label "Farmer Management" → Video URL: `https://www.youtube.com/watch?v=H8JB5GRUyE4`

- [ ] **Step 12: Team & Events section**

Reference: `src/components/TeamAndEventsSection.tsx`

This combines a team banner + upcoming events preview.

Two sub-sections:
1. Team banner: Heading + a row of team member cards (Image + Heading for name + Text for title). Pull data from the team export.
2. Events preview: Heading "Upcoming Events" + Posts widget (Elementor Pro) configured to show the Events CPT, filtered by `status = upcoming`, limit 3 cards. Each card shows: Event name, date (from `start_date` ACF field), venue.

- [ ] **Step 13: FAQ section**

Reference: `src/components/FAQSection.tsx`, data from `src/data/faqs.ts`

White background. Add:
- Heading widget: "Frequently Asked Questions"
- Accordion widget: add each Q&A pair from the faqs file

- [ ] **Step 14: CTA section**

Reference: `src/components/CTASection.tsx`

Contrasting background (brand green or gradient). Add:
- Heading widget: CTA headline
- Text Editor widget: subtext
- Button widget: "Book a Demo" (triggers the Demo Request popup from Task 8)

- [ ] **Step 15: Set as front page**

WP Admin → Settings → Reading → "A static page" → Front Page: Home → Save.

### Task 11: About Page

Reference: `src/app/(frontend)/about/page.tsx`

**Sections in order:** AboutHero → SectionScoop → VisionMission → SectionScoop → OurStory → SectionScoop → AgFintechIdentity → SectionScoop → MarketLeadership → SectionScoop → BankPartnersAbout → SectionScoop → LeadershipTeam → CareersSection → SectionScoop → AboutFAQ → AboutCTA

**Note:** MeetTheFounders has been removed from the About page — do not recreate it.

- [ ] **Step 1: Create the About page**

WP Admin → Pages → Add New → title "About" → Edit with Elementor.

- [ ] **Step 2: Build sections in order**

For each section, create a new Elementor section with the matching background color (white or gray) and add Shape Dividers at the transition points.

1. **AboutHero** — Full-width hero, gradient background, heading + subtext
2. **VisionMission** — Gray bg, 2-column: Vision left / Mission right, each with icon + heading + body text
3. **OurStory** — White bg, text-heavy section with a pull-quote box at the bottom ("We didn't just build a product; we built the solution to our own problem.") — use Blockquote widget or a styled Text Editor widget
4. **AgFintechIdentity** — Gray bg, headline + feature list/grid
5. **MarketLeadership** — White bg, stats or badge row (Counter widgets or styled Heading widgets)
6. **BankPartnersAbout** — Gray bg, heading + Image Carousel with bank logos
7. **LeadershipTeam** — White bg, team grid: for each team member create an Image Box widget (photo, name, title) + add a link icon to their LinkedIn URL
8. **CareersSection** — White bg (no scoop before it), heading + body text + CTA button linking to `/contact` or a job listings URL
9. **AboutFAQ** — Gray bg, Accordion widget with the 3 FAQs from the About page
10. **AboutCTA** — CTA banner matching CTASection style

### Task 12: Solutions Page

Reference: `src/app/(frontend)/solutions/page.tsx`

- [ ] **Step 1: Create the Solutions page**

WP Admin → Pages → Add New → title "Solutions" → Edit with Elementor.

- [ ] **Step 2: Build sections in order**

1. **SolutionsHero** (`src/components/solutions/SolutionsHero.tsx`) — Hero banner with heading, subtext, CTA button
2. **PlatformArchitecture** (`src/components/solutions/PlatformArchitecture.tsx`) — Architecture diagram: use Image widget for any diagrams; Icon Box widgets for feature breakdown
3. **DataFlow** (`src/components/solutions/DataFlow.tsx`) — Flow diagram: use Image widget if it's a static illustration, or a horizontal steps layout with Icon Box widgets
4. **SecurityCompliance** (`src/components/solutions/SecurityCompliance.tsx`) — Compliance badges/logos + feature list: Image Grid widget + Icon List widget
5. **Integrations** (`src/components/solutions/Integrations.tsx`) — Logo grid of integration partners: Image Gallery widget
6. **SolutionsCTA** (`src/components/solutions/SolutionsCTA.tsx`) — CTA banner

### Task 13: Case Studies Page

Reference: `src/app/(frontend)/case-studies/page.tsx`

- [ ] **Step 1: Create the Case Studies page**

WP Admin → Pages → Add New → title "Case Studies" → Edit with Elementor.

- [ ] **Step 2: Build CaseStudiesHero**

Reference: `src/components/case-studies/CaseStudiesHero.tsx`

Full-width hero section with heading and subtext. Dark background with gradient overlay.

- [ ] **Step 3: Build LogoWall**

Reference: `src/components/case-studies/LogoWall.tsx`

Gray background section. Two rows of logos:
- Row 1: "Our Clients" — Image Carousel with agribusiness logos
- Row 2: "Banking Partners" — Image Carousel with bank logos

- [ ] **Step 4: Build ImpactGrid (Case Study Cards)**

Reference: `src/components/case-studies/ImpactGrid.tsx`

This is a grid of cards pulled from the Case Studies CPT (set up in Task 4).

White background section. Add:
- Heading widget: "Client Impact"
- Posts widget (Elementor Pro): set Post Type = `case-studies`, layout = Grid, columns = 3, limit = 12
- In the Posts widget skin settings, show: Thumbnail, Title, custom field `sector`, custom field `stat_1_value` + `stat_1_label`

- [ ] **Step 5: Build DifferentiatorBanner**

Reference: `src/components/case-studies/DifferentiatorBanner.tsx`

Gradient/primary background section with Shape Dividers top and bottom. Add:
- Heading widget: banner headline
- Text Editor widget: supporting text

- [ ] **Step 6: Build VoiceOfCustomer**

Reference: `src/components/case-studies/VoiceOfCustomer.tsx`

Gray background. Add:
- Heading widget: "What Our Clients Say"
- Slides widget: one slide per testimonial quote from the Voice of Customer export

- [ ] **Step 7: Build CaseStudiesCTA**

CTA banner with heading + "Book a Demo" button (triggers Demo Request popup).

### Task 14: Sectors Page

Reference: `src/app/(frontend)/sectors/page.tsx` — **This is a NEW page not in the previous plan.**

- [ ] **Step 1: Create the Sectors page**

WP Admin → Pages → Add New → title "Sectors" → Edit with Elementor.

- [ ] **Step 2: Build SectorsHero**

Reference: `src/components/sectors/SectorsHero.tsx`

Hero section with heading ("Tailored Solutions for Every Value Chain" or similar), subtext, and brand background.

- [ ] **Step 3: Build SectorCards**

Reference: `src/components/sectors/SectorCards.tsx`

Grid of sector cards. The 12 sectors are: Coffee/Cocoa/Tea, Horticulture, Dairy, Seeds, Grains & Pulses, Spices, Nuts, Apiculture, Oil & Tree Crops, Pisciculture, Poultry, Rubber & Gum.

Add an inner section with a 3 or 4-column grid. For each sector use an Icon Box widget with:
- An appropriate icon (Lucide/Font Awesome equivalent)
- Sector name as heading
- 1-2 sentence description of what eProd offers for that sector

- [ ] **Step 4: Build ValueChainBlock**

Reference: `src/components/sectors/ValueChainBlock.tsx`

This explains the value chain approach. Add:
- Heading widget: section title
- A visual flow or tabbed layout. Use Tabs widget (Elementor Pro) or a 3-step horizontal layout with Icon Box widgets showing the value chain stages.

- [ ] **Step 5: Build SectorsFAQ**

Reference: `src/components/sectors/SectorsFAQ.tsx`

Two FAQs from the sectors page schema:
- "Does eProd support multi-value chain operations?" → "Yes. Manage multiple commodities within one unified system."
- "Can eProd handle certification audits?" → "Yes. The platform stores all required data for Organic, Fairtrade and EUDR audits."

Add Accordion widget with these two entries.

### Task 15: Events Listing Page

Reference: `src/app/(frontend)/events/page.tsx` — **NEW page.**

- [ ] **Step 1: Create Events listing page template in Elementor**

WP Admin → Templates → Theme Builder → Add New → Archive → name "Events Archive".

- [ ] **Step 2: Build the hero section**

Heading widget: "Events & Webinars" (or the heading from `src/components/EventsSection.tsx`). Subtext paragraph.

- [ ] **Step 3: Build the events grid**

Add a Posts widget (Elementor Pro):
- Post Type: `events`
- Layout: Grid or Cards, 3 columns
- Order by: `start_date` ACF field (descending — newest first)
- Each card shows: Featured Image, Event Name (title), Venue (ACF field), Start Date (ACF field), Status badge (ACF field)

To display the Status badge with color coding, use Elementor's Dynamic Tags on a Heading or Badge widget linked to the `status` ACF field. Alternatively, manually create separate sections for "Upcoming Events" and "Past Events" using two Posts widgets each filtered by status.

- [ ] **Step 4: Set archive conditions**

Publish → Set Conditions → Post Type Archive → Events.

### Task 16: Event Detail Page Template

Reference: `src/app/(frontend)/events/[id]/page.tsx` — **NEW.**

- [ ] **Step 1: Create Single Event template in Elementor**

WP Admin → Templates → Theme Builder → Add New → Single Post → name "Event Detail".

- [ ] **Step 2: Build the hero**

Full-width section, dark overlay on featured image. Add:
- Background Image: Post Featured Image (dynamic tag)
- Background Overlay: black, 70% opacity
- Heading widget → Dynamic Tag → Post Title
- Text Editor widget → Dynamic Tag → ACF field `venue`
- Text Editor widget → Dynamic Tag → ACF field `start_date`

- [ ] **Step 3: Build the content area**

Below the hero:
- Heading "About This Event" + Post Content widget (renders the event description)
- Heading "Photos" + Image Gallery widget → Dynamic Tag → ACF Repeater field `event_photos`

- [ ] **Step 4: Set conditions**

Publish → Set Conditions → Post Type → Events → All.

### Task 17: Contact Page

Reference: `src/app/(frontend)/contact/page.tsx`

- [ ] **Step 1: Create Contact page**

WP Admin → Pages → Add New → title "Contact" → Edit with Elementor.

- [ ] **Step 2: Build ContactHero**

Reference: `src/components/contact/ContactHero.tsx`

Hero section: Heading widget + Text Editor widget (copy the heading and subtext from the current site).

- [ ] **Step 3: Build the contact form**

In WPForms → Add New → name "Contact Form". Add fields matching `src/components/contact/ContactForm.tsx`:
- Full Name (Single Line Text, required)
- Email Address (Email, required)
- Company (Single Line Text, optional)
- Subject / Topic (Dropdown or Single Line Text)
- Message (Paragraph Text, required)

Notifications: set "Send To" to the business contact email.

- [ ] **Step 4: Embed form in Elementor**

On the Contact page in Elementor editor: add a WPForms widget → select "Contact Form". Style to match page width.

---

## Phase 7 — Blog & Insights

### Task 18: Configure WordPress Blog

- [ ] **Step 1: Set up the Insights page**

WP Admin → Pages → Add New → title "Insights" → leave content empty → Publish.
WP Admin → Settings → Reading → Posts page = "Insights".

- [ ] **Step 2: Create Blog Archive template**

WP Admin → Templates → Theme Builder → Add New → Archive → name "Insights Archive".

Build the masonry/grid layout matching `src/components/insights/InsightsMasonryGrid.tsx`:
- Posts widget (Elementor Pro): Post Type = Posts, layout = Masonry or Grid, 3 columns
- Each card: Featured Image, Category (Term widget), Title, Excerpt, Date, Read More link

Add the Insights Hero section at the top (Heading "Insights" + subtext + filter bar — use Elementor's Search widget or a static Tag Cloud widget for category filtering).

Set Conditions: Blog / Posts Archive.

- [ ] **Step 3: Create Single Article template**

WP Admin → Templates → Theme Builder → Add New → Single Post → name "Article Detail".

Build layout:
- Post Title widget
- Post Info widget (date + author)
- Post Featured Image widget
- Post Content widget
- Navigation: Post Navigation widget (previous/next article)

Set Conditions: Post Type → Posts → All.

- [ ] **Step 4: Migrate all blog posts**

For each article from the export in Task 1 Step 5:

WP Admin → Posts → Add New:
- Title: paste the article title
- Body: paste the article content (use the HTML editor if copying formatted HTML)
- Featured image: upload the article's featured image
- Date: set the original publication date (edit the "Published on" field)
- Categories: create a category if it doesn't exist, then assign
- Yoast SEO panel: fill in the meta description

Repeat for every article. If there are 20+ posts, use WP All Import plugin to bulk-import from a CSV/XML export instead.

- [ ] **Step 5: Set article permalink to match old format**

WP Admin → Settings → Permalinks → Custom Structure: `/articles/%postname%`

This ensures `/articles/my-post-slug` URLs work, matching the current site.

---

## Phase 8 — SEO

### Task 19: Configure Yoast SEO

- [ ] **Step 1: Run Yoast setup wizard**

WP Admin → Yoast SEO → General → First-time configuration. Complete all steps:
- Site name: "eProd Solutions"
- Organization: eProd Solutions Limited
- Logo: upload the eProd logo
- Connect Google Search Console

- [ ] **Step 2: Set Organization schema**

Yoast → Search Appearance → General → Knowledge Graph:
- Organization name: eProd Solutions
- Organization logo: eProd logo
- Social URLs: LinkedIn, Twitter, YouTube

This replaces the hardcoded `organizationSchema` JSON-LD in the Next.js `page.tsx`.

- [ ] **Step 3: Set meta titles and descriptions for each page**

On each page in the WordPress editor, scroll to the Yoast SEO panel. Set SEO title and meta description for:
- Home
- About
- Solutions
- Sectors
- Case Studies
- Events
- Insights
- Contact

Use the meta values from the current site's `<head>` tags or the `metadata` exports in the Next.js page files.

- [ ] **Step 4: Enable FAQ structured data**

Yoast automatically adds FAQ schema when you use its FAQ Block in the WordPress editor. Alternatively, the Accordion widget data is sufficient — Yoast will pick up FAQ markup. Verify each FAQ page with Google's Rich Results Test after launch.

### Task 20: Connect Google Analytics

- [ ] **Step 1: Configure Site Kit by Google**

WP Admin → Site Kit → Start Setup → follow the wizard to connect:
- Google Analytics 4 (use the same GA4 Measurement ID from `NEXT_PUBLIC_GA_ID` in `.env`)
- Google Search Console

This replaces all the custom `gaEvents` tracking code. Standard GA4 page views will be tracked automatically. If specific event tracking (form submissions, video plays, FAQ opens) is needed, configure GA4 custom events via the GA4 interface or Google Tag Manager.

---

## Phase 9 — URL Redirects

### Task 21: Configure Redirects

- [ ] **Step 1: Verify permalink structure matches**

The article permalink `/articles/%postname%` was set in Task 18 Step 5. This means `/articles/my-post-slug` URLs are preserved automatically — no redirect needed for articles.

- [ ] **Step 2: Add redirects for changed page URLs**

Using the Redirection plugin (WP Admin → Tools → Redirection):

| Old URL | New URL | Note |
|---|---|---|
| `/insights` | `/insights` | Same — only if WP uses `/blog` instead, redirect `/blog` → `/insights` |
| `/sectors` | `/sectors` | Same — ensure this page slug is set to `sectors` |
| `/events` | `/events` | Same — ensure CPT archive is at `/events` |

- [ ] **Step 3: Test all redirects**

Visit each old URL in a browser and confirm:
- The URL changes in the address bar (301 redirect fired)
- The correct page loads
- No redirect loops

---

## Phase 10 — Performance & Launch

### Task 22: Performance Setup

- [ ] **Step 1: Configure WP Rocket**

WP Admin → WP Rocket:
- Page Caching: On
- Browser Caching: On
- Minify CSS: On
- Minify JS: On (test carefully — can break Elementor; disable if pages look broken)
- Lazy Load Images: On

- [ ] **Step 2: Compress all images with Smush**

WP Admin → Smush → Bulk Smush → run on all uploaded media.

### Task 23: Pre-Launch QA

- [ ] **Step 1: Desktop + mobile check for all pages**

For each of the 10 pages, verify on desktop (1280px) and mobile (375px):
- [ ] Layout matches the design intent — no overflowing content, broken columns, or misaligned elements
- [ ] All text is correct — no placeholder or Lorem Ipsum text
- [ ] All images load — no broken image icons
- [ ] All links go to the correct destination
- [ ] Section wave dividers (Shape Dividers) render correctly
- [ ] Mobile hamburger menu opens and all nav items are accessible

- [ ] **Step 2: Test the Demo Request form (FAB popup)**

Click the floating "Book a Demo" button. Fill in the form and submit. Verify:
- Success message appears
- Email arrives at the configured business address
- No error appears in the browser console

- [ ] **Step 3: Test the Contact form**

Visit `/contact`, submit a test message. Verify email delivery.

- [ ] **Step 4: Test the marketing popup**

Open a page in a fresh private/incognito browser window. Wait 5 seconds. Verify the popup appears. Close it. Refresh — it should not appear again in the same session.

- [ ] **Step 5: Test Events pages**

Visit `/events` and confirm:
- Events listing shows all migrated events
- Upcoming events display a green status badge
- Past events display a gray badge
- Clicking an event goes to the correct detail page

- [ ] **Step 6: Test Case Studies page**

Visit `/case-studies` and confirm:
- ImpactGrid shows all case study cards from the CPT
- Each card displays the client name, sector, and at least one impact stat
- Logo walls render correctly

- [ ] **Step 7: Test Insights / Blog**

Visit `/insights`:
- Masonry/grid shows all migrated articles with correct featured images and dates
- Category filtering works (if implemented)
- Clicking an article loads the correct detail page

- [ ] **Step 8: Check GA4 is firing**

Open Google Analytics 4 → Real-Time report. Open the site in another browser tab and navigate between pages. Confirm page views are appearing in the Real-Time report.

- [ ] **Step 9: Validate SEO**

Run the site through Google's Rich Results Test (`search.google.com/test/rich-results`). Test the Home, About, Sectors pages (FAQ schema). Confirm no errors.

### Task 24: DNS Cutover

- [ ] **Step 1: Lower DNS TTL 24 hours before launch**

In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.): set the TTL on your A record / CNAME to `300` seconds. This allows rapid rollback if something breaks.

- [ ] **Step 2: Update DNS to point to WordPress host**

Get the IP address or CNAME from your WordPress host dashboard (WP Engine → Domains, or Kinsta → Domains). Update your A record or CNAME to point to it.

- [ ] **Step 3: Verify SSL is active**

All managed hosts provision SSL automatically. Visit `https://yourdomain.com` and confirm the padlock. If SSL is not yet active, trigger provisioning from the host dashboard.

- [ ] **Step 4: Keep the Vercel site live for 1 week**

Do NOT delete the Vercel deployment or disconnect the GitHub repo immediately. Keep the old Vercel site accessible via a temporary domain (e.g. `staging.eprod.io`) for at least 7 days as a rollback option.

- [ ] **Step 5: Monitor for 1 hour post-cutover**

Visit all 10 pages from the production domain. Confirm everything loads from WordPress. Watch for any 404s or broken assets.

---

## Plugin & Cost Summary

| Plugin | Required | Cost |
|---|---|---|
| Elementor Pro | Yes | ~$99/yr |
| ACF Pro | Yes | ~$49/yr |
| WPForms Pro | Yes | ~$199/yr |
| Custom Post Type UI | Yes | Free |
| Yoast SEO | Yes | Free |
| Site Kit by Google | Yes | Free |
| WP Rocket | Recommended | ~$49/yr |
| Smush | Yes | Free |
| Redirection | Yes | Free |
| WP All Import (if 20+ posts) | Optional | ~$99 one-time |

**Estimated annual plugin cost: ~$400/yr** (Elementor + ACF + WPForms + WP Rocket)

---

## Handover Checklist

Before signing off, provide the new owner with:

- [ ] WordPress admin URL + login credentials
- [ ] Hosting dashboard login (WP Engine / Kinsta)
- [ ] Domain registrar login
- [ ] Google Analytics 4 property access
- [ ] Elementor Academy link: `elementor.com/academy`
- [ ] 30-minute recorded walkthrough covering:
  - How to edit a page in Elementor
  - How to publish a new blog post
  - How to add a new event
  - How to add a new team member
  - How to add a new case study
