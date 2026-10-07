import { useEffect, useRef, useState } from 'react'
import { RevealStage } from '@/components/hero/RevealStage'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FeatureVisual } from '@/components/sections/FeatureVisual'
import { PageHero } from '@/components/sections/PageHero'
import { Cta } from '@/components/ui/Cta'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'
import { FEATURES } from '@/data/features'
import { cn } from '@/lib/utils'

const RELATED: Record<string, { to: string; label: string }> = {
  'ai-virtual-try-on': { to: '/use-cases/', label: 'Virtual try on for ecommerce' },
  'ai-outfit-generator': { to: '/for-businesses/boutiques/', label: 'Virtual try on for boutiques' },
  'upload-a-dress': { to: '/for-businesses/fashion-stores/', label: 'Virtual try on for fashion stores' },
  'scan-a-dress': { to: '/for-businesses/fashion-stores/', label: 'Fashion store experiences' },
  'kiosk-experience': { to: '/for-businesses/shopping-malls/', label: 'Virtual fitting room in store' },
  'lucky-draw': { to: '/for-businesses/events-exhibitions/', label: 'Brand activation marketing' },
  'jewellery-try-on': { to: '/for-businesses/jewellery-stores/', label: 'Virtual try on jewellery' },
  'eyewear-try-on': { to: '/for-businesses/eyewear-stores/', label: 'Virtual try on eyewear' },
  'real-time-virtual-fitting': { to: '/book-a-demo/', label: 'See it live in a demo' },
  'customer-engagement': { to: '/use-cases/', label: 'Engagement use cases' },
}

const HERO_CLEAN = [
  { src: '/images/hero/hero-clean-1600.webp', width: 1600 },
  { src: '/images/hero/hero-clean-2400.webp', width: 2400 },
]
const HERO_AI = [
  { src: '/images/hero/hero-ai-1600.webp', width: 1600 },
  { src: '/images/hero/hero-ai-2400.webp', width: 2400 },
]

/** /features/ — primary intent: "AI fashion technology". All product features live on this one page. */
export default function Features() {
  const [active, setActive] = useState(0)
  const heroCard = useRef<HTMLDivElement>(null)
  const panels = useRef<(HTMLElement | null)[]>([])

  // scroll-spy: the panel crossing the middle of the viewport drives the sticky visual
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index))
        }
      },
      { rootMargin: '-42% 0px -48% 0px' },
    )
    panels.current.forEach((p) => p && io.observe(p))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <PageHero
        path="/features/"
        theme="dark"
        eyebrow="Features"
        title={
          <>
            AI fashion technology for every step of the <span className="accent-serif">try-on.</span>
          </>
        }
        intro="Kannaadi.Ai brings AI fashion technology to the whole try-on journey — from virtual try-on and AI Looks to dress scanning, kiosks, jewellery and eyewear. One product, ten ways to put a customer in front of the mirror."
        actions={
          <>
            <Cta to="/book-a-demo/" size="lg" magnetic>
              Book a Demo
            </Cta>
            <Cta href="#ai-virtual-try-on" size="lg" variant="secondary">
              Jump to features
            </Cta>
          </>
        }
        visual={
          <div ref={heroCard} className="relative aspect-[5/4] w-full overflow-hidden rounded-[2rem] border border-border">
            <RevealStage
              clean={HERO_CLEAN}
              ai={HERO_AI}
              alt="Satin gown on a dress form; moving the pointer reveals its AI scan"
              sizes="(min-width: 1024px) 45vw, 92vw"
              imgClassName="object-[70%_50%]"
              eventTarget={heroCard}
              loadAi="idle"
              blobScale={0.85}
              priority
              className="absolute inset-0"
            />
            <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.68rem] tracking-[0.14em] text-white/85 uppercase mix-blend-difference">Move across to reveal the AI scan</p>
          </div>
        }
      />

      <section className="border-t border-border bg-background text-foreground" aria-label="All features">
        <div className="container-x grid gap-10 py-14 md:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          {/* sticky visual (desktop) */}
          <div className="relative hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-4">
              <div className="relative">
                {FEATURES.map((f, i) => (
                  <div
                    key={f.id}
                    inert={i !== active}
                    aria-hidden={i !== active}
                    className={cn('transition-[opacity,transform] duration-500 ease-[var(--ease-out-expo)]', i === active ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 translate-y-2 opacity-0')}
                  >
                    {Math.abs(i - active) <= 1 || i === active ? <FeatureVisual kind={f.visual} /> : <div className="aspect-[6/5]" />}
                  </div>
                ))}
              </div>
              <ol className="flex flex-wrap gap-1.5" aria-label="Feature index">
                {FEATURES.map((f, i) => (
                  <li key={f.id}>
                    <a
                      href={`#${f.id}`}
                      aria-current={i === active ? 'true' : undefined}
                      className={cn('inline-flex h-8 min-w-8 items-center justify-center rounded-full border px-2.5 font-mono text-[0.68rem] tracking-widest transition-colors', i === active ? 'border-transparent bg-lumen text-ink' : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground')}
                    >
                      {f.index}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* feature copy */}
          <div className="flex flex-col">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              const rel = RELATED[f.id]
              return (
                <article
                  key={f.id}
                  id={f.id}
                  data-index={i}
                  ref={(el) => {
                    panels.current[i] = el
                  }}
                  className="flex flex-col gap-5 border-b border-border py-10 first:pt-0 last:border-b-0 lg:min-h-[26rem] lg:justify-center"
                  data-reveal=""
                >
                  <div className="lg:hidden">
                    <FeatureVisual kind={f.visual} />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm tracking-widest text-foreground">{f.index}</span>
                    <span className="h-px w-8 bg-border" />
                    <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
                  </div>
                  <p className="eyebrow">{f.kicker}</p>
                  <h2 className="t-1 max-w-[16ch] text-[clamp(1.8rem,1.1rem+2.6vw,3rem)]">{f.title}</h2>
                  <p className="lede">{f.description}</p>
                  <ul className="grid gap-2 text-[0.98rem]">
                    {f.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-[2px] bg-foreground" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link002 href={rel.to} className="mt-1 w-fit text-[0.98rem] font-medium">
                    {rel.label}
                  </Link002>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <ConversionCard
        title={
          <>
            Try the technology on <span className="accent-serif">your</span> range.
          </>
        }
        body="Tell us what you sell and where. We will show the features that fit — and leave out the ones that do not."
      />
    </>
  )
}
