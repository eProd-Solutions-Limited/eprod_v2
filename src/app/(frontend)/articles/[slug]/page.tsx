import { cache } from 'react'
import Image from 'next/image'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { cn } from '@/lib/utils'
import { RichTextRenderer } from '@/components/RichTextRenderer'

const getArticle = cache(async (slug: string) => {
  const payload = await getPayload({ config: payloadConfig })
  return payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
  })
})

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

  return (
    <article className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
      <time className="text-gray-400">
        {article.publishedAt}
      </time>

      {/* Render blocks */}
      <div className="mt-8">
        {article.content?.map((block: any, i: number) => (
          <BlockRenderer key={i} block={block} />
        ))}
      </div>
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

    default:
      return null
  }
}