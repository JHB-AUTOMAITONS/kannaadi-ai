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
            Virtual try on saree: see the drape before it’s <span className="accent-serif">unfolded.</span>
          </>
        }
        intro="Virtual try on saree experiences let shoppers preview colour, border and pallu on themselves before staff unfold and drape each piece. That way showroom time can go to the sarees a customer already likes."
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
          { icon: Palette, title: 'Colour on you', body: 'See how the body colour sits against your skin tone and outfit — in the light of your own screen, not a rack.' },
          { icon: Sparkles, title: 'Border and pallu', body: 'Zari width, motif placement and pallu weight are shown where the customer will wear them.' },
          { icon: Layers, title: 'The drape', body: 'Preview how the saree falls, so comparing similar sarees doesn’t mean unfolding every one.' },
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
              The same approach applies to lehengas, anarkalis and other ethnic silhouettes, and the experience can run on a showroom
              kiosk as well as on your website — so ethnic wear virtual try on is consistent wherever a customer starts.
            </p>
            <p>
              Planning a launch around a festive or wedding season?{' '}
              <Link000 href="/for-businesses/bridal-stores/" className="font-medium text-foreground">
                See how bridal stores use it
              </Link000>{' '}
              or{' '}
              <Link000 href="/features/#kiosk-experience" className="font-medium text-foreground">
                explore the kiosk experience
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
