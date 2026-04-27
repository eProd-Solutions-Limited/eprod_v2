import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { cn } from '@/lib/utils'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { ArrowLeft, Building2, Calendar, Tag, TrendingUp } from 'lucide-react'

interface MediaDoc {
  id: number | string
  url?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
}

interface StatItem {
  value: string
  label: string
  id?: string | number
}

type Block =
  | { blockType: 'richText'; content: SerializedEditorState; id?: string }
  | { blockType: 'image'; image: MediaDoc; alt: string; caption?: string; width?: 'full' | 'half' | 'inline'; id?: string }
  | { blockType: 'video'; url: string; caption?: string; id?: string }
  | { blockType: 'gif'; gif: MediaDoc; caption?: string; id?: string }
  | { blockType: 'quote'; text: string; author?: string; role?: string; id?: string }
  | { blockType: 'stats'; items?: StatItem[]; id?: string }

interface CaseStudy {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  client?: string | null
  industry?: string | null
  publishedAt?: string | null
  coverImage?: MediaDoc | number | string | null
  content?: Block[]
}

const getCaseStudy = cache(async (slug: string) => {
  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function getCoverUrl(coverImage: CaseStudy['coverImage']): string | null {
  if (!coverImage || typeof coverImage !== 'object') return null
  return (coverImage as MediaDoc).url ?? null
}

function getCoverDimensions(coverImage: CaseStudy['coverImage']) {
  if (!coverImage || typeof coverImage !== 'object') return { width: 1200, height: 630 }
  const doc = coverImage as MediaDoc
  return { width: doc.width ?? 1200, height: doc.height ?? 630 }
}

function BlockRenderer({ block }: { block: Block }) {
  switch (block.blockType) {
    case 'richText':
      return (
        <RichTextRenderer data={block.content as any} className="mb-10" />
      )

    case 'image': {
      const widthClass = {
        full: 'max-w-full',
        half: 'max-w-lg mx-auto',
        inline: 'max-w-xs',
      }[block.width ?? 'full']
      return (
        <figure className={cn('my-10', widthClass)}>
          <div className="relative rounded-xl overflow-hidden">
            <Image
              src={block.image.url ?? ''}
              alt={block.alt}
              width={block.image.width ?? 800}
              height={block.image.height ?? 500}
              className="w-full h-auto"
            />
          </div>
          {block.caption && (
            <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    }

    case 'video': {
      const embedUrl = block.url.includes('youtube')
        ? block.url.replace('watch?v=', 'embed/').split('&')[0]
        : block.url
      return (
        <div className="my-10">
          <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          {block.caption && (
            <p className="text-sm text-muted-foreground mt-3 text-center italic">{block.caption}</p>
          )}
        </div>
      )
    }

    case 'gif':
      return (
        <figure className="my-10">
          <Image
            src={block.gif.url ?? ''}
            alt={block.caption ?? 'Animation'}
            width={block.gif.width ?? 800}
            height={block.gif.height ?? 450}
            className="rounded-xl w-full h-auto shadow-md"
            unoptimized
          />
          {block.caption && (
            <figcaption className="text-sm text-muted-foreground mt-3 text-center italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'quote':
      return (
        <blockquote className="relative my-12 pl-8 border-l-4 border-primary">
          <div className="absolute -top-3 -left-1 text-primary/20 text-7xl font-serif leading-none select-none">
            "
          </div>
          <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
            {block.text}
          </p>
          {(block.author || block.role) && (
            <footer className="mt-4 not-italic">
              {block.author && (
                <span className="text-sm font-semibold text-foreground">— {block.author}</span>
              )}
              {block.role && (
                <span className="text-sm text-muted-foreground">, {block.role}</span>
              )}
            </footer>
          )}
        </blockquote>
      )

    case 'stats':
      if (!block.items?.length) return null
      return (
        <div className="my-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {block.items.map((item, i) => (
            <div
              key={item.id ?? i}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary/5 border border-primary/10"
            >
              <TrendingUp className="w-5 h-5 text-secondary mb-3" />
              <span className="text-3xl font-bold text-primary">{item.value}</span>
              <span className="text-sm text-muted-foreground mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      )

    default:
      return null
  }
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { docs } = await getCaseStudy(slug)

  if (!docs?.length) notFound()

  const study = docs[0] as unknown as CaseStudy
  const coverUrl = getCoverUrl(study.coverImage)
  const { width: coverW, height: coverH } = getCoverDimensions(study.coverImage)

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative">
        {coverUrl ? (
          <div className="relative w-full aspect-[21/9] max-h-[560px] overflow-hidden">
            <Image
              src={coverUrl}
              alt={study.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-black/10" />
            <HeroOverlay study={study} />
          </div>
        ) : (
          <div className="relative w-full py-32 gradient-primary overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
            </div>
            <HeroOverlay study={study} light={false} />
          </div>
        )}
      </section>

      {/* Article body */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Case Studies
          </Link>

          {/* Excerpt lead-in */}
          {study.excerpt && (
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light border-l-4 border-secondary pl-6 mb-12">
              {study.excerpt}
            </p>
          )}

          {/* Content blocks */}
          {study.content?.map((block, i) => (
            <BlockRenderer key={block.id ?? i} block={block} />
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-border py-16 bg-muted/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Want results like these?
          </p>
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Let's build something together
          </h2>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 gradient-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Get in touch
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </section>
    </main>
  )
}

function HeroOverlay({ study, light = true }: { study: CaseStudy; light?: boolean }) {
  const textColor = light ? 'text-white' : 'text-white'
  const mutedColor = light ? 'text-white/70' : 'text-white/70'

  return (
    <div className={cn('absolute inset-0 flex flex-col justify-end', !light && 'relative inset-auto flex-col justify-start')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {study.industry && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              {study.industry}
            </span>
          )}
          {study.client && (
            <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', mutedColor)}>
              <Building2 className="w-3.5 h-3.5" />
              {study.client}
            </span>
          )}
          {study.publishedAt && (
            <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', mutedColor)}>
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(study.publishedAt)}
            </span>
          )}
        </div>
        <h1 className={cn('text-3xl md:text-5xl font-bold leading-tight max-w-3xl', textColor)}>
          {study.title}
        </h1>
      </div>
    </div>
  )
}
