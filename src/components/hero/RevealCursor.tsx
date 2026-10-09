import { useEffect, useRef, type RefObject } from 'react'

/**
 * A small "REVEAL" tag that trails the pointer over the hero. Fine pointers only: it is never
 * rendered into the interaction on touch devices, never replaces the native cursor, and steps
 * aside over anything marked data-cursor-hide (CTAs, nav) so clicking stays unambiguous.
 */
export function RevealCursor({ target, label = 'Reveal', enabled = true }: { target: RefObject<HTMLElement | null>; label?: string; enabled?: boolean }) {
  const el = useRef<HTMLDivElement>(null)
  const on = useRef(enabled)

  useEffect(() => {
    const host = target.current
    const node = el.current
    if (!host || !node) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let raf = 0
    let shown = false
    const cur = { x: 0, y: 0 }
    const want = { x: 0, y: 0 }

    const frame = () => {
      raf = 0
      cur.x += (want.x - cur.x) * 0.22
      cur.y += (want.y - cur.y) * 0.22
      node.style.transform = `translate3d(${cur.x + 16}px, ${cur.y + 20}px, 0)`
      if (shown && (Math.abs(want.x - cur.x) > 0.3 || Math.abs(want.y - cur.y) > 0.3)) raf = requestAnimationFrame(frame)
    }
    const show = (v: boolean) => {
      shown = v
      node.dataset.show = v && on.current ? 'true' : 'false'
    }
    const enter = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      cur.x = want.x = e.clientX
      cur.y = want.y = e.clientY
      node.style.transform = `translate3d(${cur.x + 16}px, ${cur.y + 20}px, 0)`
      show(true)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      want.x = e.clientX
      want.y = e.clientY
      const over = (e.target as Element | null)?.closest?.('[data-cursor-hide], a, button, input, textarea, select')
      show(!over)
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const leave = () => show(false)

    host.addEventListener('pointerenter', enter)
    host.addEventListener('pointermove', move, { passive: true })
    host.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(raf)
      host.removeEventListener('pointerenter', enter)
      host.removeEventListener('pointermove', move)
      host.removeEventListener('pointerleave', leave)
    }
  }, [target])

  // `enabled` follows the reveal itself (it is off whenever the engine has no pointer)
  useEffect(() => {
    on.current = enabled
    if (el.current && !enabled) el.current.dataset.show = 'false'
  }, [enabled])

  return (
    <div
      ref={el}
      aria-hidden="true"
      data-show="false"
      className="pointer-events-none fixed top-0 left-0 z-[70] hidden [@media(hover:hover)_and_(pointer:fine)]:block"
    >
      <span className="flex items-center gap-1.5 rounded-full bg-lumen px-2.5 py-1 font-mono text-[0.625rem] leading-none font-medium tracking-[0.16em] text-ink uppercase shadow-[0_6px_20px_-6px_rgb(0_0_0/0.45)] transition-[opacity,transform] duration-200 ease-[var(--ease-soft)] in-data-[show=false]:scale-75 in-data-[show=false]:opacity-0">
        <span className="size-1 rounded-full bg-ink" />
        {label}
      </span>
    </div>
  )
}
