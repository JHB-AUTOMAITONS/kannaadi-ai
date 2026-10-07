import { useState } from 'react'
import { cn } from '@/lib/utils'

type Focus = 'pleats' | 'pallu' | 'border' | 'legs'

const STYLES: { id: string; name: string; focus: Focus; body: string; shoppers: string }[] = [
  {
    id: 'nivi',
    name: 'Nivi',
    focus: 'pleats',
    body: 'The most widely worn drape: pleats gathered at the waist, with the pallu carried over the left shoulder.',
    shoppers: 'Shoppers judge how the pleats fall and how the body colour reads in motion.',
  },
  {
    id: 'bengali',
    name: 'Bengali',
    focus: 'pallu',
    body: 'Worn without front pleats, with a broad, gathered pallu draped over the shoulder.',
    shoppers: 'The width and weight of the pallu is what customers want to see first.',
  },
  {
    id: 'gujarati',
    name: 'Gujarati',
    focus: 'pallu',
    body: 'The pallu comes from the back over the right shoulder to the front, putting its design on display.',
    shoppers: 'It is all about how the pallu pattern sits across the front.',
  },
  {
    id: 'nauvari',
    name: 'Maharashtrian (nauvari)',
    focus: 'legs',
    body: 'A nine-yard drape passed between the legs, giving a dhoti-like silhouette.',
    shoppers: 'Shoppers want to understand length and fall before they commit to nine yards.',
  },
  {
    id: 'kasavu',
    name: 'Kerala (kasavu)',
    focus: 'border',
    body: 'Off-white with a gold kasavu border — the border does most of the talking.',
    shoppers: 'Border width and shine are the whole decision.',
  },
]

const GOLD = '#d8b25a'
const BODY = '#8a1c55'

function Anatomy({ focus }: { focus: Focus }) {
  const ring = (on: boolean) => ({ opacity: on ? 1 : 0, transition: 'opacity .4s' })
  return (
    <svg viewBox="0 0 220 300" className="h-full max-h-[22rem] w-auto" role="img" aria-label="Simplified saree diagram highlighting the part shoppers focus on">
      {/* torso block */}
      <path d="M78 36c10 8 54 8 64 0l12 62-10 14H76L66 98z" fill="#26262b" stroke="#444" />
      {/* body of the saree */}
      <path d="M66 112h88l26 168H40z" fill={BODY} />
      <path d="M66 112h88l26 168H40z" fill="none" stroke="#000" strokeOpacity=".25" />
      {/* pleats */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M${88 + i * 5.5} 114 L${78 + i * 8} 280`} stroke="#000" strokeOpacity=".28" strokeWidth="1.1" />
      ))}
      {/* pallu: over the shoulder and down */}
      <path d="M92 40 L142 36 L170 58 L186 280 L160 280 L146 92 Z" fill="#b2316f" stroke="#000" strokeOpacity=".2" />
      <path d="M92 40 L142 36" stroke={GOLD} strokeWidth="3" />
      {/* borders */}
      <path d="M40 270h140" stroke={GOLD} strokeWidth="9" strokeLinecap="round" />
      <path d="M160 280 L146 92" stroke={GOLD} strokeWidth="5" strokeLinecap="round" />
      <path d="M40 270h140" stroke="#fff" strokeOpacity=".25" strokeWidth="1.2" strokeDasharray="2 5" />
      {/* focus rings */}
      <g fill="none" stroke="#d5ff4f" strokeWidth="2.2" strokeDasharray="5 5">
        <rect x="70" y="108" width="82" height="130" rx="10" style={ring(focus === 'pleats')} />
        <rect x="136" y="30" width="58" height="256" rx="12" style={ring(focus === 'pallu')} />
        <rect x="30" y="256" width="164" height="30" rx="10" style={ring(focus === 'border')} />
        <rect x="56" y="196" width="108" height="86" rx="10" style={ring(focus === 'legs')} />
      </g>
    </svg>
  )
}

/** Common drapes shoppers ask about, with a diagram of the part each one puts the spotlight on. */
export function DrapeStyles() {
  const [id, setId] = useState('nivi')
  const active = STYLES.find((s) => s.id === id)!

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
      <div role="tablist" aria-label="Drape styles" className="flex flex-col border-t border-border">
        {STYLES.map((s, i) => {
          const on = s.id === id
          return (
            <button
              key={s.id}
              role="tab"
              id={`drape-tab-${s.id}`}
              aria-selected={on}
              aria-controls="drape-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setId(s.id)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
                e.preventDefault()
                const n = STYLES[(i + (e.key === 'ArrowDown' ? 1 : STYLES.length - 1)) % STYLES.length]
                setId(n.id)
                document.getElementById(`drape-tab-${n.id}`)?.focus()
              }}
              className={cn('group grid grid-cols-[3rem_1fr] gap-4 border-b border-border py-4 text-left transition-colors', on ? 'text-foreground' : 'text-foreground/55 hover:text-foreground')}
            >
              <span className={cn('pt-0.5 font-mono text-sm tracking-widest', on ? 'text-lumen' : 'text-muted-foreground')}>0{i + 1}</span>
              <span className="t-3">{s.name}</span>
            </button>
          )
        })}
      </div>

      <div id="drape-panel" role="tabpanel" aria-labelledby={`drape-tab-${id}`} className="grid items-center gap-6 rounded-[2rem] border border-border bg-[radial-gradient(90%_80%_at_50%_30%,#251a1f_0%,#121011_70%)] p-6 sm:grid-cols-[1fr_1fr] md:p-8">
        <div className="grid min-h-[16rem] place-items-center">
          <Anatomy focus={active.focus} />
        </div>
        <div className="flex flex-col gap-4">
          <p className="eyebrow">What the drape puts first</p>
          <h3 className="t-2">{active.name}</h3>
          <p className="text-[1rem] leading-relaxed text-muted-foreground">{active.body}</p>
          <p className="border-t border-border pt-4 text-[0.98rem] leading-relaxed">{active.shoppers}</p>
          <p className="text-xs text-muted-foreground">Simplified diagram. Which drapes launch first is agreed in a demo.</p>
        </div>
      </div>
    </div>
  )
}
