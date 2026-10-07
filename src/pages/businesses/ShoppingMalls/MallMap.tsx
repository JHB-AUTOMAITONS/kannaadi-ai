import { useState } from 'react'
import { cn } from '@/lib/utils'

const SPOTS = [
  { id: 'atrium', label: 'Atrium', x: 50, y: 48, body: 'High footfall and room to queue: the place for a showpiece kiosk that makes the brand visible from across the floor.' },
  { id: 'escalator', label: 'Escalator landing', x: 22, y: 30, body: 'People pause here to get their bearings, which makes it a natural place for a short, glanceable try-on.' },
  { id: 'flagship', label: 'Flagship entrance', x: 80, y: 28, body: 'A kiosk at the door draws shoppers into the store and gives them a first look at what is inside.' },
  { id: 'seating', label: 'Seating area', x: 78, y: 74, body: 'Where people already linger. A try-on here suits longer sessions: exploring looks, sharing, taking part in a campaign.' },
]

/** Where a kiosk can sit in a mall: tap a hotspot on the plan for the reasoning. */
export function MallMap() {
  const [id, setId] = useState('atrium')
  const s = SPOTS.find((x) => x.id === id)!

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1.3fr_1fr] lg:gap-6">
      <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem] border border-border bg-card">
        <svg viewBox="0 0 100 80" className="absolute inset-0 size-full" role="img" aria-label="Plan of a shopping mall with four kiosk placements">
          <defs>
            <pattern id="mall-grid" width="4" height="4" patternUnits="userSpaceOnUse">
              <path d="M4 0H0V4" fill="none" stroke="currentColor" strokeOpacity=".06" strokeWidth=".2" />
            </pattern>
          </defs>
          <rect width="100" height="80" fill="url(#mall-grid)" className="text-foreground" />
          {/* concourse (rounded rectangle ring) */}
          <rect x="6" y="6" width="88" height="68" rx="4" className="fill-secondary" stroke="currentColor" strokeWidth=".4" />
          {/* shop blocks */}
          {[
            [10, 10, 24, 14],
            [38, 10, 16, 10],
            [66, 10, 24, 16],
            [10, 52, 20, 18],
            [34, 58, 22, 12],
            [60, 56, 14, 14],
          ].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx="1" className="fill-card" stroke="currentColor" strokeWidth=".3" />
          ))}
          {/* atrium */}
          <circle cx="50" cy="40" r="11" className="fill-card" stroke="currentColor" strokeWidth=".4" strokeDasharray="1.2 1.2" />
          {/* escalator */}
          <path d="M18 24l8 8M20 22l8 8" stroke="currentColor" strokeWidth=".6" />
        </svg>
        {SPOTS.map((p) => (
          <button
            key={p.id}
            type="button"
            aria-pressed={p.id === id}
            aria-label={p.label}
            onClick={() => setId(p.id)}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-offset-4"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span className={cn('grid size-8 place-items-center rounded-full border-2 transition-all duration-300', p.id === id ? 'scale-110 border-ink bg-lumen shadow-[0_0_0_7px_rgb(213_255_79/0.3)]' : 'border-foreground bg-card hover:bg-lumen')}>
              <span className="size-1.5 rounded-full bg-ink" />
            </span>
            <span className="pointer-events-none absolute top-full left-1/2 mt-1.5 hidden -translate-x-1/2 rounded-full bg-foreground px-2 py-0.5 font-mono text-[0.68rem] tracking-[0.12em] whitespace-nowrap text-background uppercase sm:block">{p.label}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <div aria-live="polite" className="flex flex-col gap-3">
          <p className="eyebrow">Placement</p>
          <h3 className="t-2">{s.label}</h3>
          <p className="text-[1rem] leading-relaxed text-muted-foreground">{s.body}</p>
        </div>
        <div className="mt-auto flex flex-col gap-4 border-t border-border pt-5">
          <ul className="flex flex-wrap gap-2">
            {SPOTS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  aria-pressed={p.id === id}
                  onClick={() => setId(p.id)}
                  className={cn('inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors', p.id === id ? 'border-transparent bg-lumen text-ink' : 'border-border hover:border-foreground')}
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">Illustrative plan. Hardware and placement are planned with you around your space and footfall.</p>
        </div>
      </div>
    </div>
  )
}
