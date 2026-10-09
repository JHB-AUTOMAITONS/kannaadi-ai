import type { ReactNode } from 'react'
import { Cta } from '@/components/ui/Cta'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { cn } from '@/lib/utils'

/**
 * Closing call to action: a dark card inset into the page, so light → dark is a designed
 * transition rather than a hard stripe. Used on the home page and every industry page.
 *
 * The model is a transparent cut-out in her natural colours (built by `npm run photos:cta`): no filter, blend
 * mode or overlay touches her. Warm light sits behind her so dark hair keeps its outline against the charcoal.
 * She is anchored flush to the card's right and bottom edges (the cut-out runs off both), so the crop reads as
 * the frame rather than a seam; the text column is capped so the two never overlap.
 */
const MODEL = {
  src: '/images/models/cta/saree-cutout-1024.webp',
  srcSet: [512, 768, 1024].map((w) => `/images/models/cta/saree-cutout-${w}.webp ${w}w`).join(', '),
  width: 1024,
  height: 1664,
}

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
          className="theme-dark grain relative isolate overflow-hidden rounded-[2rem] bg-background px-6 pb-0 pt-12 text-foreground md:min-h-[34rem] md:rounded-[2.5rem] md:px-14 md:py-16 lg:px-20 lg:py-20 xl:min-h-[36rem]"
        >
          {/* Warm studio light: behind her head on phones (she sits below the copy), behind her on wider cards. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(75%_34%_at_62%_80%,rgb(246_192_108/0.58),rgb(176_112_46/0.24)_55%,transparent_100%)] md:bg-[radial-gradient(34%_92%_at_81%_42%,rgb(246_192_108/0.58),rgb(176_112_46/0.26)_52%,transparent_100%)]"
          />
          <div className="relative z-10 flex max-w-[40rem] flex-col gap-6 md:max-w-[52%]">
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
          <div
            aria-hidden="true"
            className="pointer-events-none relative -mx-6 mt-8 h-[23rem] md:absolute md:inset-y-0 md:right-0 md:mx-0 md:mt-0 md:h-auto md:w-[46%] xl:w-[44%]"
          >
            <img
              src={MODEL.src}
              srcSet={MODEL.srcSet}
              sizes="(min-width: 1280px) 44vw, (min-width: 768px) 46vw, 100vw"
              alt=""
              width={MODEL.width}
              height={MODEL.height}
              loading="lazy"
              decoding="async"
              className="size-full max-w-none object-cover object-[62%_0%] [mask-image:linear-gradient(90deg,transparent,#000_16%)] md:object-[58%_0%]"
            />
            <p className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-3.5 py-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/90 backdrop-blur-md md:bottom-8 md:left-6">
              <span className="size-1.5 rounded-[2px] bg-lumen" />
              Virtual try-on preview
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
