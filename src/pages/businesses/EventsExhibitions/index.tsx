import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { Wheel } from '@/components/sections/FeatureVisual'
import { IndustryHero } from '@/components/sections/IndustryHero'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { businessBySlug } from '@/data/businesses'
import { ActivationJourney } from './ActivationJourney'

const FORMATS = ['Exhibitions', 'Trade shows', 'Pop-up stores', 'Store launches', 'Fashion weeks', 'Festive campaigns']
const BRANDABLE = ['The kiosk screen and attract loop', 'Colourways and looks on offer', 'The reward moment and its prizes', 'Share-ready frames for each look']

/** /for-businesses/events-exhibitions/ — primary: "brand activation marketing". */
export default function EventsExhibitions() {
  const b = businessBySlug('events-exhibitions')!
  return (
    <>
      <IndustryHero
        path={b.path}
        slug={b.slug}
        theme="dark"
        shape="wide"
        eyebrow="Events & exhibitions"
        title={
          <>
            Brand activation marketing built around a live <span className="accent-serif whitespace-nowrap">try-on.</span>
          </>
        }
        intro="Brand activation marketing works when visitors do something, not just see something. Kannaadi.Ai turns a stand, pop-up or launch into a live virtual try on moment — with AI looks and a lucky draw — that people want to take part in and share."
        secondary={{ to: '/features/#lucky-draw', label: 'About Lucky Draw' }}
      />

      <section className="section" aria-labelledby="ev-journey-title">
        <div className="container-x flex flex-col gap-10 md:gap-12">
          <SectionHeading
            id="ev-journey-title"
            eyebrow="The activation"
            title={
              <>
                Five beats from <span className="accent-serif">passer-by to participant.</span>
              </>
            }
            lede="Every good activation has a shape. This one is built to be understood at a glance and remembered afterwards."
          />
          <div className="theme-dark grain relative isolate overflow-hidden rounded-[2rem] bg-background p-4 text-foreground md:rounded-[2.5rem] md:p-8">
            <ActivationJourney />
          </div>
        </div>
      </section>

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="ev-draw-title">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-7">
            <SectionHeading
              id="ev-draw-title"
              eyebrow="Lucky Draw"
              title={
                <>
                  A reason to <span className="accent-serif">stay for the ending.</span>
                </>
              }
              lede="The draw gives a try-on a finish. It is easy to understand, fun to watch, and fits any campaign — you decide what is on the wheel."
            />
            <div data-reveal="">
              <p className="eyebrow mb-4">What you can brand</p>
              <ul className="grid gap-2.5 text-[0.98rem]">
                {BRANDABLE.map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-[2px] bg-lumen" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div data-reveal="">
            <Wheel />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="ev-formats-title">
        <div className="container-x grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading id="ev-formats-title" eyebrow="Where it runs" title={<>Built for the <span className="accent-serif">floor of an event.</span></>} size="2" />
          <div data-reveal="" className="flex flex-col gap-6">
            <ul className="flex flex-wrap gap-2.5">
              {FORMATS.map((f) => (
                <li key={f} className="rounded-full border border-border px-4 py-2 text-[0.95rem] font-medium">
                  {f}
                </li>
              ))}
            </ul>
            <p className="max-w-[56ch] text-[1.02rem] leading-relaxed text-muted-foreground">
              Planning something at a venue with its own footfall? The same kiosk works in a{' '}
              <Link000 href="/for-businesses/shopping-malls/" className="font-medium text-foreground">
                shopping mall
              </Link000>{' '}
              as it does on an exhibition floor — or take the experience online through{' '}
              <Link000 href="/use-cases/" className="font-medium text-foreground">
                virtual try on for ecommerce
              </Link000>
              .
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={b.faq} title="Brand activation marketing, answered" />
      <ConversionCard />
    </>
  )
}
