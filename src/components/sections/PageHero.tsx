import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { pageByPath, type PageMeta } from '@/data/pages'
import { cn } from '@/lib/utils'

function trail(path: string): PageMeta[] {
  const out: PageMeta[] = []
  let cur = pageByPath(path)
  while (cur) {
    out.unshift(cur)
    cur = cur.parent ? pageByPath(cur.parent) : undefined
  }
  return out
}

export function Breadcrumbs({ path, className }: { path: string; className?: string }) {
  const items = trail(path)
  if (items.length < 2) return null
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase">
        {items.map((p, i) => (
          <li key={p.path} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight aria-hidden="true" className="size-3 opacity-60" />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {p.name}
              </span>
            ) : (
              <Link to={p.path} className="relative transition-colors after:absolute after:-inset-2 after:content-[''] hover:text-foreground">
                {p.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface Props {
  path: string
  theme?: 'light' | 'dark'
  eyebrow?: string
  /** The single H1 for the page; include the primary keyword naturally. */
  title: ReactNode
  /** Opening paragraph; include the primary keyword naturally. */
  intro: ReactNode
  actions?: ReactNode
  /** Right-hand visual (desktop) / stacked below (mobile) */
  visual?: ReactNode
  className?: string
  /** Extra background layer */
  backdrop?: ReactNode
  /** Full-width content under the text (wide hero stages) */
  below?: ReactNode
}

/** Shared inner-page hero. Dark heroes get a dark header at the top of the page (see global.css). */
export function PageHero({ path, theme = 'light', eyebrow, title, intro, actions, visual, className, backdrop, below }: Props) {
  return (
    <section
      data-hero={theme}
      className={cn(
        'relative isolate overflow-hidden bg-background text-foreground',
        theme === 'dark' && 'theme-dark grain',
        className,
      )}
    >
      {backdrop}
      <div className={cn('container-x relative z-10 grid items-center gap-8 pt-6 pb-10 md:pt-8 md:pb-14 lg:pb-20', visual && 'lg:grid-cols-[1.05fr_0.95fr] lg:gap-14')}>
        <div className="flex flex-col gap-6">
          <Breadcrumbs path={path} />
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="t-display max-w-[17ch] text-[clamp(2.4rem,1.2rem+5vw,5.2rem)]">{title}</h1>
          <p className="lede">{intro}</p>
          {actions && <div className="mt-1 flex flex-wrap items-center gap-2.5 sm:gap-3">{actions}</div>}
        </div>
        {visual && <div className="relative">{visual}</div>}
      </div>
      {below && <div className="container-x relative z-10 pb-10 md:pb-14 lg:pb-20 -mt-2">{below}</div>}
    </section>
  )
}
