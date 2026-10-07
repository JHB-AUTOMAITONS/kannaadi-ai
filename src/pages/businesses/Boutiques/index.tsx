import { Layers, MessageCircle, MonitorSmartphone } from 'lucide-react'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { Pillars } from '@/components/sections/Pillars'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { LookBoard } from './LookBoard'

/** /for-businesses/boutiques/ — primary: "virtual try on for boutiques". */
export default function Boutiques() {
  const b = businessBySlug('boutiques')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        shape="circle-cut"
        tone="sand"
        eyebrow="Boutiques"
        title={
          <>
            Virtual try on for boutiques that <span className="accent-serif">curate,</span> not just stock.
          </>
        }
        intro="Virtual try on for boutiques gives a small, curated collection a digital fitting room — one that supports your styling advice instead of replacing it. A single screen or kiosk can extend what you show without adding floor space or staff."
        secondary={{ to: '/features/#ai-outfit-generator', label: 'Meet AI Looks' }}
      />

      <Pillars
        id="bq-values"
        eyebrow="Stays personal"
        title={
          <>
            Technology that <span className="accent-serif">knows its place.</span>
          </>
        }
        items={[
          { icon: MessageCircle, title: 'Your advice leads', body: 'Shoppers explore; your team still guides the decision. The screen is a prompt for the conversation, not a substitute.' },
          { icon: Layers, title: 'A small range, shown wider', body: 'A focused capsule can be shown in more colours and combinations than the rail has room for.' },
          { icon: MonitorSmartphone, title: 'One screen is enough', body: 'It scales down as well as up: a single mirror-style screen beside the fitting room can carry the whole experience.' },
        ]}
      />

      <section className="theme-sand bg-background py-14 md:py-20" aria-labelledby="bq-board-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="bq-board-title"
            eyebrow="The stylist’s board"
            title={
              <>
                Curated looks, <span className="accent-serif">kept human.</span>
              </>
            }
            lede="Pick a piece from the board. AI Looks proposes how it could be styled — and your team decides what actually leaves the shop."
          />
          <div data-reveal="">
            <LookBoard />
          </div>
        </div>
      </section>

      <section className="section-sm md:section" aria-label="Related pages">
        <div className="container-x flex flex-wrap items-center gap-x-8 gap-y-3 text-[1rem]">
          <span className="eyebrow">Also see</span>
          <Link002 href="/for-businesses/fashion-stores/" className="font-medium">
            Fashion stores
          </Link002>
          <Link002 href="/for-businesses/jewellery-stores/" className="font-medium">
            Jewellery stores
          </Link002>
          <Link002 href="/features/" className="font-medium">
            AI fashion tools
          </Link002>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Virtual try on for boutiques, answered" />
      <ConversionCard />
    </>
  )
}
