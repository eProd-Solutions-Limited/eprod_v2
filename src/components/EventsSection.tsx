import { getPayloadClient } from '@/lib/payload-client'
import Link from 'next/link'
import Image from 'next/image'
import { getEventStatus, formatEventDate, getEventImageUrls, getImageAlt, extractPlainText, EventStatus } from '@/lib/event-utils'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'
import { EventSlideshow } from '@/components/EventSlideshow'

const statusConfig: Record<EventStatus, { dot: string; label: string; pulse: boolean }> = {
  ongoing: { dot: 'bg-red-500', label: 'Ongoing', pulse: true },
  upcoming: { dot: 'bg-green-500', label: 'Upcoming', pulse: false },
  past: { dot: 'bg-gray-400', label: 'Past', pulse: false },
}

function StatusBadge({ status }: { status: EventStatus }) {
  const cfg = statusConfig[status]
  return (
    <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
      <span className="relative flex h-2.5 w-2.5">
        {cfg.pulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cfg.dot}`} />
      </span>
      <span className="text-xs font-semibold text-white">{cfg.label}</span>
    </div>
  )
}

export default async function EventsSection() {
  let events: any[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'events',
      sort: '-startDate',
      limit: 6,
      depth: 2,
    })
    events = result.docs
  } catch {
    events = []
  }

  const enriched = events.map((e: any) => ({
    ...e,
    status: getEventStatus(e.startDate, e.endDate) as EventStatus,
    dateLabel: formatEventDate(e.startDate, e.endDate),
    imageUrls: getEventImageUrls(e).map((url, i) => ({
      url,
      alt: getImageAlt(e.name, i, e.imageLabels),
    })),
  }))

  const sorted = [
    ...enriched.filter((e) => e.status === 'ongoing'),
    ...enriched.filter((e) => e.status === 'upcoming'),
    ...enriched.filter((e) => e.status === 'past'),
  ]

  const featured = sorted.find((e) => e.status === 'ongoing') ?? null
  const rest = sorted.filter((e) => e !== featured).slice(0, 3)

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Events</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Where We&apos;ve Been &amp;{' '}
              <span className="gradient-primary-text">Where We&apos;re Going</span>
            </h2>
          </div>
          <Link
            href="/events"
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View all events <ArrowRight size={16} />
          </Link>
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl text-muted-foreground">
            <Calendar size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium">No events yet.</p>
            <p className="text-sm mt-1">Add events in the admin panel to display them here.</p>
          </div>
        )}

        {/* ── Featured ongoing event (big card with slideshow) ── */}
        {featured && (
          <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6 h-72 md:h-96 bg-black">
            {/* Slideshow or single image */}
            {featured.imageUrls.length > 0 ? (
              <EventSlideshow images={featured.imageUrls} />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Badge */}
            <div className="absolute top-4 right-4">
              <StatusBadge status="ongoing" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-2">{featured.name}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><Calendar size={14} />{featured.dateLabel}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} />{featured.venue}</span>
              </div>
              {featured.description && (
                <p className="mt-2 text-sm text-white/70 line-clamp-2 max-w-2xl">{extractPlainText(featured.description)}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Smaller cards row ── */}
        {rest.length > 0 && (
          <div className="grid md:grid-cols-3 gap-5">
            {rest.map((event: any) => {
              const firstImg = event.imageUrls[0]
              return (
                <div
                  key={event.id}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-muted">
                    {firstImg ? (
                      <Image
                        src={firstImg.url}
                        alt={firstImg.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar size={28} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <StatusBadge status={event.status} />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-foreground text-sm mb-1.5 leading-snug">{event.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <Calendar size={11} />{event.dateLabel}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin size={11} />{event.venue}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:brightness-110 transition shadow-md"
          >
            View all events <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
