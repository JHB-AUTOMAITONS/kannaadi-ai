import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

const CX = 80
const smooth = (t: number) => t * t * (3 - 2 * t)

/** [y, half-width] control points for the skirt; interpolated with smoothstep between keys. */
const SKIRTS: Record<string, [number, number][]> = {
  aline: [[84, 12], [100, 17], [140, 31], [192, 50]],
  ball: [[84, 12], [96, 22], [130, 48], [192, 70]],
  mermaid: [[84, 12], [104, 20], [150, 22], [168, 30], [192, 52]],
  sheath: [[84, 12], [104, 19], [150, 23], [192, 27]],
  flare: [[84, 12], [104, 20], [128, 22], [150, 34], [192, 56]],
}

const SHAPES = [
  { id: 'aline', name: 'A-line', body: 'Fitted at the bodice and flaring gently from the waist — a shape that flatters many figures.' },
  { id: 'ball', name: 'Ball gown', body: 'A fitted bodice with a full skirt: the classic fairytale silhouette.' },
  { id: 'mermaid', name: 'Mermaid', body: 'Fitted through hip and thigh, then flaring at the knee for drama.' },
  { id: 'sheath', name: 'Sheath', body: 'A slim column that follows the body from shoulder to hem.' },
  { id: 'flare', name: 'Fit-and-flare', body: 'Fitted to the hip, then flaring — more movement than a mermaid.' },
] as const

const TRAINS = [
  { id: 'none', name: 'No train', len: 0, body: 'Clean to the floor.' },
  { id: 'sweep', name: 'Sweep', len: 16, body: 'Just brushes the floor behind.' },
  { id: 'chapel', name: 'Chapel', len: 38, body: 'Trails behind for a ceremony walk.' },
  { id: 'cathedral', name: 'Cathedral', len: 64, body: 'The longest and most dramatic.' },
] as const

function skirtPath(keys: [number, number][]) {
  const w = (y: number) => {
    for (let i = 0; i < keys.length - 1; i++) {
      const [y0, w0] = keys[i]
      const [y1, w1] = keys[i + 1]
      if (y <= y1) return w0 + (w1 - w0) * smooth((y - y0) / (y1 - y0))
    }
    return keys[keys.length - 1][1]
  }
  const ys = Array.from({ length: 40 }, (_, i) => 84 + (i * (192 - 84)) / 39)
  const right = ys.map((y) => `${(CX + w(y)).toFixed(1)} ${y.toFixed(1)}`)
  const left = [...ys].reverse().map((y) => `${(CX - w(y)).toFixed(1)} ${y.toFixed(1)}`)
  return `M${right.join('L')}L${left.join('L')}Z`
}

/** Pick a silhouette and a train length; the drawing updates and the copy explains the choice. */
export function SilhouetteExplorer() {
  const [shape, setShape] = useState<(typeof SHAPES)[number]['id']>('aline')
  const [train, setTrain] = useState<(typeof TRAINS)[number]['id']>('chapel')
  const s = SHAPES.find((x) => x.id === shape)!
  const t = TRAINS.find((x) => x.id === train)!
  const d = useMemo(() => skirtPath(SKIRTS[shape]), [shape])
  const hemW = SKIRTS[shape][SKIRTS[shape].length - 1][1]

  return (
    <div className="grid items-stretch gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-6">
      <div className="relative grid min-h-[26rem] place-items-center overflow-hidden rounded-[2rem] border border-border bg-[radial-gradient(90%_75%_at_50%_30%,#fbf8f0_0%,#ece4d2_100%)]">
        <svg viewBox="0 0 160 240" className="h-[24rem] w-auto max-w-full" role="img" aria-label={`${s.name} wedding dress silhouette with ${t.name.toLowerCase()}`}>
          {/* ground shadow + train */}
          <ellipse cx={CX} cy={198} rx={hemW + 14 + t.len * 0.35} ry="7" fill="#0d0d0c" opacity=".14" />
          <path
            d={`M${CX - hemW * 0.9} 190 Q${CX} ${192 + t.len} ${CX + hemW * 0.9} 190Z`}
            fill="#efe7d4"
            stroke="#b9ad92"
            strokeWidth=".6"
            style={{ transition: 'd .5s' }}
            opacity={t.len ? 1 : 0}
          />
          {/* gown */}
          <path d={d} fill="#fbf7ee" stroke="#b9ad92" strokeWidth=".8" strokeLinejoin="round" />
          <path d={`M${CX - 15} 84 H${CX + 15}`} stroke="#d8b25a" strokeWidth="2.4" strokeLinecap="round" />
          {/* bodice with sweetheart neckline over a dress-form torso */}
          <path d="M60 30 Q80 20 100 30 L108 52 Q104 70 95 84 H65 Q56 70 52 52Z" fill="#fbf7ee" stroke="#b9ad92" strokeWidth=".8" />
          <path d="M66 31 Q73 40 80 33 Q87 40 94 31" fill="none" stroke="#b9ad92" strokeWidth=".8" />
          {/* neck of the form */}
          <path d="M74 10 Q80 4 86 10 L86 24 Q80 28 74 24Z" fill="#e5dcc6" stroke="#b9ad92" strokeWidth=".6" />
          {/* veil */}
          <path d="M80 8 Q112 30 112 120 Q110 170 126 200" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="2" />
          <path d="M80 8 Q112 30 112 120 Q110 170 126 200" fill="none" stroke="#b9ad92" strokeWidth=".4" />
        </svg>
        <span className="absolute top-4 left-4 rounded-full border border-ink/20 bg-white/70 px-3 py-1 font-mono text-[0.68rem] tracking-[0.14em] text-ink uppercase backdrop-blur">Illustrative silhouettes</span>
      </div>

      <div className="flex flex-col gap-8 rounded-[2rem] border border-border bg-card p-6 md:p-8">
        <fieldset className="flex flex-col gap-3">
          <legend className="eyebrow mb-1">Silhouette</legend>
          <div className="flex flex-wrap gap-2">
            {SHAPES.map((x) => (
              <label key={x.id} className="cursor-pointer">
                <input type="radio" name="silhouette" value={x.id} checked={shape === x.id} onChange={() => setShape(x.id)} className="peer sr-only" />
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
          <legend className="eyebrow mb-1">Train</legend>
          <div className="flex flex-wrap gap-2">
            {TRAINS.map((x) => (
              <label key={x.id} className="cursor-pointer">
                <input type="radio" name="train" value={x.id} checked={train === x.id} onChange={() => setTrain(x.id)} className="peer sr-only" />
                <span className={cn('inline-flex h-10 items-center rounded-full border px-4 text-[0.95rem] font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-foreground', train === x.id ? 'border-transparent bg-lumen text-ink' : 'border-border hover:border-foreground')}>
                  {x.name}
                </span>
              </label>
            ))}
          </div>
          <p aria-live="polite" className="text-[1rem] leading-relaxed text-muted-foreground">
            {t.body}
          </p>
        </fieldset>

        <p className="mt-auto border-t border-border pt-4 text-sm text-muted-foreground">
          With Kannaadi.Ai the same choices are shown on the bride herself, so a shortlist is built from shapes she has actually seen on her.
        </p>
      </div>
    </div>
  )
}
