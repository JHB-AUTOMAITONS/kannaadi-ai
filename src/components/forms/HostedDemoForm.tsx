import { useEffect, useState, useSyncExternalStore } from 'react'
import { ExternalLink, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

/** The live "Book a Demo" form, hosted by the form provider. This exact URL is the source of truth for the page. */
export const DEMO_FORM_URL = 'https://connect.automationclub.in/widget/form/Ay0iAkmWmPsTWQaxXCr3'

const FORM_ID = DEMO_FORM_URL.slice(DEMO_FORM_URL.lastIndexOf('/') + 1)
const FORM_TITLE = 'Kannaadi.Ai Book a Demo Form'
/** The provider's official embed script: it keeps the iframe sized to the form, so nothing is clipped or left empty. */
const EMBED_SCRIPT_URL = `${new URL(DEMO_FORM_URL).origin}/js/form_embed.js`
const SCRIPT_MARK = 'data-demo-form-embed'
/** Only used until the provider reports the real height (and as the fallback if the script never loads). */
const IFRAME_STYLE = { display: 'block', width: '100%', height: '780px', border: 'none' } as const
const SLOW_AFTER_MS = 15_000

/**
 * The provider's script sizes the iframes that exist when it runs. One tag at a time: on a revisit (client-side
 * navigation) the previous tag is replaced so the freshly mounted iframe is picked up.
 */
function loadEmbedScript() {
  document.querySelector(`script[${SCRIPT_MARK}]`)?.remove()
  const script = document.createElement('script')
  script.src = EMBED_SCRIPT_URL
  script.async = true
  script.setAttribute(SCRIPT_MARK, '')
  document.body.appendChild(script)
}

type Phase = 'loading' | 'ready' | 'slow'

const noopSubscribe = () => () => {}
/** false on the server and during hydration, true once the page is running in the browser. */
const useIsClient = () => useSyncExternalStore(noopSubscribe, () => true, () => false)

/**
 * The real form, embedded as the provider documents it. Validation, submission, success and error messages all
 * belong to the provider: this component never touches the form, intercepts a submit or fakes a result.
 *
 * The iframe is mounted on the client only. The page is prerendered and hydrated, and an iframe's `load` event can
 * fire before hydration attaches `onLoad`, which would leave the loading state stuck.
 */
export function HostedDemoForm({ className }: { className?: string }) {
  const mounted = useIsClient()
  const [phase, setPhase] = useState<Phase>('loading')

  useEffect(() => {
    if (!mounted) return
    loadEmbedScript()
    const timer = window.setTimeout(() => setPhase((p) => (p === 'loading' ? 'slow' : p)), SLOW_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [mounted])

  return (
    // Space is reserved only until the form is ready; after that the iframe's reported height decides, so nothing is left empty.
    <div className={cn('relative', phase !== 'ready' && 'min-h-[48rem]', className)}>
      {mounted && (
        <iframe
          id={`inline-${FORM_ID}`}
          src={DEMO_FORM_URL}
          title={FORM_TITLE}
          style={IFRAME_STYLE}
          className="rounded-2xl"
          onLoad={() => setPhase('ready')}
          data-layout="{'id':'INLINE'}"
          data-trigger-type="alwaysShow"
          data-trigger-value=""
          data-activation-type="alwaysActivated"
          data-activation-value=""
          data-deactivation-type="neverDeactivate"
          data-deactivation-value=""
          data-form-name={FORM_TITLE}
          data-height="752"
          data-layout-iframe-id={`inline-${FORM_ID}`}
          data-form-id={FORM_ID}
        />
      )}

      {mounted && phase !== 'ready' && (
        <div role="status" className="absolute inset-0 flex flex-col items-center gap-3 pt-24 text-center text-sm text-muted-foreground">
          {phase === 'loading' ? (
            <>
              <Loader2 aria-hidden="true" className="size-5 animate-spin" />
              <p>Loading the booking form…</p>
            </>
          ) : (
            <>
              <p className="max-w-[32ch]">The form is taking longer than usual to load.</p>
              <a
                href={DEMO_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-foreground underline underline-offset-4 hover:no-underline"
              >
                Open the form in a new tab <ExternalLink aria-hidden="true" className="size-3.5" />
              </a>
            </>
          )}
        </div>
      )}

      <noscript>
        <p className="text-sm text-muted-foreground">
          The booking form needs JavaScript.{' '}
          <a href={DEMO_FORM_URL} className="font-medium text-foreground underline underline-offset-4">
            Open the form on its own page
          </a>
          .
        </p>
      </noscript>
    </div>
  )
}
