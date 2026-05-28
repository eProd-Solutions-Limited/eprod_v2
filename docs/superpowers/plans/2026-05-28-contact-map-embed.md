# Contact Page Map Embed — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Embed an OpenStreetMap iframe pinned at the eProd office coordinates (-1.214994, 36.789431) inside the left column of the contact form, between the contact details and social links.

**Architecture:** Single JSX block added to `ContactForm.tsx`. No new components, no API keys, no JS libraries — plain `<iframe>` embed from openstreetmap.org with a caption bar linking to the full map.

**Tech Stack:** React/Next.js, Tailwind CSS, OpenStreetMap embed URL

---

### Task 1: Add map embed to ContactForm left column

**Files:**
- Modify: `src/components/contact/ContactForm.tsx:129-131`

This is a pure markup change — no logic to unit-test. Visual verification is the test.

- [ ] **Step 1: Insert the map block**

In `src/components/contact/ContactForm.tsx`, locate the comment `{/* Left — Contact info */}` section. Find the closing `</div>` of the contact details block (the one with `className="space-y-6 mb-10"`) at around line 129, and insert the map block immediately after it, before the social links `<div>`:

```tsx
            {/* Map embed */}
            <div className="rounded-xl overflow-hidden border border-border mb-10">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=36.7794%2C-1.2250%2C36.7994%2C-1.2050&layer=mapnik&marker=-1.214994%2C36.789431"
                width="100%"
                height="220"
                style={{ display: "block", border: "none" }}
                loading="lazy"
                title="eProd office location"
              />
              <div className="bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground text-right">
                <a
                  href="https://www.openstreetmap.org/?mlat=-1.214994&mlon=36.789431#map=15/-1.214994/36.789431"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View larger map ↗
                </a>
              </div>
            </div>
```

The left column structure should now read (in order):
1. `<h2>We're here to help</h2>`
2. `<div className="space-y-6 mb-10">` — address / phone / email
3. `<div className="rounded-xl overflow-hidden ...">` — **map embed (new)**
4. `<div>` — social links

- [ ] **Step 2: Verify the dev server compiles cleanly**

```bash
npm run dev
```

Expected: no TypeScript or compilation errors in the terminal.

- [ ] **Step 3: Visual check in browser**

Open `http://localhost:3000/contact` (or whatever port the dev server uses).

Check:
- Map tile loads and shows a pin at the correct location (near Nairobi)
- Map sits between the contact details and the social icons
- "View larger map ↗" link is visible below the map and opens OSM in a new tab
- On mobile width the map fills the full column width without overflow

- [ ] **Step 4: Commit**

```bash
git add src/components/contact/ContactForm.tsx
git commit -m "feat: add OpenStreetMap embed to contact page left column"
```
