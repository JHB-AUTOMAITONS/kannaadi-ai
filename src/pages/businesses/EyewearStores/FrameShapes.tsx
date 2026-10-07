import { useState } from 'react'
import { cn } from '@/lib/utils'

const SHAPES = [
  { id: 'round', name: 'Round', body: 'Soft curves that are often chosen to balance angular features.' },
  { id: 'rect', name: 'Rectangular', body: 'Adds a little structure — a common pick for softer, rounder faces.' },
  { id: 'cat', name: 'Cat-eye', body: 'An upswept outer corner that lifts the face. Expressive and fashion-forward.' },
  { id: 'aviator', name: 'Aviator', body: 'A classic teardrop that works across many face shapes.' },
  { id: 'square', name: 'Square', body: 'Bold and graphic; a strong contrast to softer features.' },
] as const

const COLOURS = [
  { id: 'black', name: 'Black', stroke: '#0d0d0c', lens: 'rgb(13 13 12 / 0.1)' },
  { id: 'tortoise', name: 'Tortoise', stroke: '#7a4a21', lens: 'rgb(122 74 33 / 0.14)' },
  { id: 'crystal', name: 'Crystal', stroke: '#8fa9b8', lens: 'rgb(143 169 184 / 0.18)' },
  { id: 'gold', name: 'Gold wire', stroke: '#c99a3f', lens: 'rgb(201 154 63 / 0.12)' },
] as const

function lensPath(id: (typeof SHAPES)[number]['id']) {
  switch (id) {
    case 'round':
      return 'M57 110a19 19 0 1 0 38 0a19 19 0 1 0 -38 0Z'
    case 'rect':
      return 'M56 98 h40 a5 5 0 0 1 5 5 v14 a5 5 0 0 1 -5 5 h-40 a5 5 0 0 1 -5 -5 v-14 a5 5 0 0 1 5 -5Z'
    case 'cat':
      return 'M50 108 Q50 90 76 91 L99 97 Q102 116 86 125 Q62 127 50 108Z'
    case 'aviator':
      return 'M54 95 H98 Q101 130 76 134 Q50 130 54 95Z'
    case 'square':
      return 'M55 96 h42 v36 h-42Z'
  }
}

/** Frame-shape and colour picker drawn on a face outline. Pure SVG: instant, crisp, no assets. */
export function FrameShapes() {
  const [shape, setShape] = useState<(typeof SHAPES)[number]['id']>('cat')
  const [colour, setColour] = useState<(typeof COLOURS)[number]['id']>('tortoise')
  const s = SHAPES.find((x) => x.id === shape)!
  const c = COLOURS.find((x) => x.id === colour)!
  const d = lensPath(shape)

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
      <div className="relative grid min-h-[22rem] place-items-center overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(90%_80%_at_50%_30%,#fbf9f2_0%,#e8e1d0_100%)]">
        <svg viewBox="0 0 200 260" className="h-[21rem] w-auto" role="img" aria-label={`${c.name} ${s.name.toLowerCase()} frames on a face outline`}>
          {/* face */}
          <path d="M100 40 C146 40 164 80 162 128 C160 184 136 222 100 222 C64 222 40 184 38 128 C36 80 54 40 100 40Z" fill="#f1e6d6" stroke="#cdbfa7" strokeWidth="1.2" />
          <path d="M100 118 Q96 136 100 146 Q106 148 108 144" fill="none" stroke="#cdbfa7" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M82 178 Q100 190 118 178" fill="none" stroke="#cdbfa7" strokeWidth="1.4" strokeLinecap="round" />
          {/* eyes */}
          <circle cx="76" cy="110" r="3" fill="#6d5b45" />
          <circle cx="124" cy="110" r="3" fill="#6d5b45" />
          {/* frames */}
          <g style={{ transition: 'all .45s cubic-bezier(.16,1,.3,1)' }}>
            <path d={d} fill={c.lens} stroke={c.stroke} strokeWidth={colour === 'gold' ? 2 : 3.6} strokeLinejoin="round" />
            <path d={d} fill={c.lens} stroke={c.stroke} strokeWidth={colour === 'gold' ? 2 : 3.6} strokeLinejoin="round" transform="translate(200 0) scale(-1 1)" />
            <path d="M96 106 Q100 100 104 106" fill="none" stroke={c.stroke} strokeWidth={colour === 'gold' ? 2 : 3.2} strokeLinecap="round" />
            <path d="M50 104 L38 100 M150 104 L162 100" stroke={c.stroke} strokeWidth={colour === 'gold' ? 1.8 : 3} strokeLinecap="round" />
          </g>
        </svg>
        <span className="absolute top-4 left-4 rounded-full border border-ink/20 bg-white/70 px-3 py-1 font-mono text-[0.68rem] tracking-[0.14em] text-ink uppercase backdrop-blur">Illustrative</span>
      </div>

      <div className="flex flex-col gap-7 rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <fieldset className="flex flex-col gap-3">
          <legend className="eyebrow mb-1">Shape</legend>
          <div className="flex flex-wrap gap-2">
            {SHAPES.map((x) => (
              <label key={x.id} className="cursor-pointer">
                <input type="radio" name="frame-shape" checked={shape === x.id} onChange={() => setShape(x.id)} className="peer sr-only" />
                <span className={cn('inline-flex h-10 items-center rounded-full border px-4 text-[0.95rem] font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground', shape === x.id ? 'border-transparent bg-lumen text-ink' : 'border-border hover:border-foreground')}>
                  {x.name}
                </span>
              </label>
            ))}
          </div>
          <p aria-live="polite" className="text-[1rem] leading-relaxed text-muted-foreground">
            {s.body}
          </p>
        </fieldset>

        <fieldset className="flex flex-col gap-3">
          <legend className="eyebrow mb-1">Frame</legend>
          <div className="flex flex-wrap gap-2.5">
            {COLOURS.map((x) => (
              <label key={x.id} className="cursor-pointer">
                <input type="radio" name="frame-colour" checked={colour === x.id} onChange={() => setColour(x.id)} className="peer sr-only" />
                <span className={cn('inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-[0.95rem] font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground', colour === x.id ? 'border-foreground' : 'border-border hover:border-foreground/60')}>
                  <span className="size-4 rounded-full ring-1 ring-foreground/25" style={{ background: x.stroke }} />
                  {x.name}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="mt-auto border-t border-border pt-4 text-sm text-muted-foreground">
          Face-shape advice is a starting point, not a rule. With virtual try on, customers decide by seeing frames on their own face.
        </p>
      </div>
    </div>
  )
}
