import { heroPair } from '@/lib/images'
import { Cta } from '@/components/ui/Cta'
import { SectionHeading } from '@/components/ui/SectionHeading'

const LAYERS = [
  { n: '01', title: 'Catalogue-aware', body: 'It starts from the pieces you actually sell — garments, jewellery or frames — not a generic demo.' },
  { n: '02', title: 'Shopper-first', body: 'The piece appears on the person looking at the screen, so the preview is about them.' },
  { n: '03', title: 'Look-building', body: 'AI Looks turns a single piece into outfit ideas and keeps the visit going.' },
  { n: '04', title: 'Always responsive', body: 'Real-time fitting is built to feel like a mirror, not a render queue.' },
]

/** Dark band that continues the showcase, using the same AI-scan world the hero reveals. */
const AI_BG = (() => {
  const ai = [...heroPair().scan].sort((a, b) => a.width - b.width).filter((a) => a.width <= 1600)
  return { src: ai[ai.length - 1].src, srcSet: ai.map((a) => `${a.src} ${a.width}w`).join(', ') }
})()

export function AiTechnology() {
  return (
    <section className="theme-dark relative isolate overflow-hidden border-t border-border bg-background text-foreground" aria-labelledby="tech-title">
      <img
        src={AI_BG.src}
            srcSet={AI_BG.srcSet}
            sizes="100vw"
        alt=""
        aria-hidden="true"
        width={1600}
        height={867}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[80%_50%] opacity-50 max-md:object-[86%_50%]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0d0d0c_30%,rgb(13_13_12/0.78)_60%,rgb(13_13_12/0.25)_100%)] max-md:bg-[linear-gradient(180deg,#0d0d0c_40%,rgb(13_13_12/0.8))]" />
      <div className="container-x section grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-7">
          <SectionHeading
            id="tech-title"
            eyebrow="AI fashion technology"
            title={
              <>
                AI fashion technology that <span className="accent-serif">stays out of the way.</span>
              </>
            }
            lede="Shoppers should notice the look, not the technology. Kannaadi.Ai keeps the AI behind the glass — fast, visual and built around fashion."
          />
          <div data-reveal="">
            <Cta to="/features/" size="lg">
              Explore AI fashion tools
            </Cta>
          </div>
        </div>
        <ol data-reveal-stagger="" className="border-t border-border">
          {LAYERS.map((l) => (
            <li key={l.n} data-reveal="" className="group grid grid-cols-[3rem_1fr] gap-4 border-b border-border py-5 transition-colors duration-300 hover:bg-foreground/[0.03]">
              <span className="pt-1 font-mono text-sm tracking-widest text-lumen">{l.n}</span>
              <div>
                <h3 className="t-3">{l.title}</h3>
                <p className="mt-1.5 max-w-[46ch] text-[0.98rem] leading-relaxed text-muted-foreground">{l.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
