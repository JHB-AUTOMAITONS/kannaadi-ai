import { Fragment, useRef, useState } from 'react'
import { Cta } from '@/components/ui/Cta'
import { RevealCursor } from './RevealCursor'
import { RevealStage, type ImageSource, type RevealStageHandle } from './RevealStage'
import { HeroBackdropWords } from './HeroBackdropWords'

const CLEAN: ImageSource[] = [
  { src: '/images/hero/hero-clean-1600.webp', width: 1600 },
  { src: '/images/hero/hero-clean-2400.webp', width: 2400 },
]
const AI: ImageSource[] = [
  { src: '/images/hero/hero-ai-1600.webp', width: 1600 },
  { src: '/images/hero/hero-ai-2400.webp', width: 2400 },
]

const HEADLINE = ['Virtual', 'try', 'on', 'for', 'fashion', 'that']
const HEADLINE_ACCENT = ['looks', 'like', 'you.']

/**
 * Home hero — the signature experience.
 * Image 1 (a studio still) is always visible. Image 2 (the same garment as an AI scan) exists only
 * inside an organic blob that follows the pointer or finger. The hero copy is blended with
 * `difference`, so it flips ink ↔ ivory as the dark layer passes beneath it and stays legible.
 */
export function HomeHero() {
  const hero = useRef<HTMLElement>(null)
  const stage = useRef<RevealStageHandle>(null)
  const [active, setActive] = useState(false)

  return (
    <section
      ref={hero}
      aria-labelledby="hero-title"
      data-hero="light"
      className="relative isolate flex flex-col overflow-hidden bg-background md:block md:min-h-[clamp(600px,calc(100svh-var(--header-h)),880px)]"
    >
      <HeroBackdropWords />

      {/* Stage: absolute backdrop on desktop, a dedicated block under the copy on mobile */}
      <RevealStage
        ref={stage}
        clean={CLEAN}
        ai={AI}
        alt="A satin evening gown on a dress form, shown as a studio photograph. Moving the pointer over it reveals the same gown as a luminous AI scan."
        sizes="(max-width: 767px) 140vw, 100vw"
        imgClassName="object-[86%_50%] md:object-[50%_50%]"
        eventTarget={hero}
        priority
        loadAi="idle"
        onActiveChange={setActive}
        className="hero-stage-in relative order-2 -mt-2 h-[min(76svh,130vw)] w-full md:absolute md:inset-0 md:mt-0 md:h-auto"
      />

      <div className="container-x relative order-1 pt-9 pb-2 md:flex md:min-h-[inherit] md:items-center md:py-16">
        <div className="max-w-[44rem] md:max-w-[36rem] lg:max-w-[42rem]">
          {/* blended block: white source → ink on ivory, ivory on the dark AI layer */}
          <div className="text-foreground md:text-white md:mix-blend-difference">
            <p className="hero-fade font-mono text-[0.7rem] tracking-[0.16em] uppercase opacity-80" style={{ ['--d' as string]: '60ms' }}>
              Fashion · AI · Retail
            </p>
            <h1 id="hero-title" className="t-display mt-5">
              <span className="hero-line">
                {HEADLINE.map((w, i) => (
                  <Fragment key={w + i}>
                    <span className="hero-word" style={{ ['--i' as string]: i }}>
                      {w}
                    </span>{' '}
                  </Fragment>
                ))}
              </span>
              <span className="hero-line">
                {HEADLINE_ACCENT.map((w, i) => (
                  <Fragment key={w}>
                    <span className="hero-word accent-serif" style={{ ['--i' as string]: HEADLINE.length + i }}>
                      {w}
                    </span>{' '}
                  </Fragment>
                ))}
              </span>
            </h1>
            <p className="hero-fade mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-foreground/85 md:text-[1.12rem] md:text-white/85" style={{ ['--d' as string]: '620ms' }}>
              Kannaadi.Ai helps fashion and retail businesses deliver AI-powered virtual try on experiences — online, in store and at
              events — so every customer can see a look on themselves before they commit to it.
            </p>
          </div>

          <div className="hero-fade mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3" style={{ ['--d' as string]: '760ms' }}>
            <Cta to="/book-a-demo/" size="lg" magnetic>
              Book a Demo
            </Cta>
            <Cta to="/features/" size="lg" variant="secondary">
              Explore Features
            </Cta>
          </div>
        </div>
      </div>

      {/* hint + keyboard path */}
      <div className="pointer-events-none relative order-3 container-x pt-3 pb-5 md:absolute md:inset-x-0 md:bottom-0 md:pt-0 md:pb-6">
        <div className="flex items-center justify-between gap-4 text-foreground md:text-white md:mix-blend-difference">
          <p className="hero-fade flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase opacity-85" style={{ ['--d' as string]: '1000ms' }}>
            <span className={`size-1.5 rounded-full bg-foreground md:bg-white ${active ? '' : 'animate-pulse-dot'}`} aria-hidden="true" />
            <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">Move across the hero to reveal the AI layer</span>
            <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">Touch and drag to reveal the AI layer</span>
          </p>
          <p className="hidden font-mono text-[0.68rem] tracking-[0.14em] uppercase opacity-70 md:block" aria-hidden="true">
            Studio ↔ AI scan
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => stage.current?.play()}
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:bottom-4 focus:z-20 focus:rounded-full focus:bg-lumen focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Play the AI scan reveal
      </button>

      <RevealCursor target={hero} />
    </section>
  )
}
