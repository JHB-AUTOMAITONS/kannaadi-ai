import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { PageHero } from '@/components/sections/PageHero'
import { ProductPageMock } from '@/components/sections/ProductPageMock'
import { Cta } from '@/components/ui/Cta'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'
import { faqFor } from '@/data/faqs'

const CASES = [
  {
    n: '01',
    title: 'Online fashion shopping',
    body: 'Shoppers cannot touch or try a garment online, so they rely on product photos and a model who does not look like them. Virtual try on for ecommerce puts the piece on the shopper instead.',
    points: ['A preview on the person browsing', 'Colour and silhouette in context', 'Works alongside your existing product pages'],
  },
  {
    n: '02',
    title: 'Customer confidence',
    body: 'A buying decision is easier when the customer has seen the look on themselves. Try-on gives them something more personal to base the choice on.',
    points: ['Fewer "will it suit me?" unknowns', 'A clearer picture before checkout', 'A friendlier way to compare options'],
  },
  {
    n: '03',
    title: 'Product discovery',
    body: 'AI Looks turns one piece into outfit ideas, so shoppers find pieces they would not have searched for — and your catalogue works harder.',
    points: ['Outfit suggestions around a chosen piece', 'Exploration beyond the first click', 'A natural route into the wider range'],
  },
  {
    n: '04',
    title: 'Engagement',
    body: 'Try-on is interactive by nature. Add share-ready moments and rewards like the lucky draw, and a browse becomes an experience people remember.',
    points: ['Interactive, playful moments', 'Share-ready looks', 'Campaign mechanics for launches and sales'],
  },
  {
    n: '05',
    title: 'Conversion',
    body: 'The aim of all of it is a more confident purchase. We do not promise numbers — results depend on your products, traffic and journey — but we do build the experience to help shoppers get to a decision.',
    points: ['Try-on placed where the decision happens', 'Clear route from try-on to purchase', 'Measured against your own goals'],
  },
  {
    n: '06',
    title: 'Digital fashion experience',
    body: 'Beyond the product page, a digital fashion experience can live on a kiosk or at an event — one consistent try-on across every place a customer meets your brand.',
    points: ['Online, in store and at events', 'One brand experience across channels', 'Shaped to your visual identity'],
  },
]

const OUTSIDE = [
  { to: '/for-businesses/shopping-malls/', title: 'In store', body: 'A virtual fitting room kiosk on the floor.' },
  { to: '/for-businesses/events-exhibitions/', title: 'At events', body: 'Live try-on for activations and launches.' },
  { to: '/for-businesses/', title: 'By business type', body: 'Eight categories, each with its own experience.' },
]

/** /use-cases/ — primary intent: "virtual try on for ecommerce". No statistics, no unsupported claims. */
export default function UseCases() {
  return (
    <>
      <PageHero
        path="/use-cases/"
        eyebrow="Use cases"
        title={
          <>
            Virtual try on for ecommerce: where it <span className="accent-serif">earns its place.</span>
          </>
        }
        intro="Virtual try on for ecommerce works best where shoppers hesitate: choosing a colour, judging a silhouette, imagining a piece on themselves. Here is how Kannaadi.Ai helps at each of those moments — practically, without hype."
        actions={
          <>
            <Cta to="/book-a-demo/" size="lg" magnetic>
              Book a Demo
            </Cta>
            <Cta to="/features/" size="lg" variant="secondary">
              Explore Features
            </Cta>
          </>
        }
        visual={<ProductPageMock />}
      />

      <section className="section border-t border-border" aria-labelledby="cases-title">
        <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              id="cases-title"
              eyebrow="Six practical use cases"
              title={
                <>
                  From first look to <span className="accent-serif">final decision.</span>
                </>
              }
              lede="An AI shopping experience is only useful if it fits real moments in the customer journey. These are the ones we build for."
            />
          </div>
          <ol data-reveal-stagger="" className="border-t border-border">
            {CASES.map((c) => (
              <li key={c.n} data-reveal="" className="group grid gap-x-6 gap-y-3 border-b border-border py-7 md:grid-cols-[3.5rem_1fr]">
                <span className="font-mono text-sm tracking-widest text-muted-foreground">{c.n}</span>
                <div className="flex flex-col gap-3">
                  <h3 className="t-2 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">{c.title}</h3>
                  <p className="max-w-[56ch] text-[1.02rem] leading-relaxed text-muted-foreground">{c.body}</p>
                  <ul className="mt-1 grid gap-1.5 text-[0.95rem]">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <span aria-hidden="true" className="mt-[0.55em] size-1.5 shrink-0 rounded-[2px] bg-foreground" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="theme-dark grain relative isolate overflow-hidden bg-background py-14 text-foreground md:py-20" aria-labelledby="beyond-title">
        <div className="container-x flex flex-col gap-10">
          <SectionHeading
            id="beyond-title"
            eyebrow="Beyond the website"
            title={
              <>
                The same try-on, <span className="accent-serif">everywhere.</span>
              </>
            }
            lede="Ecommerce is where many retailers start. The same ecommerce fashion technology can then move into stores and events."
          />
          <ul data-reveal-stagger="" className="grid gap-3 md:grid-cols-3 md:gap-4">
            {OUTSIDE.map((o) => (
              <li key={o.to} data-reveal="" className="rounded-3xl border border-border bg-card p-6">
                <h3 className="t-3">{o.title}</h3>
                <p className="mt-2 text-[0.98rem] text-muted-foreground">{o.body}</p>
                <Link002 href={o.to} className="mt-5 w-fit text-[0.95rem] font-medium text-lumen">
                  Learn more
                </Link002>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqSection faqs={faqFor('/use-cases/')} title="Virtual try on for ecommerce, answered" />
      <ConversionCard />
    </>
  )
}
