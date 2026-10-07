import { forwardRef, useEffect, useImperativeHandle, useRef, type RefObject } from 'react'
import { RevealEngine } from '@/lib/reveal-engine'
import { prefersReducedMotion } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

export interface ImageSource {
  src: string
  width: number
}

export interface RevealStageHandle {
  /** Scripted reveal pass — gives keyboard and no-pointer users the same effect. */
  play: () => void
}

interface Props {
  /** Image 1 — the permanent base layer (a normal <img>). */
  clean: ImageSource[]
  /** Image 2 — exists only as pixels drawn through the blob mask. */
  ai: ImageSource[]
  alt: string
  /** Tailwind classes for the clean <img>; use object-[x%_y%] to set the shared focal point. */
  imgClassName?: string
  /** Relative blob size: 1 for the hero, ~0.6 for cards */
  blobScale?: number
  sizes?: string
  /** Natural aspect of the artwork pair (identical for both images) */
  aspect?: [number, number]
  /** Element that receives pointer events. Defaults to the stage itself. */
  eventTarget?: RefObject<HTMLElement | null>
  priority?: boolean
  /** When to fetch Image 2: after load+idle, when scrolled into view, or on first interaction */
  loadAi?: 'idle' | 'visible' | 'interact'
  className?: string
  onActiveChange?: (active: boolean) => void
}

const pickSource = (list: ImageSource[], needed: number) => {
  const sorted = [...list].sort((a, b) => a.width - b.width)
  return sorted.find((s) => s.width >= needed * 0.85) ?? sorted[sorted.length - 1]
}

/**
 * Two perfectly aligned images; only a mask moves.
 *   <img>     Image 1, object-fit: cover — never transformed
 *   <canvas>  Image 2, identical cover math, visible only through the organic blob mask
 * On load the canvas is fully transparent, so Image 2 is completely hidden.
 */
export const RevealStage = forwardRef<RevealStageHandle, Props>(function RevealStage(
  { clean, ai, alt, imgClassName, blobScale = 1, sizes = '100vw', aspect = [2400, 1300], eventTarget, priority, loadAi = 'idle', className, onActiveChange },
  ref,
) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<RevealEngine | null>(null)
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 })
  const cb = useRef(onActiveChange)
  // Callers may pass fresh array literals each render; the effect reads the latest through a ref
  // so it only re-binds when the event target or load strategy really changes.
  const cfg = useRef({ ai, aspect, blobScale })
  // keep the latest props readable from long-lived listeners without re-binding them
  useEffect(() => {
    cb.current = onActiveChange
    cfg.current = { ai, aspect, blobScale }
  })
  const img1 = useRef<HTMLImageElement>(null)

  useImperativeHandle(ref, () => ({
    play: () => {
      const { w, h } = sizeRef.current
      // sweep across the right-of-centre subject area
      engineRef.current?.autoplay({ x: w * 0.62, y: h * 0.52 }, { x: Math.min(w * 0.2, 320), y: h * 0.2 }, 3400)
      cb.current?.(true)
      window.setTimeout(() => cb.current?.(false), 3500)
    },
  }))

  useEffect(() => {
    const stage = wrap.current
    const cv = canvas.current
    if (!stage || !cv) return
    const target = eventTarget?.current ?? stage
    const engine = new RevealEngine(cv, { reducedMotion: prefersReducedMotion() })
    engine.setScale(cfg.current.blobScale)
    engineRef.current = engine

    // ---- sizing ------------------------------------------------------------------------
    let aiLoaded = false
    let aiStarted = false
    const dprNow = () => Math.min(window.devicePixelRatio || 1, 2)
    const apply = () => {
      const r = stage.getBoundingClientRect()
      sizeRef.current = { w: r.width, h: r.height, dpr: dprNow() }
      // the canvas copies the <img>'s computed object-position so both layers share one focal point
      const op = img1.current ? getComputedStyle(img1.current).objectPosition.split(' ') : ['50%', '50%']
      const pct = (v: string) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5)
      engine.setFocal(pct(op[0] ?? '50%'), pct(op[1] ?? '50%'))
      engine.resize(r.width, r.height, dprNow())
    }
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(stage)

    // ---- Image 2 loading ---------------------------------------------------------------
    const loadImage = () => {
      if (aiStarted) return
      aiStarted = true
      const { w, h, dpr } = sizeRef.current
      const { ai: aiList, aspect: asp } = cfg.current
      const scaledW = Math.max(w, (h * asp[0]) / asp[1])
      const choice = pickSource(aiList, scaledW * dpr)
      const im = new Image()
      im.decoding = 'async'
      im.src = choice.src
      const done = () => {
        aiLoaded = true
        engine.setImage(im)
      }
      if (im.decode) im.decode().then(done, done)
      else im.onload = done
    }

    let idleHandle = 0
    let io: IntersectionObserver | undefined
    if (loadAi === 'idle') {
      const kick = () => {
        const ric = (window as unknown as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback
        idleHandle = ric ? ric(loadImage, { timeout: 2500 }) : window.setTimeout(loadImage, 1200)
      }
      if (document.readyState === 'complete') kick()
      else window.addEventListener('load', kick, { once: true })
    } else if (loadAi === 'visible') {
      io = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            loadImage()
            io?.disconnect()
          }
        },
        { rootMargin: '300px' },
      )
      io.observe(stage)
    }

    // ---- pointer handling --------------------------------------------------------------
    const prevTouchAction = target.style.getPropertyValue('touch-action')
    target.style.setProperty('touch-action', 'pan-y')
    let inside = false
    const local = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top, ok: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }
    }
    const setInside = (v: boolean) => {
      if (v !== inside) {
        inside = v
        cb.current?.(v)
      }
    }
    const down = (e: PointerEvent) => {
      loadImage()
      if (e.pointerType !== 'touch') return
      const p = local(e)
      if (p.ok) {
        engine.enter(p.x, p.y, true)
        setInside(true)
      }
    }
    const move = (e: PointerEvent) => {
      loadImage()
      const p = local(e)
      if (!p.ok) {
        engine.leave()
        setInside(false)
        return
      }
      const touch = e.pointerType === 'touch'
      if (!inside) {
        engine.enter(p.x, p.y, touch)
        setInside(true)
      } else {
        engine.move(p.x, p.y)
      }
    }
    const up = (e: PointerEvent) => {
      engine.leave(e.pointerType === 'touch' ? 240 : 0)
      setInside(false)
    }
    const leave = (e: PointerEvent) => {
      engine.leave(e.pointerType === 'touch' ? 240 : 0)
      setInside(false)
    }
    const hide = () => {
      engine.leave()
      setInside(false)
    }
    target.addEventListener('pointerdown', down, { passive: true })
    target.addEventListener('pointermove', move, { passive: true })
    target.addEventListener('pointerup', up, { passive: true })
    target.addEventListener('pointercancel', up, { passive: true })
    target.addEventListener('pointerleave', leave, { passive: true })
    window.addEventListener('blur', hide)
    document.addEventListener('visibilitychange', hide)

    return () => {
      target.removeEventListener('pointerdown', down)
      target.removeEventListener('pointermove', move)
      target.removeEventListener('pointerup', up)
      target.removeEventListener('pointercancel', up)
      target.removeEventListener('pointerleave', leave)
      window.removeEventListener('blur', hide)
      document.removeEventListener('visibilitychange', hide)
      target.style.setProperty('touch-action', prevTouchAction)
      ro.disconnect()
      io?.disconnect()
      if (idleHandle) {
        const cic = (window as unknown as { cancelIdleCallback?: (n: number) => void }).cancelIdleCallback
        if (cic) cic(idleHandle)
        else window.clearTimeout(idleHandle)
      }
      engine.destroy()
      engineRef.current = null
      void aiLoaded
    }
    // sources are static per mount; re-bind only if the event target changes
  }, [eventTarget, loadAi])

  const srcSet = clean.map((s) => `${s.src} ${s.width}w`).join(', ')
  const largest = [...clean].sort((a, b) => b.width - a.width)[0]

  return (
    <div ref={wrap} className={cn('overflow-hidden', className)} data-reveal-stage>
      <img
        ref={img1}
        src={largest.src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={aspect[0]}
        height={aspect[1]}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={false}
        className={cn('absolute inset-0 h-full w-full object-cover', imgClassName)}
      />
      <canvas ref={canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  )
})
