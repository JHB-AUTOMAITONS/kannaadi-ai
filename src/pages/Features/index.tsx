import { heroPair } from '@/lib/images'
import { useEffect, useRef, useState } from 'react'
import { RevealHint } from '@/components/hero/RevealHint'
import { RevealStage } from '@/components/hero/RevealStage'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FeatureVisual } from '@/components/sections/FeatureVisual'
import { PageHero } from '@/components/sections/PageHero'
import { Cta } from '@/components/ui/Cta'
import { Gift, ScanLine, Shirt } from 'lucide-react'
import { FaqSection } from '@/components/sections/FaqSection'
import { Pillars } from '@/components/sections/Pillars'
import { Link000, Link002 } from '@/components/ui/skiper-ui/skiper40'
import { faqFor } from '@/data/faqs'
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

const HERO = heroPair()
const HERO_CLEAN = HERO.clean
const HERO_AI = HERO.ai.filter((a) => a.width >= 1600)

/** /features/ — primary intent: "AI virtual try-on features". All product features live on this one page. */
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
            AI virtual try-on features for every step of the <span className="accent-serif whitespace-nowrap">journey.</span>
          </>
        }
        intro="The AI virtual try-on features inside Kannaadi.Ai, one by one: try-on on the shopper, AI Looks, upload and scan, the kiosk, lucky draw, jewellery and eyewear try-on. Ten capabilities, each described below with what it does and where it helps."
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
              alt={HERO.alt}
              sizes="(min-width: 1024px) 45vw, 92vw"
              imgClassName="object-[70%_50%]"
              eventTarget={heroCard}
              loadAi="idle"
              blobScale={0.85}
              priority
              className="absolute inset-0"
            />
            <RevealHint />
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

      <Pillars
        id="ft-session"
        eyebrow="How it works"
        title={
          <>
            How AI virtual try-on works, <span className="accent-serif">in one session.</span>
          </>
        }
        lede={
          <>
            The shopper-side flow in plain terms. How your own range is set up, and which channels it runs on, is agreed in a demo. Browse by{' '}
            <Link000 href="/for-businesses/" className="font-medium text-foreground">
              business type
            </Link000>{' '}
            or{' '}
            <Link000 href="/book-a-demo/" className="font-medium text-foreground">
              book a demo
            </Link000>
            .
          </>
        }
        items={[
          { icon: ScanLine, title: 'Choose a piece', body: 'The shopper picks a piece from your range — or scans a garment in store, or uploads a photo of a dress they have in mind.' },
          { icon: Shirt, title: 'See it on the shopper', body: 'The piece is shown on the shopper rather than on a model, and they can switch colours and looks to compare.' },
          { icon: Gift, title: 'Look further, then finish', body: 'AI Looks suggests how pieces come together, and campaigns can end with a share-ready look or a lucky draw.' },
        ]}
      />

      <FaqSection faqs={faqFor('/features/')} title="Features, answered" />

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
