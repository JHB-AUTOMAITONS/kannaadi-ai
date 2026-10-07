import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { prefersReducedMotion } from '@/hooks/use-media'

const STEPS = [
  { title: 'Approach', body: 'An attract screen invites passers-by with a moving look and a single prompt.' },
  { title: 'Step in', body: 'A simple guide shows where to stand. No sign-up, no manual — the screen leads.' },
  { title: 'Try', body: 'The shopper sees pieces on themselves and switches colours and looks with a tap.' },
  { title: 'Share or reward', body: 'A share-ready look, and for campaigns a lucky-draw moment to finish.' },
]

const gown = (c: string) => `/images/showcase/gown-${c}.webp`

function Screen({ step }: { step: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(90%_70%_at_50%_35%,#222a18_0%,#0e100f_75%)]">
      {step === 0 && (
        <>
          <img src={gown('claret')} alt="" aria-hidden="true" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain opacity-60" />
          <div className="absolute inset-x-0 bottom-6 grid place-items-center">
            <span className="animate-pulse-dot rounded-full bg-lumen px-4 py-2 font-mono text-[0.68rem] tracking-[0.16em] text-ink uppercase">Try a look</span>
          </div>
        </>
      )}
      {step === 1 && (
        <div className="absolute inset-0 grid place-items-center">
          <svg viewBox="0 0 100 140" className="h-3/4 text-lumen" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="4 4">
            <ellipse cx="50" cy="34" rx="16" ry="20" />
            <path d="M18 138c0-34 14-58 32-58s32 24 32 58" />
          </svg>
          <span className="absolute bottom-5 font-mono text-[0.68rem] tracking-[0.16em] uppercase">Stand here</span>
        </div>
      )}
      {step === 2 && (
        <>
          <img src={gown('forest')} alt="" aria-hidden="true" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain" />
          <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
            {['#2c2c34', '#eadfc8', '#1f5a43', '#6a1730'].map((c, i) => (
              <span key={c} className={cn('size-5 rounded-full ring-1 ring-foreground/40', i === 2 && 'ring-2 ring-lumen')} style={{ background: c }} />
            ))}
          </div>
        </>
      )}
      {step === 3 && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div aria-hidden="true" className="grid size-24 grid-cols-7 gap-px rounded-lg bg-ivory p-2">
              {Array.from({ length: 49 }).map((_, i) => (
                <span key={i} className={cn('rounded-[1px]', (i * 7 + (i % 5) * 3 + (i % 3)) % 3 === 0 ? 'bg-ink' : 'bg-transparent')} />
              ))}
            </div>
            <span className="rounded-full border border-lumen px-3 py-1 font-mono text-[0.68rem] tracking-[0.16em] text-lumen uppercase">Look ready</span>
          </div>
        </div>
      )}
    </div>
  )
}

/** A walk-up kiosk session in four steps: choose a step (or let it play) and the screen changes. */
export function KioskFlow() {
  const [step, setStep] = useState(0)
  const hover = useRef(false)
  const visible = useRef(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    const id = window.setInterval(() => visible.current && !hover.current && setStep((s) => (s + 1) % STEPS.length), 3600)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [])

  return (
    <div ref={root} onMouseEnter={() => (hover.current = true)} onMouseLeave={() => (hover.current = false)} className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
      <ol className="border-t border-border">
        {STEPS.map((s, i) => (
          <li key={s.title} className="border-b border-border">
            <button type="button" aria-current={i === step} onClick={() => setStep(i)} onFocus={() => setStep(i)} className="group grid w-full grid-cols-[3rem_1fr] gap-4 py-5 text-left">
              <span className={cn('pt-1 font-mono text-sm tracking-widest', i === step ? 'text-lumen' : 'text-muted-foreground')}>0{i + 1}</span>
              <span className="flex flex-col gap-1.5">
                <span className={cn('t-3 transition-colors', i === step ? 'text-foreground' : 'text-foreground/55 group-hover:text-foreground')}>{s.title}</span>
                <span className={cn('grid transition-[grid-template-rows,opacity] duration-500', i === step ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                  <span className="overflow-hidden text-[0.98rem] leading-relaxed text-muted-foreground">{s.body}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="relative mx-auto flex w-full max-w-[19rem] flex-col items-center" aria-live="polite">
        <div className="relative aspect-[9/15] w-full overflow-hidden rounded-[1.6rem] border-2 border-foreground/30 shadow-[0_0_0_7px_#151517,0_40px_70px_-24px_rgb(0_0_0/0.85)]">
          <Screen step={step} />
          <span className="absolute top-2.5 left-1/2 h-1 w-10 -translate-x-1/2 rounded-full bg-foreground/20" aria-hidden="true" />
        </div>
        <div aria-hidden="true" className="h-8 w-3 bg-foreground/30" />
        <div aria-hidden="true" className="h-1.5 w-28 rounded-full bg-foreground/30" />
        <div aria-hidden="true" className="absolute -bottom-4 h-8 w-56 rounded-[50%] bg-lumen/15 blur-xl" />
      </div>
    </div>
  )
}
