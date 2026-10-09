import { cn } from '@/lib/utils'

/**
 * Small caption telling people the image is interactive. Own background (not a blend mode) so it stays legible on
 * light and dark artwork; the wording follows the primary input — decided in CSS so SSR and client always agree.
 */
export function RevealHint({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        'pointer-events-none absolute bottom-3 left-3 z-10 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full bg-ink/75 px-3 py-1.5 font-mono text-[0.68rem] leading-none tracking-[0.12em] text-ivory uppercase backdrop-blur-sm',
        className,
      )}
    >
      <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-lumen" />
      <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">Move across to reveal the AI scan</span>
      <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">Touch and drag to reveal the AI scan</span>
    </p>
  )
}
