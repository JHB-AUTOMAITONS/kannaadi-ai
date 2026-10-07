import { Glasses, Layers, ScanFace } from 'lucide-react'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { Pillars } from '@/components/sections/Pillars'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { FrameShapes } from './FrameShapes'

/** /for-businesses/eyewear-stores/ — primary: "virtual try on eyewear". */
export default function EyewearStores() {
  const b = businessBySlug('eyewear-stores')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        shape="round"
        eyebrow="Eyewear stores"
        title={
          <>
            Virtual try on eyewear: frames that fit before the <span className="accent-serif">fitting.</span>
          </>
        }
        intro="Virtual try on eyewear lets shoppers compare frames on their own face — shape, size and colour — in store or at home. Your opticians keep the measurements, lenses and fit; try-on helps customers arrive with frames they already like."
        secondary={{ to: '/features/#eyewear-try-on', label: 'Eyewear try-on' }}
      />

      <Pillars
        id="ew-values"
        eyebrow="Why it fits"
        title={
          <>
            Frames are a <span className="accent-serif">face decision.</span>
          </>
        }
        items={[
          { icon: ScanFace, title: 'On your own face', body: 'Shoppers look at the camera and see frames on themselves, not a model with a different face.' },
          { icon: Layers, title: 'Compare quickly', body: 'Move between shapes and colours with a tap, so a shortlist builds itself.' },
          { icon: Glasses, title: 'Fitting stays human', body: 'Measurements, lenses and adjustments remain with your opticians. Try-on only narrows the choice.' },
        ]}
      />

      <section className="theme-sand bg-background py-14 md:py-20" aria-labelledby="ew-frames-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="ew-frames-title"
            eyebrow="Frame shapes"
            title={
              <>
                Five shapes, four finishes, <span className="accent-serif">one face.</span>
              </>
            }
            lede="Pick a shape and a finish to see how frames change a face. The real try-on does this on the customer."
          />
          <div data-reveal="">
            <FrameShapes />
          </div>
        </div>
      </section>

      <section className="section-sm md:section" aria-labelledby="ew-more-title">
        <div className="container-x grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading id="ew-more-title" eyebrow="In store and online" title={<>The same try-on, <span className="accent-serif">wherever they look.</span></>} size="2" />
          <p data-reveal="" className="max-w-[58ch] text-[1.02rem] leading-relaxed text-muted-foreground">
            A counter screen helps the customer who is already in your store; the same experience on your website helps the one who is
            not yet. See how it works as a{' '}
            <Link000 href="/features/#kiosk-experience" className="font-medium text-foreground">
              kiosk experience
            </Link000>
            , or explore{' '}
            <Link000 href="/use-cases/" className="font-medium text-foreground">
              virtual try on for ecommerce
            </Link000>
            .
          </p>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Virtual try on eyewear, answered" />
      <ConversionCard />
    </>
  )
}
