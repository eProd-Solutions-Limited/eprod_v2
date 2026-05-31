import { getPayloadClient } from '@/lib/payload-client'
export const dynamic = 'force-dynamic'

import { getEventStatus, formatEventDate, getEventImageUrls, getImageAlt, formatEventDayName } from '@/lib/event-utils'
import EventsPageClient from './EventsPageClient'

export default async function EventsPage() {
  const payload = await getPayloadClient()
  const { docs: events } = await payload.find({
    collection: 'events',
    sort: '-startDate',
    limit: 100,
    depth: 2,
  })

  const enriched = events.map((e: any) => {
    const imageUrls = getEventImageUrls(e).map((url, i) => ({
      url,
      alt: getImageAlt(e.name, i, e.imageLabels),
    }))
    return {
      id: e.id,
      name: e.name,
      venue: e.venue,
      startDate: e.startDate,
      endDate: e.endDate ?? null,
      description: e.description ?? null,
      imageUrls,
      status: getEventStatus(e.startDate, e.endDate),
      dateLabel: formatEventDate(e.startDate, e.endDate),
      dayName: formatEventDayName(e.startDate),
    }
  })

  // Next upcoming event for hero
  const nextUpcoming = enriched
    .filter((e) => e.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0] ?? null

  return <EventsPageClient events={enriched} nextUpcoming={nextUpcoming} />
}
