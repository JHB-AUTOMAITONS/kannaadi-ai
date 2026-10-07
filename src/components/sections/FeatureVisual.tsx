import { useRef, useState } from 'react'
import { RevealStage, type ImageSource } from '@/components/hero/RevealStage'
import type { FeatureVisualKey } from '@/data/features'
import { cn } from '@/lib/utils'

const gown = (c: string) => `/images/showcase/gown-${c}.webp`

const HERO_CLEAN: ImageSource[] = [
  { src: '/images/hero/hero-clean-1600.webp', width: 1600 },
  { src: '/images/hero/hero-clean-2400.webp', width: 2400 },
]
const HERO_AI: ImageSource[] = [
  { src: '/images/hero/hero-ai-1600.webp', width: 1600 },
  { src: '/images/hero/hero-ai-2400.webp', width: 2400 },
]

const frame =
  'theme-dark relative aspect-[6/5] w-full overflow-hidden rounded-[1.75rem] border border-border bg-[radial-gradient(90%_80%_at_50%_30%,#232719_0%,#111312_65%,#0b0c0d_100%)]'

function Corners() {
  return (
    <>
      {['top-3 left-3 border-t border-l', 'top-3 right-3 border-t border-r', 'bottom-3 left-3 border-b border-l', 'bottom-3 right-3 border-b border-r'].map((c) => (
        <span key={c} aria-hidden="true" className={cn('absolute size-4 border-lumen/70', c)} />
      ))}
    </>
  )
}

const Img = ({ src, className, alt = '' }: { src: string; className?: string; alt?: string }) => (
  <img src={src} alt={alt} aria-hidden={!alt} width={1100} height={1300} loading="lazy" decoding="async" draggable={false} className={cn('absolute object-contain', className)} />
)

export function Wheel() {
  const [turn, setTurn] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const segs = ['Gift', 'Voucher', 'Styling', 'Retry', 'Gift', 'Voucher', 'Styling', 'Retry']
  return (
    <div className={cn(frame, 'grid place-items-center')}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <span aria-hidden="true" className="absolute -top-2 left-1/2 z-10 size-4 -translate-x-1/2 rotate-45 bg-lumen" />
          <svg
            viewBox="0 0 200 200"
            className="size-[min(60vw,15rem)] transition-transform duration-[2800ms] ease-[cubic-bezier(0.12,0.8,0.1,1)] motion-reduce:duration-0"
            style={{ transform: `rotate(${turn}deg)` }}
            role="img"
            aria-label="Lucky draw wheel, illustrative"
          >
            <circle cx="100" cy="100" r="96" fill="#101211" stroke="#d5ff4f" strokeWidth="2" />
            {segs.map((s, i) => (
              <g key={i} transform={`rotate(${i * 45} 100 100)`}>
                <path d="M100 100 100 4" stroke="#d5ff4f" strokeOpacity=".35" />
                <text x="100" y="30" textAnchor="middle" transform="rotate(22.5 100 100)" fill="#f5f1e8" fontSize="9" fontFamily="var(--font-mono)" letterSpacing=".6">
                  {s.toUpperCase()}
                </text>
              </g>
            ))}
            <circle cx="100" cy="100" r="9" fill="#d5ff4f" />
          </svg>
        </div>
        <button
          type="button"
          disabled={spinning}
          onClick={() => {
            setSpinning(true)
            setTurn((t) => t + 1080 + Math.round(Math.random() * 359))
            window.setTimeout(() => setSpinning(false), 2900)
          }}
          className="rounded-full bg-lumen px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-ivory disabled:opacity-60"
        >
          {spinning ? 'Spinning…' : 'Spin the wheel'}
        </button>
        <p className="text-xs text-muted-foreground">Illustrative — rewards are set per campaign.</p>
      </div>
    </div>
  )
}

function SceneReveal({ slug, alt }: { slug: string; alt: string }) {
  const host = useRef<HTMLDivElement>(null)
  return (
    <div ref={host} className={frame}>
      <RevealStage
        clean={[{ src: `/images/industry/${slug}-clean.webp`, width: 1200 }]}
        ai={[{ src: `/images/industry/${slug}-ai.webp`, width: 1200 }]}
        aspect={[1200, 900]}
        alt={alt}
        sizes="(min-width: 1024px) 40vw, 92vw"
        eventTarget={host}
        blobScale={0.8}
        loadAi="interact"
        className="absolute inset-0"
      />
      <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.68rem] tracking-[0.14em] text-white/80 uppercase mix-blend-difference">Move across to reveal the AI scan</p>
    </div>
  )
}

/** One visual per feature, all built from the same Kannaadi.Ai artwork. */
export function FeatureVisual({ kind }: { kind: FeatureVisualKey }) {
  const host = useRef<HTMLDivElement>(null)

  switch (kind) {
    case 'tryon':
      return (
        <div className={frame}>
          <Corners />
          <Img src={gown('champagne')} alt="Champagne satin gown shown on a dress form" className="inset-x-[8%] inset-y-[2%] h-[96%] w-[84%]" />
          <div className="absolute top-4 left-1/2 flex -translate-x-1/2 gap-1.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
            <span className="rounded-full bg-lumen px-2.5 py-1 text-ink">On you</span>
            <span className="rounded-full border border-border px-2.5 py-1">Colour</span>
            <span className="rounded-full border border-border px-2.5 py-1">Silhouette</span>
          </div>
        </div>
      )
    case 'looks':
      return (
        <div className={cn(frame, 'grid grid-cols-2 gap-3 p-4')}>
          {(['ink', 'champagne', 'forest', 'claret'] as const).map((c, i) => (
            <div key={c} className="relative overflow-hidden rounded-2xl border border-border bg-muted/40">
              <Img src={gown(c)} className="inset-0 h-full w-full scale-110 object-cover object-[50%_30%]" />
              <span className="absolute bottom-2 left-3 font-mono text-[0.68rem] tracking-[0.14em] uppercase" style={{ color: i === 1 ? '#0d0d0c' : '#f5f1e8' }}>
                Look 0{i + 1}
              </span>
            </div>
          ))}
        </div>
      )
    case 'upload':
      return (
        <div className={cn(frame, 'grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-5')}>
          <div className="grid aspect-[3/4] place-items-center rounded-2xl border border-dashed border-lumen/60 text-center">
            <span className="flex flex-col items-center gap-2 px-2 font-mono text-[0.68rem] tracking-[0.14em] text-lumen uppercase">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V4m0 0L7 9m5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
              Drop a dress photo
            </span>
          </div>
          <span aria-hidden="true" className="text-2xl text-lumen">→</span>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted/40">
            <Img src={gown('claret')} className="inset-0 h-full w-full scale-110 object-cover object-[50%_28%]" />
          </div>
        </div>
      )
    case 'scan':
      return (
        <div className={frame}>
          <Corners />
          <Img src={gown('forest')} alt="Forest green gown being scanned" className="inset-x-[8%] inset-y-[2%] h-[96%] w-[84%]" />
          <Img src="/images/showcase/gown-scan.webp" className="inset-x-[8%] inset-y-[2%] h-[96%] w-[84%] [clip-path:inset(0_0_0_50%)] animate-[scan-x_4s_ease-in-out_infinite_alternate] motion-reduce:animate-none" />
          <span className="absolute bottom-4 left-4 rounded-full border border-lumen px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.14em] text-lumen uppercase">Scanning…</span>
        </div>
      )
    case 'kiosk':
      return (
        <div className={cn(frame, 'grid place-items-center')}>
          <div className="relative flex h-[88%] flex-col items-center">
            <div className="relative aspect-[9/14] h-[88%] overflow-hidden rounded-[1.4rem] border-2 border-foreground/30 bg-[#0b0c0d] shadow-[0_0_0_6px_#151517,0_30px_60px_-20px_rgb(0_0_0/0.8)]">
              <Img src={gown('forest')} className="inset-0 h-full w-full object-contain" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1.5 p-3">
                {['#2c2c34', '#eadfc8', '#1f5a43', '#6a1730'].map((c) => (
                  <span key={c} className="size-4 rounded-full ring-1 ring-foreground/40" style={{ background: c }} />
                ))}
              </div>
            </div>
            <div aria-hidden="true" className="h-[8%] w-3 bg-foreground/30" />
            <div aria-hidden="true" className="h-1.5 w-24 rounded-full bg-foreground/30" />
            <div aria-hidden="true" className="absolute -bottom-3 h-6 w-48 rounded-[50%] bg-lumen/20 blur-xl" />
          </div>
        </div>
      )
    case 'draw':
      return <Wheel />
    case 'jewellery':
      return <SceneReveal slug="jewellery-stores" alt="Gold necklace and earrings on a velvet bust, with an AI scan revealed under the pointer" />
    case 'eyewear':
      return <SceneReveal slug="eyewear-stores" alt="Pair of acetate glasses on a plinth beside a second frame, with an AI scan revealed under the pointer" />
    case 'realtime':
      return (
        <div ref={host} className={frame}>
          <RevealStage
            clean={HERO_CLEAN}
            ai={HERO_AI}
            alt="Satin gown on a dress form with a live AI scan revealed under the pointer"
            sizes="(min-width: 1024px) 50vw, 92vw"
            imgClassName="object-[72%_50%]"
            eventTarget={host}
            blobScale={0.8}
            loadAi="interact"
            className="absolute inset-0"
          />
          <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.68rem] tracking-[0.14em] text-white/80 uppercase mix-blend-difference">Move across to feel it respond</p>
        </div>
      )
    case 'engage':
      return (
        <div className={cn(frame, 'flex flex-col justify-center gap-3 p-6')}>
          {['Share-ready look', 'Lucky draw reward', 'Look of the day', 'Save and send to a friend'].map((t, i) => (
            <div key={t} className={cn('flex items-center justify-between rounded-2xl border px-4 py-3.5 text-[0.98rem]', i === 0 ? 'border-lumen bg-lumen/10' : 'border-border bg-muted/30')} style={{ marginLeft: `${i * 6}%` }}>
              {t}
              <span aria-hidden="true" className="text-lumen">✦</span>
            </div>
          ))}
        </div>
      )
  }
}
