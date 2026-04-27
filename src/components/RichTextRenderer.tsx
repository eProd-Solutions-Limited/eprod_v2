import React from 'react'

type LexicalNode = {
  type: string
  version?: number
  text?: string
  format?: number
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  fields?: { url?: string; newTab?: boolean }
  children?: LexicalNode[]
  [key: string]: unknown
}

type EditorState = {
  root: LexicalNode
}

const TEXT_FORMAT = {
  BOLD: 1,
  ITALIC: 2,
  STRIKETHROUGH: 4,
  UNDERLINE: 8,
  CODE: 16,
  SUPERSCRIPT: 32,
  SUBSCRIPT: 64,
}

function renderText(node: LexicalNode): React.ReactNode {
  let content: React.ReactNode = node.text ?? ''
  const fmt = node.format ?? 0

  if (fmt & TEXT_FORMAT.CODE) {
    content = (
      <code className="bg-muted text-primary px-1.5 py-0.5 rounded text-sm font-mono">
        {content}
      </code>
    )
  }
  if (fmt & TEXT_FORMAT.BOLD) {
    content = <strong className="font-semibold text-foreground">{content}</strong>
  }
  if (fmt & TEXT_FORMAT.ITALIC) {
    content = <em className="italic">{content}</em>
  }
  if (fmt & TEXT_FORMAT.UNDERLINE) {
    content = <u className="underline underline-offset-2">{content}</u>
  }
  if (fmt & TEXT_FORMAT.STRIKETHROUGH) {
    content = <s className="line-through">{content}</s>
  }
  return content
}

const HEADING_CLASSES: Record<string, string> = {
  h1: 'text-3xl font-bold text-foreground mt-10 mb-4 tracking-tight leading-tight',
  h2: 'text-2xl font-bold text-foreground mt-10 mb-4 tracking-tight leading-snug',
  h3: 'text-xl font-bold text-foreground mt-8 mb-3 tracking-tight leading-snug',
  h4: 'text-lg font-semibold text-foreground mt-6 mb-2',
  h5: 'text-base font-semibold text-foreground mt-4 mb-2',
  h6: 'text-sm font-semibold text-foreground mt-4 mb-2',
}

function renderNode(node: LexicalNode, key: number | string): React.ReactNode {
  switch (node.type) {
    case 'root':
      return (node.children ?? []).map((child, i) => renderNode(child, i))

    case 'heading': {
      const tag = (node.tag ?? 'h2') as keyof typeof HEADING_CLASSES
      const cls = HEADING_CLASSES[tag] ?? HEADING_CLASSES.h2
      return React.createElement(
        tag,
        { key, className: cls },
        (node.children ?? []).map((child, i) => renderNode(child, i))
      )
    }

    case 'paragraph': {
      const children = (node.children ?? []).map((child, i) => renderNode(child, i))
      const isEmpty = node.children?.every((c) => c.type === 'text' && !c.text)
      if (isEmpty) return <div key={key} className="h-2" />
      return (
        <p key={key} className="text-muted-foreground leading-relaxed my-3">
          {children}
        </p>
      )
    }

    case 'text':
      return <React.Fragment key={key}>{renderText(node)}</React.Fragment>

    case 'linebreak':
      return <br key={key} />

    case 'list': {
      const isOrdered = node.listType === 'number'
      const Tag = isOrdered ? 'ol' : 'ul'
      const cls = isOrdered
        ? 'list-decimal pl-6 my-4 space-y-1.5'
        : 'list-disc pl-6 my-4 space-y-1.5'
      return (
        <Tag key={key} className={cls}>
          {(node.children ?? []).map((child, i) => renderNode(child, i))}
        </Tag>
      )
    }

    case 'listitem':
      return (
        <li key={key} className="text-muted-foreground leading-relaxed pl-1">
          {(node.children ?? []).map((child, i) => renderNode(child, i))}
        </li>
      )

    case 'link': {
      const url = (node.fields?.url as string) ?? '#'
      const newTab = node.fields?.newTab
      return (
        <a
          key={key}
          href={url}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
          className="text-primary underline underline-offset-2 hover:opacity-75 transition-opacity"
        >
          {(node.children ?? []).map((child, i) => renderNode(child, i))}
        </a>
      )
    }

    case 'horizontalrule':
      return <hr key={key} className="my-8 border-border" />

    case 'table':
      return (
        <div key={key} className="my-8 w-full overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm border-collapse">
            <tbody>
              {(node.children ?? []).map((child, i) => renderNode(child, i))}
            </tbody>
          </table>
        </div>
      )

    case 'tablerow':
      return (
        <tr key={key} className="border-b border-border last:border-0">
          {(node.children ?? []).map((child, i) => renderNode(child, i))}
        </tr>
      )

    case 'tablecell': {
      const isHeader = (node.headerState as number) > 0
      const Tag = isHeader ? 'th' : 'td'
      const colSpan = (node.colSpan as number) > 1 ? (node.colSpan as number) : undefined
      const rowSpan = (node.rowSpan as number) > 1 ? (node.rowSpan as number) : undefined
      return React.createElement(
        Tag,
        {
          key,
          colSpan,
          rowSpan,
          className: isHeader
            ? 'px-4 py-3 text-left font-semibold text-foreground bg-muted border-r border-border last:border-0'
            : 'px-4 py-3 text-muted-foreground border-r border-border last:border-0 align-top',
        },
        (node.children ?? []).map((child, i) => renderNode(child, i))
      )
    }

    case 'quote':
    case 'blockquote':
      return (
        <blockquote
          key={key}
          className="border-l-4 border-primary pl-5 my-6 text-muted-foreground italic"
        >
          {(node.children ?? []).map((child, i) => renderNode(child, i))}
        </blockquote>
      )

    default:
      if (node.children) {
        return (
          <React.Fragment key={key}>
            {node.children.map((child, i) => renderNode(child, i))}
          </React.Fragment>
        )
      }
      return node.text ? <React.Fragment key={key}>{node.text}</React.Fragment> : null
  }
}

export function RichTextRenderer({
  data,
  className,
}: {
  data: EditorState | null | undefined
  className?: string
}) {
  if (!data?.root) return null
  return (
    <div className={className}>
      {renderNode(data.root, 'root')}
    </div>
  )
}
