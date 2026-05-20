# Leadership Team Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `isLeadership` toggle to the Team collection and extend `LeadershipTeam.tsx` to render a second "The Team" section (4-per-row, no LinkedIn) below the existing leadership section.

**Architecture:** Single query fetches all team members sorted by `order`; the component splits them into two arrays by `isLeadership` and renders two visually consistent card grids inside one `<section>`. No new files, no second query.

**Tech Stack:** Next.js (App Router), Payload CMS, Tailwind CSS, TypeScript

---

## Files

| Action | Path |
|--------|------|
| Modify | `src/collections/Team.ts` |
| Modify | `src/components/about/LeadershipTeam.tsx` |

---

### Task 1: Add `isLeadership` field to Team collection

**Files:**
- Modify: `src/collections/Team.ts`

- [ ] **Step 1: Add the checkbox field**

In `src/collections/Team.ts`, insert this field after the `linkedin` field and before the `order` field:

```ts
{
  name: 'isLeadership',
  type: 'checkbox',
  defaultValue: false,
  label: 'Leadership member',
},
```

The full `fields` array should look like:

```ts
fields: [
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'photo',
    type: 'upload',
    relationTo: 'media',
    required: true,
  },
  {
    name: 'bio',
    type: 'textarea',
    required: true,
  },
  {
    name: 'linkedin',
    type: 'text',
  },
  {
    name: 'isLeadership',
    type: 'checkbox',
    defaultValue: false,
    label: 'Leadership member',
  },
  {
    name: 'order',
    type: 'number',
    required: true,
    defaultValue: 0,
    admin: {
      description: 'Display order',
    },
  },
],
```

- [ ] **Step 2: Verify the dev server accepts the change**

Run: `npm run dev`

Expected: server starts without TypeScript or Payload schema errors. Open the Payload admin at `http://localhost:3000/admin`, navigate to a Team entry, and confirm a "Leadership member" checkbox appears.

- [ ] **Step 3: Mark existing leadership members in the CMS**

In the Payload admin, open each person who is a leader and tick "Leadership member". Save each record.

- [ ] **Step 4: Commit**

```bash
git add src/collections/Team.ts
git commit -m "feat(team): add isLeadership checkbox field"
```

---

### Task 2: Update `LeadershipTeam.tsx` to render two sections

**Files:**
- Modify: `src/components/about/LeadershipTeam.tsx`

- [ ] **Step 1: Replace the component with the two-section version**

Replace the entire contents of `src/components/about/LeadershipTeam.tsx` with:

```tsx
import { Linkedin } from "lucide-react";
import Image from "next/image";
import { cache } from 'react'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'

const getTeam = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: 'team',
    sort: 'order',
  })
})

export default async function LeadershipTeam() {
  const { docs: team } = await getTeam()

  const leaders = team.filter((p: any) => p.isLeadership)
  const rest = team.filter((p: any) => !p.isLeadership)

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">

        {/* Leadership */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Meet Our <span className="gradient-primary-text">Leadership</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto">
            A team built for a generational business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {leaders.map((person: any) => (
            <div key={person.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
              <div className="aspect-square overflow-hidden">
                <Image
                  src={person.photo.url}
                  alt={`${person.name}, ${person.title}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  width={512}
                  height={512}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
                    <p className="text-sm font-medium text-secondary">{person.title}</p>
                  </div>
                  <a
                    href={person.linkedin}
                    className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition"
                    aria-label={`${person.name}'s LinkedIn`}
                  >
                    <Linkedin size={16} />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  {person.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rest of team */}
        {rest.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet The <span className="gradient-primary-text">Team</span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {rest.map((person: any) => (
                <div key={person.id} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                  <div className="aspect-square overflow-hidden">
                    <Image
                      src={person.photo.url}
                      alt={`${person.name}, ${person.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      width={512}
                      height={512}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-foreground">{person.name}</h3>
                    <p className="text-sm font-medium text-secondary">{person.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                      {person.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify in the browser**

With the dev server running, open the About page. Confirm:
- Leadership section shows only members with `isLeadership: true`, 3-per-row, with LinkedIn buttons
- "Meet The Team" section appears below with the remaining members, 4-per-row, no LinkedIn buttons
- If no non-leadership members exist yet, the second section does not render

- [ ] **Step 3: Commit**

```bash
git add src/components/about/LeadershipTeam.tsx
git commit -m "feat(about): add The Team section below leadership grid"
```
