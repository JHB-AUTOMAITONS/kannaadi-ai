import { Link } from 'react-router'
import { cn } from '@/lib/utils'

/** Mirror glyph: an organic, slightly asymmetric looking-glass with a lumen glint. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn('size-8', className)} aria-hidden="true">
      <path
        d="M20 3.5c7.6 0 13 6.4 13 16.2 0 10.4-5.6 16.8-13.2 16.8S7 30 7 19.8C7 10 12.4 3.5 20 3.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path d="M14.5 26.5 25.5 12" stroke="#d5ff4f" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M14.5 26.5 25.5 12" stroke="#0d0d0c" strokeOpacity=".18" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className, to = '/' }: { className?: string; to?: string }) {
  return (
    <Link to={to} aria-label="Kannaadi.Ai — home" className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark />
      <span className="text-[1.28rem] leading-none font-semibold tracking-[-0.04em]">
        Kannaadi<span className="accent-serif ml-px text-[1.32em] tracking-[-0.02em]">.Ai</span>
      </span>
    </Link>
  )
}
