'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import type { EventStatus } from '@/lib/event-utils'
import { EventSlideshow } from '@/components/EventSlideshow'
import { EventRichText } from '@/components/EventRichText'
import { useI18n } from '@/lib/i18n/LanguageProvider'

interface ImageEntry { url: string; alt: string }

interface EventItem {
  id: string
  name: string
  venue: string
  startDate: string
  endDate: string | null
  description: any | null
  imageUrls: ImageEntry[]
  status: EventStatus
  dateLabel: string
  dayName: string
}

const statusConfig: Record<EventStatus, { dot: string; label: string; pulse: boolean; textColor: string }> = {
  ongoing: { dot: 'bg-red-500', label: 'Ongoing', pulse: true, textColor: 'text-red-500' },
  upcoming: { dot: 'bg-green-500', label: 'Upcoming', pulse: false, textColor: 'text-green-600' },
  past: { dot: 'bg-gray-400', label: 'Past', pulse: false, textColor: 'text-muted-foreground' },
}

const PAST_PER_PAGE = 8

function StatusDot({ status }: { status: EventStatus }) {
  const cfg = statusConfig[status]
  return (
    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
      {cfg.pulse && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${cfg.dot}`} />
    </span>
  )
}

function StatusBadge({ status }: { status: EventStatus }) {
  const { t } = useI18n()
  return (
    <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5">
      <StatusDot status={status} />
      <span className="text-xs font-semibold text-white">{t.events.status[status]}</span>
    </div>
  )
}

export default function EventsPageClient({
  events,
  nextUpcoming,
}: {
  events: EventItem[]
  nextUpcoming: EventItem | null
}) {
  const { t } = useI18n()
  const [pastPage, setPastPage] = useState(0)

  const ongoing = events.filter((e) => e.status === 'ongoing')
  const upcoming = events.filter((e) => e.status === 'upcoming')
  const past = events.filter((e) => e.status === 'past')

  const featured = ongoing[0] ?? past[0] ?? null
  const totalPastPages = Math.ceil(past.length / PAST_PER_PAGE)
  const pagedPast = past.slice(pastPage * PAST_PER_PAGE, pastPage * PAST_PER_PAGE + PAST_PER_PAGE)

  // Hero background: use next upcoming event image, fallback to gradient
  const heroBg = nextUpcoming?.imageUrls[0]?.url ?? null

  return (
    <main className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden">
        {/* Background */}
        {heroBg ? (
          <>
            <Image src={heroBg} alt={nextUpcoming!.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/60" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-primary" />
        )}

        <div className="relative z-10 container mx-auto px-4 py-20 grid md:grid-cols-[1fr_360px] gap-10 items-center">

          {/* Left — titles */}
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-white/60 mb-4">{t.events.hero.eyebrow}</p>
            <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-5">
              {t.events.hero.titleLead} <span className="text-secondary">{t.events.hero.titleHighlight}</span>
            </h1>
            <p className="text-white/70 text-lg max-w-lg leading-relaxed">
              {t.events.hero.subtitle}
            </p>
          </div>

          {/* Right — next upcoming event card */}
          {nextUpcoming ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-green-400">{t.events.hero.nextEvent}</span>
              </div>
              <h3 className="text-lg font-extrabold text-white leading-snug mb-4">{nextUpcoming.name}</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm text-white/80">
                  <Calendar size={15} className="flex-shrink-0 mt-0.5 text-secondary" />
                  <span>{nextUpcoming.dayName}</span>
                </div>
                <div className="flex items-start gap-2.5 text-sm text-white/80">
                  <MapPin size={15} className="flex-shrink-0 mt-0.5 text-secondary" />
                  <span>{nextUpcoming.venue}</span>
                </div>
              </div>
              {nextUpcoming.description && (
                <EventRichText
                  content={nextUpcoming.description}
                  truncate
                  truncateHeight="4.5rem"
                  textClassName="text-xs text-white/70 leading-relaxed"
                  className="mt-4"
                />
              )}
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center">
              <p className="text-white/50 text-sm">{t.events.hero.noUpcomingHero}</p>
            </div>
          )}

        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">

          {/* ── LEFT (60%) — Featured + Past ── */}
          <div className="flex flex-col gap-8">

            {/* Featured event — scrolls with past events */}
            {featured && (
              <div className="pb-2">
                <div className="flex items-center gap-2 mb-4">
                  <StatusDot status={featured.status} />
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {featured.status === 'ongoing' ? t.events.featured.ongoingEvent : t.events.featured.latestEvent}
                  </span>
                </div>
                <Link href={`/events/${featured.id}`} className="rounded-2xl overflow-hidden border border-border shadow-lg bg-card block hover:shadow-xl transition-shadow">
                  <div className="relative aspect-[16/7] w-full bg-muted overflow-hidden">
                    {featured.imageUrls.length > 0 ? (
                      <>
                        <EventSlideshow images={featured.imageUrls} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Calendar size={48} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <StatusBadge status={featured.status} />
                    </div>
                  </div>
                  <div className="p-6 md:p-8">
                    <h2 className="text-2xl font-extrabold text-foreground mb-3">{featured.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1.5"><Calendar size={14} />{featured.dayName}</span>
                      <span className="flex items-center gap-1.5"><MapPin size={14} />{featured.venue}</span>
                    </div>
                    {featured.description && (
                      <EventRichText content={featured.description} truncate={false} />
                    )}
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-4">
                      {t.events.featured.viewFull} <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* Past events */}
            {past.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-foreground mb-5">{t.events.past.title}</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {pagedPast.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group block"
                    >
                      {/* Image — 16:9 shows more of the scene */}
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        {event.imageUrls[0] ? (
                          <Image
                            src={event.imageUrls[0].url}
                            alt={event.imageUrls[0].alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar size={24} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <StatusBadge status={event.status} />
                        </div>
                        {/* Photo count badge */}
                        {event.imageUrls.length > 1 && (
                          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white font-medium">
                            {event.imageUrls.length} {t.events.past.photos}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-foreground text-sm mb-1.5 leading-snug group-hover:text-primary transition-colors">{event.name}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                          <Calendar size={11} />{event.dateLabel}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin size={11} />{event.venue}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPastPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => setPastPage((p) => Math.max(0, p - 1))}
                      disabled={pastPage === 0}
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPastPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setPastPage(i); }}
                        className={`w-9 h-9 rounded-full text-sm font-semibold transition ${
                          i === pastPage
                            ? 'gradient-primary text-primary-foreground shadow-sm'
                            : 'border border-border hover:bg-muted text-foreground'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPastPage((p) => Math.min(totalPastPages - 1, p + 1))}
                      disabled={pastPage === totalPastPages - 1}
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}

            {!featured && past.length === 0 && (
              <div className="py-20 text-center text-muted-foreground">
                {t.events.past.empty}
              </div>
            )}
          </div>

          {/* ── RIGHT (40%) — Upcoming (sticky) ── */}
          <div className="sticky top-20">
            <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              {t.events.upcoming.title}
            </h3>

            {upcoming.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
                {t.events.upcoming.empty}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {upcoming.map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`} className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block group">
                    {event.imageUrls[0] && (
                      <div className="relative h-36 bg-muted overflow-hidden">
                        <Image
                          src={event.imageUrls[0].url}
                          alt={event.imageUrls[0].alt}
                          fill
                          className="object-cover"
                          sizes="380px"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wide">{t.events.upcoming.badge}</span>
                      </div>
                      <h4 className="font-bold text-foreground text-sm mb-1.5 leading-snug">{event.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Calendar size={11} />{event.dayName}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={11} />{event.venue}
                      </div>
                      {event.description && (
                        <EventRichText content={event.description} truncate truncateHeight="3rem" className="mt-2" />
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  )
}
