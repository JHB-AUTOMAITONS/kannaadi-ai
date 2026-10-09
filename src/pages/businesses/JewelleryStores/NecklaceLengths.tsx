import { useId, useState } from 'react'

const LENGTHS = [
  { id: 'choker', name: 'Choker', inches: '14–16″', drop: 16, body: 'Sits at the base of the neck. Frames the collarbone and works best with open necklines.' },
  { id: 'princess', name: 'Princess', inches: '17–19″', drop: 46, body: 'Rests at the collarbone: the most versatile length, and the usual home for a pendant.' },
  { id: 'matinee', name: 'Matinee', inches: '20–24″', drop: 82, body: 'Falls between collarbone and bust. A good partner for high necklines and layered looks.' },
  { id: 'opera', name: 'Opera', inches: '28–36″', drop: 128, body: 'A long line that can be worn single, doubled or knotted — with a lot of presence.' },
] as const

/** A necklace length slider. The chain re-drapes on a simple neckline so scale is visible, not described. */
export function NecklaceLengths() {
  const [i, setI] = useState(1)
  const id = useId()
  const n = LENGTHS[i]
  const y = 70 + n.drop
  // chain: two sides from the neck, meeting at a pendant at depth `y`
  const chain = `M64 62 C 66 ${y * 0.68} , 88 ${y - 4} , 110 ${y} C 132 ${y - 4} , 154 ${y * 0.68} , 156 62`

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
      <div className="relative grid min-h-[22rem] place-items-center overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(90%_80%_at_50%_30%,#2b2418_0%,#121010_75%)]">
        <svg viewBox="0 0 220 300" className="h-[21rem] w-auto" role="img" aria-label={`${n.name} necklace, ${n.inches}, drawn on a neckline`}>
          <defs>
            <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f6e2a6" />
              <stop offset="0.5" stopColor="#c99a3f" />
              <stop offset="1" stopColor="#f1d68a" />
            </linearGradient>
          </defs>
          {/* neck + shoulders */}
          <path d="M92 0 V48 C92 66 70 74 46 82 C20 92 8 112 4 142 V300 H216 V142 C212 112 200 92 174 82 C150 74 128 66 128 48 V0Z" fill="#26211c" stroke="#3a322a" />
          <path d="M92 50 Q110 62 128 50" fill="none" stroke="#3a322a" />
          {/* chain */}
          <path d={chain} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="2.2" strokeLinecap="round" strokeDasharray="0.1 3.2" style={{ transition: 'd .5s cubic-bezier(.16,1,.3,1)' }} />
          <path d={chain} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1" strokeLinecap="round" style={{ transition: 'd .5s cubic-bezier(.16,1,.3,1)' }} />
          {/* pendant */}
          <g style={{ transform: `translate(0, ${y - 70}px)`, transition: 'transform .5s cubic-bezier(.16,1,.3,1)' }}>
            <path d="M110 66 l9 14 -9 18 -9 -18z" fill={`url(#${id}-gold)`} stroke="#8a6a20" strokeWidth=".6" />
            <path d="M110 66 l9 14 h-18z" fill="#fff" opacity=".35" />
            <circle cx="110" cy="64" r="2.2" fill="#c99a3f" />
          </g>
        </svg>
        <span className="absolute top-4 left-4 rounded-full border border-foreground/20 px-3 py-1 font-mono text-[0.68rem] tracking-[0.14em] uppercase">Illustrative</span>
      </div>

      <div className="flex flex-col gap-6 rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <div>
          <label htmlFor={`${id}-range`} className="eyebrow">
            Necklace length
          </label>
          <input
            id={`${id}-range`}
            type="range"
            min={0}
            max={LENGTHS.length - 1}
            step={1}
            value={i}
            onChange={(e) => setI(Number(e.target.value))}
            aria-valuetext={`${n.name}, ${n.inches}`}
            className="mt-3 h-6 w-full cursor-pointer appearance-none bg-transparent accent-lumen [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-border [&::-webkit-slider-thumb]:-mt-2 [&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-border [&::-moz-range-thumb]:size-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-lumen [&::-webkit-slider-thumb]:size-6 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-lumen"
          />
          <div className="mt-3 flex justify-between font-mono text-[0.68rem] tracking-[0.12em] text-muted-foreground uppercase" aria-hidden="true">
            {LENGTHS.map((l) => (
              <span key={l.id} className={l.id === n.id ? 'text-foreground' : ''}>
                {l.name}
              </span>
            ))}
          </div>
        </div>
        <div aria-live="polite" className="flex flex-col gap-3 border-t border-border pt-5">
          <h3 className="t-2">
            {n.name} <span className="font-mono text-base font-normal text-muted-foreground">{n.inches}</span>
          </h3>
          <p className="text-[1rem] leading-relaxed text-muted-foreground">{n.body}</p>
        </div>
        <p className="mt-auto text-sm text-muted-foreground">With virtual try on, customers see this on their own neckline instead of a bust form.</p>
      </div>
    </div>
  )
}
