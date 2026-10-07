import { Eye, Gift, Repeat, Share2, Sparkles } from 'lucide-react'

const STEPS = [
  { icon: Eye, title: 'Attract', body: 'A branded screen and a moving look stop people at the edge of your stand.' },
  { icon: Sparkles, title: 'Try', body: 'Visitors see pieces on themselves — the part they will want to show someone else.' },
  { icon: Share2, title: 'Share', body: 'A share-ready look turns each visitor into a small piece of reach for the brand.' },
  { icon: Gift, title: 'Draw', body: 'A lucky-draw moment gives the interaction a clear, playful ending.' },
  { icon: Repeat, title: 'Follow up', body: 'Collect interest the way your campaign needs, so the conversation continues after the event.' },
]

/** The five beats of an activation. Each card lights up in turn on hover/focus for a simple, tactile read. */
export function ActivationJourney() {
  return (
    <ol data-reveal-stagger="" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {STEPS.map(({ icon: Icon, title, body }, i) => (
        <li key={title} data-reveal="" className="group relative flex flex-col gap-4 overflow-hidden rounded-3xl border border-border bg-card p-5 transition-[transform,border-color,background-color] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-lumen/70 focus-within:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm tracking-widest text-lumen">0{i + 1}</span>
            <Icon aria-hidden="true" className="size-5 text-muted-foreground transition-colors group-hover:text-lumen" />
          </div>
          <h3 className="t-3">{title}</h3>
          <p className="text-[0.95rem] leading-relaxed text-muted-foreground">{body}</p>
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-lumen transition-transform duration-500 group-hover:scale-x-100" />
        </li>
      ))}
    </ol>
  )
}
