import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Seamless CSS marquee. Duplicated track is hidden from assistive tech; pauses on hover/focus. */
export function Marquee({ items, className, itemClass }: { items: ReactNode[]; className?: string; itemClass?: string }) {
  const track = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className={cn('flex shrink-0 items-center gap-10', itemClass)}>
          {it}
        </li>
      ))}
    </ul>
  )
  return (
    <div className={cn('group flex w-full overflow-hidden', className)}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {track(false)}
        {track(true)}
      </div>
    </div>
  )
}
