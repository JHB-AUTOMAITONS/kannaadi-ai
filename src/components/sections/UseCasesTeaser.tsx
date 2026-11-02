import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'

const ITEMS = [
  {
    n: '01',
    title: 'Designed for physical fashion retail',
    body: 'Built around the shop floor: a walk-up kiosk, scanning at the rail and a flow that suits a busy showroom.',
    to: '/for-businesses/fashion-stores/',
    link: 'Virtual try on for fashion stores',
  },
  {
    n: '02',
    title: 'AI-powered virtual try-on',
    body: 'Garments appear on the shopper, not a model, so the preview is about the person in front of the screen.',
    to: '/features/#ai-virtual-try-on',
    link: 'AI virtual try-on',
  },
  {
    n: '03',
    title: 'An interactive, kiosk-based workflow',
    body: 'A self-guided, walk-up experience that can be branded to your store or campaign.',
    to: '/features/#kiosk-experience',
    link: 'Kiosk experience',
  },
  {
    n: '04',
    title: 'Easy for customers to use',
    body: 'A simple on-screen guide and a tap to switch colours and looks keep it easy for first-time users.',
    to: '/for-businesses/shopping-malls/',
    link: 'Virtual fitting room in store',
  },
  {
    n: '05',
    title: 'Focused on fashion retail',
    body: 'Clothing and ethnic wear, plus jewellery and eyewear try-on and AI Looks for outfit ideas.',
    to: '/features/',
    link: 'All features',
  },
  {
    n: '06',
    title: 'Set up around your range',
    body: 'It starts from the pieces you sell, not a generic demo. Scope and rollout are agreed with you in a demo.',
    to: '/book-a-demo/',
    link: 'Book a demo',
  },
]

export function UseCasesTeaser() {
  return (
    <section className="section" aria-labelledby="uc-title">
      <div className="container-x flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="uc-title"
            eyebrow="Why Kannaadi.Ai"
            title={
              <>
                Why Choose <span className="accent-serif">Kannaadi.Ai?</span>
              </>
            }
            lede="Practical virtual try on software for fashion retail businesses: focused on the shop floor, simple for customers and shaped around your range."
          />
          <div data-reveal="" className="shrink-0">
            <Link002 href="/use-cases/" className="text-[1rem] font-medium">
              All use cases
            </Link002>
          </div>
        </div>
        <ul data-reveal-stagger="" className="grid gap-x-8 gap-y-0 border-t border-border md:grid-cols-3">
          {ITEMS.map((it) => (
            <li key={it.n} data-reveal="" className="group flex flex-col gap-4 border-b border-border py-7 md:py-8">
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
