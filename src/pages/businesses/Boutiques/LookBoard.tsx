import { useState } from 'react'
import { cn } from '@/lib/utils'
import { gown, gownAlt } from '@/lib/images'

const LOOKS = [
  { id: 'ink', name: 'The evening anchor', tilt: -2.2, notes: ['Statement earrings', 'Structured clutch', 'Satin heels'], why: 'A confident base piece that a stylist can dress up or down.' },
  { id: 'champagne', name: 'Soft occasion', tilt: 1.6, notes: ['Pearl drops', 'Slim belt', 'Metallic sandal'], why: 'Light and luminous — easy to pair, and kind to a wide range of skin tones.' },
  { id: 'forest', name: 'Deep and quiet', tilt: -1.2, notes: ['Gold cuff', 'Velvet wrap', 'Minimal clutch'], why: 'A colour that photographs richly and rarely competes with accessories.' },
  { id: 'claret', name: 'The collector’s piece', tilt: 2.4, notes: ['Dark lip', 'Brass jewellery', 'Evening bag'], why: 'The one customers remember — and ask to see again.' },
] as const

/** A stylist’s board: pick a piece and see the look and the reasoning around it. */
export function LookBoard() {
  const [id, setId] = useState<(typeof LOOKS)[number]['id']>('forest')
  const active = LOOKS.find((l) => l.id === id)!

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div role="radiogroup" aria-label="Looks" className="grid grid-cols-2 gap-x-3 gap-y-5 pt-2 sm:gap-x-4 md:grid-cols-4">
        {LOOKS.map((l) => {
          const on = l.id === id
          return (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setId(l.id)}
              style={{ ['--tilt' as string]: `${l.tilt}deg` }}
              className={cn(
                'group relative rotate-[var(--tilt)] rounded-2xl border bg-card p-2 pb-8 text-left shadow-[0_18px_40px_-26px_rgb(13_13_12/0.55)] transition-[transform,border-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:rotate-0',
                on ? '-translate-y-2 rotate-0 border-foreground shadow-[0_28px_50px_-24px_rgb(13_13_12/0.6)]' : 'border-border',
              )}
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-xl bg-[radial-gradient(90%_70%_at_50%_35%,#f4efe3,#e1d9c6)]">
                <img src={gown(l.id, 'sm')} alt={`${l.name}: ${gownAlt(l.id, l.id)}`} width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-105 object-contain" />
              </span>
              <span className="absolute inset-x-3 bottom-2.5 flex items-center justify-between font-mono text-[0.68rem] tracking-[0.12em] uppercase">
                <span>{l.name}</span>
                <span aria-hidden="true" className={cn('size-2 rounded-full transition-colors', on ? 'bg-lumen ring-1 ring-ink' : 'bg-foreground/20')} />
              </span>
              <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-10 -translate-x-1/2 rotate-[-3deg] bg-foreground/10 backdrop-blur-sm" />
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="grid gap-6 rounded-[2rem] border border-border bg-card p-6 md:grid-cols-[1.2fr_1fr] md:gap-10 md:p-8">
        <div className="flex flex-col gap-3">
          <p className="eyebrow">Stylist’s note</p>
          <h3 className="t-2">{active.name}</h3>
          <p className="max-w-[48ch] text-[1rem] leading-relaxed text-muted-foreground">{active.why}</p>
        </div>
        <div className="flex flex-col justify-between gap-5 md:border-l md:border-border md:pl-10">
          <div>
            <p className="eyebrow mb-3">Styled with</p>
            <ul className="flex flex-wrap gap-2">
              {active.notes.map((n) => (
                <li key={n} className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium">
                  {n}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-muted-foreground">Illustrative styling. AI Looks suggests combinations like these from your own collection.</p>
        </div>
      </div>
    </div>
  )
}
