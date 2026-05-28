---
name: contact-map-embed
description: Embed an OpenStreetMap iframe on the contact page, below the contact details in the left column
metadata:
  type: project
---

# Contact Page — Embedded Map

## Overview

Add an OpenStreetMap iframe to the contact page showing the eProd office location, pinned at coordinates `-1.214994, 36.789431`.

## Placement

Inside `ContactForm.tsx`, in the left column (`<!-- Left — Contact info -->`), between the existing contact details block (`div.space-y-6`) and the social links block. No new section or page-level component is needed.

## Implementation

A single `<div>` wrapper with rounded corners and a border, containing:

1. An `<iframe>` pointing to the OSM embed URL with the pin coordinates and a bounding box centered on the location.
2. A thin caption bar below the iframe with a "View larger map ↗" link that opens the full OSM page at those coordinates in a new tab.

**OSM embed URL:**
```
https://www.openstreetmap.org/export/embed.html?bbox=36.7794,-1.2250,36.7994,-1.2050&layer=mapnik&marker=-1.214994,36.789431
```

**Larger map link:**
```
https://www.openstreetmap.org/?mlat=-1.214994&mlon=36.789431#map=15/-1.214994/36.789431
```

**iframe attributes:** `width="100%"`, `height="220"`, `loading="lazy"`, `title="eProd office location"`, `style="display:block;border:none;"`.

**Wrapper styling (Tailwind):** `rounded-xl overflow-hidden border border-border mb-10` (matches the card aesthetic used elsewhere in the component).

**Caption bar styling (Tailwind):** `bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground text-right` with the link as `text-primary hover:underline`.

## Files Changed

- `src/components/contact/ContactForm.tsx` — add map block between contact details and social links (left column only).

## Out of Scope

- No JavaScript map library (Leaflet, Mapbox). Plain iframe only.
- No API key required.
- No changes to the hero, form, or page layout.
