export type EventStatus = 'ongoing' | 'upcoming' | 'past'

export function getEventImageUrls(event: any): string[] {
  if (Array.isArray(event.images) && event.images.length > 0) {
    return event.images
      .map((img: any) => (typeof img === 'object' ? img.url : null))
      .filter(Boolean)
  }
  return []
}

export function getImageAlt(eventName: string, index: number, imageLabels?: any[]): string {
  const entry = imageLabels?.find((l: any) => l.enabled !== false && l.photoNumber === index + 1)
  if (entry?.label) return entry.label
  return `${eventName} ${index + 1}`
}

export function extractPlainText(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  const extract = (node: any): string => {
    if (node.type === 'text') return node.text || ''
    if (node.children) return (node.children as any[]).map(extract).join('')
    return ''
  }
  return (content?.root?.children || []).map(extract).join(' ')
}

export function formatEventDayName(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getEventStatus(startDate: string, endDate?: string | null): EventStatus {
  const now = new Date()
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date(startDate)
  end.setHours(23, 59, 59, 999)

  if (now >= start && now <= end) return 'ongoing'
  if (now < start) return 'upcoming'
  return 'past'
}

export function formatEventDate(startDate: string, endDate?: string | null): string {
  const start = new Date(startDate)
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  if (!endDate) return start.toLocaleDateString('en-GB', opts)
  const end = new Date(endDate)
  if (start.toDateString() === end.toDateString()) return start.toLocaleDateString('en-GB', opts)
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-GB', opts)}`
}
