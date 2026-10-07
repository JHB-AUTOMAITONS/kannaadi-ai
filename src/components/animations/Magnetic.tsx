import { useEffect, useRef, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

interface Props {
  children: ReactNode
  /** Fraction of the pointer offset the child follows (0.2–0.4 stays refined). */
  strength?: number
  className?: string
}

/**
 * Subtle magnetic pull. The wrapper owns the (slightly padded) hit area so the effect starts just
 * before the pointer reaches the control; the first child is what moves. Mouse only.
 * GSAP is imported on first hover-capable mount so it never blocks first paint.
 */
export function Magnetic({ children, strength = 0.28, className }: Props) {
  const wrap = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = wrap.current
    const inner = el?.firstElementChild as HTMLElement | null
    if (!el || !inner || prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let cancelled = false
    let teardown: (() => void) | undefined

    void import('gsap').then(({ gsap }) => {
      if (cancelled) return
      const x = gsap.quickTo(inner, 'x', { duration: 0.55, ease: 'power3.out' })
      const y = gsap.quickTo(inner, 'y', { duration: 0.55, ease: 'power3.out' })
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        x((e.clientX - (r.left + r.width / 2)) * strength)
        y((e.clientY - (r.top + r.height / 2)) * strength)
      }
      const reset = () => {
        x(0)
        y(0)
      }
      el.addEventListener('pointermove', move)
      el.addEventListener('pointerleave', reset)
      teardown = () => {
        el.removeEventListener('pointermove', move)
        el.removeEventListener('pointerleave', reset)
        gsap.set(inner, { clearProps: 'transform' })
      }
    })

    return () => {
      cancelled = true
      teardown?.()
    }
  }, [strength])

  return (
    <span ref={wrap} data-cursor-hide className={cn('-m-2 inline-flex p-2', className)}>
      {children}
    </span>
  )
}
