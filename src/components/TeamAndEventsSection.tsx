import { getPayloadClient } from '@/lib/payload-client'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import teamImg from '@/assets/team1.png'
import { getEventStatus, formatEventDate, getEventImageUrls, EventStatus } from '@/lib/event-utils'

const statusConfig: Record<EventStatus, { dot: string; pulse: boolean; label: string }> = {
  ongoing: { dot: 'bg-red-500', pulse: true, label: 'Ongoing' },
  upcoming: { dot: 'bg-green-500', pulse: false, label: 'Upcoming' },
  past: { dot: 'bg-gray-400', pulse: false, label: 'Past' },
}

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

  const enriched = events
    .map((e: any) => ({
      ...e,
      status: getEventStatus(e.startDate, e.endDate) as EventStatus,
      dateLabel: formatEventDate(e.startDate, e.endDate),
      firstImageUrl: getEventImageUrls(e)[0] ?? null,
    }))
    .sort((a: any, b: any) => {
      const order = { ongoing: 0, upcoming: 1, past: 2 }
      return order[a.status as EventStatus] - order[b.status as EventStatus]
    })
    .slice(0, 3)

  return (
    <section className="grid md:grid-cols-2 md:min-h-130 w-full overflow-hidden">

      {/* ── Left: Team Banner ── */}
      <div className="relative overflow-hidden min-h-75 md:min-h-130">
        <Image
          src={teamImg}
          alt="The eProd team"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex items-end h-full p-5 md:p-10">
          <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-7 w-full md:max-w-xs">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              We are <span className="gradient-primary-text">eProd!</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Our team is always looking for passionate thinkers, doers, and innovators who share our
              mission of transforming agricultural supply chains across Africa and beyond.
            </p>
            <Link
              href="/about#team"
              className="inline-flex items-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110 transition shadow-md"
            >
              Meet the team <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Right: Events ── */}
      <div className="bg-background flex flex-col justify-center px-5 md:px-10 py-8 md:py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">Events</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Where We&apos;ve Been &amp;{' '}
              <span className="gradient-primary-text">Where We&apos;re Going</span>
            </h3>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0 ml-4"
          >
            All events <ArrowRight size={13} />
          </Link>
        </div>

        {enriched.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-8 text-center text-muted-foreground text-sm">
            <Calendar size={32} className="mx-auto mb-3 opacity-30" />
            No events yet — add them in the admin panel.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {enriched.map((event: any) => {
              const cfg = statusConfig[event.status as EventStatus]
              return (
                <div
                  key={event.id}
                  className="flex items-start gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-sm transition"
                >
                  {/* Event image */}
                  {event.firstImageUrl && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-muted">
                      <Image
                        src={event.firstImageUrl}
                        alt={event.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      {/* Status dot */}
                      <span className="relative flex h-2 w-2 shrink-0">
                        {cfg.pulse && (
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
                      </span>
                      <span className={`text-xs font-bold uppercase tracking-wide shrink-0 ${
                        event.status === 'ongoing' ? 'text-red-500' :
                        event.status === 'upcoming' ? 'text-green-600' : 'text-muted-foreground'
                      }`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground text-sm leading-snug line-clamp-2 wrap-break-word">{event.name}</p>
                    <div className="flex flex-col gap-0.5 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                        <Calendar size={10} className="shrink-0" /><span className="truncate">{event.dateLabel}</span>
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground min-w-0">
                        <MapPin size={10} className="shrink-0" /><span className="truncate">{event.venue}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Link
          href="/events"
          className="mt-5 inline-flex sm:hidden items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          View all events <ArrowRight size={14} />
        </Link>
      </div>

    </section>
  )
}
