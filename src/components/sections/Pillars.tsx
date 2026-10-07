import type { LucideIcon } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

export interface Pillar {
  icon: LucideIcon
  title: string
  body: string
}

/** Three-up value block. Each page supplies its own copy and icons; layout is deliberately plain. */
export function Pillars({
  id,
  eyebrow,
  title,
  lede,
  items,
  className,
}: {
  id: string
  eyebrow: string
  title: React.ReactNode
  lede?: React.ReactNode
  items: Pillar[]
  className?: string
}) {
  return (
    <section className={cn('section', className)} aria-labelledby={id}>
      <div className="container-x flex flex-col gap-10 md:gap-12">
        <SectionHeading id={id} eyebrow={eyebrow} title={title} lede={lede} />
        <ul data-reveal-stagger="" className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-3">
          {items.map(({ icon: Icon, title: t, body }) => (
            <li key={t} data-reveal="" className="group flex flex-col gap-4 bg-background p-6 transition-colors duration-300 hover:bg-card md:p-8">
              <span className="grid size-11 place-items-center rounded-full border border-border transition-colors duration-300 group-hover:border-transparent group-hover:bg-lumen group-hover:text-ink">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="t-3">{t}</h3>
              <p className="text-[0.98rem] leading-relaxed text-muted-foreground">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
