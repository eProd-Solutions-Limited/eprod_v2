'use client'

import { useEffect } from 'react'
import { gaEvents } from '@/lib/ga-events'

const DEPTHS = [25, 50, 75, 100] as const

export function ArticleReadTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const fired = new Set<number>()

    function onScroll() {
      const el = document.documentElement
      const scrolled = el.scrollTop + el.clientHeight
      const pct = Math.round((scrolled / el.scrollHeight) * 100)

      for (const depth of DEPTHS) {
        if (pct >= depth && !fired.has(depth)) {
          fired.add(depth)
          gaEvents.articleRead(slug, depth)
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [slug])

  return null
}
