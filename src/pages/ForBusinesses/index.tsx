import { BusinessGrid } from '@/components/sections/BusinessGrid'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { PageHero } from '@/components/sections/PageHero'
import { Cta } from '@/components/ui/Cta'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { BUSINESSES } from '@/data/businesses'

const GLANCE: Record<string, { where: string; signature: string }> = {
  'fashion-stores': { where: 'Shop floor and online', signature: 'AI Virtual Try-On · Upload or scan a dress' },
  'saree-ethnic-stores': { where: 'Showroom and online', signature: 'Drape, border and pallu preview' },
  'bridal-stores': { where: 'Appointments and at home', signature: 'Silhouettes, trains and necklines' },
  boutiques: { where: 'In the boutique', signature: 'AI Looks for curated collections' },
  'shopping-malls': { where: 'Concourses and flagships', signature: 'Kiosk experience' },
  'events-exhibitions': { where: 'Stands, pop-ups and launches', signature: 'Live try-on · Lucky Draw' },
  'jewellery-stores': { where: 'Counter and online', signature: 'Jewellery try-on' },
  'eyewear-stores': { where: 'In store and online', signature: 'Eyewear try-on' },
}

/** /for-businesses/ — a navigation hub. Deliberately has no primary keyword of its own. */
export default function ForBusinesses() {
  return (
    <>
      <PageHero
        path="/for-businesses/"
        eyebrow="For businesses"
        title={
          <>
            One <span className="whitespace-nowrap">try-on</span> layer, <span className="accent-serif">eight</span> ways to sell.
          </>
        }
        intro="Fashion stores, ethnic wear, bridal, boutiques, malls, events, jewellery and eyewear each sell differently. Choose your business type to see how Kannaadi.Ai fits the way you work."
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
      />

      <BusinessGrid
        id="categories-title"
        eyebrow="Choose your business"
        title={
          <>
            Pick the store that <span className="accent-serif">looks like yours.</span>
          </>
        }
        lede="Every category has its own page, with the try-on experience, features and questions that matter for that kind of business."
        detailed
        compactMobile={false}
        showAllLink={false}
      />

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="glance-title">
        <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            id="glance-title"
            eyebrow="At a glance"
            title={
              <>
                Where each one <span className="accent-serif">runs.</span>
              </>
            }
            size="2"
            lede="A quick map of where the experience lives for each business type, and the feature it leans on most."
          />
          <ul data-reveal-stagger="" className="border-t border-border">
            {BUSINESSES.map((b) => (
              <li key={b.slug} data-reveal="" className="grid gap-1 border-b border-border py-4 md:grid-cols-[1.1fr_1fr_1.4fr] md:items-baseline md:gap-6">
                <Link000 href={b.path} className="w-fit text-[1.05rem] font-medium">
                  {b.name}
                </Link000>
                <span className="text-[0.95rem] text-muted-foreground">{GLANCE[b.slug].where}</span>
                <span className="text-[0.95rem]">{GLANCE[b.slug].signature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ConversionCard
        title={
          <>
            Not sure which one <span className="accent-serif">fits?</span>
          </>
        }
        body="Many businesses span two or three of these. Tell us how you sell and we will map the right mix in a demo."
      />
    </>
  )
}
