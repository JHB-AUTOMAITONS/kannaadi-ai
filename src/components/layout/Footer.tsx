import { Link } from 'react-router'
import { Logo } from '@/components/ui/Logo'
import { Link000, Link001 } from '@/components/ui/skiper-ui/skiper40'
import { BUSINESSES } from '@/data/businesses'
import { SITE } from '@/data/site'

const YEAR = new Date().getFullYear()

const EXPLORE = [
  { to: '/features/', label: 'Features' },
  { to: '/use-cases/', label: 'Use Cases' },
  { to: '/about/', label: 'About' },
  { to: '/book-a-demo/', label: 'Book a Demo' },
  { to: '/contact/', label: 'Contact' },
]

export function Footer() {
  return (
    <footer className="theme-dark grain relative isolate overflow-hidden bg-background text-foreground">
      <div className="container-x relative z-10 pt-14 pb-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1.4fr] md:gap-10">
          <div className="flex max-w-sm flex-col gap-5">
            <Logo />
            <p className="text-[0.98rem] leading-relaxed text-muted-foreground">
              AI-powered virtual try on for fashion and retail — online, in store and at events.
            </p>
            <Link
              to="/book-a-demo/"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-lumen px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-ivory"
            >
              Book a Demo →
            </Link>
            {SITE.contactEmail && (
              <Link000 href={`mailto:${SITE.contactEmail}`} className="w-fit text-sm text-muted-foreground hover:text-foreground">
                {SITE.contactEmail}
              </Link000>
            )}
          </div>

          <nav aria-label="Explore">
            <h2 className="eyebrow mb-5">Explore</h2>
            <ul className="flex flex-col gap-3 text-[1.02rem]">
              {EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link000 href={l.to}>{l.label}</Link000>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Business types">
            <h2 className="eyebrow mb-5">For businesses</h2>
            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 text-[1.02rem] min-[480px]:grid-cols-2">
              <li className="min-[480px]:col-span-2">
                <Link000 href="/for-businesses/" className="font-medium">
                  All business types
                </Link000>
              </li>
              {BUSINESSES.map((b) => (
                <li key={b.slug}>
                  <Link000 href={b.path}>{b.name}</Link000>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © <span suppressHydrationWarning>{YEAR}</span> Kannaadi.Ai. All rights reserved.
          </p>
          <p>
            Link interactions from{' '}
            <Link001 href="https://skiper-ui.com" className="text-foreground">
              Skiper UI
            </Link001>
          </p>
        </div>
      </div>

      {/* oversized, cropped wordmark — depth, not decoration for its own sake */}
      <p
        aria-hidden="true"
        className="pointer-events-none relative z-0 -mt-4 mb-[-0.18em] overflow-hidden text-center text-[clamp(4.5rem,21vw,19rem)] leading-[0.82] font-semibold tracking-[-0.06em] whitespace-nowrap text-foreground/[0.045] select-none"
      >
        Kannaadi<span className="accent-serif">.Ai</span>
      </p>
    </footer>
  )
}
