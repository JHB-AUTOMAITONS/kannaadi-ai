import { BusinessCard } from '@/components/sections/BusinessCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'
import { BUSINESSES } from '@/data/businesses'

/** The eight business categories as interactive cards. Used on the home page and the For Businesses hub. */
export function BusinessGrid({
  id = 'biz-title',
  eyebrow = 'For businesses',
  title,
  lede,
  detailed = false,
  showAllLink = true,
  headingLevel = 'h2',
  compactMobile = true,
}: {
  id?: string
  eyebrow?: string
  title?: React.ReactNode
  lede?: React.ReactNode
  detailed?: boolean
  showAllLink?: boolean
  headingLevel?: 'h2' | 'h3'
  /** Two columns of image-led cards on phones (home); the hub keeps full cards */
  compactMobile?: boolean
}) {
  return (
    <section className="theme-sand bg-background py-14 md:py-20" aria-labelledby={id}>
      <div className="container-x flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id={id}
            level={headingLevel}
            eyebrow={eyebrow}
            title={
              title ?? (
                <>
                  Built for how each kind of store <span className="accent-serif">sells.</span>
                </>
              )
            }
            lede={lede ?? 'Eight business types, each with its own try-on experience. Hover or touch a card to see its AI layer.'}
          />
          {showAllLink && (
            <div data-reveal="" className="shrink-0">
              <Link002 href="/for-businesses/" className="text-[1rem] font-medium">
                All business types
              </Link002>
            </div>
          )}
        </div>
        <ul data-reveal-stagger="" className={compactMobile ? 'grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4 xl:grid-cols-4' : 'grid grid-cols-1 gap-3 min-[560px]:grid-cols-2 md:gap-4 xl:grid-cols-4'}>
          {BUSINESSES.map((b, i) => (
            <li key={b.slug} data-reveal="" className="flex">
              <BusinessCard b={b} index={i} detailed={detailed} compact={compactMobile} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
