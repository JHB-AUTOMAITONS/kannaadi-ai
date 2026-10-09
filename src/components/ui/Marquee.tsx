import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Seamless CSS marquee. The duplicated track is hidden from assistive tech; it pauses on hover/focus and while off-screen. */
export function Marquee({ items, className, itemClass }: { items: ReactNode[]; className?: string; itemClass?: string }) {
  const root = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

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
    <div ref={root} className={cn('group flex w-full overflow-hidden', className)}>
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={inView ? undefined : { animationPlayState: 'paused' }}
      >
        {track(false)}
        {track(true)}
      </div>
    </div>
  )
}
