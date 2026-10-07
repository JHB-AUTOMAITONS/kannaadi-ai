import { useRef } from 'react'
import { useParallax } from '@/hooks/use-parallax'

const RANGE_A: [number, number] = [-30, 30]
const RANGE_B: [number, number] = [-70, 50]
const RANGE_C: [number, number] = [-20, 60]

/**
 * Oversized, cropped background type that adds depth behind the subject. Deliberately low contrast
 * (it must never compete with the headline or the garment) and hidden from assistive tech.
 */
export function HeroBackdropWords() {
  const a = useRef<HTMLSpanElement>(null)
  const b = useRef<HTMLSpanElement>(null)
  const c = useRef<HTMLSpanElement>(null)
  useParallax(a, RANGE_A)
  useParallax(b, RANGE_B)
  useParallax(c, RANGE_C)

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none">
      <span
        ref={a}
        className="absolute top-[-3%] left-[-3vw] text-[clamp(8rem,26vw,27rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-ink/[0.045]"
      >
        TRY ON
      </span>
      <span
        ref={b}
        className="absolute top-[22%] left-[40vw] text-[clamp(7rem,22vw,23rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgb(13_13_12/0.12)] max-md:top-auto max-md:bottom-[14%] max-md:left-[20vw]"
      >
        STYLE
      </span>
      <span
        ref={c}
        className="absolute bottom-[-6%] left-[-1vw] max-md:hidden text-[clamp(7rem,20vw,21rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-ink/[0.045]"
      >
        FIT
      </span>
    </div>
  )
}
