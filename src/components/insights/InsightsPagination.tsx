import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function buildUrl(page: number, category?: string, q?: string): string {
  const params = new URLSearchParams()
  if (category) params.set('category', category)
  if (q) params.set('q', q)
  params.set('page', String(page))
  return `/insights?${params.toString()}`
}

interface InsightsPaginationProps {
  currentPage: number
  totalPages: number
  category?: string
  q?: string
}

export function InsightsPagination({ currentPage, totalPages, category, q }: InsightsPaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    // Show pages centred around currentPage
    const half = 2
    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPages, start + 4)
    start = Math.max(1, end - 4)
    return start + i
  }).filter((p) => p >= 1 && p <= totalPages)

  return (
    <nav className="flex items-center justify-center gap-1 pt-8" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(currentPage - 1, category, q)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground/40 cursor-not-allowed">
          <ChevronLeft size={16} />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildUrl(page, category, q)}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition ${
            page === currentPage
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-foreground hover:bg-muted'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Link>
      ))}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(currentPage + 1, category, q)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground hover:bg-muted transition"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground/40 cursor-not-allowed">
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  )
}
