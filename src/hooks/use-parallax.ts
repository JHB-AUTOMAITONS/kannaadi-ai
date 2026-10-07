import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from './use-media'

/**
 * Scroll parallax on one element via GSAP ScrollTrigger (loaded on demand so it never touches the
 * initial bundle). `range` is the vertical travel in px across the element's pass through the
 * viewport. Skipped entirely for reduced motion.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, range: [number, number] = [-36, 36]) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    let cleanup: (() => void) | undefined
    let cancelled = false

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const tween = gsap.fromTo(
        el,
        { y: range[0] },
        {
          y: range[1],
          ease: 'none',
          force3D: true,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )
      cleanup = () => {
        tween.scrollTrigger?.kill()
        tween.kill()
        gsap.set(el, { clearProps: 'transform' })
      }
    })
    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [ref, range])
}
