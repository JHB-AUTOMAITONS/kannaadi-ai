import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  eyebrow?: string
  title: ReactNode
  lede?: ReactNode
  align?: 'left' | 'center'
  level?: 'h1' | 'h2' | 'h3'
  /** Size token: display for page heroes, 1 for major sections, 2 for sub-sections */
  size?: 'display' | '1' | '2'
  className?: string
  id?: string
  reveal?: boolean
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('eyebrow inline-flex items-center gap-2.5', className)}>
      <span aria-hidden="true" className="size-1.5 rounded-[2px] bg-lumen ring-1 ring-foreground/25" />
      {children}
    </p>
  )
}

export function SectionHeading({ eyebrow, title, lede, align = 'left', level = 'h2', size = '1', className, id, reveal = true }: Props) {
  const Tag = level
  const sizeCls = size === 'display' ? 't-display' : size === '1' ? 't-1' : 't-2'
  return (
    <div
      className={cn('flex flex-col gap-4', align === 'center' && 'mx-auto items-center text-center', className)}
      {...(reveal ? { 'data-reveal': '' } : {})}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Tag id={id} className={cn(sizeCls, 'max-w-[20ch] sm:max-w-[26ch]', size === 'display' && 'max-w-[18ch] sm:max-w-[22ch]', align === 'center' && 'mx-auto')}>
        {title}
      </Tag>
      {lede && <p className={cn('lede', align === 'center' && 'mx-auto')}>{lede}</p>}
    </div>
  )
}
