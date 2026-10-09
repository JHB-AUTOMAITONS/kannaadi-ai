import { scene } from '@/lib/images'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { ChevronDown, Menu, X } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Cta } from '@/components/ui/Cta'
import { Link005 } from '@/components/ui/skiper-ui/skiper40'
import { BUSINESSES } from '@/data/businesses'
import { useDesktop } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

const LINKS = [
  { to: '/features/', label: 'Features' },
  { to: '/for-businesses/', label: 'For Businesses', mega: true },
  { to: '/use-cases/', label: 'Use Cases' },
  { to: '/about/', label: 'About' },
] as const

const linkCls = (active: boolean) =>
  cn(
    'relative inline-flex h-10 items-center rounded-full px-4 text-[0.93rem] font-medium tracking-[-0.01em] transition-colors duration-200',
    active ? 'bg-lumen text-ink' : 'text-foreground/80 hover:bg-foreground/[0.07] hover:text-foreground',
  )

export function Header() {
  const { pathname } = useLocation()
  const [top, setTop] = useState(true)
  // open state is keyed to the pathname it was opened on, so navigating closes it without an effect
  const [megaAt, setMegaAt] = useState<string | null>(null)
  const [menuAt, setMenuAt] = useState<string | null>(null)
  const desktop = useDesktop()
  const mega = desktop && megaAt === pathname
  const menu = !desktop && menuAt === pathname
  const setMega = useCallback((v: boolean | ((p: boolean) => boolean)) => setMegaAt((cur) => ((typeof v === 'function' ? v(cur === pathname) : v) ? pathname : null)), [pathname])
  const setMenu = useCallback((v: boolean | ((p: boolean) => boolean)) => setMenuAt((cur) => ((typeof v === 'function' ? v(cur === pathname) : v) ? pathname : null)), [pathname])
  const closeTimer = useRef<number>(0)
  const hoverOpenedAt = useRef(0)
  const megaBtn = useRef<HTMLButtonElement>(null)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const megaWrap = useRef<HTMLDivElement>(null)

  // header state
  useEffect(() => {
    const on = () => setTop(window.scrollY < 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  // mega menu: Escape, outside click
  useEffect(() => {
    if (!mega) return
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false)
        megaBtn.current?.focus()
      }
    }
    const click = (e: PointerEvent) => {
      if (!megaWrap.current?.contains(e.target as Node)) setMega(false)
    }
    document.addEventListener('keydown', key)
    document.addEventListener('pointerdown', click)
    return () => {
      document.removeEventListener('keydown', key)
      document.removeEventListener('pointerdown', click)
    }
  }, [mega, setMega])

  // stable identities: MobileMenu's focus/scroll-lock effect must not re-run on unrelated header renders
  const closeMenu = useCallback(() => setMenu(false), [setMenu])
  const escapeMenu = useCallback(() => {
    setMenu(false)
    menuBtn.current?.focus()
  }, [setMenu])

  const openMega = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    hoverOpenedAt.current = Date.now()
    setMega(true)
  }, [setMega])
  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setMega(false), 140)
  }, [setMega])

  return (
    <header
      className="site-header sticky top-0 z-50 border-b border-transparent bg-background text-foreground backdrop-blur-xl transition-[background-color,border-color] duration-300 data-[top=false]:border-border data-[top=false]:bg-background/90"
      data-top={top}
      data-menu={menu ? 'open' : 'closed'}
    >
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) =>
            'mega' in l ? (
              <div
                key={l.to}
                ref={megaWrap}
                className="relative flex items-center"
                onMouseEnter={openMega}
                onMouseLeave={scheduleClose}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setMega(false)
                }}
              >
                <NavLink to={l.to} className={({ isActive }) => cn(linkCls(isActive || pathname.startsWith('/for-businesses/')), 'pr-1.5')}>
                  {l.label}
                </NavLink>
                <button
                  ref={megaBtn}
                  type="button"
                  aria-expanded={mega}
                  aria-controls="mega-menu"
                  aria-label="Show business types"
                  onClick={() => {
                    // hovering already opened it a moment ago: the click confirms, it must not toggle it shut
                    if (mega && Date.now() - hoverOpenedAt.current < 700) return
                    setMega((v) => !v)
                  }}
                  className="-ml-1 grid size-8 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground/[0.07] hover:text-foreground"
                >
                  <ChevronDown aria-hidden="true" className={cn('size-4 transition-transform duration-300', mega && 'rotate-180')} />
                </button>
                <MegaMenu open={mega} onNavigate={() => setMega(false)} />
              </div>
            ) : (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => linkCls(isActive)}>
                {l.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <Cta to="/book-a-demo/" size="md" magnetic>
              Book a Demo
            </Cta>
          </div>
          <button
            ref={menuBtn}
            type="button"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            onClick={() => setMenu((v) => !v)}
            className="relative z-[60] grid size-11 place-items-center rounded-full border border-foreground/20 transition-colors hover:bg-foreground/[0.07] lg:hidden"
          >
            {menu ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>

      <MobileMenu open={menu} onClose={closeMenu} onEscape={escapeMenu} />
    </header>
  )
}

function MegaMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  return (
    <div
      id="mega-menu"
      hidden={!open}
      className={cn(
        'theme-dark absolute top-full left-1/2 z-50 w-[min(60rem,calc(100vw-3rem))] -translate-x-[38%] pt-3',
        open && 'animate-in fade-in-0 slide-in-from-top-1 duration-200',
      )}
    >
      <div className="overflow-hidden rounded-3xl border border-border bg-popover/95 shadow-[0_30px_80px_-20px_rgb(0_0_0/0.55)] backdrop-blur-xl">
        <div className="grid grid-cols-[15rem_1fr] gap-0">
          <div className="flex flex-col justify-between gap-6 border-r border-border bg-[radial-gradient(120%_90%_at_0%_0%,#1f2a12_0%,transparent_60%)] p-6">
            <div>
              <p className="eyebrow">For businesses</p>
              <p className="mt-3 text-lg leading-snug font-semibold tracking-tight text-foreground">
                One try-on layer, shaped to how your customers shop.
              </p>
            </div>
            <Link
              to="/for-businesses/"
              onClick={onNavigate}
              className="inline-flex w-fit items-center gap-2 rounded-full bg-lumen px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-ivory"
            >
              All business types →
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-x-2 p-3">
            {BUSINESSES.map((b) => (
              <li key={b.slug}>
                <Link005 href={b.path} onClick={onNavigate} className="gap-3 rounded-xl p-2 text-foreground">
                  <img
                    src={scene(b.slug, b.image, b.imageAlt).thumb}
                    alt=""
                    width={64}
                    height={48}
                    loading="lazy"
                    decoding="async"
                    className="z-0 h-12 w-16 shrink-0 rounded-lg object-cover"
                  />
                  <span className="z-0 flex min-w-0 flex-col py-0.5">
                    <span className="text-[0.95rem] leading-tight font-medium">{b.name}</span>
                    <span className="mt-0.5 line-clamp-1 text-xs opacity-65">{b.blurb}</span>
                  </span>
                </Link005>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function MobileMenu({ open, onClose, onEscape }: { open: boolean; onClose: () => void; onEscape: () => void }) {
  const panel = useRef<HTMLDivElement>(null)
  const [biz, setBiz] = useState(false)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // the page behind an open modal menu must not be reachable by keyboard or screen reader
    const behind = [document.getElementById('main'), document.querySelector<HTMLElement>('body > #root footer, footer')].filter((el): el is HTMLElement => !!el)
    behind.forEach((el) => (el.inert = true))
    const root = panel.current
    const focusables = () =>
      Array.from(root?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? []).filter((el) => el.offsetParent !== null)
    const first = window.setTimeout(() => focusables()[0]?.focus(), 80)
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape()
      if (e.key !== 'Tab') return
      // keep focus inside the menu. DOM order is toggle → menu items, so that is also the cycle order
      const toggle = document.querySelector<HTMLElement>('button[aria-controls="mobile-menu"]')
      const list = [...(toggle ? [toggle] : []), ...focusables()]
      if (!list.length) return
      const i = list.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && i <= 0) {
        e.preventDefault()
        list[list.length - 1].focus()
      } else if (!e.shiftKey && i === list.length - 1) {
        e.preventDefault()
        list[0].focus()
      }
    }
    document.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = prev
      behind.forEach((el) => (el.inert = false))
      window.clearTimeout(first)
      document.removeEventListener('keydown', key)
    }
  }, [open, onEscape])

  return (
    <div
      id="mobile-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        'theme-dark fixed inset-0 z-[55] flex flex-col overflow-y-auto bg-background px-5 pt-[calc(var(--header-h)+0.75rem)] pb-8 text-foreground lg:hidden',
        'transition-[opacity,clip-path] duration-500 ease-[var(--ease-out-expo)]',
        open ? 'pointer-events-auto opacity-100 [clip-path:inset(0_0_0_0)]' : 'pointer-events-none opacity-0 [clip-path:inset(0_0_100%_0)]',
      )}
    >
      <nav aria-label="Mobile" className="flex flex-col">
        {LINKS.map((l, i) => (
          <div key={l.to} className="border-b border-border" style={{ transitionDelay: open ? `${120 + i * 55}ms` : '0ms' }}>
            {'mega' in l ? (
              <>
                <div className="flex items-center justify-between">
                  <Link to={l.to} onClick={onClose} className="py-4 text-[2rem] leading-none font-semibold tracking-[-0.035em]">
                    {l.label}
                  </Link>
                  <button
                    type="button"
                    aria-expanded={biz}
                    aria-controls="mobile-biz"
                    aria-label="Show business types"
                    onClick={() => setBiz((v) => !v)}
                    className="grid size-11 place-items-center rounded-full border border-border"
                  >
                    <ChevronDown aria-hidden="true" className={cn('size-5 transition-transform duration-300', biz && 'rotate-180')} />
                  </button>
                </div>
                <ul
                  id="mobile-biz"
                  hidden={!biz}
                  className="mb-4 grid grid-cols-1 gap-0.5 rounded-2xl bg-muted/60 p-2 min-[420px]:grid-cols-2"
                >
                  {BUSINESSES.map((b) => (
                    <li key={b.slug}>
                      <Link to={b.path} onClick={onClose} className="flex min-h-11 items-center rounded-xl px-3 text-[0.95rem] font-medium hover:bg-foreground/10">
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <Link to={l.to} onClick={onClose} className="block py-4 text-[2rem] leading-none font-semibold tracking-[-0.035em]">
                {l.label}
              </Link>
            )}
          </div>
        ))}
        <Link to="/contact/" onClick={onClose} className="py-4 text-lg font-medium text-muted-foreground">
          Contact
        </Link>
      </nav>
      <div className="mt-auto pt-6">
        <Cta to="/book-a-demo/" size="lg" onClick={onClose} className="w-full justify-between">
          Book a Demo
        </Cta>
      </div>
    </div>
  )
}
