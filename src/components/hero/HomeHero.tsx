import { HERO_SIZES, heroPair } from '@/lib/images'
import { Fragment, useRef, useState } from 'react'
import { Cta } from '@/components/ui/Cta'
import { RevealCursor } from './RevealCursor'
import { RevealStage, type ImageSource, type RevealStageHandle } from './RevealStage'
import { HeroBackdropWords, type HeroWordsHandle } from './HeroBackdropWords'

const HERO = heroPair()
const CLEAN: ImageSource[] = HERO.clean
const AI: ImageSource[] = HERO.ai.filter((s) => s.width >= 1600)
// Photo heroes are composed with the model already on the right, and must stay horizontally centred at lg+ so the
// lettering mask (sized to the same box) lines up with her silhouette.
const IMG_POS = HERO.isPhoto
  ? 'object-[86%_50%] md:object-[96%_50%] lg:object-[50%_50%] short:object-[100%_50%]'
  : 'object-[86%_50%] md:object-[96%_50%] lg:object-[50%_50%] xl:object-[72%_50%] short:object-[100%_50%]'
// Small desktops (1024–1279px): the photo's model starts just past mid-screen, so the copy narrows to clear her.
// NB: dynamic class strings must keep a space before `${…}` — Tailwind reads `class${x}` as one (invalid) token and
// silently drops the class before it.
const FIT_H1 = HERO.isPhoto ? ' lg:max-xl:text-[clamp(2.6rem,min(1.2rem_+_4.6vw,11vh),6.4rem)]' : ''
const FIT_P = HERO.isPhoto ? ' lg:max-xl:max-w-[26rem]' : ''

const HEADLINE = ['Virtual', 'try', 'on', 'for', 'fashion', 'that']
const HEADLINE_ACCENT = ['looks', 'like', 'you.']

/**
 * Home hero — the signature experience.
 * Image 1 (a studio still) is always visible. Image 2 (the same garment as an AI scan) exists only
 * inside an organic blob that follows the pointer or finger. The hero copy is blended with
 * `difference`, so it flips ink ↔ ivory as the dark layer passes beneath it and stays legible.
 * The whole hero is the reveal surface for a mouse (`reachAll`), and the background lettering shows its revealed
 * state through the very same blob (`onShape` → HeroBackdropWords): one engine, one pointer, one mask.
 */
export function HomeHero() {
  const hero = useRef<HTMLElement>(null)
  const stage = useRef<RevealStageHandle>(null)
  const words = useRef<HeroWordsHandle>(null)
  const [active, setActive] = useState(false)

  return (
    <section
      ref={hero}
      aria-labelledby="hero-title"
      data-hero="light"
      className="relative isolate flex flex-col overflow-hidden bg-background lg:block lg:min-h-[var(--hero-h)] short:grid short:min-h-[calc(100svh-var(--header-h))] short:grid-cols-[1.15fr_0.85fr] short:grid-rows-[1fr_auto]"
    >
      {!HERO.isPhoto && <HeroBackdropWords />}

      {/* Stage. Desktop (lg+): a backdrop sized to the artwork's own aspect, centred, so ultra-wide screens never
          zoom past the image's natural fit (that crops the head and hem). Tablets/phones: a block under the copy.
          Landscape phones: the right-hand column. Its edges feather out where the AI plate would otherwise show. */}
      <RevealStage
        ref={stage}
        clean={CLEAN}
        ai={AI}
        alt={HERO.alt}
        sizes={HERO_SIZES}
        imgClassName={IMG_POS}
        eventTarget={hero}
        reachAll
        onShape={HERO.isPhoto ? (shape, origin) => words.current?.paint(shape, origin) : undefined}
        priority
        loadAi="idle"
        onActiveChange={setActive}
        className="hero-stage-in relative order-2 -mt-2 h-[min(76svh,130vw)] w-full md:h-[min(56svh,84vw,720px)] lg:absolute lg:inset-y-0 lg:inset-x-0 lg:mx-auto lg:mt-0 lg:h-auto lg:w-[min(100%,calc(var(--hero-h)*1.846))] lg:[mask-image:linear-gradient(to_right,transparent,#000_56px,#000_calc(100%-56px),transparent)] short:order-none short:col-start-2 short:row-span-2 short:row-start-1 short:mt-0 short:h-auto short:w-full"
      />

      {HERO.isPhoto && <HeroBackdropWords ref={words} overPhoto maskUrl={HERO.mask} />}

      <div className="container-x relative order-1 pt-9 pb-2 lg:flex lg:min-h-[inherit] lg:items-center lg:py-16 short:order-none short:col-start-1 short:row-start-1 short:self-center short:py-3">
        <div className="max-w-[44rem] lg:max-w-[42rem] short:max-w-none">
          {/* blended block: white source → ink on ivory, ivory on the dark AI layer */}
          <div className="text-foreground lg:text-white lg:mix-blend-difference">
            <p className="hero-fade hero-eyebrow font-mono text-[0.7rem] tracking-[0.16em] uppercase opacity-80" style={{ ['--d' as string]: '60ms' }}>
              Fashion · AI · Retail
            </p>
            <h1 id="hero-title" className={`t-display mt-5 lg:text-[clamp(2.6rem,min(1.4rem_+_6vw,11vh),6.4rem)] short:mt-2 short:text-[clamp(1.75rem,9.5vh,2.7rem)] ${FIT_H1}`}>
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
            <p className={`hero-fade hero-lede mt-6 max-w-[34rem] text-[1.05rem] leading-relaxed text-foreground/85 md:text-[1.12rem] lg:text-white/85 short:mt-2.5 short:text-[0.9rem] short:leading-snug ${FIT_P}`} style={{ ['--d' as string]: '620ms' }}>
              Kannaadi.Ai helps fashion and retail businesses deliver AI-powered virtual try on experiences — online, in store and at
              events — so every customer can see a look on themselves before they commit to it.
            </p>
          </div>

          <div className="hero-fade hero-ctas mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3 short:mt-3.5" style={{ ['--d' as string]: '760ms' }}>
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
      <div className="pointer-events-none relative order-3 container-x pt-3 pb-5 lg:absolute lg:inset-x-0 lg:bottom-0 lg:pt-0 lg:pb-6 short:order-none short:col-start-1 short:row-start-2 short:pt-0 short:pb-3">
        <div className="flex items-center justify-between gap-4 text-foreground lg:text-white lg:mix-blend-difference">
          <p className="hero-fade flex items-center gap-2.5 font-mono text-[0.68rem] tracking-[0.14em] uppercase opacity-85" style={{ ['--d' as string]: '1000ms' }}>
            <span className={`size-1.5 rounded-full bg-foreground lg:bg-white ${active ? '' : 'animate-pulse-dot'}`} aria-hidden="true" />
            <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">{HERO.hint ?? 'Move across the hero to reveal the AI layer'}</span>
            <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">{HERO.touchHint ?? 'Touch and drag to reveal the AI layer'}</span>
          </p>
          <p className="hidden font-mono text-[0.68rem] tracking-[0.14em] uppercase opacity-70 lg:block" aria-hidden="true">
            {HERO.pairLabel ?? 'Studio ↔ AI scan'}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => stage.current?.play()}
        className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:bottom-4 focus:z-20 focus:rounded-full focus:bg-lumen focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        {HERO.pairLabel ? 'Play the try-on reveal' : 'Play the AI scan reveal'}
      </button>

      <RevealCursor target={hero} enabled={active} label={HERO.cursorLabel ?? 'Reveal'} />
    </section>
  )
}
