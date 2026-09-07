import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BackToInsights({ className }: { className?: string }) {
  return (
    <Link
      href="/insights"
      className={cn(
        'inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white',
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to Insights
    </Link>
  )
}
