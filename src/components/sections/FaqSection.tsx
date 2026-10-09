import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { Faq } from '@/data/businesses'
import { cn } from '@/lib/utils'

/** FAQ block. The same Q&A feeds the FAQPage JSON-LD (lib/seo.ts), so markup always matches the page. */
export function FaqSection({ faqs, title = 'Questions, answered', eyebrow = 'FAQ', className }: { faqs: Faq[]; title?: string; eyebrow?: string; className?: string }) {
  if (!faqs.length) return null
  return (
    <section className={cn('section-sm md:section', className)} aria-labelledby="faq-title">
      <div className="container-x grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading id="faq-title" eyebrow={eyebrow} title={title} size="2" />
        <Accordion hiddenUntilFound className="border-t border-border" data-reveal="">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-b border-border">
              <AccordionTrigger className="rounded-none border-0 py-5 text-left text-[1.08rem] leading-snug font-medium tracking-tight hover:no-underline focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-offset-2">
                {f.q}
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[60ch] pb-2 text-[1rem] leading-relaxed text-muted-foreground">{f.a}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
