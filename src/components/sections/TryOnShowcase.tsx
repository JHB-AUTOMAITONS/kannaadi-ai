import { gownProps, gownAlt, looksArePhotos } from '@/lib/images'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Layers, MonitorSmartphone, Shirt } from 'lucide-react'
import { Cta } from '@/components/ui/Cta'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { prefersReducedMotion } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

const COLOURS = [
  { id: 'ink', label: 'Ink', swatch: '#2c2c34' },
  { id: 'champagne', label: 'Champagne', swatch: '#eadfc8' },
  { id: 'forest', label: 'Forest', swatch: '#1f5a43' },
  { id: 'claret', label: 'Claret', swatch: '#6a1730' },
] as const

const SHOWCASE_SIZES = '(min-width: 1024px) 34rem, 92vw'

const POINTS = [
  { icon: Shirt, title: 'Colour and silhouette on the shopper', body: 'Customers judge the piece the way they will wear it.' },
  { icon: Layers, title: 'Switch pieces without leaving the mirror', body: 'Explore colourways and looks in a single flow.' },
  { icon: MonitorSmartphone, title: 'Online, in store, at events', body: 'The same try-on experience, wherever the shopper is.' },
]

/**
 * Interactive showcase: pick a colourway, then drag the scan line to see the same garment as the AI
 * sees it. The two layers are identical renders of one model, so they align exactly.
 */
export function TryOnShowcase() {
  const [colour, setColour] = useState<(typeof COLOURS)[number]['id']>('ink')
  const [pos, setPos] = useState(58) // % from left where the scan layer begins
  const stage = useRef<HTMLDivElement>(null)
  const scan = useRef<HTMLImageElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const knob = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const touched = useRef(false)
  // Other colourways are fetched only once the section has been seen (or a swatch is hovered/focused)
  const [armed, setArmed] = useState(false)

  // Paint the split position straight to the DOM (no React render per frame during the idle sweep).
  const paint = useCallback((p: number) => {
    if (scan.current) scan.current.style.clipPath = `inset(0 0 0 ${p}%)`
    if (line.current) line.current.style.left = `${p}%`
    if (knob.current) knob.current.style.left = `${p}%`
  }, [])
  useEffect(() => paint(pos), [pos, paint])

  // Gentle idle sweep until the visitor takes over. The loop only exists while the stage is on screen.
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const reduced = prefersReducedMotion()
    let raf = 0
    let arm = 0
    const t0 = performance.now()
    const loop = (now: number) => {
      if (touched.current) return
      paint(58 + Math.sin((now - t0) / 1500) * 22)
      raf = requestAnimationFrame(loop)
    }
    const io = new IntersectionObserver(
      ([e]) => {
        cancelAnimationFrame(raf)
        if (!e.isIntersecting) return
        arm = window.setTimeout(() => setArmed(true), 900)
        if (!reduced && !touched.current) raf = requestAnimationFrame(loop)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(arm)
      io.disconnect()
    }
  }, [paint])

  const setFromEvent = useCallback((e: PointerEvent) => {
    const r = stage.current?.getBoundingClientRect()
    if (!r) return
    setPos(Math.min(96, Math.max(4, ((e.clientX - r.left) / r.width) * 100)))
  }, [])

  const onKey = (e: KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setPos((p) => Math.max(4, p - step))
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setPos((p) => Math.min(96, p + step))
    else if (e.key === 'Home') setPos(4)
    else if (e.key === 'End') setPos(96)
    else return
    touched.current = true
    e.preventDefault()
  }

  return (
    <section className="theme-dark grain relative isolate overflow-hidden bg-background text-foreground" aria-labelledby="showcase-title">
      <div className="container-x section grid items-center gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
        {/* stage */}
        <div className="order-2 mx-auto w-full max-w-[34rem] lg:order-1" data-reveal="">
          <div
            ref={stage}
            className="relative aspect-[1100/1300] w-full touch-pan-y overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(90%_70%_at_50%_38%,#262a1d_0%,#121413_55%,#0b0c0d_100%)] select-none"
            onPointerDown={(e) => {
              dragging.current = true
              touched.current = true
              e.currentTarget.setPointerCapture(e.pointerId)
              setFromEvent(e)
            }}
            onPointerMove={(e) => dragging.current && setFromEvent(e)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            {COLOURS.filter((c) => c.id === colour || armed).map((c) => (
              <img
                key={c.id}
                {...gownProps(c.id, { sizes: SHOWCASE_SIZES })}
                alt={c.id === colour ? gownAlt(c.id, c.label) : ''}
                aria-hidden={c.id !== colour}
                width={1100}
                height={1300}
                loading="lazy"
                decoding="async"
                draggable={false}
                className={cn('absolute inset-0 h-full w-full object-contain transition-opacity duration-500', c.id === colour ? 'opacity-100' : 'opacity-0')}
              />
            ))}
            {/* AI layer — same geometry, clipped by the scan line */}
            <img
              {...gownProps('scan', { sizes: SHOWCASE_SIZES, scanOf: colour })}
              alt=""
              aria-hidden="true"
              width={1100}
              height={1300}
              loading="lazy"
              decoding="async"
              draggable={false}
              ref={scan}
              className="absolute inset-0 h-full w-full object-contain"
              style={{ clipPath: 'inset(0 0 0 58%)' }}
            />
            {/* scan line + handle */}
            <div ref={line} className="pointer-events-none absolute inset-y-0 w-px bg-lumen shadow-[0_0_18px_2px_rgb(213_255_79/0.55)]" style={{ left: '58%' }} />
            <div
              ref={knob}
              role="slider"
              tabIndex={0}
              aria-label="Scan line: drag to compare the studio render with the AI scan"
              aria-valuemin={4}
              aria-valuemax={96}
              aria-valuenow={Math.round(pos)}
              aria-valuetext={`${Math.round(pos)}% studio, ${100 - Math.round(pos)}% AI scan`}
              onKeyDown={onKey}
              className="absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-lumen bg-ink text-lumen shadow-[0_8px_24px_-6px_rgb(0_0_0/0.7)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-lumen"
              style={{ left: '58%' }}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
              </svg>
            </div>
            <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.68rem] tracking-[0.14em] text-foreground/70 uppercase">Studio</span>
            <span className="pointer-events-none absolute right-4 bottom-3 font-mono text-[0.68rem] tracking-[0.14em] text-lumen uppercase">AI scan</span>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div role="radiogroup" aria-label="Gown colour" className="flex items-center gap-2.5">
              {COLOURS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={c.id === colour}
                  aria-label={c.label}
                  onClick={() => setColour(c.id)}
                  onPointerEnter={() => setArmed(true)}
                  onFocus={() => setArmed(true)}
                  className={cn(
                    'size-9 rounded-full border-2 border-transparent p-0.5 transition-[transform,border-color] duration-300',
                    c.id === colour ? 'scale-110 border-lumen' : 'hover:scale-105 hover:border-foreground/40',
                  )}
                >
                  <span className="block size-full rounded-full ring-1 ring-foreground/25" style={{ background: c.swatch }} />
                </button>
              ))}
              <span className="ml-1 font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase" aria-live="polite">
                {COLOURS.find((c) => c.id === colour)?.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{looksArePhotos ? 'AI-generated model imagery.' : 'Illustration: garment on a dress form.'}</p>
          </div>
        </div>

        {/* copy */}
        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <SectionHeading
            id="showcase-title"
            eyebrow="Virtual try-on showcase"
            title={
              <>
                See the colour, the drape, the fit — <span className="accent-serif">before</span> the fitting room.
              </>
            }
            lede="Virtual try on clothes the way shoppers actually decide: colour first, then how it sits. Switch colourways, then drag the scan line to look beneath the surface."
          />
          <ul data-reveal-stagger="" className="flex flex-col divide-y divide-border border-y border-border">
            {POINTS.map(({ icon: Icon, title, body }) => (
              <li key={title} data-reveal="" className="flex items-start gap-4 py-4">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-border text-lumen">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <div>
                  <h3 className="text-[1.02rem] font-medium tracking-tight">{title}</h3>
                  <p className="text-[0.95rem] text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div data-reveal="">
            <Cta to="/features/#ai-virtual-try-on" size="lg" variant="secondary">
              See how try-on works
            </Cta>
          </div>
        </div>
      </div>
    </section>
  )
}
