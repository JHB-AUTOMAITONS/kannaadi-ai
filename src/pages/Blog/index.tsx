import { Link, useLocation } from 'react-router'
import { PostCard } from '@/components/blog/PostCard'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { Cta } from '@/components/ui/Cta'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { PAGE_SIZE, POSTS, listingPath, pageCount } from '@/content/blog'
import { normalizePath } from '@/data/pages'

/** /blog and /blog/page/N — newest article featured, the rest in a grid; paginated once there are more than PAGE_SIZE. */
export default function Blog() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const page = Number(path.match(/^\/blog\/page\/(\d+)$/)?.[1] ?? 1)
  const pages = pageCount()
  const slice = POSTS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const featured = page === 1 ? slice[0] : undefined
  const cards = page === 1 ? slice.slice(1) : slice

  return (
    <>
      <section data-hero="light" className="relative overflow-hidden bg-background">
        <div className="container-x flex flex-col gap-6 pt-6 pb-10 md:pt-8 md:pb-14">
          <Breadcrumbs path={path} />
          <Eyebrow>The Kannaadi.Ai blog</Eyebrow>
          <h1 className="t-display max-w-[16ch] text-[clamp(2.4rem,1.2rem+5vw,5.2rem)]">
            Guides for fashion <span className="accent-serif">retail.</span>
          </h1>
          <p className="lede">
            Practical guides on virtual try on, AI fashion technology and the shopping experience, written for fashion retailers, boutique owners
            and ecommerce teams.
          </p>
        </div>
      </section>

      <section className="section-sm md:section border-t border-border" aria-label="Articles">
        <div className="container-x flex flex-col gap-6 md:gap-8">
          {POSTS.length === 0 ? (
            <div className="flex flex-col items-start gap-5 rounded-3xl border border-dashed border-border p-8 md:p-12">
              <h2 className="t-2">No articles yet.</h2>
              <p className="lede">We are preparing our first guides. In the meantime, see what Kannaadi.Ai does.</p>
              <Cta to="/features/" size="lg">
                Explore Features
              </Cta>
            </div>
          ) : (
            <>
              {featured && <PostCard post={featured} featured />}
              {cards.length > 0 && (
                <div data-reveal-stagger="" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
                  {cards.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              )}
              {pages > 1 && (
                <nav aria-label="Blog pages" className="flex flex-wrap items-center gap-2 pt-4">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <Link
                      key={n}
                      to={listingPath(n)}
                      aria-current={n === page ? 'page' : undefined}
                      className={
                        'inline-flex size-10 items-center justify-center rounded-full border border-border text-sm font-medium ' +
                        (n === page ? 'bg-lumen text-ink' : 'hover:bg-foreground hover:text-background')
                      }
                    >
                      {n}
                    </Link>
                  ))}
                </nav>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
