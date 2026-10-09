import { forwardRef, useEffect, useImperativeHandle, useRef, type CSSProperties } from 'react'
import { useParallax } from '@/hooks/use-parallax'
import type { BlobShape } from '@/lib/reveal-engine'
import { WordsReveal, type RevealWord } from '@/lib/words-reveal'
import { cn } from '@/lib/utils'

const RANGE_A: [number, number] = [-30, 30]
const RANGE_B: [number, number] = [-70, 50]
const RANGE_C: [number, number] = [-20, 60]

// The words' revealed state: the same neutral ink as the resting words, several times stronger. No hue, so the
// headline's difference blend over them stays a clean ink.
const INK = (alpha: number) => `rgba(13,13,12,${alpha})`

export interface HeroWordsHandle {
  /** Draw the lettering's revealed state through the engine's blob (see WordsReveal). */
  paint: (shape: BlobShape | null, origin: { x: number; y: number }) => void
}

/**
 * Oversized, cropped background type that adds depth behind the subject. Deliberately low contrast
 * (it must never compete with the headline or the garment). The words are CSS-generated content, not document
 * text: pure decoration, never read aloud, selected or copied.
 *
 * `overPhoto`: the hero is an opaque photograph, so the type is laid OVER it with multiply (it reads as printed on
 * the studio backdrop). With `maskUrl` (the model's silhouette, see .hero-words-masked) the type is cut away wherever
 * she stands, so on desktop it reads as sitting behind her; without a mask, STYLE — which would cross her — is left out.
 *
 * Over a photo the layer also carries a canvas for the words' revealed state: where the reveal blob passes, the same
 * words (same place, same size) come forward. It lives inside this layer, so it shares the layer's stacking, blend and
 * silhouette mask, and it is fed by the hero's single RevealEngine through the handle.
 */
export const HeroBackdropWords = forwardRef<HeroWordsHandle, { overPhoto?: boolean; maskUrl?: string }>(function HeroBackdropWords({ overPhoto = false, maskUrl }, ref) {
  const a = useRef<HTMLSpanElement>(null)
  const b = useRef<HTMLSpanElement>(null)
  const c = useRef<HTMLSpanElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const layer = useRef<WordsReveal | null>(null)
  useParallax(a, RANGE_A)
  useParallax(b, RANGE_B)
  useParallax(c, RANGE_C)

  useEffect(() => {
    const cv = canvas.current
    if (!cv || !WordsReveal.supported()) return
    const words = (): RevealWord[] => {
      const out: RevealWord[] = []
      if (a.current) out.push({ el: a.current, fill: INK(0.2) })
      if (b.current) out.push({ el: b.current, fill: INK(0.1), stroke: { color: INK(0.38), width: 2 } })
      if (c.current) out.push({ el: c.current, fill: INK(0.2) })
      return out
    }
    const wr = new WordsReveal(cv, words)
    layer.current = wr
    return () => {
      wr.destroy()
      layer.current = null
    }
  }, [])

  useImperativeHandle(ref, () => ({ paint: (shape, origin) => layer.current?.paint(shape, origin) }), [])

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden select-none', overPhoto ? 'z-[1] mix-blend-multiply' : 'z-0', maskUrl && 'hero-words-masked')}
      style={maskUrl ? ({ '--hero-mask': `url(${maskUrl})` } as CSSProperties) : undefined}
    >
      <span
        ref={a}
        className="before:content-[attr(data-word)] absolute top-[-3%] left-[-3vw] text-[clamp(8rem,26vw,27rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-ink/[0.045]"
        data-word="TRY ON"
      />
      <span
        ref={b}
        hidden={overPhoto && !maskUrl}
        className="before:content-[attr(data-word)] max-lg:in-[.hero-words-masked]:hidden absolute top-[22%] left-[40vw] lg:max-xl:left-[47vw] text-[clamp(7rem,22vw,23rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgb(13_13_12/0.12)] max-md:top-auto max-md:bottom-[14%] max-md:left-[20vw]"
        data-word="STYLE"
      />
      <span
        ref={c}
        className="before:content-[attr(data-word)] absolute bottom-[-6%] left-[-1vw] max-md:hidden text-[clamp(7rem,20vw,21rem)] leading-[0.8] font-semibold tracking-[-0.06em] whitespace-nowrap text-ink/[0.045]"
        data-word="FIT"
      />
      {overPhoto && <canvas ref={canvas} className="absolute inset-0 size-full" />}
    </div>
  )
})
