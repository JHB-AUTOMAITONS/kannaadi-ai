import { Marquee } from '@/components/ui/Marquee'

const TERMS = [
  'AI virtual try on',
  'Virtual fitting room',
  'AI looks',
  'Upload a dress',
  'Scan a dress',
  'Kiosk experience',
  'Lucky draw',
  'Jewellery try-on',
  'Eyewear try-on',
  'Real-time fitting',
]

/** A dark band under the light hero: the product vocabulary, moving. Decorative, so hidden from assistive tech. */
export function ValueMarquee() {
  const star = (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0 text-lumen">
      <path d="M10 0c.7 5.6 3.4 9.3 10 10-6.6.7-9.3 4.4-10 10C9.3 14.4 6.6 10.7 0 10 6.6 9.3 9.3 5.6 10 0Z" fill="currentColor" />
    </svg>
  )
  return (
    <section aria-label="What Kannaadi.Ai covers" className="theme-dark overflow-hidden bg-background py-5 text-foreground md:py-6">
      <Marquee
        items={TERMS.map((t) => (
          <>
            <span className="text-[1.35rem] font-medium tracking-[-0.03em] whitespace-nowrap md:text-[1.9rem]">{t}</span>
            {star}
          </>
        ))}
      />
    </section>
  )
}
