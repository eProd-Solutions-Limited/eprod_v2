import { cache } from 'react'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload-client'
import { cn } from '@/lib/utils'
import { RichTextRenderer } from '@/components/RichTextRenderer'
import { ArticleReadTracker } from '@/components/articles/ArticleReadTracker'

const getArticle = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  return payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 1,
  })
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { docs } = await getArticle(slug)
  if (!docs?.length) return {}

  const article = docs[0]
  const coverImage =
    typeof article.coverImage === 'object' && article.coverImage !== null
      ? article.coverImage
      : null

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: 'article',
      url: `/articles/${slug}`,
      publishedTime: article.publishedAt ?? undefined,
      images: coverImage?.url
        ? [{ url: coverImage.url, width: coverImage.width ?? 1200, height: coverImage.height ?? 630, alt: article.title }]
        : undefined,
    },
    alternates: { canonical: `/articles/${slug}` },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  if (!slug) {
    return <div>Article not found</div>
  }

  const { docs } = await getArticle(slug)

  if (!docs?.length) {
    return <div>Article not found</div>
  }

  const article = docs[0]

  const coverImage = typeof article.coverImage === 'object' && article.coverImage !== null
    ? article.coverImage
    : null

  const authorName =
    typeof article.author === 'object' && article.author !== null
      ? (article.author as any).email ?? 'eProd Solutions'
      : 'eProd Solutions'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.eprod-solutions.com'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    ...(article.excerpt ? { description: article.excerpt } : {}),
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
    ...(coverImage?.url ? { image: coverImage.url } : {}),
    url: `${siteUrl}/articles/${slug}`,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'eProd Solutions',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${slug}`,
    },
  }

  return (
    <article className="max-w-3xl mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <time className="text-gray-400">
        {article.publishedAt}
      </time>

      {coverImage?.url && (
        <div className="mt-8 rounded-2xl overflow-hidden">
          <Image
            src={coverImage.url}
            alt={coverImage.alt ?? article.title}
            width={coverImage.width ?? 1200}
            height={coverImage.height ?? 630}
            className="w-full h-auto object-cover"
            priority
          />
        </div>
      )}

      {/* Render blocks */}
      <div className="mt-8">
        {article.content?.map((block: any, i: number) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
      <ArticleReadTracker slug={slug} />
    </article>
  )
}

interface BlockProps {
  block: any
}

function BlockRenderer({ block }: BlockProps) {
  switch (block.blockType) {
    case 'richText':
      return (
        <RichTextRenderer data={block.content as any} className="mb-8" />
      )

    case 'image':
      return (
        <figure
          className={cn('my-8', {
            'max-w-full': block.width === 'full',
            'max-w-lg': block.width === 'half',
            'max-w-xs': block.width === 'inline',
          })}
        >
          <Image
            src={block.image.url}
            alt={block.alt || 'Article image'}
            width={block.image.width || 800}
            height={block.image.height || 600}
            className="rounded-lg w-full h-auto"
          />
          {block.caption && (
            <figcaption className="text-sm text-gray-400 mt-2 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'video':
      const embedUrl = block.url.includes('youtube')
        ? block.url.replace('watch?v=', 'embed/').split('&')[0]
        : block.url

      return (
        <div className="my-8">
          <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg">
            <iframe
              src={embedUrl}
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          {block.caption && (
            <p className="text-sm text-gray-400 mt-2 text-center">{block.caption}</p>
          )}
        </div>
      )

    case 'gif':
      return (
        <figure className="my-8">
          <img
            src={block.gif.url}
            alt={block.caption || 'GIF'}
            className="rounded-lg w-full h-auto"
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="text-sm text-gray-400 mt-2 text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )

    case 'quote':
      return (
        <blockquote className="border-l-4 border-teal-500 pl-6 italic text-lg my-8 text-gray-300">
          <p>"{block.text}"</p>
          {block.author && (
            <footer className="text-sm mt-2 not-italic">— {block.author}</footer>
          )}
        </blockquote>
      )

    case 'columns': {
      const colClass = block.layout === '3'
        ? 'grid-cols-1 sm:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2'
      return (
        <div className={`grid gap-6 my-8 ${colClass}`}>
          {block.columns?.map((col: any, i: number) => (
            <div key={i}>
              <RichTextRenderer data={col.content as any} />
            </div>
          ))}
        </div>
      )
    }

    case 'profileQuote': {
      const photo = typeof block.photo === 'object' && block.photo !== null ? block.photo : null
      return (
        <div className="my-10 flex flex-col sm:flex-row gap-6 items-start">
          {photo?.url && (
            <div className="shrink-0 w-36 sm:w-44">
              <Image
                src={photo.url}
                alt={photo.alt ?? block.name}
                width={photo.width ?? 176}
                height={photo.height ?? 176}
                className="rounded-xl w-full h-auto object-cover"
              />
              <div className="mt-3 text-sm leading-snug">
                <p className="font-semibold text-white">{block.name}</p>
                {block.jobTitle && <p className="text-gray-400">{block.jobTitle}</p>}
                {block.company && <p className="text-gray-400">{block.company}</p>}
              </div>
            </div>
          )}
          <div className="flex-1">
            {block.question && (
              <p className="font-semibold text-white mb-2 italic">{block.question}</p>
            )}
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{block.answer}</p>
          </div>
        </div>
      )
    }

    default:
      return null
  }
}