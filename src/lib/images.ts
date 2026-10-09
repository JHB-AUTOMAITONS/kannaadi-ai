import { photo, pick, srcSetOf, type PhotoSlot } from '@/data/photos'

/**
 * Look imagery (the four colourways used by the try-on showcase, AI Looks tiles, product demo, look board…).
 * Uses the realistic model photographs when `npm run photos` has produced them; otherwise the procedural
 * placeholder art. Every caller goes through here, so both modes stay consistent site-wide.
 *
 * Placeholder art ships at 1100×1300 and 550×650 (`-sm`); photos ship at the same two sizes.
 */
export type GownId = 'ink' | 'champagne' | 'forest' | 'claret' | 'scan'
type Colour = Exclude<GownId, 'scan'>

const lookSlot = (c: string) => `look-${c}` as PhotoSlot
const art = (id: string, size: 'sm' | 'full') => `/images/showcase/gown-${id}${size === 'sm' ? '-sm' : ''}.webp`

/** True once all four look photographs exist. Mixed modes would look inconsistent, so it is all or nothing. */
export const looksArePhotos = (['ink', 'champagne', 'forest', 'claret'] as const).every((c) => !!photo(lookSlot(c)))

/** Clean image of a colourway, or the AI layer for `scan` (of `scanOf`, default ink). */
function sources(id: GownId, scanOf: Colour = 'ink') {
  if (looksArePhotos) {
    const p = photo(lookSlot(id === 'scan' ? scanOf : id))!
    return id === 'scan' ? p.ai : p.clean
  }
  return [
    { src: art(id, 'sm'), width: 550 },
    { src: art(id, 'full'), width: 1100 },
  ]
}

export const gown = (id: GownId | string, size: 'sm' | 'full' = 'full', scanOf?: Colour) =>
  pick(sources(id as GownId, scanOf), size === 'sm' ? 500 : 1100)

/** <img> attributes: a plain small file for small renders, or a srcset for responsive ones. */
export function gownProps(id: GownId | string, opts: ({ small: true } | { sizes: string }) & { scanOf?: Colour }) {
  const list = sources(id as GownId, opts.scanOf)
  if ('small' in opts) return { src: pick(list, 500) }
  return { src: pick(list, 500), srcSet: srcSetOf(list), sizes: opts.sizes }
}

/** Accessible description of a colourway image in the current mode. */
export function gownAlt(id: Colour, label: string) {
  return looksArePhotos ? photo(lookSlot(id))!.alt : `${label} satin gown on a dress form`
}

/**
 * Scene pair (clean + AI) for a business page / card. Photos when available, otherwise the procedural scene.
 */
export function scene(slug: string, fallbackBase: string, fallbackAlt: string) {
  const p = photo(slug as PhotoSlot)
  if (p) return { clean: p.clean, ai: p.ai, alt: p.alt, thumb: p.thumb ?? pick(p.clean, 1), aspect: [p.width, p.height] as [number, number] }
  return {
    clean: [{ src: `${fallbackBase}-clean.webp`, width: 1200 }],
    ai: [{ src: `${fallbackBase}-ai.webp`, width: 1200 }],
    alt: fallbackAlt,
    thumb: `${fallbackBase}-thumb.webp`,
    aspect: [1200, 900] as [number, number],
  }
}

/**
 * Home hero pair (also reused by the Features hero and the real-time fitting demo). `scan` is the AI-scan look for
 * dark sections: the derived AI layer, or — when Image 2 is a real try-on photo — an AI scan of that photo.
 */
export function heroPair() {
  const p = photo('hero')
  if (p) return { clean: p.clean, ai: p.ai, scan: p.scan ?? p.ai, mask: p.mask, alt: p.alt, isPhoto: true, hint: p.hint, touchHint: p.touchHint, pairLabel: p.pairLabel, cursorLabel: p.cursorLabel }
  const ai = [
    { src: '/images/hero/hero-ai-800.webp', width: 800 },
    { src: '/images/hero/hero-ai-1600.webp', width: 1600 },
    { src: '/images/hero/hero-ai-2400.webp', width: 2400 },
  ]
  return {
    clean: [
      { src: '/images/hero/hero-clean-1600.webp', width: 1600 },
      { src: '/images/hero/hero-clean-2400.webp', width: 2400 },
    ],
    ai,
    scan: ai,
    mask: undefined as string | undefined,
    alt: 'A satin evening gown, shown as a studio still. Moving the pointer over it reveals the same gown as a luminous AI scan.',
    isPhoto: false,
    hint: undefined as string | undefined,
    touchHint: undefined as string | undefined,
    pairLabel: undefined as string | undefined,
    cursorLabel: undefined as string | undefined,
  }
}

/** The home hero <img sizes>. */
export const HERO_SIZES = '(max-width: 767px) 140vw, (max-width: 1023px) 100vw, min(100vw, 1625px)'
