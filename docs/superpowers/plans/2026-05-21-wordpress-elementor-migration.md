# WordPress + Elementor Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the eProd Next.js marketing site to WordPress + Elementor so a non-technical person can own and edit the design going forward.

**Architecture:** Recreate all 7 marketing pages as Elementor-built WordPress pages. Dynamic content (logo walls, team, testimonials, blog posts) will use WordPress native features (Posts, Custom Post Types, ACF). The analytics and dashboard pages are app-specific and are NOT migrated — they stay on the current stack or are handled separately.

**Tech Stack:** WordPress (latest), Elementor Pro, Hello Elementor theme, Advanced Custom Fields (ACF) Pro, WPForms or Contact Form 7, Yoast SEO, WP Rocket (caching).

---

## Pages to Migrate

| Page | URL | Sections |
|---|---|---|
| Home | `/` | Hero, Problem, Solution, Bank Partnerships, Logo Wall, How It Works, Testimonials, Differentiation, FAQ, CTA |
| About | `/about` | Hero, Vision/Mission, Meet the Founders, Our Story, AgFintech Identity, Market Leadership, Bank Partners, Leadership Team, FAQ, CTA |
| Solutions | `/solutions` | Hero, Platform Architecture, Data Flow, Security/Compliance, Integrations, CTA |
| Case Studies | `/case-studies` | Hero Carousel, Logo Wall, Voice of Customer, Impact Grid, Differentiator Banner, CTA |
| Insights (Blog) | `/insights` | Blog listing with filtering and pagination |
| Individual Article | `/articles/[slug]` | Single blog post |
| Contact | `/contact` | Hero, Contact Form |

**Not migrated:** `/analytics`, `/dashboard` (these are authenticated app pages, not marketing).

---

## Phase 1 — Preparation

### Task 1: Extract All Copy & Assets

Before touching WordPress, document everything from the live site.

**Files to reference:**
- All components in `src/components/`
- Images in `public/` and any Payload media

- [ ] **Step 1: Copy all text content from each page**

Open each page in the browser and copy every heading, paragraph, stat, and label into a Google Doc or Notion page, organized by page and section. Include:
- All hero headings and subheadings
- All body copy
- All button labels and their destination URLs
- All stat numbers (e.g. "250+ clients", "20+ countries", "1M+ farmer records")
- All FAQ questions and answers
- All team member names, titles, bios, and LinkedIn URLs

- [ ] **Step 2: Download all images and logos**

From the Payload CMS admin (`/admin`), download:
- All logo wall images (agribusiness logos, bank logos)
- All team member headshots
- All case study images
- Any hero or section background images

Save them organized by page into a folder like `wp-migration-assets/`.

- [ ] **Step 3: Export all blog posts from Payload CMS**

In the Payload admin, go to the Articles collection and export or manually copy:
- Post title
- Slug
- Featured image
- Author
- Publication date
- Full body content (rich text)
- Category/tag

- [ ] **Step 4: Note the brand colors and fonts from the current site**

Open `src/app/globals.css` and `tailwind.config.ts` (or equivalent). Record:
- Primary color (the green gradient — check `gradient-primary-text` class)
- Background color
- Text colors (foreground, muted-foreground)
- Font families used

---

## Phase 2 — WordPress Setup

### Task 2: Install WordPress and Core Plugins

- [ ] **Step 1: Choose and set up hosting**

Use one of these (all support 1-click WordPress install):
- **WP Engine** (recommended for a client handover — managed, secure, easy)
- **SiteGround**
- **Kinsta**

Create an account, provision a new WordPress site. Get the admin URL (usually `yourdomain.com/wp-admin`).

- [ ] **Step 2: Install Hello Elementor theme**

In WP Admin → Appearance → Themes → Add New, search for "Hello Elementor". Install and activate it.

This is the official lightweight theme built for Elementor — it adds no extra styling that would conflict with Elementor's designs.

- [ ] **Step 3: Install Elementor Pro**

Purchase Elementor Pro at elementor.com. Download the `.zip` file.

In WP Admin → Plugins → Add New → Upload Plugin, upload the zip. Install and activate. Connect your license key when prompted.

- [ ] **Step 4: Install Advanced Custom Fields (ACF) Pro**

Purchase ACF Pro at advancedcustomfields.com. Upload and activate the same way.

ACF is needed to store structured data (team members, testimonials, logo walls) that Elementor can then display dynamically.

- [ ] **Step 5: Install remaining plugins**

In WP Admin → Plugins → Add New, install and activate:

| Plugin | Purpose |
|---|---|
| Yoast SEO | Meta titles, descriptions, structured data |
| WPForms Lite (or Pro) | Contact form |
| WP Rocket | Page caching and performance |
| Smush | Image compression |
| Redirection | Handle URL redirects from old site |

- [ ] **Step 6: Configure WordPress permalinks**

WP Admin → Settings → Permalinks → Select "Post name" → Save Changes.

This ensures URLs like `/insights/my-article` work correctly.

---

## Phase 3 — Global Design Setup

### Task 3: Configure Brand Colors and Typography in Elementor

- [ ] **Step 1: Set global colors**

In WP Admin → Elementor → Custom Colors (or open any page in Elementor editor → hamburger menu → Global Colors).

Add these colors using the values you recorded in Task 1 Step 4:
- `--primary` → name it "Brand Green"
- `--background` → name it "Background"
- `--foreground` → name it "Text Primary"
- `--muted-foreground` → name it "Text Muted"

- [ ] **Step 2: Set global fonts**

Elementor editor → hamburger menu → Global Fonts.

Set the fonts matching the current site (likely Inter or a similar sans-serif). Apply to Primary, Secondary, Text, and Accent font slots.

- [ ] **Step 3: Set site-wide settings**

Elementor → Site Settings → Layout:
- Set content width to match current site (check `max-w-4xl` / `container` classes in components — likely 1280px or 1440px max)
- Set default padding/spacing

### Task 4: Build the Header (Navbar)

Reference: `src/components/Navbar.tsx`

The navbar contains: Logo, nav links (Home, Solutions, Case Studies, Insights, About, Contact), and a CTA button ("Get a Demo" or similar).

- [ ] **Step 1: Create a new Header template in Elementor**

WP Admin → Templates → Theme Builder → Add New → Header.

- [ ] **Step 2: Build the navbar structure**

Using Elementor widgets:
- Add a Section with 2 columns (Logo left, Nav right)
- Left column: Image widget → upload the eProd logo
- Right column: Nav Menu widget → assign a menu you'll create in Step 3
- Add a Button widget next to the nav for the CTA ("Book a Demo")

- [ ] **Step 3: Create the WordPress navigation menu**

WP Admin → Appearance → Menus → Create New Menu named "Main Navigation".

Add pages: Home, Solutions, Case Studies, Insights, About, Contact.

Go back to the Elementor header template and assign this menu to the Nav Menu widget.

- [ ] **Step 4: Set conditions**

In the Elementor header template, click "Publish" → Set Conditions → Include → Entire Site.

### Task 5: Build the Footer

Reference: `src/components/Footer.tsx`

- [ ] **Step 1: Create a new Footer template in Elementor**

WP Admin → Templates → Theme Builder → Add New → Footer.

- [ ] **Step 2: Build the footer structure**

Typical footer sections from the current site:
- Logo and tagline
- Navigation columns (Solutions, Company, Resources, etc.)
- Social links
- Copyright line

Use Elementor's Heading, Icon List, and Text Editor widgets. Match the layout from the current footer.

- [ ] **Step 3: Set conditions**

Publish → Set Conditions → Entire Site.

---

## Phase 4 — Recreate Each Page

### Task 6: Home Page

Reference: `src/app/(frontend)/page.tsx` and all components imported there.

- [ ] **Step 1: Create a new page**

WP Admin → Pages → Add New. Title: "Home". Click "Edit with Elementor".

- [ ] **Step 2: Build Hero section**

Reference: `src/components/HeroSection.tsx`

Use Elementor widgets:
- Section with background color/image
- Heading widget for main headline
- Text Editor widget for subheading
- Button widget(s) for CTAs
- Any hero image/illustration as an Image widget

- [ ] **Step 3: Build Problem section**

Reference: `src/components/ProblemSection.tsx`

Typically a section with a heading and 3-column icon/stat blocks. Use:
- Heading widget
- Icon Box widgets (icon + title + description) in a 3-column section

- [ ] **Step 4: Build Solution section**

Reference: `src/components/SolutionSection.tsx`

Usually a heading with feature cards. Use:
- Heading widget
- Card or Image Box widgets in a grid

- [ ] **Step 5: Build Bank Partnerships section**

Reference: `src/components/BankPartnershipsSection.tsx`

- Heading widget
- Image Carousel or Image Gallery widget with the bank logos uploaded in Task 1

- [ ] **Step 6: Build Proof / Logo Wall section**

Reference: `src/components/ProofSection.tsx`

- Stats row: Counter widgets or Heading widgets with the key numbers
- Logo carousel: Image Carousel widget with agribusiness logos

- [ ] **Step 7: Build How It Works section**

Reference: `src/components/HowItWorksSection.tsx`

Usually a numbered steps layout. Use:
- Heading widget
- Icon Box or custom HTML for numbered step cards in a row

- [ ] **Step 8: Build Testimonials section**

Reference: `src/components/TestimonialsSection.tsx`

- Testimonial widget (Elementor Pro) or Slides widget
- Add each quote from the Voice of Customer data exported in Task 1

- [ ] **Step 9: Build Differentiation section**

Reference: `src/components/DifferentiationSection.tsx`

Usually a comparison table or feature list. Use:
- Heading widget
- Icon List or Pricing Table widget

- [ ] **Step 10: Build FAQ section**

Reference: `src/components/FAQSection.tsx`

- Heading widget
- Accordion widget — add each Q&A from the FAQ data in `src/data/faqs.ts`

- [ ] **Step 11: Build CTA section**

Reference: `src/components/CTASection.tsx`

- Section with contrasting background color
- Heading widget
- Button widget

- [ ] **Step 12: Set as WordPress front page**

WP Admin → Settings → Reading → "A static page" → Front Page: Home.

### Task 7: About Page

Reference: `src/app/(frontend)/about/page.tsx` and all about components.

- [ ] **Step 1: Create page**

WP Admin → Pages → Add New. Title: "About". Edit with Elementor.

- [ ] **Step 2: Build sections in order**

Build these sections using the matching Elementor widgets (same approach as Home page):

1. **About Hero** (`src/components/about/AboutHero.tsx`) — Full-width hero with heading and subtext
2. **Vision & Mission** (`src/components/about/VisionMission.tsx`) — Two-column layout with Vision left, Mission right
3. **Meet the Founders** (`src/components/about/MeetTheFounders.tsx`) — Profile cards (photo, name, bio)
4. **Our Story** (`src/components/about/OurStory.tsx`) — Text-heavy section with a pull quote box at the bottom
5. **AgFintech Identity** (`src/components/about/AgFintechIdentity.tsx`) — Feature/identity section
6. **Market Leadership** (`src/components/about/MarketLeadership.tsx`) — Stats or badges section
7. **Bank Partners** (`src/components/about/BankPartnersAbout.tsx`) — Logo row/carousel
8. **Leadership Team** (`src/components/about/LeadershipTeam.tsx`) — Team grid (photo, name, title, LinkedIn link)
9. **FAQ** (`src/components/about/AboutFAQ.tsx`) — Accordion widget
10. **CTA** (`src/components/about/AboutCTA.tsx`) — CTA banner

### Task 8: Solutions Page

Reference: `src/app/(frontend)/solutions/page.tsx` and solutions components.

- [ ] **Step 1: Create page**

WP Admin → Pages → Add New. Title: "Solutions". Edit with Elementor.

- [ ] **Step 2: Build sections in order**

1. **Solutions Hero** (`src/components/solutions/SolutionsHero.tsx`) — Hero banner
2. **Platform Architecture** (`src/components/solutions/PlatformArchitecture.tsx`) — Diagram or structured feature breakdown; use Image widget for any diagrams, Icon Box for features
3. **Data Flow** (`src/components/solutions/DataFlow.tsx`) — Flow diagram or step illustration; use Image widget
4. **Security & Compliance** (`src/components/solutions/SecurityCompliance.tsx`) — Feature list with compliance badges; use Icon List or Image Box widgets
5. **Integrations** (`src/components/solutions/Integrations.tsx`) — Logo grid of integration partners
6. **CTA** (`src/components/solutions/SolutionsCTA.tsx`) — CTA banner

### Task 9: Case Studies Page

Reference: `src/app/(frontend)/case-studies/page.tsx` and case-studies components.

- [ ] **Step 1: Create page**

WP Admin → Pages → Add New. Title: "Case Studies". Edit with Elementor.

- [ ] **Step 2: Build sections in order**

1. **Hero** (`src/components/case-studies/CaseStudiesHero.tsx`) / **Hero Carousel** (`CaseStudiesHeroCarousel.tsx`) — Slides widget with case study hero cards
2. **Logo Wall** (`src/components/case-studies/LogoWall.tsx`) — Image Carousel or Gallery widget
3. **Voice of Customer** (`src/components/case-studies/VoiceOfCustomer.tsx`) — Testimonials Slides widget
4. **Impact Grid** (`src/components/case-studies/ImpactGrid.tsx`) — Stats grid; Counter widgets or Heading widgets in a grid
5. **Differentiator Banner** (`src/components/case-studies/DifferentiatorBanner.tsx`) — Bold callout section
6. **CTA** (`src/components/case-studies/CaseStudiesCTA.tsx`) — CTA banner

### Task 10: Contact Page

Reference: `src/app/(frontend)/contact/page.tsx`, `ContactHero.tsx`, `ContactForm.tsx`.

- [ ] **Step 1: Create page**

WP Admin → Pages → Add New. Title: "Contact". Edit with Elementor.

- [ ] **Step 2: Build Contact Hero**

Heading widget + subtext matching `ContactHero.tsx`.

- [ ] **Step 3: Build Contact Form**

In WPForms → Add New, create a form with fields matching `src/components/contact/ContactForm.tsx`:
- Name
- Email
- Company
- Message
- Any other fields present in the component

Configure email notifications (WPForms → Settings → Notifications) to send submissions to the business email.

- [ ] **Step 4: Embed form in Elementor**

In the Contact page Elementor editor, add a WPForms widget and select the form you just built.

---

## Phase 5 — Blog / Insights Setup

### Task 11: Configure WordPress Blog

The Insights page (`/insights`) is a blog listing. Individual articles (`/articles/[slug]`) are blog posts.

- [ ] **Step 1: Set up WordPress Posts**

WordPress Posts are already built-in and are the right tool here. Each article from Payload becomes a WordPress Post.

WP Admin → Settings → Reading: Set "Posts page" to a page called "Insights" (create this page first with no Elementor content — WordPress will auto-populate it with posts).

- [ ] **Step 2: Create an Insights listing template in Elementor**

WP Admin → Templates → Theme Builder → Add New → Archive.

Build the listing layout:
- Use Posts widget (Elementor Pro) to display post cards in a masonry or grid layout
- Each card shows: Featured Image, Title, Excerpt, Date, Category
- Set conditions to apply to "Blog / Posts Archive"

- [ ] **Step 3: Create a Single Post template in Elementor**

WP Admin → Templates → Theme Builder → Add New → Single Post.

Build the article layout matching the current article pages:
- Post Title widget
- Post Featured Image widget
- Post Meta widget (date, author)
- Post Content widget (body)
- Set conditions to apply to "All Posts"

- [ ] **Step 4: Migrate blog posts**

For each article exported in Task 1:

WP Admin → Posts → Add New:
- Paste the title
- Paste the full body content
- Upload and set the featured image
- Set the published date (use the original date)
- Set category/tags
- In Yoast SEO panel (bottom of editor): set the meta description

Repeat for every article. If there are many posts (20+), consider using a WordPress XML import or a migration plugin.

---

## Phase 6 — SEO Configuration

### Task 12: Configure Yoast SEO

The current site uses JSON-LD structured data. Yoast handles most of this automatically.

- [ ] **Step 1: Complete Yoast setup wizard**

WP Admin → Yoast SEO → General → First-time configuration. Follow the wizard:
- Set site name: "eProd Solutions"
- Set organization name and logo
- Connect Google Search Console if available

- [ ] **Step 2: Set meta titles and descriptions for each page**

On each page in the WordPress editor, scroll to the Yoast SEO panel and set:
- SEO title (match the current `<title>` tags)
- Meta description (match the current meta descriptions)

Do this for: Home, About, Solutions, Case Studies, Insights, Contact.

- [ ] **Step 3: Enable Organization schema**

Yoast SEO → Search Appearance → General → Knowledge Graph. Fill in:
- Organization name: eProd Solutions
- Organization logo: upload the eProd logo
- Social profiles: LinkedIn URL, Twitter, etc.

This replaces the custom `organizationSchema` JSON-LD currently hardcoded in the Next.js pages.

---

## Phase 7 — URL Redirects

### Task 13: Set Up Redirects for Old URLs

The current site uses `/articles/[slug]` for blog posts. WordPress by default uses `/year/month/slug` or just `/slug`. We need to preserve or redirect old URLs.

- [ ] **Step 1: Set WordPress permalink to match old structure**

If the old URLs were `/articles/my-post-slug`, we can approximate this in WordPress.

WP Admin → Settings → Permalinks → Custom Structure: `/articles/%postname%`

This makes all post URLs match the old format exactly.

- [ ] **Step 2: Add redirects for any URLs that changed**

Install and use the "Redirection" plugin (already installed in Task 2).

WP Admin → Tools → Redirection → Add Redirect:
- For any page where the URL changed (e.g., `/insights` was the listing but WordPress uses `/blog`), add a 301 redirect.

---

## Phase 8 — Performance & Launch

### Task 14: Performance Setup

- [ ] **Step 1: Configure WP Rocket**

WP Admin → WP Rocket → Dashboard. Enable:
- Page caching
- Browser caching
- Minify CSS and JS
- Lazy loading images

- [ ] **Step 2: Compress all images**

WP Admin → Smush → Bulk Smush. Run bulk compression on all uploaded images.

### Task 15: Pre-Launch QA Checklist

- [ ] **Step 1: Test all pages on desktop and mobile**

Visit each page and verify:
- [ ] Layout matches the original design intent
- [ ] All text is correct (no placeholder text left)
- [ ] All images load
- [ ] All buttons link to the correct destination
- [ ] Mobile menu works
- [ ] Logo shows in header and footer

- [ ] **Step 2: Test the contact form**

Submit a test message via the Contact page. Verify the email arrives at the configured address.

- [ ] **Step 3: Check all blog posts**

Visit `/insights` and confirm the listing shows all migrated posts with correct images and dates.

Click through to 3–4 individual posts and verify content renders correctly.

- [ ] **Step 4: Validate SEO**

Use the Yoast SEO traffic light on each page — aim for green on all key pages.

Run the site through Google's Rich Results Test to verify structured data.

- [ ] **Step 5: Check redirects**

Visit each old URL that has a redirect configured. Verify it lands on the correct new page (browser URL should update to the new URL — that confirms a 301 redirect fired).

### Task 16: DNS Cutover

- [ ] **Step 1: Lower DNS TTL (do this 24 hours before launch)**

In your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), set the TTL on your A record / CNAME to 300 seconds (5 minutes). This allows a fast rollback if something goes wrong.

- [ ] **Step 2: Update DNS to point to WordPress host**

Get the IP address or CNAME from your WordPress host (WP Engine, Kinsta, etc.) and update your domain's DNS record to point to it.

- [ ] **Step 3: Verify SSL is active**

Most managed WordPress hosts provision SSL automatically. Visit `https://yourdomain.com` and confirm the padlock shows. If not, go to your host's dashboard and trigger an SSL certificate provision.

- [ ] **Step 4: Monitor for 1 hour after cutover**

Visit all key pages and confirm they load from the new WordPress site. Keep the old Vercel site live (don't delete it) for at least 1 week in case a rollback is needed.

---

## Plugin Summary

| Plugin | Required? | Cost |
|---|---|---|
| Elementor Pro | Yes | ~$99/yr |
| Advanced Custom Fields Pro | Recommended | ~$49/yr |
| WPForms Pro (or Lite) | Yes | Free–$199/yr |
| Yoast SEO | Yes (free tier is fine) | Free |
| WP Rocket | Recommended | ~$49/yr |
| Smush | Yes (free tier is fine) | Free |
| Redirection | Yes | Free |

**Estimated total plugin cost: ~$200–$300/year**

---

## Handover Checklist for the New Owner

After launch, provide the incoming owner with:
- [ ] WordPress admin URL and login credentials
- [ ] Hosting dashboard login (WP Engine / Kinsta / etc.)
- [ ] Domain registrar login
- [ ] Elementor documentation link (elementor.com/academy)
- [ ] A 30-minute walkthrough: how to edit a page, how to publish a blog post, how to add a new team member
