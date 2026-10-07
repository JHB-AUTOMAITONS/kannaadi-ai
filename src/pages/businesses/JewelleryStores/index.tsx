import { Eye, Gem, Ruler } from 'lucide-react'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { Pillars } from '@/components/sections/Pillars'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { NecklaceLengths } from './NecklaceLengths'

/** /for-businesses/jewellery-stores/ — primary: "virtual try on jewellery". */
export default function JewelleryStores() {
  const b = businessBySlug('jewellery-stores')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        theme="dark"
        shape="round"
        eyebrow="Jewellery stores"
        title={
          <>
            Virtual try on jewellery: necklaces, earrings and more, <span className="accent-serif">worn.</span>
          </>
        }
        intro="Virtual try on jewellery shows a piece on the customer, so they can judge scale, length and style before the vault is opened. It suits a counter screen or kiosk in store as well as your website."
        secondary={{ to: '/features/#jewellery-try-on', label: 'Jewellery try-on' }}
      />

      <Pillars
        id="jw-values"
        eyebrow="Why it fits"
        title={
          <>
            Seen on <span className="accent-serif">the wearer.</span>
          </>
        }
        items={[
          { icon: Ruler, title: 'Scale and length', body: 'A pendant or drop reads very differently on a bust form than it does on the person who will wear it.' },
          { icon: Eye, title: 'A wider first look', body: 'Customers preview more pieces before staff bring specific ones out, so conversations start closer to what they like.' },
          { icon: Gem, title: 'Counter, kiosk or web', body: 'The same try-on can sit on the counter, on a standing screen or on your product pages.' },
        ]}
      />

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="jw-length-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="jw-length-title"
            eyebrow="Length, made visible"
            title={
              <>
                Choker to opera, <span className="accent-serif">in one slide.</span>
              </>
            }
            lede="Necklace length is the first thing customers ask about. Drag the slider to see how each length sits."
          />
          <div data-reveal="">
            <NecklaceLengths />
          </div>
        </div>
      </section>

      <section className="section-sm md:section" aria-labelledby="jw-more-title">
        <div className="container-x grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading id="jw-more-title" eyebrow="Complete the look" title={<>For weddings, <span className="accent-serif">and every day.</span></>} size="2" />
          <p data-reveal="" className="max-w-[58ch] text-[1.02rem] leading-relaxed text-muted-foreground">
            Jewellery is often chosen to go with something: a gown, a saree, an occasion. Pair it with{' '}
            <Link000 href="/for-businesses/bridal-stores/" className="font-medium text-foreground">
              virtual try on wedding dresses
            </Link000>{' '}
            or{' '}
            <Link000 href="/for-businesses/saree-ethnic-stores/" className="font-medium text-foreground">
              virtual try on saree
            </Link000>{' '}
            so the whole look is seen together.
          </p>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Virtual try on jewellery, answered" />
      <ConversionCard />
    </>
  )
}
