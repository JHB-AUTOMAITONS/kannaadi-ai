import { Fragment, type ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g

const linkCls = 'font-medium underline decoration-foreground/35 underline-offset-[0.2em] transition-colors hover:decoration-foreground hover:bg-lumen/60'

/** Renders the blog's inline subset: `[label](href)` links (internal → client-side Link) and `**bold**`. */
export function Inline({ text, className }: { text: string; className?: string }) {
  const out: ReactNode[] = []
  let last = 0
  let i = 0
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index))
    if (m[3] != null) {
      out.push(<strong key={i++}>{m[3]}</strong>)
    } else if (m[2].startsWith('/')) {
      out.push(
        <Link key={i++} to={m[2]} className={cn(linkCls, className)}>
          {m[1]}
        </Link>,
      )
    } else {
      out.push(
        <a key={i++} href={m[2]} rel="noopener" className={cn(linkCls, className)}>
          {m[1]}
        </a>,
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return <Fragment>{out}</Fragment>
}
