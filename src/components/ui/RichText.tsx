import React from 'react'

type LexicalNode = {
  type: string
  text?: string
  format?: number
  children?: LexicalNode[]
  tag?: string
  listType?: 'bullet' | 'number'
  value?: number
  url?: string
  newTab?: boolean
  [key: string]: unknown
}

type LexicalRoot = {
  root?: {
    children?: LexicalNode[]
  }
}

/** Renderiza nodos del editor Lexical de Payload de forma liviana y segura. */
function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    let el: React.ReactNode = node.text || ''
    // Bits de formato estándar en Lexical: 1=bold, 2=italic, 8=underline, 16=code
    const format = node.format || 0
    if (format & 1) el = <strong key="b">{el}</strong>
    if (format & 2) el = <em key="i">{el}</em>
    if (format & 8) el = <u key="u">{el}</u>
    if (format & 16) el = <code key="c" className="rounded bg-brand-soft px-1 text-sm">{el}</code>
    return <React.Fragment key={index}>{el}</React.Fragment>
  }

  const children = node.children ? node.children.map((child, i) => renderNode(child, i)) : null

  switch (node.type) {
    case 'heading': {
      const tag = node.tag || 'h2'
      if (tag === 'h1') return <h2 key={index} className="text-3xl font-extrabold mt-6 mb-3">{children}</h2>
      if (tag === 'h2') return <h2 key={index} className="text-2xl font-bold mt-5 mb-2">{children}</h2>
      if (tag === 'h3') return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{children}</h3>
      return <h4 key={index} className="text-lg font-bold mt-3 mb-1">{children}</h4>
    }
    case 'paragraph':
      return <p key={index} className="mb-4 leading-relaxed text-ink/80">{children}</p>
    case 'list': {
      if (node.listType === 'number') {
        return <ol key={index} className="mb-4 list-decimal pl-6 space-y-1 text-ink/80">{children}</ol>
      }
      return <ul key={index} className="mb-4 list-disc pl-6 space-y-1 text-ink/80">{children}</ul>
    }
    case 'listitem':
      return <li key={index}>{children}</li>
    case 'link':
      return (
        <a
          key={index}
          href={node.url || '#'}
          target={node.newTab ? '_blank' : undefined}
          rel={node.newTab ? 'noopener noreferrer' : undefined}
          className="text-brand font-semibold underline hover:text-court"
        >
          {children}
        </a>
      )
    case 'quote':
      return (
        <blockquote key={index} className="my-4 border-l-4 border-accent pl-4 italic text-ink/75">
          {children}
        </blockquote>
      )
    default:
      return <div key={index}>{children}</div>
  }
}

export function RichText({ content }: { content?: unknown }) {
  if (!content) return null
  const root = (content as LexicalRoot)?.root
  if (!root?.children || !Array.isArray(root.children)) {
    if (typeof content === 'string') return <p>{content}</p>
    return null
  }
  return <div className="prose max-w-none">{root.children.map((node, i) => renderNode(node, i))}</div>
}
