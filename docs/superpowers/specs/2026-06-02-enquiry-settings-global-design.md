# Enquiry Settings Global — Design Spec

**Date:** 2026-06-02
**Status:** Approved

## Overview

Replace the `CTAConfig` collection (a singleton workaround) with a proper Payload Global called `EnquirySettings`. The Global holds the destination email addresses for enquiry notifications and a configurable email template. The `send-cta-email` API route is updated to read from the Global and apply the template before sending.

## Problem

`CTAConfig` is a Payload Collection that is only ever meant to have one record. The admin UI shows a list with a single entry, there is a "create" button that should never be used, and the API fetches with `limit: 1` and reads `docs[0]` — all workarounds for the wrong primitive. Payload Globals are the correct tool for singleton site configuration.

## Global: `enquiry-settings`

**File:** `src/globals/EnquirySettings.ts`
**Slug:** `enquiry-settings`

### Fields

#### Recipients group

| Field | Type     | Required | Description |
|-------|----------|----------|-------------|
| `to`  | text     | yes      | Primary recipient address (e.g. `info@eprod-solutions.com`) |
| `cc`  | array    | no       | Additional recipients — each entry is a single `email` text field |

#### Email Template group

| Field     | Type     | Required | Description |
|-----------|----------|----------|-------------|
| `subject` | text     | yes      | Email subject line. Supports `{{placeholder}}` tokens. Default: `New Enquiry from {{company}}` |
| `body`    | textarea | no       | Intro message shown above the auto-generated data table. Supports `{{placeholder}}` tokens. |

### Available placeholders

`{{company}}`, `{{email}}`, `{{challenge}}`, `{{phone}}`, `{{message}}`, `{{sourceSection}}`

### Notes

- The `title` field from the old collection is dropped — it existed only as a list-view label, which Globals do not need.
- `body` uses `textarea` (not the lexical rich text editor) for predictable plain-text output. The existing HTML wrapper and data table are applied in code.
- The auto-generated data table and footer are always appended after the rendered `body` — admins write the intro, the form data is guaranteed to appear below it.

## API: `POST /api/send-cta-email`

**File:** `src/app/api/send-cta-email/route.ts`

### Changes

**Before:**
```ts
const { docs } = await payload.find({ collection: 'cta-config', limit: 1 })
const { to } = docs[0]
const subject = `New Enquiry from ${company}`
```

**After:**
```ts
const config = await payload.findGlobal({ slug: 'enquiry-settings' })
const { to, cc, subject: subjectTemplate, body: bodyTemplate } = config
```

**Placeholder helper** (inlined in route file):
```ts
const replacePlaceholders = (template: string, data: Record<string, string>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] ?? '')
```

Applied to both `subject` and `body` before sending. The `cc` array is passed to `payload.sendEmail` as the `cc` field. If `body` is empty, the email renders with only the data table (same behaviour as today).

## Migration Steps

1. Delete `src/collections/CTAConfig.ts`
2. Create `src/globals/EnquirySettings.ts`
3. In `src/payload.config.ts`: remove `CTAConfig` from `collections`, add `EnquirySettings` to `globals`
4. Update `src/app/api/send-cta-email/route.ts`
5. Run `payload generate:types` to regenerate `src/payload-types.ts`
6. In the Payload admin, open the new Enquiry Settings global and set `to` to `info@eprod-solutions.com` and `subject` to `New Enquiry from {{company}}`

## Out of Scope

- Per-form routing (different emails for different site sections)
- Sender "From" address configuration
- HTML rich text body editing
