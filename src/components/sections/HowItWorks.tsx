import { gown as gownUrl, gownProps } from '@/lib/images'
import { useEffect, useRef, useState } from 'react'
import { Globe, MonitorSmartphone, PartyPopper, Plus } from 'lucide-react'
import { Cta } from '@/components/ui/Cta'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { prefersReducedMotion } from '@/hooks/use-media'
import { cn } from '@/lib/utils'

const STEPS = [
  { title: 'Connect your catalogue', body: 'Choose the garments, jewellery or frames you want shoppers to try. We shape the experience around your range.' },
  { title: 'Choose where it lives', body: 'Online store, in-store kiosk, live event — or a mix. One try-on experience, placed where your customers are.' },
  { title: 'Shoppers try on', body: 'Customers see pieces on themselves, explore AI Looks and, for campaigns, finish with a lucky draw.' },
  { title: 'Launch and refine', body: 'Go live in the places your customers shop, then update pieces, add channels and run new campaigns.' },
]

const gown = (c: string) => gownUrl(c, 'sm')
const SIZES = '(min-width: 1024px) 30rem, 90vw'

function Visual({ step }: { step: number }) {
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] border border-border bg-[radial-gradient(90%_80%_at_50%_30%,#232719_0%,#111312_70%)] p-5 md:p-7">
      {step === 0 && (
        <div className="grid h-full grid-cols-3 gap-3">
          {['ink', 'champagne', 'forest', 'claret'].map((c) => (
            <div key={c} className="relative overflow-hidden rounded-xl border border-border bg-muted/50">
              <img src={gown(c)} alt="" aria-hidden="true" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-125 object-cover object-[50%_32%]" />
            </div>
          ))}
          <div className="grid place-items-center rounded-xl border border-dashed border-lumen/60 text-lumen">
            <span className="flex flex-col items-center gap-1 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
              <Plus aria-hidden="true" className="size-5" /> Your pieces
            </span>
          </div>
          <div className="col-span-1 rounded-xl border border-border bg-muted/30" />
        </div>
      )}
      {step === 1 && (
        <div className="grid h-full grid-cols-3 gap-3">
          {[
            { icon: Globe, label: 'Online store' },
            { icon: MonitorSmartphone, label: 'In-store kiosk' },
            { icon: PartyPopper, label: 'Live event' },
          ].map(({ icon: Icon, label }, i) => (
            <div key={label} className={cn('flex flex-col items-start justify-between rounded-xl border p-3 md:p-4', i === 1 ? 'border-lumen bg-lumen/10' : 'border-border bg-muted/30')}>
              <Icon aria-hidden="true" className={cn('size-6', i === 1 ? 'text-lumen' : 'text-foreground')} />
              <span className="text-sm leading-tight font-medium">{label}</span>
            </div>
          ))}
        </div>
      )}
      {step === 2 && (
        <div className="relative h-full">
          <img {...gownProps('forest', { sizes: SIZES })} alt="" aria-hidden="true" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain" />
          <img {...gownProps('scan', { sizes: SIZES, scanOf: 'forest' })} alt="" aria-hidden="true" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain [clip-path:inset(0_0_0_62%)]" />
          <div className="absolute inset-y-0 left-[62%] w-px bg-lumen shadow-[0_0_14px_2px_rgb(213_255_79/0.5)]" />
          <div className="absolute top-0 left-0 flex flex-wrap gap-2 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
            <span className="rounded-full border border-lumen px-2.5 py-1 text-lumen">AI looks</span>
            <span className="rounded-full border border-border px-2.5 py-1">Lucky draw</span>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="flex h-full flex-col justify-between">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-lumen px-3 py-1.5 font-mono text-[0.68rem] tracking-[0.14em] text-lumen uppercase">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-lumen" /> Live
          </span>
          <ul className="grid gap-2 text-[0.95rem]">
            {['Update pieces', 'Add channels', 'Run new campaigns'].map((t) => (
              <li key={t} className="flex items-center justify-between rounded-xl border border-border bg-muted/30 px-4 py-3">
                {t}
                <span aria-hidden="true" className="text-lumen">→</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

/** Four steps, one visual. Click, hover or focus a step; it also advances on its own while in view. */
export function HowItWorks() {
  const [active, setActive] = useState(0)
  const hovering = useRef(false)
  const visible = useRef(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    const id = window.setInterval(() => {
      if (visible.current && !hovering.current) setActive((a) => (a + 1) % STEPS.length)
    }, 4800)
    return () => {
      io.disconnect()
      window.clearInterval(id)
    }
  }, [])

  return (
    <section className="theme-dark grain relative isolate overflow-hidden bg-background text-foreground" aria-labelledby="how-title">
      <div className="container-x section flex flex-col gap-10 md:gap-14">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title={
            <>
              From catalogue to <span className="accent-serif">mirror</span> in four steps.
            </>
          }
        />
        <div ref={root} className="grid items-start gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16" onMouseEnter={() => (hovering.current = true)} onMouseLeave={() => (hovering.current = false)}>
          <ol className="border-t border-border" data-reveal-stagger="">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal="" className="border-b border-border">
                <button
                  type="button"
                  aria-expanded={active === i}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group grid w-full grid-cols-[3rem_1fr] gap-4 py-5 text-left"
                >
                  <span className={cn('pt-1 font-mono text-sm tracking-widest transition-colors', active === i ? 'text-lumen' : 'text-muted-foreground')}>0{i + 1}</span>
                  <span className="flex flex-col gap-2">
                    <span className={cn('t-3 transition-colors', active === i ? 'text-foreground' : 'text-foreground/55 group-hover:text-foreground')}>{s.title}</span>
                    <span
                      className={cn(
                        'grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)]',
                        active === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                      )}
                    >
                      <span className="overflow-hidden text-[0.98rem] leading-relaxed text-muted-foreground">{s.body}</span>
                    </span>
                    <span className="relative mt-1 h-px w-full overflow-hidden bg-border">
                      <span
                        key={active === i ? `on-${active}` : `off-${i}`}
                        className={cn('absolute inset-y-0 left-0 bg-lumen', active === i ? 'w-full origin-left animate-[bar_4.8s_linear_both] motion-reduce:animate-none' : 'w-0')}
                      />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <div data-reveal="" aria-live="polite" className="lg:sticky lg:top-28">
            <Visual step={active} />
          </div>
        </div>
        <div data-reveal="">
          <Cta to="/book-a-demo/" size="lg">
            Plan yours in a demo
          </Cta>
        </div>
      </div>
    </section>
  )
}
