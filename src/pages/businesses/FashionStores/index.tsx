import { Globe, ScanLine, Sparkles } from 'lucide-react'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { Pillars } from '@/components/sections/Pillars'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { FloorPlan } from './FloorPlan'

/** /for-businesses/fashion-stores/ — primary: "virtual try on for fashion stores". */
export default function FashionStores() {
  const b = businessBySlug('fashion-stores')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        eyebrow="Fashion stores"
        title={
          <>
            Virtual try on for fashion stores, on the floor and <span className="accent-serif">online.</span>
          </>
        }
        intro="Virtual try on for fashion stores gives every rail a digital fitting room. Shoppers see a piece on themselves straight away, so the pieces that reach a changing room are the ones they already like — in your shop and across your online catalogue."
        secondary={{ to: '/use-cases/', label: 'Ecommerce use cases' }}
      />

      <Pillars
        id="fs-values"
        eyebrow="Why it fits"
        title={
          <>
            The rail is where the <span className="accent-serif">decision</span> starts.
          </>
        }
        items={[
          { icon: ScanLine, title: 'Decide at the rail', body: 'Shoppers scan a piece and see it on themselves before carrying it to a fitting room.' },
          { icon: Globe, title: 'One try-on, two channels', body: 'The shop floor and your online store share the same experience, so customers meet one familiar tool.' },
          { icon: Sparkles, title: 'Looks, not just items', body: 'AI Looks suggests combinations around a piece, helping your team show the wider range.' },
        ]}
      />

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="fs-floor-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="fs-floor-title"
            eyebrow="Map your floor"
            title={
              <>
                Five places a <span className="whitespace-nowrap">try-on</span> <span className="accent-serif">earns its spot.</span>
              </>
            }
            lede="A virtual fitting room does not have to live in one place. Tap a hotspot to see where it can sit on a typical fashion retail floor."
          />
          <div data-reveal="">
            <FloorPlan />
          </div>
        </div>
      </section>

      <section className="section-sm" aria-label="Related pages">
        <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-3 text-[1rem]">
          <span className="eyebrow w-full sm:w-auto">Keep exploring</span>
          <Link000 href="/for-businesses/boutiques/" className="font-medium">
            Boutiques
          </Link000>
          <Link000 href="/for-businesses/shopping-malls/" className="font-medium">
            Shopping malls
          </Link000>
          <Link000 href="/use-cases/" className="font-medium">
            Virtual try on for ecommerce
          </Link000>
          <Link000 href="/features/" className="font-medium">
            All features
          </Link000>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Virtual try on for fashion stores, answered" />
      <ConversionCard />
    </>
  )
}
