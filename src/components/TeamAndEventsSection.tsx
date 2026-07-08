import { getPayloadClient } from '@/lib/payload-client'
import { getEventStatus, formatEventDate, getEventImageUrls, EventStatus } from '@/lib/event-utils'
import TeamAndEventsClient, { type EnrichedEvent } from '@/components/TeamAndEventsClient'

export default async function TeamAndEventsSection() {
  let events: any[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      sort: '-startDate',
      limit: 3,
      depth: 1,
    })
    events = result.docs
  } catch {
    events = []
  }

  const enriched: EnrichedEvent[] = events
    .map((e: any) => ({
      id: e.id,
      name: e.name,
      venue: e.venue ?? null,
      status: getEventStatus(e.startDate, e.endDate) as EventStatus,
      dateLabel: formatEventDate(e.startDate, e.endDate),
      firstImageUrl: getEventImageUrls(e)[0] ?? null,
    }))
    .sort((a, b) => {
      const order = { ongoing: 0, upcoming: 1, past: 2 }
      return order[a.status] - order[b.status]
    })
    .slice(0, 3)

  return <TeamAndEventsClient enriched={enriched} />
}
