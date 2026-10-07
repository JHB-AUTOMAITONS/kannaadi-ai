import { useRef, type ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowUpRight, Gift, Glasses, Gem, MonitorSmartphone, ScanLine, Shirt, Sparkles, Upload } from 'lucide-react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link002 } from '@/components/ui/skiper-ui/skiper40'
import { useParallax } from '@/hooks/use-parallax'
import { cn } from '@/lib/utils'

const PARALLAX: [number, number] = [-18, 18]

function Tile({
  to,
  className,
  children,
}: {
  to: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      to={to}
      data-reveal=""
      className={cn(
        'group/tile relative flex min-h-[15rem] flex-col justify-between gap-6 overflow-hidden rounded-3xl border border-border p-6 transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_26px_50px_-30px_rgb(13_13_12/0.6)] focus-visible:-translate-y-1',
        className,
      )}
    >
      {children}
      <span className="absolute top-5 right-5 grid size-9 place-items-center rounded-full bg-foreground text-background transition-colors duration-300 group-hover/tile:bg-lumen group-hover/tile:text-ink">
        <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/tile:rotate-45" />
      </span>
    </Link>
  )
}

const Head = ({ icon: Icon, title, body, light }: { icon: typeof Shirt; title: string; body: string; light?: boolean }) => (
  <div className="relative z-10 flex max-w-[26rem] flex-col gap-3">
    <Icon aria-hidden="true" className={cn('size-6', light ? 'text-ink' : 'text-foreground')} />
    <h3 className="t-2">{title}</h3>
    <p className={cn('text-[0.98rem] leading-snug', light ? 'text-ink/75' : 'text-muted-foreground')}>{body}</p>
  </div>
)

export function FeatureBento() {
  const gown = useRef<HTMLImageElement>(null)
  useParallax(gown, PARALLAX)

  return (
    <section className="section" aria-labelledby="bento-title">
      <div className="container-x flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="bento-title"
            eyebrow="The product"
            title={
              <>
                Everything a try-on needs, in <span className="accent-serif">one</span> product.
              </>
            }
            lede="From the first look to the lucky draw, Kannaadi.Ai covers the whole experience — not just the mirror."
          />
          <div data-reveal="" className="shrink-0">
            <Link002 href="/features/" className="text-[1rem] font-medium">
              All features
            </Link002>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          {/* AI Virtual Try-On */}
          <Tile to="/features/#ai-virtual-try-on" className="bg-card max-md:min-h-[29rem] md:col-span-5 md:row-span-2 md:min-h-[34rem]">
            <Head icon={Shirt} title="AI Virtual Try-On" body="Garments shown on the shopper, not a model — colour, silhouette and style in context." />
            <img
              ref={gown}
              src="/images/showcase/gown-champagne.webp"
              alt="Champagne satin gown on a dress form"
              width={1100}
              height={1300}
              loading="lazy"
              decoding="async"
              className="pointer-events-none absolute right-[-8%] bottom-[-6%] w-[62%] max-w-[26rem] md:w-[78%] object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/tile:scale-[1.03]"
            />
          </Tile>

          {/* AI Looks */}
          <Tile to="/features/#ai-outfit-generator" className="bg-card md:col-span-7">
            <Head icon={Sparkles} title="AI Outfit Generator / AI Looks" body="Turn one piece into a look — and a reason to keep exploring." />
            <div className="relative z-10 flex gap-2.5">
              {(['ink', 'champagne', 'forest', 'claret'] as const).map((c, i) => (
                <div
                  key={c}
                  className="relative aspect-[3/4] flex-1 overflow-hidden rounded-xl border border-border bg-muted transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover/tile:-translate-y-1.5"
                  style={{ transitionDelay: `${i * 45}ms` }}
                >
                  <img src={`/images/showcase/gown-${c}.webp`} alt="" aria-hidden="true" width={1100} height={1300} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_35%] scale-125" />
                  <span className="absolute bottom-1.5 left-2 font-mono text-[0.68rem] tracking-[0.14em] text-ink/70 uppercase">Look 0{i + 1}</span>
                </div>
              ))}
            </div>
          </Tile>

          {/* Upload / Scan */}
          <Tile to="/features/#upload-a-dress" className="bg-secondary md:col-span-4">
            <Head icon={Upload} title="Upload or scan a dress" body="Bring a piece in from a photo — or scan it right off the rail." />
            <div className="relative z-10 flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.14em] uppercase">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/25 px-3 py-1.5">
                <Upload aria-hidden="true" className="size-3.5" /> Upload
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/25 px-3 py-1.5">
                <ScanLine aria-hidden="true" className="size-3.5" /> Scan
              </span>
            </div>
          </Tile>

          {/* Kiosk — dark tile */}
          <Tile to="/features/#kiosk-experience" className="theme-dark border-transparent bg-background text-foreground md:col-span-3">
            <Head icon={MonitorSmartphone} title="Kiosk experience" body="A walk-up fitting room for floors, malls and events." />
            <svg aria-hidden="true" viewBox="0 0 120 40" className="relative z-10 h-8 w-full text-lumen" fill="none" stroke="currentColor" strokeWidth="1.4">
              <rect x="42" y="2" width="36" height="30" rx="3" />
              <path d="M60 32v6M50 38h20" strokeLinecap="round" />
              <path d="M48 10h24M48 16h14" strokeOpacity=".5" strokeLinecap="round" />
            </svg>
          </Tile>

          {/* Lucky draw — the single accent tile */}
          <Tile to="/features/#lucky-draw" className="border-transparent bg-lumen text-ink md:col-span-4">
            <Head light icon={Gift} title="Lucky Draw" body="A playful reward moment after the try-on, built for campaigns." />
            <svg aria-hidden="true" viewBox="0 0 64 64" className="absolute right-6 bottom-6 size-20 text-ink/90 transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover/tile:rotate-[200deg]">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2" />
              {Array.from({ length: 8 }).map((_, i) => (
                <path key={i} d="M32 32 32 4" stroke="currentColor" strokeWidth="1.5" transform={`rotate(${i * 45} 32 32)`} />
              ))}
              <circle cx="32" cy="32" r="5" fill="currentColor" />
            </svg>
          </Tile>

          {/* Jewellery */}
          <Tile to="/features/#jewellery-try-on" className="justify-end bg-card text-white md:col-span-4">
            <img src="/images/industry/jewellery-stores-clean.webp" alt="" aria-hidden="true" width={1200} height={900} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/tile:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
            <Head icon={Gem} title="Jewellery try-on" body="Necklaces and earrings, worn." />
          </Tile>

          {/* Eyewear */}
          <Tile to="/features/#eyewear-try-on" className="justify-end bg-card text-white md:col-span-4">
            <img src="/images/industry/eyewear-stores-clean.webp" alt="" aria-hidden="true" width={1200} height={900} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover/tile:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
            <Head icon={Glasses} title="Eyewear try-on" body="Frames on your own face." />
          </Tile>
        </div>
      </div>
    </section>
  )
}
