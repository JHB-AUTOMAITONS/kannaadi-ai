import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigationType } from 'react-router'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/navigation/Header'
import { useRouteEffects } from '@/hooks/use-route-effects'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'
import { NOT_FOUND_META, normalizePath, pageByPath } from '@/data/pages'
import { applyHead, headTags } from '@/lib/seo'

/** Site shell: skip link, header, routed page, footer, plus per-route SEO sync and motion plumbing. */
export function SiteLayout() {
  const { pathname } = useLocation()
  const navType = useNavigationType() // POP on first load, PUSH after a link click

  useScrollReveal(pathname)
  useRouteEffects()

  // keep <head> in step with the route (the prerenderer writes the same tags into the static HTML)
  useEffect(() => {
    const meta = pageByPath(normalizePath(pathname))
    applyHead(headTags(meta ?? NOT_FOUND_META, { noindex: !meta }))
  }, [pathname])

  useEffect(() => {
    // reveal CSS may now apply; cancel the "JS never arrived" failsafe set in index.html
    const w = window as unknown as { __kfb?: number }
    if (w.__kfb) window.clearTimeout(w.__kfb)
  }, [])

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-lumen px-5 py-2.5 text-sm font-medium text-ink shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1} key={pathname} className={navType === 'PUSH' ? 'animate-page-in outline-none' : 'outline-none'}>
        <Suspense fallback={<div className="min-h-[70svh]" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
