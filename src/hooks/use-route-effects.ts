import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router'

/** --header-h (4.25rem) + the 1rem scroll-padding-top used for anchors */
const ANCHOR_OFFSET_PX = 68 + 16

/**
 * What a multi-page site gets for free from the browser, rebuilt for client-side routing:
 *  - a new page starts at the top; Back restores where that history entry had been scrolled to
 *  - `/page/#section` links land on the section (page chunks load lazily, so wait for the target to exist)
 *  - focus moves to the new page's <h1> so keyboard and screen-reader users aren't left on the old link
 * The first render is left alone: the browser already handled it (hash target, reload restoration).
 * Same-page hash changes (in-page anchors) are left to the browser too.
 */
export function useRouteEffects() {
  const { pathname, hash, key } = useLocation()
  const navType = useNavigationType()
  const positions = useRef(new Map<string, number>())

  // remember where each history entry was scrolled (one Map.set per scroll event)
  useEffect(() => {
    const save = () => positions.current.set(key, window.scrollY)
    window.addEventListener('scroll', save, { passive: true })
    return () => window.removeEventListener('scroll', save)
  }, [key])

  // reset or restore scroll when the page changes. A layout effect, so there is no flash at the old offset.
  const lastPath = useRef(pathname)
  useLayoutEffect(() => {
    const changed = lastPath.current !== pathname
    lastPath.current = pathname
    if (!changed || hash) return
    const saved = navType === 'POP' ? positions.current.get(key) : undefined
    window.scrollTo({ top: saved ?? 0, left: 0, behavior: 'instant' })
    if (saved) {
      // the destination may still be growing (lazy sections, images): re-apply until it is tall enough
      let frames = 0
      const tick = () => {
        if (document.documentElement.scrollHeight >= saved + window.innerHeight) return
        if (frames++ > 40) return
        window.scrollTo({ top: saved, behavior: 'instant' })
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  }, [pathname, hash, key, navType])

  // once the new page is in the DOM: focus its heading, and scroll to a #hash target
  const handledKey = useRef(key)
  const handledPath = useRef(pathname)
  useEffect(() => {
    if (handledKey.current === key) return
    const pageChanged = handledPath.current !== pathname
    handledKey.current = key
    handledPath.current = pathname
    if (!pageChanged) return

    let raf = 0
    let tries = 0
    let timer = 0
    const id = hash ? decodeURIComponent(hash.slice(1)) : ''
    const settle = () => {
      const h1 = document.querySelector<HTMLElement>('#main h1')
      const target = id ? document.getElementById(id) : null
      if (!h1 || (id && !target)) {
        if (tries++ < 90) raf = requestAnimationFrame(settle) // chunk still loading
        return
      }
      h1.tabIndex = -1
      h1.focus({ preventScroll: true })
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        // late layout (images, fonts) can nudge the target; re-assert once, after things settle
        timer = window.setTimeout(() => {
          const t = document.getElementById(id)
          if (t && Math.abs(t.getBoundingClientRect().top - ANCHOR_OFFSET_PX) > 24) t.scrollIntoView({ behavior: 'instant', block: 'start' })
        }, 400)
      }
    }
    settle()
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [pathname, hash, key])
}
