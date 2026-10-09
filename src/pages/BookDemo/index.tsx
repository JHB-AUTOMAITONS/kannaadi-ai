import { LeadForm } from '@/components/forms/LeadForm'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { FaqSection } from '@/components/sections/FaqSection'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { faqFor } from '@/data/faqs'

const STEPS = [
  { n: '01', title: 'We learn how you sell', body: 'A short conversation about your products, channels and goals.' },
  { n: '02', title: 'You see it live', body: 'The virtual try on software running with pieces like yours — try-on, AI Looks, kiosk and more.' },
  { n: '03', title: 'We map what fits', body: 'Which features, which channels, and what a rollout would involve for your business.' },
]

/** /book-a-demo/ — primary intent: "virtual try on software". The conversion page. */
export default function BookDemo() {
  return (
    <>
      <section data-hero="dark" className="theme-dark grain relative isolate overflow-hidden bg-background text-foreground">
        {/* Phones: intro → form → steps, so the action is never buried. Desktop: copy left, sticky form right. */}
        <div className="container-x grid items-start gap-x-16 gap-y-8 pt-6 pb-12 md:pt-8 md:pb-16 lg:grid-cols-[1fr_0.95fr] lg:pb-20">
          <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-1 lg:pt-6">
            <Breadcrumbs path="/book-a-demo/" />
            <Eyebrow>Book a demo</Eyebrow>
            <h1 className="t-display max-w-[16ch] text-[clamp(2.4rem,1.2rem+5vw,5.2rem)]">
              See our virtual try on software in <span className="accent-serif">action.</span>
            </h1>
            <p className="lede">
              Book a demo of Kannaadi.Ai’s virtual try on software. This fashion technology demo walks through our AI fashion software —
              virtual fitting room software for web, kiosks and events — using products like yours.
            </p>
          </div>

          <div className="theme-light rounded-[2rem] border border-foreground/10 bg-card p-6 shadow-[0_40px_90px_-40px_rgb(0_0_0/0.7)] md:p-9 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <h2 className="t-2 mb-1">Request a demo</h2>
            <p className="mb-6 text-[0.95rem] text-muted-foreground">A few details so we can prepare something relevant.</p>
            <LeadForm kind="demo" />
          </div>

          <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2">
            <ol className="border-t border-border">
              {STEPS.map((s) => (
                <li key={s.n} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-border py-4">
                  <span className="pt-0.5 font-mono text-sm tracking-widest text-lumen">{s.n}</span>
                  <div>
                    <h2 className="t-3">{s.title}</h2>
                    <p className="mt-1 max-w-[46ch] text-[0.95rem] text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-[0.95rem] text-muted-foreground">
              Want to look around first? Explore the{' '}
              <Link000 href="/features/" className="font-medium text-foreground">
                features
              </Link000>{' '}
              or browse by{' '}
              <Link000 href="/for-businesses/" className="font-medium text-foreground">
                business type
              </Link000>
              .
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqFor('/book-a-demo/')} title="Before you book" />
    </>
  )
}
