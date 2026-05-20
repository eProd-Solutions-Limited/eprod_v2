# Leadership Team Page Expansion

**Date:** 2026-05-20
**Status:** Approved

## Goal

Extend the About page's team section to show both leadership and the rest of the team, separated by a visual header. The team collection is the single source of truth for all members.

## Data Layer

### Team collection change (`src/collections/Team.ts`)

Add one new field:

```ts
{
  name: 'isLeadership',
  type: 'checkbox',
  defaultValue: false,
  label: 'Leadership member',
}
```

All existing records default to `false`. CMS editors tick this box for leadership members. No migration needed — Payload treats missing values as the default.

### Query

The existing `getTeam` cache function in `LeadershipTeam.tsx` fetches all team members sorted by `order`. No change to the query. The component splits the result:

```ts
const leaders = team.filter(p => p.isLeadership)
const rest    = team.filter(p => !p.isLeadership)
```

## Component (`src/components/about/LeadershipTeam.tsx`)

Single `<section className="bg-background py-20">` containing two sub-blocks in one container.

### Leadership block (unchanged)

- Heading: "Meet Our **Leadership**" (gradient on "Leadership")
- Grid: `md:grid-cols-3`, max-width `max-w-5xl mx-auto`
- Cards: photo (aspect-square), name, title, bio, LinkedIn button

### Team block (new)

- Heading: "Meet The **Team**" (gradient on "Team", same style as leadership heading)
- Grid: `md:grid-cols-4 sm:grid-cols-2`, same max-width
- Cards: identical visual style to leadership cards (rounded-xl, border, shadow, hover scale) — LinkedIn button omitted
- Rendered only when `rest.length > 0`

### Spacing between blocks

A `mt-20` top margin on the team block. No decorative divider.

## Constraints

- No new files — all changes stay in `Team.ts` and `LeadershipTeam.tsx`
- No second database query
- Regular team cards must not render a LinkedIn anchor even if the field has a value
