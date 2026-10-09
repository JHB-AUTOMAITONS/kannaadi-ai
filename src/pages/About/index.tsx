import { gownProps, gownAlt } from '@/lib/images'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { PageHero } from '@/components/sections/PageHero'
import { Cta } from '@/components/ui/Cta'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000, Link002 } from '@/components/ui/skiper-ui/skiper40'
import { BUSINESSES } from '@/data/businesses'

const BUILD = [
  { title: 'Virtual try-on', body: 'AI that shows garments, jewellery and frames on the shopper — for web, kiosks and in-store screens.', to: '/features/', link: 'AI fashion technology' },
  { title: 'Looks and discovery', body: 'An AI outfit generator that turns single pieces into looks, so catalogues are explored rather than skimmed.', to: '/features/#ai-outfit-generator', link: 'AI Looks' },
  { title: 'Experiences for stores and events', body: 'Kiosks, scanning and lucky-draw moments for shop floors, malls, exhibitions and launches.', to: '/use-cases/', link: 'Use cases' },
]

const PRINCIPLES = [
  { n: '01', title: 'Fashion first', body: 'Technology should serve the look. Every decision starts from how a garment, a frame or a piece of jewellery is actually chosen.' },
  { n: '02', title: 'Honest technology', body: 'We describe what the product does and leave out numbers we cannot back up. No inflated claims, no invented case studies.' },
  { n: '03', title: 'Human in the loop', body: 'Try-on supports stylists and shop teams; it does not replace their advice. The best result is a better conversation.' },
  { n: '04', title: 'Built to be used', body: 'Designed for real shop floors, real traffic and real campaigns — fast, legible and forgiving.' },
]

/** /about/ — primary intent: "fashion technology company". No invented history, team, offices or numbers. */
export default function About() {
  return (
    <>
      <PageHero
        path="/about/"
        theme="dark"
        eyebrow="About Kannaadi.Ai"
        title={
          <>
            A fashion technology company building the <span className="accent-serif">digital mirror.</span>
          </>
        }
        intro="Kannaadi.Ai is a fashion technology company. We build AI-powered virtual try-on and digital fashion experiences for retail and ecommerce, so customers can see a look on themselves before they commit to it."
        actions={
          <>
            <Cta to="/book-a-demo/" size="lg" magnetic>
              Book a Demo
            </Cta>
            <Cta to="/features/" size="lg" variant="secondary">
              Explore Features
            </Cta>
          </>
        }
        visual={
          <div className="relative mx-auto aspect-[4/5] w-[min(100%,25rem)]">
            <div className="absolute inset-0 overflow-hidden rounded-[50%_50%_46%_54%/38%_42%_58%_62%] border-2 border-foreground/80 bg-[radial-gradient(80%_65%_at_50%_35%,#2a3020_0%,#121413_60%,#0b0c0d_100%)] shadow-[0_0_0_10px_rgb(245_241_232/0.06),0_40px_90px_-40px_rgb(213_255_79/0.35)]">
              <img {...gownProps('champagne', { sizes: '25rem' })} alt={gownAlt('champagne', 'Champagne')} width={1100} height={1300} loading="eager" decoding="async" className="absolute inset-0 h-full w-full scale-[1.08] object-contain" />
              <img {...gownProps('scan', { sizes: '25rem', scanOf: 'champagne' })} alt="" aria-hidden="true" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-[1.08] object-contain [clip-path:inset(0_0_0_62%)]" />
              <span className="absolute inset-y-0 left-[62%] w-px bg-lumen/80 shadow-[0_0_16px_2px_rgb(213_255_79/0.45)]" aria-hidden="true" />
            </div>
            <span aria-hidden="true" className="absolute -top-1 right-[14%] h-14 w-1.5 rotate-[38deg] rounded-full bg-lumen" />
          </div>
        }
      />

      <section className="section border-t border-border" aria-labelledby="name-title">
        <div className="container-x grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            id="name-title"
            eyebrow="The name"
            title={
              <>
                <span className="accent-serif">Kannaadi</span> means mirror.
              </>
            }
          />
          <div data-reveal="" className="flex max-w-[60ch] flex-col gap-4 text-[1.05rem] leading-relaxed text-muted-foreground">
            <p>
              Kannaadi is a word for “mirror” in several South Indian languages. It is the whole idea in one word: fashion has always
              been decided in front of a mirror, and we think that moment can be carried into every place a customer meets a brand.
            </p>
            <p>
              As an AI fashion company we focus on that single moment — the look on you — and on the technology that makes it available
              online, in store and at events. Fashion innovation, for us, means making that moment easier, not more complicated.
            </p>
          </div>
        </div>
      </section>

      <section className="theme-sand bg-background py-14 md:py-20" aria-labelledby="build-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="build-title"
            eyebrow="What we build"
            title={
              <>
                Fashion technology for <span className="accent-serif">retail.</span>
              </>
            }
            lede="Our fashion technology is organised around three things retailers ask for."
          />
          <ul data-reveal-stagger="" className="grid gap-3 md:grid-cols-3 md:gap-4">
            {BUILD.map((b) => (
              <li key={b.title} data-reveal="" className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 md:p-7">
                <h3 className="t-2">{b.title}</h3>
                <p className="text-[1rem] leading-relaxed text-muted-foreground">{b.body}</p>
                <Link002 href={b.to} className="mt-auto w-fit pt-3 text-[0.95rem] font-medium">
                  {b.link}
                </Link002>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="principles-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            id="principles-title"
            eyebrow="How we work"
            title={
              <>
                Four principles, <span className="accent-serif">kept simple.</span>
              </>
            }
          />
          <ol data-reveal-stagger="" className="border-t border-border">
            {PRINCIPLES.map((p) => (
              <li key={p.n} data-reveal="" className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border py-6">
                <span className="pt-1 font-mono text-sm tracking-widest text-lumen">{p.n}</span>
                <div>
                  <h3 className="t-3">{p.title}</h3>
                  <p className="mt-1.5 max-w-[52ch] text-[0.98rem] leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-sm md:section" aria-labelledby="where-title">
        <div className="container-x flex flex-col gap-8">
          <SectionHeading id="where-title" eyebrow="Who we work with" title="Retail and fashion businesses of every shape." size="2" />
          <ul data-reveal-stagger="" className="flex flex-wrap gap-2.5">
            {BUSINESSES.map((b) => (
              <li key={b.slug} data-reveal="">
                <Link000 href={b.path} className="rounded-full border border-border px-4 py-2 text-[0.95rem] font-medium transition-colors hover:bg-foreground hover:text-background">
                  {b.name}
                </Link000>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ConversionCard
        title={
          <>
            Let’s put a mirror <span className="accent-serif">in your store.</span>
          </>
        }
      />
    </>
  )
}
