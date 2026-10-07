import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { Journey } from './Journey'
import { SilhouetteExplorer } from './SilhouetteExplorer'

/** /for-businesses/bridal-stores/ — primary: "virtual try on wedding dresses". */
export default function BridalStores() {
  const b = businessBySlug('bridal-stores')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        shape="arch"
        eyebrow="Bridal stores"
        title={
          <>
            Virtual try on wedding dresses, from first browse to <span className="accent-serif">final fitting.</span>
          </>
        }
        intro="Virtual try on wedding dresses lets a bride explore silhouettes, necklines and trains before her first appointment — and keep exploring between fittings. Your team still does what only people can: fit, fabric and honest advice."
        secondary={{ to: '/for-businesses/jewellery-stores/', label: 'Add the jewellery' }}
      />

      <section className="section" aria-labelledby="br-shape-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="br-shape-title"
            eyebrow="Silhouette explorer"
            title={
              <>
                Find the <span className="accent-serif">shape</span> before the sample size.
              </>
            }
            lede="Brides often start with a feeling rather than a style name. Try a silhouette and a train length and see how the dress reads."
          />
          <div data-reveal="">
            <SilhouetteExplorer />
          </div>
        </div>
      </section>

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="br-journey-title">
        <div className="container-x flex flex-col gap-10 md:gap-14">
          <SectionHeading
            id="br-journey-title"
            eyebrow="The journey"
            title={
              <>
                A bridal journey with try-on <span className="accent-serif">at every step.</span>
              </>
            }
            lede="Try-on does not replace the appointment. It makes the weeks around it more useful."
          />
          <Journey />
        </div>
      </section>

      <section className="section-sm md:section" aria-labelledby="br-more-title">
        <div className="container-x grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading id="br-more-title" eyebrow="Complete the look" title={<>Gown, veil, <span className="accent-serif">jewellery.</span></>} size="2" />
          <div data-reveal="" className="flex max-w-[58ch] flex-col gap-4 text-[1.02rem] leading-relaxed text-muted-foreground">
            <p>
              A wedding look is more than the dress. The same try-on that shows a gown can show the necklace that goes with it, so brides
              and their families see the whole picture.
            </p>
            <p>
              Explore{' '}
              <Link000 href="/for-businesses/jewellery-stores/" className="font-medium text-foreground">
                virtual try on jewellery
              </Link000>
              , the{' '}
              <Link000 href="/features/#ai-outfit-generator" className="font-medium text-foreground">
                AI outfit generator
              </Link000>{' '}
              or{' '}
              <Link000 href="/for-businesses/saree-ethnic-stores/" className="font-medium text-foreground">
                virtual try on saree
              </Link000>{' '}
              for bridal ethnic wear.
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Virtual try on wedding dresses, answered" />
      <ConversionCard />
    </>
  )
}
