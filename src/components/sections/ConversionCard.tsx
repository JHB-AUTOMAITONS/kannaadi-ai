import type { ReactNode } from 'react'
import { Cta } from '@/components/ui/Cta'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

/**
 * Closing call to action: a dark card inset into the page, so light → dark is a designed
 * transition rather than a hard stripe. Used on the home page and every industry page.
 */
export function ConversionCard({
  title = (
    <>
      See virtual try on with <span className="accent-serif">your</span> products.
    </>
  ),
  body = 'Book a demo and we will walk through the experience with pieces like yours — online, in store or at an event.',
  secondary = { to: '/contact/', label: 'Contact us' },
  className,
}: {
  title?: ReactNode
  body?: ReactNode
  secondary?: { to: string; label: string } | null
  className?: string
}) {
  return (
    <section className={cn('section-sm md:section', className)} aria-labelledby="cta-title">
      <div className="container-x">
        <div
          data-reveal=""
          className="theme-dark grain relative isolate overflow-hidden rounded-[2rem] bg-background px-6 py-12 text-foreground md:rounded-[2.5rem] md:px-14 md:py-16 lg:px-20 lg:py-20"
        >
          <img
            src="/images/hero/hero-ai-1600.webp"
            alt=""
            aria-hidden="true"
            width={1600}
            height={867}
            loading="lazy"
            decoding="async"
            className="absolute inset-y-0 right-0 -z-10 h-full w-[170%] max-w-none object-cover object-[74%_50%] opacity-60 md:w-[78%] md:opacity-90"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0d0d0c_20%,rgb(13_13_12/0.72)_55%,transparent_100%)] max-md:bg-[linear-gradient(180deg,rgb(13_13_12/0.55),#0d0d0c_85%)]" />
          <div className="flex max-w-[40rem] flex-col gap-6">
            <Eyebrow>Book a demo</Eyebrow>
            <h2 id="cta-title" className="t-1">
              {title}
            </h2>
            <p className="lede">{body}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Cta to="/book-a-demo/" size="lg" magnetic>
                Book a Demo
              </Cta>
              {secondary && (
                <Cta to={secondary.to} size="lg" variant="secondary">
                  {secondary.label}
                </Cta>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
