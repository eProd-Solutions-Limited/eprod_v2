export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
import { getEventImageUrls, getImageAlt, formatEventDate, formatEventDayName, getEventStatus, EventStatus } from '@/lib/event-utils'
import { EventDetailView } from '@/components/EventDetailView'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  let event: any
  try {
    const payload = await getPayloadClient()
    event = await payload.findByID({ collection: 'events', id, depth: 2 })
  } catch {
    return {}
  }
  if (!event) return {}

  const dateLabel = formatEventDate(event.startDate, event.endDate)
  const description = `${event.name} — ${event.venue}${dateLabel ? `, ${dateLabel}` : ''}.`
  const heroImage = getEventImageUrls(event)[0] ?? null

  return {
    title: event.name,
    description,
    openGraph: {
      title: event.name,
      description,
      type: 'website',
      url: `/events/${id}`,
      images: heroImage ? [{ url: heroImage, alt: event.name }] : undefined,
    },
    alternates: { canonical: `/events/${id}` },
  }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  let event: any
  try {
    const payload = await getPayloadClient()
    event = await payload.findByID({ collection: 'events', id, depth: 2 })
  } catch {
    notFound()
  }
  if (!event) notFound()

  const imageUrls = getEventImageUrls(event).map((url, i) => ({
    url,
    alt: getImageAlt(event.name, i, event.imageLabels),
  }))

  const dateLabel  = formatEventDate(event.startDate, event.endDate)
  const dayName    = formatEventDayName(event.startDate)
  const status     = getEventStatus(event.startDate, event.endDate)
  const heroImage  = imageUrls[0]?.url ?? null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eprod-solutions.com'

  const eventSchema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: `${event.name} — ${event.venue}${dateLabel ? `, ${dateLabel}` : ''}.`,
    startDate: event.startDate,
    ...(event.endDate ? { endDate: event.endDate } : {}),
    eventStatus: status === 'past'
      ? 'https://schema.org/EventScheduled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venue,
    },
    organizer: {
      '@type': 'Organization',
      name: 'eProd Solutions',
      url: siteUrl,
    },
    url: `${siteUrl}/events/${id}`,
    ...(heroImage ? { image: heroImage } : {}),
  }

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      <EventDetailView
        name={event.name}
        venue={event.venue}
        dayName={dayName}
        status={status}
        description={event.description ?? null}
        imageUrls={imageUrls}
      />
    </main>
  )
}
