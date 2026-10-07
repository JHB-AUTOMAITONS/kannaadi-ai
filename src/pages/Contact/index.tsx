import { LeadForm } from '@/components/forms/LeadForm'
import { Cta } from '@/components/ui/Cta'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Link000, Link002 } from '@/components/ui/skiper-ui/skiper40'
import { BUSINESSES } from '@/data/businesses'
import { SITE } from '@/data/site'

const INCLUDE = ['What you sell and where (store, online, events)', 'The experience you have in mind — try-on, kiosk, activation', 'Any timeline or launch date you are working to']

/** /contact/ — primary intent: "virtual try on company". Only real contact details are shown. */
export default function Contact() {
  return (
    <section data-hero="light" className="relative isolate overflow-hidden">
      <div className="container-x grid items-start gap-10 pt-6 pb-14 md:pt-8 md:pb-20 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col gap-6 lg:pt-6">
          <Breadcrumbs path="/contact/" />
          <Eyebrow>Contact</Eyebrow>
          <h1 className="t-display max-w-[15ch] text-[clamp(2.4rem,1.2rem+5vw,5.2rem)]">
            Contact a virtual try on company built for <span className="accent-serif">fashion.</span>
          </h1>
          <p className="lede">
            Kannaadi.Ai is a virtual try on company and AI fashion company working with fashion and retail businesses. Tell us about your
            project — a store, an online catalogue, an event — and we will point you in the right direction.
          </p>

          <div className="mt-2 rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="t-2 mb-1">Send a message</h2>
            <p className="mb-6 text-[0.95rem] text-muted-foreground">We’ll reply to the address you give us.</p>
            <LeadForm kind="contact" />
          </div>
        </div>

        <aside className="flex flex-col gap-4 lg:pt-6" aria-label="Other ways to reach us">
          <div data-reveal="" className="theme-dark grain relative overflow-hidden rounded-3xl bg-background p-6 text-foreground md:p-8">
            <p className="eyebrow">Prefer a walkthrough?</p>
            <h2 className="t-2 mt-3">Book a demo instead.</h2>
            <p className="mt-3 text-[0.98rem] text-muted-foreground">
              A demo shows the virtual fitting room working with products like yours — the quickest way to see if it fits.
            </p>
            <div className="mt-6">
              <Cta to="/book-a-demo/" magnetic>
                Book a Demo
              </Cta>
            </div>
          </div>

          <div data-reveal="" className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="t-3">Helpful to include</h2>
            <ul className="mt-4 grid gap-2.5 text-[0.98rem]">
              {INCLUDE.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-[2px] bg-foreground" />
                  {t}
                </li>
              ))}
            </ul>
            {SITE.contactEmail && (
              <p className="mt-6 text-[0.98rem]">
                Or email{' '}
                <Link002 href={`mailto:${SITE.contactEmail}`} className="font-medium">
                  {SITE.contactEmail}
                </Link002>
              </p>
            )}
          </div>

          <div data-reveal="" className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="t-3">Looking for your business type?</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {BUSINESSES.map((b) => (
                <li key={b.slug}>
                  <Link000 href={b.path} className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium transition-colors hover:bg-foreground hover:text-background">
                    {b.name}
                  </Link000>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">
              Curious who we are?{' '}
              <Link000 href="/about/" className="font-medium text-foreground">
                Read about Kannaadi.Ai
              </Link000>
              .
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}
