/**
 * Skiper 40 — Animated Link, installed with `npx shadcn add @skiper-ui/skiper40`.
 *
 * Adapted for Kannaadi.Ai: the Next.js <Link> is replaced by React Router (internal hrefs) or a
 * plain anchor (mailto:/external), the five variants share one <Anchor>, and the demo section that
 * shipped with the component was removed. Variants:
 *   Link000  underline wipe (left → right)               — footer + inline links
 *   Link001  underline + arrow, opens in a new tab        — external links
 *   Link002  underline wipe (right → left) + arrow
 *   Link003  underline grows from the centre + arrow
 *   Link004  difference-blend bar rises behind the label  — works on light AND dark surfaces
 *   Link005  difference-blend sweep fills the row         — menu rows, category index
 *
 * Skiper UI — inspired by and adapted from https://cursor.com/?from=home
 * License & Usage (upstream):
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Author: @gurvinder-singh02 · https://gxuri.me · https://x.com/Gur__vi
 */
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router'

import { cn } from '@/lib/utils'

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  children: ReactNode
  href: string
  className?: string
}

const isInternal = (href: string) => href.startsWith('/') && !href.startsWith('//')

function Anchor({ href, children, ...rest }: LinkProps) {
  if (isInternal(href)) {
    return (
      <RouterLink to={href} {...rest}>
        {children}
      </RouterLink>
    )
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  )
}

const ARROW_PATH = 'M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004'

const Arrow = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d={ARROW_PATH} stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ARROW_RISE =
  "ml-[0.3em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
const ARROW_ROTATE =
  "z-0 ml-[0.6em] mt-[0em] size-[0.55em] translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100 motion-reduce:transition-none"
const ARROW_SLIDE =
  "z-0 ml-[0.6em] mt-[0em] size-[0.55em] -translate-x-1 rotate-45 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"

const HIT = "after:absolute after:inset-x-0 after:-inset-y-2.5 after:content-['']"

const LINE =
  "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-current before:content-[''] before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:before:transition-none"

export const Link000 = ({ children, href, className, ...rest }: LinkProps) => (
  <Anchor
    href={href}
    {...rest}
    className={cn(
      'group relative inline-flex items-center',
      className,
      LINE,
      HIT,
      'before:bottom-0 before:h-[0.06em] before:origin-right hover:before:origin-left hover:before:scale-x-100 focus-visible:before:origin-left focus-visible:before:scale-x-100',
    )}
  >
    {children}
  </Anchor>
)

export const Link001 = ({ children, href, className, ...rest }: LinkProps) => (
  <Anchor
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    {...rest}
    className={cn(
      'group relative inline-flex items-center',
      LINE,
      HIT,
      'before:bottom-[-0.15em] before:h-[0.06em] before:origin-right hover:before:origin-left hover:before:scale-x-100',
      className,
    )}
  >
    {children}
    <Arrow className={ARROW_RISE} />
  </Anchor>
)

export const Link002 = ({ children, href, className, ...rest }: LinkProps) => (
  <Anchor
    href={href}
    {...rest}
    className={cn(
      'group relative inline-flex items-center',
      className,
      LINE,
      HIT,
      'before:bottom-[-0.15em] before:h-[0.06em] before:origin-left hover:before:origin-right hover:before:scale-x-100 focus-visible:before:origin-right focus-visible:before:scale-x-100',
    )}
  >
    {children}
    <Arrow className={ARROW_RISE} />
  </Anchor>
)

export const Link003 = ({ children, href, className, ...rest }: LinkProps) => (
  <Anchor
    href={href}
    {...rest}
    className={cn(
      'group relative inline-flex items-center',
      className,
      LINE,
      HIT,
      'before:bottom-[-0.15em] before:h-[0.06em] before:origin-center hover:before:scale-x-100 focus-visible:before:scale-x-100',
    )}
  >
    {children}
    <Arrow className={ARROW_RISE} />
  </Anchor>
)

export const Link004 = ({ children, href, className, ...rest }: LinkProps) => (
  <Anchor
    href={href}
    {...rest}
    className={cn(
      'group relative flex items-center px-2',
      className,
      "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:z-1 before:h-0 before:w-full before:bg-white before:mix-blend-difference before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:content-[''] hover:before:h-[1.4em] focus-visible:before:h-[1.4em] motion-reduce:before:transition-none",
    )}
  >
    {children}
    <Arrow className={ARROW_ROTATE} />
  </Anchor>
)

export const Link005 = ({ children, href, className, ...rest }: LinkProps) => (
  <Anchor
    href={href}
    {...rest}
    className={cn(
      'group relative flex items-center px-2',
      className,
      "before:pointer-events-none before:absolute before:left-0 before:top-0 before:z-1 before:h-full before:w-full before:origin-left before:scale-x-0 before:bg-white before:mix-blend-difference before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] before:content-[''] hover:before:scale-x-100 focus-visible:before:scale-x-100 motion-reduce:before:transition-none",
    )}
  >
    {children}
    <Arrow className={ARROW_SLIDE} />
  </Anchor>
)
