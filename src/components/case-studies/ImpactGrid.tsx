'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Play, ChevronDown, ChevronUp } from 'lucide-react'
import { RichTextRenderer } from '@/components/RichTextRenderer'

const TEXT_LIMIT = 160

type Category = 'All' | 'Financial Inclusion' | 'EUDR Traceability' | 'Operational Efficiency'

const FILTERS: Category[] = ['All', 'Financial Inclusion', 'EUDR Traceability', 'Operational Efficiency']

interface MediaDoc {
  url?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
}

export interface CaseStudyCard {
  id: string | number
  title: string
  coverImage?: MediaDoc | number | string | null
  client?: string | null
  tag?: string | null
  headline?: string | null
  situation?: string | null
  action?: string | null
  result?: Record<string, unknown> | null
  ctaLabel?: string | null
  ctaLink?: string | null
  hasVideo?: boolean | null
  videoUrl?: string | null
}

function getCoverUrl(coverImage: CaseStudyCard['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as MediaDoc).url ?? null
}

function toEmbedUrl(url: string): string {
  if (url.includes('youtube.com/watch')) {
    return url.replace('watch?v=', 'embed/').split('&')[0]
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split('?')[0]
    return `https://www.youtube.com/embed/${id}`
  }
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    const id = url.split('vimeo.com/')[1]?.split('?')[0]
    return `https://player.vimeo.com/video/${id}`
  }
  return url
}

function StoryCard({ story }: { story: CaseStudyCard }) {
  const [expanded, setExpanded] = useState(false)
  const coverUrl = getCoverUrl(story.coverImage)

  const rows = [
    { label: 'Challenge', text: story.situation },
    { label: 'Solution', text: story.action },
  ].filter((row) => row.text) as { label: string; text: string }[]

  const totalLength = rows.reduce((sum, r) => sum + r.text.length, 0)
  const needsToggle = totalLength > TEXT_LIMIT

  return (
    <article className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="relative aspect-16/10 overflow-hidden bg-primary/10">
        {story.hasVideo && story.videoUrl ? (
          <iframe
            src={toEmbedUrl(story.videoUrl)}
            title={story.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0"
          />
        ) : coverUrl ? (
          <Image
            src={coverUrl}
            alt={story.client ?? story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 gradient-primary" />
        )}
        {!(story.hasVideo && story.videoUrl) && (
          <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent" />
        )}
        {story.hasVideo && !story.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-foreground/90 backdrop-blur flex items-center justify-center shadow-lg group-hover:scale-110 transition">
              <Play size={24} className="text-primary ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        {story.tag && !(story.hasVideo && story.videoUrl) && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-secondary text-xs font-bold text-secondary-foreground uppercase tracking-wider">
            {story.tag}
          </span>
        )}
      </div>

      <div className="p-7 flex flex-col flex-1">
        {story.client && (
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {story.client}
          </p>
        )}
        <h3 className="text-xl font-bold text-foreground leading-snug mb-5">
          {story.headline ?? story.title}
        </h3>

        <dl className="space-y-3 mb-6 flex-1">
          {rows.map((row) => {
            const truncated = !expanded && needsToggle && row.text.length > TEXT_LIMIT / rows.length
            const displayText = truncated
              ? row.text.slice(0, Math.floor(TEXT_LIMIT / rows.length)) + '…'
              : row.text
            return (
              <div key={row.label} className="border-l-2 border-secondary pl-3">
                <dt className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                  {row.label}
                </dt>
                <dd className="text-sm text-muted-foreground leading-relaxed">{displayText}</dd>
              </div>
            )
          })}
          {story.result && (expanded || !needsToggle) && (
            <div className="border-l-2 border-secondary pl-3">
              <dt className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">
                Impact
              </dt>
              <dd className="text-sm text-muted-foreground leading-relaxed">
                <RichTextRenderer
                  data={story.result as any}
                  className="[&_ul]:my-1 [&_ul]:pl-4 [&_li]:my-0"
                />
              </dd>
            </div>
          )}
        </dl>

        {needsToggle && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary mb-4 hover:underline"
          >
            {expanded ? (
              <>Show less <ChevronUp size={14} /></>
            ) : (
              <>Read more <ChevronDown size={14} /></>
            )}
          </button>
        )}

        {story.ctaLink && (
          <a
            href={story.ctaLink}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all"
          >
            {story.ctaLabel ?? 'Read Full Case Study'}
            <ArrowRight size={16} />
          </a>
        )}
      </div>
    </article>
  )
}

interface ImpactGridProps {
  stories: CaseStudyCard[]
}

export function ImpactGrid({ stories }: ImpactGridProps) {
  const [active, setActive] = useState<Category>('All')

  const visible = active === 'All' ? stories : stories.filter((s) => s.tag === active)

  return (
    <section id="impact-grid" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-sm font-bold text-secondary uppercase tracking-wider mb-3">
            Success Stories
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-5">
            Measurable Results Across{' '}
            <span className="gradient-primary-text">Every Value Chain</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real outcomes from clients who transformed their operations into bankable, compliant,
            scalable businesses.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                active === f
                  ? 'gradient-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {visible.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  )
}
