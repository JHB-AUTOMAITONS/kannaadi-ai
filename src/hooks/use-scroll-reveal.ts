import { useEffect } from 'react'

/**
 * Scroll reveal for any element marked `data-reveal` (CSS in global.css hides it only once the
 * document has the `js` class). Siblings inside a `[data-reveal-stagger]` parent get a short
 * cascading delay. One shared IntersectionObserver; a MutationObserver picks up late content
 * (tabs, route changes). Re-runs per pathname so new pages reveal from the top.
 */
export function useScrollReveal(pathname: string) {
  useEffect(() => {
    const root = document.documentElement
    if (!('IntersectionObserver' in window)) {
      root.classList.add('no-anim')
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          ;(e.target as HTMLElement).classList.add('is-in')
          io.unobserve(e.target)
        }
      },
      { rootMargin: '0px 0px -7% 0px', threshold: 0.06 },
    )

    const seen = new WeakSet<Element>()
    const watch = (el: Element) => {
      if (seen.has(el) || el.classList.contains('is-in')) return
      seen.add(el)
      const h = el as HTMLElement
      const explicit = h.dataset.revealDelay
      if (explicit) {
        h.style.setProperty('--reveal-delay', `${explicit}ms`)
      } else if (h.parentElement?.hasAttribute('data-reveal-stagger')) {
        const sibs = Array.from(h.parentElement.children).filter((c) => c.hasAttribute('data-reveal'))
        h.style.setProperty('--reveal-delay', `${Math.min(sibs.indexOf(h), 8) * 70}ms`)
      }
      io.observe(el)
    }
    const scan = (scope: ParentNode = document) => scope.querySelectorAll('[data-reveal]').forEach(watch)

    scan()
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return
          const el = n as Element
          if (el.hasAttribute('data-reveal')) watch(el)
          scan(el)
        })
      }
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])
}
