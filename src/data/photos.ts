import { PHOTOS } from './photos.generated'

/**
 * Realistic model photography (see scripts/photos/manifest.mjs). Each slot is filled by `npm run photos` once its
 * source image exists; until then `photo()` returns undefined and components keep the procedural placeholder art.
 */
export interface PhotoEntry {
  width: number
  height: number
  alt: string
  /** Image 1 — clean photograph, largest first not guaranteed (sorted by consumers) */
  clean: { src: string; width: number }[]
  /** Image 2 — the AI layer derived from Image 1, pixel-aligned */
  ai: { src: string; width: number }[]
  thumb?: string
  /** AI-scan version of Image 2, for dark sections (present when Image 2 is a real photo, e.g. a try-on pair) */
  scan?: { src: string; width: number }[]
  /** Silhouette mask (alpha = model) aligned with the images */
  mask?: string
  /** Reveal instruction, e.g. "Move across her to try on the saree" (falls back to the generic AI-layer wording) */
  hint?: string
  /** Same instruction for touch screens */
  touchHint?: string
  /** Small corner label naming the two layers, e.g. "Casual ↔ Saree try-on" */
  pairLabel?: string
  /** Text on the small cursor tag (default "Reveal") */
  cursorLabel?: string
}

export type PhotoSlot =
  | 'hero'
  | 'fashion-stores'
  | 'saree-ethnic-stores'
  | 'bridal-stores'
  | 'boutiques'
  | 'shopping-malls'
  | 'events-exhibitions'
  | 'jewellery-stores'
  | 'eyewear-stores'
  | 'look-ink'
  | 'look-champagne'
  | 'look-forest'
  | 'look-claret'

export const photo = (slot: PhotoSlot): PhotoEntry | undefined => PHOTOS[slot]

/** Smallest variant at least `minWidth` wide (or the largest available). */
export const pick = (list: { src: string; width: number }[], minWidth: number) => {
  const sorted = [...list].sort((a, b) => a.width - b.width)
  return (sorted.find((s) => s.width >= minWidth) ?? sorted[sorted.length - 1]).src
}

export const srcSetOf = (list: { src: string; width: number }[]) => list.map((s) => `${s.src} ${s.width}w`).join(', ')
