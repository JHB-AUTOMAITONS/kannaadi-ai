import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'

const SPOTS = [
  {
    id: 'entrance',
    label: 'Entrance screen',
    x: 50,
    y: 93,
    title: 'A first impression with a mirror',
    body: 'A screen at the door invites passers-by to try a look before they step in — the shopfront becomes part of the experience.',
    to: '/features/#kiosk-experience',
    link: 'Kiosk experience',
  },
  {
    id: 'rail',
    label: 'Rail wall',
    x: 12,
    y: 40,
    title: 'Decide at the rail',
    body: 'Scan a piece on the rail and see it on yourself straight away, before it is carried to a fitting room.',
    to: '/features/#scan-a-dress',
    link: 'Scan a dress',
  },
  {
    id: 'island',
    label: 'Display island',
    x: 50,
    y: 50,
    title: 'Looks around the centrepiece',
    body: 'AI Looks suggests how the piece on show works with others, so the floor tells a story and not just a price.',
    to: '/features/#ai-outfit-generator',
    link: 'AI Looks',
  },
  {
    id: 'fitting',
    label: 'Fitting rooms',
    x: 87,
    y: 24,
    title: 'A mirror that offers more',
    body: 'Inside the fitting room, a mirror can show another colour or a complementary piece without another trip to the rail.',
    to: '/features/#ai-virtual-try-on',
    link: 'AI Virtual Try-On',
  },
  {
    id: 'till',
    label: 'Till',
    x: 80,
    y: 76,
    title: 'One last look',
    body: 'At the till, a quick look at how the pieces in the bag work together — an option for stores that like to suggest the finishing touch.',
    to: '/features/#customer-engagement',
    link: 'Customer engagement',
  },
]

/** Interactive store plan: pick a hotspot to see where virtual try on fits on a fashion shop floor. */
export function FloorPlan() {
  const [id, setId] = useState('rail')
  const active = SPOTS.find((s) => s.id === id)!

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1.25fr_1fr] lg:gap-6">
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] border border-border bg-card">
        <svg viewBox="0 0 100 80" className="absolute inset-0 size-full" role="img" aria-label="Top-down plan of a fashion store with five try-on hotspots">
          <defs>
            <pattern id="plan-grid" width="5" height="5" patternUnits="userSpaceOnUse">
              <path d="M5 0H0V5" fill="none" stroke="currentColor" strokeOpacity=".07" strokeWidth=".2" />
            </pattern>
          </defs>
          <rect width="100" height="80" fill="url(#plan-grid)" className="text-foreground" />
          {/* shell */}
          <rect x="4" y="4" width="92" height="72" rx="1.5" fill="none" stroke="currentColor" strokeWidth=".8" className="text-foreground" />
          <rect x="40" y="73.8" width="20" height="4.4" fill="var(--card)" />
          {/* rail wall */}
          <rect x="6" y="9" width="4" height="40" rx=".6" className="fill-foreground/20" />
          <rect x="6" y="9" width="4" height="40" rx=".6" fill="none" stroke="currentColor" strokeWidth=".35" className="text-foreground" />
          {/* island */}
          <rect x="34" y="30" width="32" height="22" rx="2" className="fill-secondary" stroke="currentColor" strokeWidth=".35" />
          <path d="M40 36h20M40 41h20M40 46h12" stroke="currentColor" strokeOpacity=".3" strokeWidth=".5" strokeLinecap="round" />
          {/* fitting rooms */}
          {[0, 1, 2].map((i) => (
            <rect key={i} x="78" y={8 + i * 9.4} width="15" height="8" rx=".8" className="fill-secondary" stroke="currentColor" strokeWidth=".35" />
          ))}
          {/* till */}
          <rect x="68" y="66" width="22" height="5" rx=".8" className="fill-foreground/80" />
        </svg>

        {SPOTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setId(s.id)}
            aria-pressed={s.id === id}
            aria-label={s.label}
            className="group absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-offset-4"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            <span
              className={cn(
                'grid size-8 place-items-center rounded-full border-2 transition-all duration-300',
                s.id === id ? 'scale-110 border-ink bg-lumen shadow-[0_0_0_6px_rgb(213_255_79/0.35)]' : 'border-foreground bg-card hover:bg-lumen',
              )}
            >
              <span className="size-1.5 rounded-full bg-ink" />
            </span>
            <span className="pointer-events-none absolute top-full left-1/2 mt-1.5 hidden -translate-x-1/2 rounded-full bg-foreground px-2 py-0.5 font-mono text-[0.68rem] tracking-[0.12em] whitespace-nowrap text-background uppercase sm:block">
              {s.label}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <div aria-live="polite" className="flex flex-col gap-3">
          <p className="eyebrow">{active.label}</p>
          <h3 className="t-2">{active.title}</h3>
          <p className="text-[1rem] leading-relaxed text-muted-foreground">{active.body}</p>
          <Link002 href={active.to} className="mt-1 w-fit text-[0.98rem] font-medium">
            {active.link}
          </Link002>
        </div>
        <div className="mt-auto border-t border-border pt-5">
          <p className="eyebrow mb-3">All five spots</p>
          <ul className="flex flex-wrap gap-2">
            {SPOTS.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={s.id === id}
                  onClick={() => setId(s.id)}
                  className={cn('inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition-colors', s.id === id ? 'border-transparent bg-lumen text-ink' : 'border-border hover:border-foreground')}
                >
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
