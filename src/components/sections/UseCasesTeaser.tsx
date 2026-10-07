import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'

const ITEMS = [
  {
    n: '01',
    title: 'Online fashion shopping',
    body: 'Replace a flat product photo with a preview on the shopper, so the choice feels more certain.',
    to: '/use-cases/',
    link: 'Virtual try on for ecommerce',
  },
  {
    n: '02',
    title: 'In-store fitting rooms',
    body: 'A kiosk on the floor that narrows the rail down to the pieces worth trying on.',
    to: '/for-businesses/fashion-stores/',
    link: 'Virtual try on for fashion stores',
  },
  {
    n: '03',
    title: 'Brand activations',
    body: 'A live try-on and a lucky draw give visitors something to do at a stand, not just see.',
    to: '/for-businesses/events-exhibitions/',
    link: 'Brand activation marketing',
  },
]

export function UseCasesTeaser() {
  return (
    <section className="section" aria-labelledby="uc-title">
      <div className="container-x flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="uc-title"
            eyebrow="Use cases"
            title={
              <>
                Where virtual try on <span className="accent-serif">earns its place.</span>
              </>
            }
          />
          <div data-reveal="" className="shrink-0">
            <Link002 href="/use-cases/" className="text-[1rem] font-medium">
              All use cases
            </Link002>
          </div>
        </div>
        <ul data-reveal-stagger="" className="grid gap-x-8 gap-y-0 border-t border-border md:grid-cols-3">
          {ITEMS.map((it) => (
            <li key={it.n} data-reveal="" className="group flex flex-col gap-4 border-b border-border py-7 md:border-b-0 md:py-8">
              <span className="font-mono text-sm tracking-widest text-muted-foreground">{it.n}</span>
              <h3 className="t-2 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5">{it.title}</h3>
              <p className="max-w-[34ch] text-[1rem] leading-relaxed text-muted-foreground">{it.body}</p>
              <Link002 href={it.to} className="mt-1 w-fit text-[0.95rem] font-medium">
                {it.link}
              </Link002>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
