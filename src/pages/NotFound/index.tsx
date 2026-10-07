import { Cta } from '@/components/ui/Cta'
import { Eyebrow } from '@/components/ui/SectionHeading'
import { Link000 } from '@/components/ui/skiper-ui/skiper40'
import { BUSINESSES } from '@/data/businesses'

/** Unknown URLs. Served with noindex (see SiteLayout / prerender). */
export default function NotFound() {
  return (
    <section data-hero="light" className="section">
      <div className="container-x flex flex-col items-start gap-6">
        <Eyebrow>404</Eyebrow>
        <h1 className="t-display max-w-[14ch]">
          That page isn’t in the <span className="accent-serif">mirror.</span>
        </h1>
        <p className="lede">The page you were looking for doesn’t exist or has moved. Try one of these instead.</p>
        <div className="flex flex-wrap gap-3">
          <Cta to="/" size="lg">
            Back to home
          </Cta>
          <Cta to="/features/" size="lg" variant="secondary">
            Explore Features
          </Cta>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.98rem]">
          {BUSINESSES.map((b) => (
            <li key={b.slug}>
              <Link000 href={b.path}>{b.name}</Link000>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
