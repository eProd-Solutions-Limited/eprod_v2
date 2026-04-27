import { cache } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { ArrowRight, BookOpen, Calendar, Tag } from 'lucide-react'

interface MediaDoc {
  id: number | string
  url?: string | null
  width?: number | null
  height?: number | null
  alt?: string | null
}

interface CaseStudy {
  id: number | string
  title: string
  slug: string
  excerpt?: string | null
  client?: string | null
  industry?: string | null
  publishedAt?: string | null
  coverImage?: MediaDoc | number | string | null
}

const getCaseStudies = cache(async () => {
  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: 'case-studies',
    sort: '-publishedAt',
    limit: 50,
    depth: 1,
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

function getCoverAlt(coverImage: CaseStudy['coverImage']): string {
  if (!coverImage || typeof coverImage !== 'object') return 'Case study cover'
  return (coverImage as MediaDoc).alt ?? 'Case study cover'
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const coverUrl = getCoverUrl(study.coverImage)
  const isFeatured = index === 0

  return (
    <Link
      href={`/case-studies/${study.slug}`}
      className={`group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${isFeatured ? 'md:col-span-2' : ''}`}
    >
      {/* Cover image */}
      <div className={`relative overflow-hidden bg-primary/10 ${isFeatured ? 'aspect-16/7' : 'aspect-video'}`}>
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={getCoverAlt(study.coverImage)}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes={isFeatured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            priority={isFeatured}
          />
        ) : (
          <div className="absolute inset-0 gradient-primary flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
        {study.industry && (
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs font-semibold bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
            <Tag className="w-3 h-3" />
            {study.industry}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {study.client && (
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
            {study.client}
          </p>
        )}
        <h2 className={`font-bold text-foreground leading-snug mb-3 group-hover:text-primary transition-colors ${isFeatured ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
          {study.title}
        </h2>
        {study.excerpt && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
            {study.excerpt}
          </p>
        )}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border">
          {study.publishedAt ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(study.publishedAt)}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            Read case study
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 mx-auto">
        <BookOpen className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">No case studies yet</h2>
      <p className="text-muted-foreground max-w-sm">
        We're documenting our client successes. Check back soon to read about the real impact we've delivered.
      </p>
    </div>
  )
}

export default async function CaseStudiesPage() {
  const { docs } = await getCaseStudies()
  const studies = docs as unknown as CaseStudy[]

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-primary py-24 md:py-32">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute -bottom-12 right-0 w-125 h-125 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-5">
            Success Stories
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-2xl">
            Real Impact,<br className="hidden sm:block" /> Real Results
          </h1>
          <p className="text-lg text-white/75 leading-relaxed max-w-xl">
            Explore how we've helped financial institutions and agribusinesses transform their operations and unlock growth through technology.
          </p>
          {studies.length > 0 && (
            <div className="flex items-center gap-2 mt-8">
              <span className="w-8 h-px bg-secondary" />
              <span className="text-secondary text-sm font-medium">
                {studies.length} case {studies.length === 1 ? 'study' : 'studies'} published
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {studies.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {studies.map((study, i) => (
                <CaseStudyCard key={study.id} study={study} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
