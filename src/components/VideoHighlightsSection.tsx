'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { gaEvents } from '@/lib/ga-events'
import { useI18n } from '@/lib/i18n/LanguageProvider'

const videoIds = ['K60ZdON-xO0', '2ipMHeav6go', 'H8JB5GRUyE4']

const VideoHighlightsSection = () => {
  const { t } = useI18n()
  const videos = videoIds.map((id, i) => ({ id, title: t.video.titles[i] }))
  const [activeId, setActiveId] = useState(videoIds[0])

  const watchNext = videos.filter((v) => v.id !== activeId)

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10">
          {t.video.headingLead} <span className="gradient-primary-text">{t.video.headingHighlight}</span>
        </h2>

        <div className="grid md:grid-cols-[1fr_320px] gap-6 items-start">

          {/* Main video */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-lg bg-black aspect-video">
            <iframe
              key={activeId}
              src={`https://www.youtube.com/embed/${activeId}?autoplay=0&rel=0`}
              title="eProd video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {/* Watch next */}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-widest">
              {t.video.watchNext}
            </p>
            {watchNext.map((v) => (
              <button
                key={v.id}
                onClick={() => { gaEvents.videoSelected(v.title); setActiveId(v.id) }}
                className="flex items-start gap-3 rounded-xl p-2 hover:bg-muted transition-colors text-left group"
              >
                {/* Thumbnail */}
                <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                  <Image
                    src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                    alt={v.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                    <Play size={18} className="text-white fill-white" />
                  </div>
                </div>
                {/* Title */}
                <p className="text-sm font-medium text-foreground leading-snug pt-1 group-hover:text-primary transition-colors">
                  {v.title}
                </p>
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

export default VideoHighlightsSection
