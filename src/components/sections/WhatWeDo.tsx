import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'

const BENEFITS = [
  {
    n: '01',
    title: 'Modernise your showroom',
    body: 'Add an interactive virtual try on layer to a traditional clothing showroom without changing how your team sells.',
    to: '/for-businesses/fashion-stores/',
    link: 'Virtual try on for fashion stores',
  },
  {
    n: '02',
    title: 'Improve in-store engagement',
    body: 'A walk-up kiosk gives customers something to do on the floor, so browsing becomes participation.',
    to: '/for-businesses/shopping-malls/',
    link: 'Virtual fitting room in store',
  },
  {
    n: '03',
    title: 'Create an interactive shopping experience',
    body: 'Shoppers switch colours and looks on themselves, scan pieces from the rail and explore outfit ideas with AI Looks.',
    to: '/features/',
    link: 'AI virtual try-on features',
  },
  {
    n: '04',
    title: 'Stand out from competitors',
    body: 'A distinctive try-on experience gives customers a reason to choose, and remember, your store over a similar one nearby.',
    to: '/for-businesses/boutiques/',
    link: 'Virtual try on for boutiques',
  },
  {
    n: '05',
    title: 'Bring smart technology into physical retail',
    body: 'Introduce AI to the shop floor in a focused way: start with one range or category, then expand once you see how customers respond.',
    to: '/use-cases/',
    link: 'See the use cases',
  },
]

export function WhatWeDo() {
  return (
    <section className="section" aria-labelledby="what-title">
      <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="what-title"
            eyebrow="For store owners"
            title={
              <>
                How Kannaadi.Ai Helps Fashion <span className="accent-serif">Retail</span> Businesses
              </>
            }
            lede="Kannaadi means mirror. Kannaadi.Ai gives physical fashion retailers a way to let customers see an outfit on themselves, right inside the store."
          />
          <p data-reveal="" className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-muted-foreground">
            It is built for store owners and decision-makers who want to bring smart technology into a showroom, working with the
            pieces you actually sell, from clothing and ethnic wear to jewellery and eyewear.
          </p>
        </div>

        <ol data-reveal-stagger="" className="border-t border-border">
          {BENEFITS.map((c) => (
            <li key={c.n} data-reveal="" className="group grid gap-x-6 gap-y-3 border-b border-border py-7 md:grid-cols-[4rem_1fr] md:py-9">
              <span className="font-mono text-sm tracking-widest text-muted-foreground">{c.n}</span>
              <div className="flex flex-col gap-3">
                <h3 className="t-2 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">{c.title}</h3>
                <p className="max-w-[48ch] text-[1.02rem] leading-relaxed text-muted-foreground">{c.body}</p>
                <Link002 href={c.to} className="mt-1 w-fit text-[0.95rem] font-medium">
                  {c.link}
                </Link002>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
