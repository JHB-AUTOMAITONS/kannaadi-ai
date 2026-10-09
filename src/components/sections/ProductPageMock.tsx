import { gownProps, gownAlt } from '@/lib/images'
import { useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

const COLOURS = [
  { id: 'ink', label: 'Ink', swatch: '#2c2c34' },
  { id: 'champagne', label: 'Champagne', swatch: '#eadfc8' },
  { id: 'forest', label: 'Forest', swatch: '#1f5a43' },
  { id: 'claret', label: 'Claret', swatch: '#6a1730' },
] as const

/**
 * A stand-in ecommerce product page with a "Try it on" action: the use case the page is about,
 * demonstrated rather than described. Illustrative only — no real product, price or store.
 */
export function ProductPageMock() {
  const [colour, setColour] = useState<(typeof COLOURS)[number]['id']>('forest')
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'tried'>('idle')

  const tryOn = () => {
    if (phase === 'scanning') return
    if (phase === 'tried') return setPhase('idle')
    setPhase('scanning')
    window.setTimeout(() => setPhase('tried'), 1400)
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[0_40px_80px_-50px_rgb(13_13_12/0.5)]">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="size-2.5 rounded-full bg-foreground/15" />
        <span className="ml-3 h-5 flex-1 rounded-full bg-foreground/[0.06]" />
      </div>
      <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
        <div className="relative aspect-[1100/1300] bg-[radial-gradient(90%_70%_at_50%_35%,#f1ede2,#e3dccb)] md:aspect-auto md:min-h-[26rem]">
          {COLOURS.map((c) => (
            <img
              key={c.id}
              {...gownProps(c.id, { sizes: '(min-width: 768px) 24rem, 92vw' })}
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
          {/* try-on layer: the scan sweeps, then the AI view stays */}
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 overflow-hidden transition-[clip-path,opacity] ease-[var(--ease-out-expo)]',
              phase === 'idle' ? 'opacity-0 duration-300 [clip-path:inset(0_100%_0_0)]' : 'opacity-100 duration-[1400ms] [clip-path:inset(0_0_0_0)]',
            )}
          >
            <img {...gownProps('scan', { sizes: '(min-width: 768px) 24rem, 92vw', scanOf: colour })} alt="" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full bg-[#0b0c0d] object-contain" />
          </div>
          {phase !== 'idle' && (
            <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] text-lumen uppercase" role="status">
              {phase === 'scanning' ? (
                <>
                  <Loader2 aria-hidden="true" className="size-3 animate-spin" /> Fitting…
                </>
              ) : (
                <>
                  <Sparkles aria-hidden="true" className="size-3" /> Try-on view
                </>
              )}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-5 p-6 md:p-8">
          <div>
            <p className="eyebrow">Illustrative product page</p>
            <p className="t-2 mt-3">Satin evening gown</p>
            <p className="mt-2 text-[0.95rem] text-muted-foreground">A sample listing. The try-on button is the part Kannaadi.Ai adds.</p>
          </div>
          <div role="radiogroup" aria-label="Colour" className="flex items-center gap-2.5">
            {COLOURS.map((c) => (
              <button
                key={c.id}
                type="button"
                role="radio"
                aria-checked={c.id === colour}
                aria-label={c.label}
                onClick={() => setColour(c.id)}
                className={cn('size-9 rounded-full border-2 border-transparent p-0.5 transition-[transform,border-color] duration-300', c.id === colour ? 'scale-110 border-foreground' : 'hover:scale-105 hover:border-foreground/40')}
              >
                <span className="block size-full rounded-full ring-1 ring-foreground/25" style={{ background: c.swatch }} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={tryOn}
            aria-pressed={phase === 'tried'}
            className="group/cta mt-auto inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-lumen px-6 font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <Sparkles aria-hidden="true" className="size-4" />
            {phase === 'tried' ? 'Back to product photo' : phase === 'scanning' ? 'Fitting…' : 'Try it on'}
          </button>
          <button type="button" disabled className="inline-flex h-12 items-center justify-center rounded-full border border-border text-muted-foreground">
            Add to bag
          </button>
        </div>
      </div>
    </div>
  )
}
