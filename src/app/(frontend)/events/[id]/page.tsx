export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload-client'
import { getEventImageUrls, getImageAlt, formatEventDate, formatEventDayName, getEventStatus, EventStatus } from '@/lib/event-utils'
import { EventRichText } from '@/components/EventRichText'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'

const statusConfig: Record<EventStatus, { dot: string; label: string; pulse: boolean }> = {
  ongoing: { dot: 'bg-red-500', label: 'Ongoing', pulse: true },
  upcoming: { dot: 'bg-green-500', label: 'Upcoming', pulse: false },
  past:    { dot: 'bg-gray-400', label: 'Past', pulse: false },
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
  const cfg        = statusConfig[status]
  const heroImage  = imageUrls[0]?.url ?? null
  const restImages = imageUrls.slice(1)

  return (
    <main className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="relative min-h-[480px] flex flex-col justify-end overflow-hidden">
        {heroImage ? (
          <>
            <Image src={heroImage} alt={event.name} fill className="object-cover" priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          </>
        ) : (
          <div className="absolute inset-0 gradient-primary" />
        )}

        <div className="relative z-10 container mx-auto px-4 pb-12 pt-24">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Events
          </Link>

          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4">
            <span className="relative flex h-2 w-2">
              {cfg.pulse && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${cfg.dot} opacity-75`} />
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${cfg.dot}`} />
            </span>
            <span className="text-xs font-semibold text-white">{cfg.label}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-5 leading-tight max-w-3xl">
            {event.name}
          </h1>

          <div className="flex flex-wrap gap-5 text-white/80 text-sm">
            <span className="flex items-center gap-2"><Calendar size={15} className="text-secondary" />{dayName}</span>
            <span className="flex items-center gap-2"><MapPin size={15} className="text-secondary" />{event.venue}</span>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container mx-auto px-4 py-14">
        <div className="max-w-5xl mx-auto">

          {/* About */}
          {event.description && (
            <div className="mb-14">
              <h2 className="text-xl font-bold text-foreground mb-5">About This Event</h2>
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                <EventRichText content={event.description} truncate={false} />
              </div>
            </div>
          )}

          {/* Photo gallery */}
          {imageUrls.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-5">
                Photos
                <span className="ml-2 text-sm font-normal text-muted-foreground">({imageUrls.length})</span>
              </h2>

              {/* Featured first photo */}
              <div className="rounded-2xl overflow-hidden mb-3 aspect-video relative bg-muted">
                <Image
                  src={imageUrls[0].url}
                  alt={imageUrls[0].alt}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white font-medium">
                  {imageUrls[0].alt}
                </div>
              </div>

              {/* Remaining photos grid */}
              {restImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {restImages.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group bg-muted">
                      <Image
                        src={img.url}
                        alt={img.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs text-white">
                        {img.alt}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
