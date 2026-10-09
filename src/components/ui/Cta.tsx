import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '@/components/animations/Magnetic'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ink'
type Size = 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  /** Subtle magnetic pull toward the pointer (mouse only). */
  magnetic?: boolean
  className?: string
  children: ReactNode
  icon?: boolean
}

type AsLink = CommonProps & { to: string; href?: never } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>
type AsAnchor = CommonProps & { href: string; to?: never } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className' | 'children'>
type AsButton = CommonProps & { to?: never; href?: never } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>

const base =
  'group/cta relative inline-flex shrink-0 items-center gap-3 rounded-full font-medium tracking-[-0.01em] whitespace-nowrap select-none ' +
  'transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-soft)] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-60'

const sizes: Record<Size, { box: string; chip: string }> = {
  md: { box: 'h-11 pl-5 pr-1.5 text-[0.95rem]', chip: 'size-8' },
  lg: { box: 'h-12 gap-2.5 pl-4 pr-1.5 text-[0.92rem] sm:h-[3.4rem] sm:gap-3 sm:pl-6 sm:pr-2 sm:text-base', chip: 'size-8 sm:size-10' },
}

// Colours come from tokens so `secondary` is right on both ivory and ink sections.
const variants: Record<Variant, { box: string; chip: string }> = {
  primary: {
    box: 'bg-lumen text-ink hover:bg-ink hover:text-ivory hover:shadow-[0_0_0_1px_#d5ff4f] focus-visible:outline-[var(--ring)]',
    chip: 'bg-ink text-lumen group-hover/cta:bg-lumen group-hover/cta:text-ink',
  },
  secondary: {
    box: 'bg-card text-foreground border border-foreground/20 hover:border-foreground',
    chip: 'bg-foreground text-background group-hover/cta:bg-lumen group-hover/cta:text-ink',
  },
  ink: {
    box: 'bg-ink text-ivory hover:bg-graphite',
    chip: 'bg-lumen text-ink',
  },
}

export function Cta(props: AsLink | AsAnchor | AsButton) {
  const { variant = 'primary', size = 'md', magnetic = false, className, children, icon = true, ...rest } = props
  const s = sizes[size]
  const v = variants[variant]
  const cls = cn(base, s.box, v.box, className)
  const inner = (
    <>
      <span>{children}</span>
      {icon && (
        <span
          className={cn(
            'grid shrink-0 place-items-center overflow-hidden rounded-full transition-colors duration-300',
            s.chip,
            v.chip,
          )}
        >
          <ArrowUpRight
            aria-hidden="true"
            className="size-[45%] transition-transform duration-300 ease-[var(--ease-soft)] group-hover/cta:rotate-45"
          />
        </span>
      )}
    </>
  )

  let el: ReactNode
  if ('to' in rest && rest.to) {
    const { to, ...a } = rest as { to: string } & Record<string, unknown>
    el = (
      <Link to={to} className={cls} data-cursor-hide {...a}>
        {inner}
      </Link>
    )
  } else if ('href' in rest && rest.href) {
    const { href, ...a } = rest as { href: string } & Record<string, unknown>
    el = (
      <a href={href} className={cls} data-cursor-hide {...a}>
        {inner}
      </a>
    )
  } else {
    el = (
      <button type="button" className={cls} data-cursor-hide {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {inner}
      </button>
    )
  }
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}
