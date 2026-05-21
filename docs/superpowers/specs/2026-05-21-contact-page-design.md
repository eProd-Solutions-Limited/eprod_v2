# Contact Page Design

**Date:** 2026-05-21  
**Status:** Approved

---

## Overview

Create the `/contact` page for eProd Solutions. The navbar already links to `/contact`; this spec defines the page that goes there.

---

## Page Structure

Three vertical sections:

1. **Hero** — light green banner with breadcrumb and heading
2. **Two-column body** — contact info sidebar (left) + enquiry form (right)
3. **Footer** — site footer (already provided by layout)

---

## Section 1: Hero

- Background: `primary-lighter` (`hsl(183 38% 92%)`) — same light green used elsewhere
- Breadcrumb: `Home › Contact` (plain text links, not a component)
- Heading: `Contact Us` (large, dark, bold)
- Tagline: `Get in touch with our team to learn how eProd can transform your supply chain, ensure compliance, and unlock capital.`
- Centered, consistent with About/Solutions hero style

**Component:** `src/components/contact/ContactHero.tsx` (server component, no state)

---

## Section 2: Two-Column Body

**Layout:** `grid-cols-[1fr_1.6fr]` — sidebar left, form right. Stacks to single column on mobile.

### Left: Contact Info Sidebar

Heading: **"We're here to help"**

Three info rows (icon in `primary-lighter` pill + label + value):

| Icon | Label | Value |
|------|-------|-------|
| MapPin | Nairobi, Kenya | eProd Solutions Headquarters, Westlands Business Park, 4th Floor, Ring Road, Nairobi |
| Phone | Phone | +254 112 203 982 |
| Mail | Email | info@eprod-solutions.com (clickable `mailto:`) |

**"CONNECT WITH US"** section below the info rows — 4 icon links (same URLs as footer):

| Icon | URL |
|------|-----|
| Linkedin | `https://www.linkedin.com/company/eprod-solutions-limited/posts/?feedView=all` |
| Twitter | `https://twitter.com/eProdSolutions` |
| Facebook | `https://www.facebook.com/eProdSolutions` |
| Youtube | `https://www.youtube.com/@eprodsolutionslimited3557` |

**Map** — Google Maps iframe below social links, pinned to Nairobi, Kenya. Height ~200px, rounded corners. Use a standard embed URL (no API key required for basic iframe embed).

### Right: Enquiry Form

Heading: **"Send us a message"**  
Subtext: `Fill out the form below and our team will get back to you within 24 hours.`

**Fields:**

| Field | Type | Width | Required |
|-------|------|-------|----------|
| Company Name | text input | full | yes |
| Work Email | email input | half (left) | yes |
| Phone | tel input | half (right) | yes |
| Primary Challenge | select dropdown | full | yes |
| Message | textarea (4 rows) | full | yes |

Dropdown options (same as CTASection): Compliance, Efficiency, Scaling, Other.

**Submit button:** Full-width, dark green (`bg-primary`), rounded, `Send Message →` label. Shows loading state while submitting.

**Success/error message:** Inline, below the button — same style as CTASection.

**Privacy note:** `By submitting this form, you agree to our Privacy Policy.` — small muted text below button. "Privacy Policy" links to `#` for now.

**Component:** `src/components/contact/ContactForm.tsx` (`"use client"`)

---

## API Integration

**Endpoint:** `POST /api/send-cta-email` (existing, no changes to the route file)

**Request body:**

```json
{
  "company": "...",
  "email": "...",
  "challenge": "...",
  "phone": "...",
  "message": "...",
  "sourceSection": "contact_page"
}
```

The existing route saves `company`, `email`, `challenge`, `sourceSection` to the Enquiries collection. `phone` and `message` are appended to the `notes` field:

```
Phone: +254...

Message: Tell us more...
```

**Requires a small change to `src/app/api/send-cta-email/route.ts`** — add `notes` to the `payload.create` call:

```ts
notes: [body.phone && `Phone: ${body.phone}`, body.message && `Message: ${body.message}`]
  .filter(Boolean).join('\n\n'),
```

**GA event:** Fire `gaEvents.formSubmitted("contact_form", form.company)` on success (same pattern as CTASection).

---

## Files to Create / Modify

| Action | File |
|--------|------|
| Create | `src/app/(frontend)/contact/page.tsx` |
| Create | `src/components/contact/ContactHero.tsx` |
| Create | `src/components/contact/ContactForm.tsx` |
| Modify | `src/app/api/send-cta-email/route.ts` (add `notes` field) |

---

## Metadata

Page title: `Contact Us | eProd Solutions`  
Page description: `Get in touch with the eProd team. Reach us in Nairobi, Kenya or fill out the form and we'll respond within 24 hours.`

---

## Out of Scope

- Payload CMS schema changes (phone/message stored in `notes`, no migration needed)
- Office hours display (not in the approved design)
- Any new API routes
