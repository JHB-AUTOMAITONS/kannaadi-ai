import { useSyncExternalStore } from 'react'

/** Subscribe to a CSS media query. Server and first client render report `false` (no hydration mismatch). */
function useMedia(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', cb)
      return () => mq.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Matches the `lg` breakpoint where the desktop navigation takes over. */
export const useDesktop = () => useMedia('(min-width: 1024px)')

/** Non-hook check for effects. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
