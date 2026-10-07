import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'

const CHANNELS = [
  {
    n: '01',
    title: 'Online',
    body: 'Add virtual try on to your ecommerce experience so shoppers see pieces on themselves, not just on a model.',
    to: '/use-cases/',
    link: 'Virtual try on for ecommerce',
  },
  {
    n: '02',
    title: 'In store',
    body: 'Put a virtual fitting room on the shop floor — a walk-up kiosk that helps shoppers decide what is worth trying on.',
    to: '/for-businesses/shopping-malls/',
    link: 'Virtual fitting room in store',
  },
  {
    n: '03',
    title: 'At events',
    body: 'Build brand activations around a live try-on and a lucky-draw moment people want to take part in.',
    to: '/for-businesses/events-exhibitions/',
    link: 'Brand activation marketing',
  },
]

export function WhatWeDo() {
  return (
    <section className="section" aria-labelledby="what-title">
      <div className="container-x grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="what-title"
            eyebrow="What Kannaadi.Ai does"
            title={
              <>
                A mirror for every place <span className="accent-serif">fashion</span> is sold.
              </>
            }
            lede="Kannaadi means mirror. We build the AI behind one — so fashion and retail businesses can offer virtual try on wherever a customer meets a collection."
          />
          <p data-reveal="" className="mt-6 max-w-[52ch] text-[1rem] leading-relaxed text-muted-foreground">
            One technology, three places to use it. Customers get a consistent experience; your team gets a try-on layer that
            works with the pieces you actually sell, from clothing and ethnic wear to jewellery and eyewear.
          </p>
        </div>

        <ol data-reveal-stagger="" className="border-t border-border">
          {CHANNELS.map((c) => (
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
