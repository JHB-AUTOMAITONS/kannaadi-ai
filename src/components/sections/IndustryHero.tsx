import { useRef, type ReactNode } from 'react'
import { RevealStage } from '@/components/hero/RevealStage'
import { PageHero } from '@/components/sections/PageHero'
import { Cta } from '@/components/ui/Cta'
import { businessBySlug } from '@/data/businesses'
import { cn } from '@/lib/utils'

export type HeroShape = 'round' | 'arch' | 'tall' | 'wide' | 'circle-cut'

const SHAPES: Record<HeroShape, string> = {
  round: 'aspect-[4/3] rounded-[2rem]',
  arch: 'aspect-[4/4.6] rounded-t-[999px] rounded-b-[2rem]',
  tall: 'aspect-[4/5] rounded-[2rem] rounded-tr-[6rem]',
  wide: 'aspect-[16/9] rounded-[2rem] md:rounded-[2.5rem]',
  'circle-cut': 'aspect-[4/3.4] rounded-[2rem] rounded-bl-[7rem]',
}

interface Props {
  path: string
  slug: string
  theme?: 'light' | 'dark'
  shape?: HeroShape
  eyebrow: string
  title: ReactNode
  intro: ReactNode
  /** Tailwind object-position class for the scene crop */
  focal?: string
  secondary?: { to: string; label: string }
  /** Warmer sand background for light heroes */
  tone?: 'sand'
}

/**
 * Industry hero: each page picks its own theme and stage shape, but they share one behaviour —
 * the studio scene is permanent and its AI scan is revealed through the organic blob under the pointer.
 */
export function IndustryHero({ path, slug, theme = 'light', shape = 'round', eyebrow, title, intro, focal, secondary, tone }: Props) {
  const b = businessBySlug(slug)!
  const host = useRef<HTMLDivElement>(null)
  const wide = shape === 'wide'

  const stage = (
    <div ref={host} className={cn('relative w-full overflow-hidden border border-border', SHAPES[shape])}>
      <RevealStage
        clean={[{ src: `${b.image}-clean.webp`, width: 1200 }]}
        ai={[{ src: `${b.image}-ai.webp`, width: 1200 }]}
        aspect={[1200, 900]}
        alt={b.imageAlt}
        sizes={wide ? '(min-width: 1400px) 1300px, 92vw' : '(min-width: 1024px) 46vw, 92vw'}
        imgClassName={focal}
        eventTarget={host}
        blobScale={wide ? 1 : 0.85}
        priority
        loadAi="idle"
        className="absolute inset-0"
      />
      <p className="pointer-events-none absolute bottom-3 left-4 font-mono text-[0.68rem] tracking-[0.14em] text-white/85 uppercase mix-blend-difference">
        Move across to reveal the AI scan
      </p>
    </div>
  )

  return (
    <PageHero
      path={path}
      theme={theme}
      className={tone === 'sand' ? 'theme-sand' : undefined}
      eyebrow={eyebrow}
      title={title}
      intro={intro}
      actions={
        <>
          <Cta to="/book-a-demo/" size="lg" magnetic>
            Book a Demo
          </Cta>
          <Cta to={secondary?.to ?? '/features/'} size="lg" variant="secondary">
            {secondary?.label ?? 'Explore Features'}
          </Cta>
        </>
      }
      visual={wide ? undefined : stage}
      below={wide ? stage : undefined}
    />
  )
}
