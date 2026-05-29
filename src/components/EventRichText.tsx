'use client'

import { useState } from 'react'

/* ── Lexical text format bitmask ── */
const BOLD        = 1
const ITALIC      = 2
const STRIKETHROUGH = 4
const UNDERLINE   = 8
const CODE        = 16

function esc(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function serializeNode(node: any): string {
  if (!node) return ''

  switch (node.type) {

    case 'text': {
      let t = esc(node.text || '')
      const f = node.format || 0
      if (f & BOLD)          t = `<strong>${t}</strong>`
      if (f & ITALIC)        t = `<em>${t}</em>`
      if (f & UNDERLINE)     t = `<u>${t}</u>`
      if (f & STRIKETHROUGH) t = `<s>${t}</s>`
      if (f & CODE)          t = `<code class="bg-muted px-1 rounded text-xs font-mono">${t}</code>`
      if (node.style)        t = `<span style="${esc(node.style)}">${t}</span>`
      return t
    }

    case 'linebreak':
      return '<br/>'

    case 'paragraph': {
      const inner = (node.children || []).map(serializeNode).join('')
      const align = node.format ? ` style="text-align:${node.format}"` : ''
      return `<p class="mb-2 last:mb-0"${align}>${inner || '<br/>'}</p>`
    }

    case 'heading': {
      const tag = node.tag || 'h3'
      const sizes: Record<string, string> = {
        h1: 'text-2xl font-extrabold mb-3',
        h2: 'text-xl font-bold mb-2',
        h3: 'text-lg font-bold mb-2',
        h4: 'text-base font-semibold mb-1',
        h5: 'text-sm font-semibold mb-1',
        h6: 'text-xs font-semibold mb-1',
      }
      const inner = (node.children || []).map(serializeNode).join('')
      return `<${tag} class="${sizes[tag] || 'font-bold'}">${inner}</${tag}>`
    }

    case 'link':
    case 'autolink': {
      const href = esc(node.fields?.url || node.url || '#')
      const newTab = node.fields?.newTab !== false
      const extra = newTab ? 'target="_blank" rel="noopener noreferrer"' : ''
      const inner = (node.children || []).map(serializeNode).join('')
      return `<a href="${href}" ${extra} class="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity">${inner}</a>`
    }

    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      const cls = node.listType === 'number'
        ? 'list-decimal pl-5 mb-2 space-y-1'
        : 'list-disc pl-5 mb-2 space-y-1'
      const inner = (node.children || []).map(serializeNode).join('')
      return `<${tag} class="${cls}">${inner}</${tag}>`
    }

    case 'listitem': {
      const inner = (node.children || []).map(serializeNode).join('')
      return `<li>${inner}</li>`
    }

    case 'quote': {
      const inner = (node.children || []).map(serializeNode).join('')
      return `<blockquote class="border-l-4 border-primary/30 pl-4 italic text-muted-foreground mb-2">${inner}</blockquote>`
    }

    case 'horizontalrule':
      return '<hr class="my-3 border-border"/>'

    default:
      if (node.children) return (node.children || []).map(serializeNode).join('')
      return ''
  }
}

function toHtml(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return `<p>${esc(content)}</p>`
  if (!content?.root?.children) return ''
  return (content.root.children as any[]).map(serializeNode).join('')
}

interface Props {
  content: any
  truncate?: boolean
  className?: string
  textClassName?: string
  truncateHeight?: string
}

export function EventRichText({
  content,
  truncate = false,
  className = '',
  textClassName = 'text-sm text-muted-foreground leading-relaxed',
  truncateHeight = '5rem',
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const html = toHtml(content)
  if (!html.trim()) return null

  const isTruncated = truncate && !expanded

  return (
    <div className={className}>
      <div
        className={`${textClassName} overflow-hidden transition-all duration-300`}
        style={isTruncated ? { maxHeight: truncateHeight } : { maxHeight: '9999px' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {truncate && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-xs font-semibold text-primary hover:underline focus:outline-none"
        >
          {expanded ? 'Read less ↑' : 'Read more ↓'}
        </button>
      )}
    </div>
  )
}
