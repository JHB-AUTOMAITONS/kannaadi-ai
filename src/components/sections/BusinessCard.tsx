import { scene } from '@/lib/images'
import { useRef } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { RevealStage } from '@/components/hero/RevealStage'
import type { Business } from '@/data/businesses'
import { cn } from '@/lib/utils'


/**
 * Category card. The studio image is permanent; hovering or touching the card reveals that same
 * scene as an AI scan through the same organic blob mask used in the hero (smaller, tuned for cards).
 */
export function BusinessCard({
  b,
  className,
  detailed = false,
  index,
  compact = false,
}: {
  b: Business
  className?: string
  detailed?: boolean
  index?: number
  /** Two-up mobile layout: tighter padding, tag and blurb hidden below sm */
  compact?: boolean
}) {
  const link = useRef<HTMLAnchorElement>(null)
  const sc = scene(b.slug, b.image, b.imageAlt)
  return (
    <Link
      ref={link}
      to={b.path}
      data-cursor-hide
      className={cn(
        'group/card relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)]',
        'hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_24px_50px_-28px_rgb(13_13_12/0.55)] focus-visible:-translate-y-1',
        compact ? 'p-1.5 sm:p-2.5' : 'p-2.5',
        className,
      )}
    >
      <RevealStage
        clean={sc.clean}
        ai={sc.ai}
        alt={sc.alt}
        aspect={sc.aspect}
        sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 92vw"
        eventTarget={link}
        blobScale={0.62}
        loadAi="interact"
        className={cn('relative aspect-[4/3] w-full', compact ? 'rounded-[1rem] sm:rounded-[1.25rem]' : 'rounded-[1.25rem]')}
      />
      <div className={cn('flex flex-1 flex-col gap-2', compact ? 'px-1.5 pt-3 pb-2 sm:px-2.5 sm:pt-4 sm:pb-2.5' : 'px-2.5 pt-4 pb-2.5')}>
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">
            {index != null && <span className="mr-2 text-foreground">{String(index + 1).padStart(2, '0')}</span>}
            <span className={compact ? 'max-sm:hidden' : undefined}>{b.tag}</span>
          </p>
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-foreground text-background transition-colors duration-300 group-hover/card:bg-lumen group-hover/card:text-ink">
            <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/card:rotate-45" />
          </span>
        </div>
        <h3 className="t-3">{b.name}</h3>
        <p className={cn('text-[0.95rem] leading-snug text-muted-foreground', compact && 'max-sm:hidden')}>{detailed ? b.card : b.blurb}</p>
      </div>
    </Link>
  )
}
