import Link from 'next/link'

export interface InsightArticle {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  publishedAt?: string | null
  coverImage?: { url: string; width?: number; height?: number } | null
  category?: { id: number; name: string; slug: string } | null
}

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ArticleCard({ article, large }: { article: InsightArticle; large?: boolean }) {
  const hasCover = !!article.coverImage?.url

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:shadow-md ${large ? 'row-span-2' : ''}`}
    >
      {/* Cover image or gradient placeholder */}
      <div
        className={`w-full flex-shrink-0 ${large ? 'h-52' : 'h-28'}`}
        style={
          hasCover
            ? { backgroundImage: `url(${article.coverImage!.url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, hsl(183 97% 18%), hsl(183 97% 30%))' }
        }
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        {article.category && (
          <span className="w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
            {article.category.name}
          </span>
        )}
        <h3 className={`font-bold leading-snug text-foreground group-hover:text-primary transition-colors ${large ? 'text-lg' : 'text-sm'}`}>
          {article.title}
        </h3>
        {large && article.excerpt && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}
        {article.publishedAt && (
          <time className="mt-auto text-xs text-muted-foreground">{formatDate(article.publishedAt)}</time>
        )}
      </div>
    </Link>
  )
}

interface InsightsMasonryGridProps {
  articles: InsightArticle[]
}

export function InsightsMasonryGrid({ articles }: InsightsMasonryGridProps) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-muted-foreground">No articles found.</p>
        <Link href="/insights" className="text-sm font-medium text-primary underline underline-offset-4">
          Clear filters
        </Link>
      </div>
    )
  }

  // Group into sets of 3: [large, small, small]
  const groups: InsightArticle[][] = []
  for (let i = 0; i < articles.length; i += 3) {
    groups.push(articles.slice(i, i + 3))
  }

  return (
    <div className="flex flex-col gap-6">
      {groups.map((group, gi) => (
        <div key={gi} className="grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr]">
          {/* Large card — always first in group */}
          <ArticleCard article={group[0]} large />
          {/* Small cards stacked on the right */}
          <div className="flex flex-col gap-4">
            {group.slice(1).map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
