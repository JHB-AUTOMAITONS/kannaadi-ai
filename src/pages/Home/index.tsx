import { AiTechnology } from '@/components/sections/AiTechnology'
import { BusinessGrid } from '@/components/sections/BusinessGrid'
import { ConversionCard } from '@/components/sections/ConversionCard'
import { FaqSection } from '@/components/sections/FaqSection'
import { FeatureBento } from '@/components/sections/FeatureBento'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { TryOnShowcase } from '@/components/sections/TryOnShowcase'
import { UseCasesTeaser } from '@/components/sections/UseCasesTeaser'
import { ValueMarquee } from '@/components/sections/ValueMarquee'
import { WhatWeDo } from '@/components/sections/WhatWeDo'
import { HomeHero } from '@/components/hero/HomeHero'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'
import { faqFor } from '@/data/faqs'

/** Who each kind of fashion retailer can use Kannaadi.Ai for (text only; the cards above carry the imagery). */
const WHO = [
  { title: 'Clothing showrooms', body: 'Let customers screen pieces on a kiosk before they ask staff to bring more out.', to: '/for-businesses/fashion-stores/', link: 'Virtual try on for fashion stores' },
  { title: 'Fashion boutiques', body: 'Extend a curated collection with a digital fitting room that supports your styling advice.', to: '/for-businesses/boutiques/', link: 'Virtual try on for boutiques' },
  { title: 'Saree shops', body: 'Show colour, border and pallu on the shopper before a saree is unfolded.', to: '/for-businesses/saree-ethnic-stores/', link: 'Virtual try on saree' },
  { title: 'Men’s wear stores', body: 'Let customers compare colours and styles across your range before trying pieces on. Which categories to launch with is agreed in a demo.', to: '/features/#ai-virtual-try-on', link: 'AI virtual try-on' },
  { title: 'Women’s fashion stores', body: 'Help shoppers explore looks and combinations with AI Looks, from everyday wear to occasion wear.', to: '/features/#ai-outfit-generator', link: 'AI Looks' },
  { title: 'Multi-brand fashion retailers', body: 'Run one consistent try-on experience across brands and floors, in a single store or as a shared experience in a mall.', to: '/for-businesses/shopping-malls/', link: 'Virtual fitting room in store' },
]

function WhoCanUse() {
  return (
    <ul data-reveal-stagger="" className="grid gap-x-8 border-t border-border md:grid-cols-3">
      {WHO.map((w) => (
        <li key={w.title} data-reveal="" className="flex flex-col gap-3 border-b border-border py-6">
          <h3 className="t-3">{w.title}</h3>
          <p className="max-w-[40ch] text-[0.98rem] leading-relaxed text-muted-foreground">{w.body}</p>
          <Link002 href={w.to} className="mt-auto w-fit pt-1 text-[0.95rem] font-medium">
            {w.link}
          </Link002>
        </li>
      ))}
    </ul>
  )
}

/**
 * / — primary intent: "AI virtual try on". Section order follows the homepage brief:
 * hero → how it works → how it helps retailers → features → benefits → who can use it → why choose →
 * experience (showcase) → FAQ → final CTA. Each section reuses its existing component, imagery and styling.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <ValueMarquee />
      <HowItWorks />
      <WhatWeDo />
      <FeatureBento />
      <AiTechnology />
      <BusinessGrid
        title={
          <>
            Who can use <span className="accent-serif">Kannaadi.Ai?</span>
          </>
        }
        lede="Eight business types, each with its own try-on experience. Hover or touch a card to see its AI layer."
        footer={<WhoCanUse />}
      />
      <UseCasesTeaser />
      <TryOnShowcase />
      <FaqSection faqs={faqFor('/')} title="Frequently Asked Questions About AI Virtual Try On" />
      <ConversionCard
        title={
          <>
            Bring <span className="accent-serif">AI Virtual Try On</span> to Your Fashion Store
          </>
        }
        body="Book a demo to see AI virtual try on working with pieces like yours: at the rail, on your showroom floor and in your kiosk. Tell us what you sell, and we will show the features that fit."
        secondary={{ to: '/contact/', label: 'Contact Our Team' }}
      />
    </>
  )
}
