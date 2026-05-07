'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
}

interface InsightsFilterBarProps {
  categories: Category[]
}

export function InsightsFilterBar({ categories }: InsightsFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category') ?? ''
  const activeQ = searchParams.get('q') ?? ''

  const [inputValue, setInputValue] = useState(activeQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Keep input in sync if browser back/forward changes params
  useEffect(() => {
    setInputValue(activeQ)
  }, [activeQ])

  function pushParams(category: string, q: string) {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (q) params.set('q', q)
    params.set('page', '1')
    router.push(`/insights?${params.toString()}`)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setInputValue(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      pushParams(activeCategory, value)
    }, 300)
  }

  function handleCategoryClick(slug: string) {
    const next = slug === activeCategory ? '' : slug
    pushParams(next, inputValue)
  }

  return (
    <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      {/* Search input */}
      <div className="relative w-full sm:max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          value={inputValue}
          onChange={handleSearchChange}
          placeholder="Search articles..."
          className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleCategoryClick('')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            activeCategory === ''
              ? 'bg-primary text-primary-foreground'
              : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryClick(cat.slug)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              activeCategory === cat.slug
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  )
}
