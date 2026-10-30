import { Layers, Palette, Sparkles } from 'lucide-react'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { Pillars } from '@/components/sections/Pillars'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { DrapeStyles } from './DrapeStyles'

/** /for-businesses/saree-ethnic-stores/ — primary: "virtual try on saree". */
export default function SareeEthnicStores() {
  const b = businessBySlug('saree-ethnic-stores')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        theme="dark"
        shape="tall"
        focal="object-[50%_50%]"
        eyebrow="Saree & ethnic stores"
        title={
          <>
            Virtual try on saree for your showroom: see the drape before it’s <span className="accent-serif">unfolded.</span>
          </>
        }
        intro="Virtual try on saree experiences give saree and ethnic-wear stores another way to help shoppers explore a look before staff unfold and drape each piece. Customers can narrow down their choices first, helping showroom staff focus on the sarees they want to see more closely."
        secondary={{ to: '/features/#ai-virtual-try-on', label: 'How try-on works' }}
      />

      <Pillars
        id="se-values"
        eyebrow="What shoppers compare"
        title={
          <>
            Border, pallu and <span className="accent-serif">drape.</span>
          </>
        }
        lede="Choosing a saree is a very visual decision. Virtual try on puts the three things that matter in front of the customer first."
        items={[
          { icon: Palette, title: 'Colour on you', body: 'Preview the saree on yourself, rather than seeing it only on a hanger or in a flat photograph.' },
          { icon: Sparkles, title: 'Border and pallu', body: 'See where the border and pallu sit on the wearer, to get a sense of their width and placement before the saree is unfolded.' },
          { icon: Layers, title: 'The drape', body: 'Compare similar sarees on yourself, so fewer pieces need unfolding. A preview is a guide, not a guarantee of how a saree will drape in person.' },
        ]}
      />

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="se-drape-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="se-drape-title"
            eyebrow="Drape styles"
            title={
              <>
                Every drape puts a different part of the saree <span className="accent-serif">first.</span>
              </>
            }
            lede="Nivi, Bengali, Gujarati, nauvari, kasavu: the same saree reads differently in each. Choose a drape to see what customers look at."
          />
          <div data-reveal="">
            <DrapeStyles />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="se-beyond-title">
        <div className="container-x grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            id="se-beyond-title"
            eyebrow="Beyond sarees"
            title={
              <>
                Ethnic fashion, <span className="accent-serif">start to finish.</span>
              </>
            }
            size="2"
          />
          <div data-reveal="" className="flex max-w-[58ch] flex-col gap-4 text-[1.02rem] leading-relaxed text-muted-foreground">
            <p>
              Ethnic wear stores often sell more than sarees. The experience is designed to extend to other ethnic wear, with the
              categories to launch with discussed in a demo, and to run on a showroom kiosk as well as on your website — so ethnic wear
              virtual try on can feel consistent wherever a customer starts.
            </p>
            <p>
              Planning a launch around a festive or wedding season?{' '}
              <Link000 href="/for-businesses/bridal-stores/" className="font-medium text-foreground">
                See how bridal stores use it
              </Link000>
              ,{' '}
              <Link000 href="/features/#kiosk-experience" className="font-medium text-foreground">
                explore the kiosk experience
              </Link000>{' '}
              or see how{' '}
              <Link000 href="/features/#scan-a-dress" className="font-medium text-foreground">
                scanning a garment at the rail
              </Link000>{' '}
              works. Selling online as well? See{' '}
              <Link000 href="/use-cases/" className="font-medium text-foreground">
                virtual try on for ecommerce
              </Link000>
              .
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Virtual try on saree, answered" />
      <ConversionCard />
    </>
  )
}
