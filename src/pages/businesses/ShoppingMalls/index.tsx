import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { KioskFlow } from './KioskFlow'
import { MallMap } from './MallMap'

/** /for-businesses/shopping-malls/ — primary: "virtual fitting room in store". */
export default function ShoppingMalls() {
  const b = businessBySlug('shopping-malls')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        theme="dark"
        shape="wide"
        eyebrow="Shopping malls"
        title={
          <>
            Virtual fitting room in store for malls and <span className="accent-serif">flagships.</span>
          </>
        }
        intro="A virtual fitting room in store gives shoppers a walk-up way to see garments on themselves without changing. Kannaadi.Ai’s kiosk experience is built for concourses, atriums and flagship stores, where the experience itself is part of the draw."
        secondary={{ to: '/features/#kiosk-experience', label: 'The kiosk experience' }}
      />

      <section className="section" aria-labelledby="sm-flow-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="sm-flow-title"
            eyebrow="One session, four steps"
            title={
              <>
                Built for people who are <span className="accent-serif">just passing.</span>
              </>
            }
            lede="A mall kiosk has seconds to earn attention. The flow is short, self-guided and finishes on something worth taking away."
          />
          <div data-reveal="" className="theme-dark grain relative isolate overflow-hidden rounded-[2rem] bg-background p-6 text-foreground md:rounded-[2.5rem] md:p-12">
            <KioskFlow />
          </div>
        </div>
      </section>

      <section className="theme-sand bg-background py-14 md:py-20" aria-labelledby="sm-map-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="sm-map-title"
            eyebrow="Where it goes"
            title={
              <>
                Four spots a kiosk <span className="accent-serif">earns its footprint.</span>
              </>
            }
            lede="Placement decides whether a kiosk is used. Tap a spot on the plan for the thinking behind it."
          />
          <div data-reveal="">
            <MallMap />
          </div>
        </div>
      </section>

      <section className="section-sm md:section" aria-label="Related pages">
        <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-3 text-[1rem]">
          <span className="eyebrow">Also see</span>
          <Link002 href="/for-businesses/events-exhibitions/" className="font-medium">
            Events &amp; exhibitions
          </Link002>
          <Link002 href="/for-businesses/fashion-stores/" className="font-medium">
            Fashion stores
          </Link002>
          <Link002 href="/features/#lucky-draw" className="font-medium">
            Lucky Draw
          </Link002>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Virtual fitting room in store, answered" />
      <ConversionCard />
    </>
  )
}
