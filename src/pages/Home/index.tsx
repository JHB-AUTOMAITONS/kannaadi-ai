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
import { faqFor } from '@/data/faqs'

/** / — primary intent: "virtual try on". */
export default function Home() {
  return (
    <>
      <HomeHero />
      <ValueMarquee />
      <WhatWeDo />
      <TryOnShowcase />
      <AiTechnology />
      <FeatureBento />
      <BusinessGrid />
      <HowItWorks />
      <UseCasesTeaser />
      <FaqSection faqs={faqFor('/')} title="Virtual try on, answered" />
      <ConversionCard />
    </>
  )
}
