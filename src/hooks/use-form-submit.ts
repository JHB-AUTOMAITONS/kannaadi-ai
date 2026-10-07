import { useCallback, useState } from 'react'
import { SITE } from '@/data/site'

export type SubmitState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'error'; message: string }

/**
 * Delivers a lead form as JSON to SITE.formEndpoint. It reports exactly what happened:
 * with no endpoint configured, or when the request fails, the user sees an error — never a fake "sent".
 */
export function useFormSubmit(kind: 'demo' | 'contact') {
  const [state, setState] = useState<SubmitState>({ status: 'idle' })

  const submit = useCallback(
    async (data: Record<string, string>) => {
      if (!SITE.formEndpoint) {
        setState({
          status: 'error',
          message: SITE.contactEmail
            ? `We couldn't send your request because this site's form delivery isn't set up yet. Please email ${SITE.contactEmail} instead.`
            : "We couldn't send your request because this site's form delivery isn't set up yet. Please try again later.",
        })
        return false
      }
      setState({ status: 'submitting' })
      try {
        const ctrl = new AbortController()
        const timer = window.setTimeout(() => ctrl.abort(), 15000)
        const res = await fetch(SITE.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ form: kind, source: window.location.href, submittedAt: new Date().toISOString(), ...data }),
          signal: ctrl.signal,
        })
        window.clearTimeout(timer)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        setState({ status: 'success' })
        return true
      } catch (err) {
        const aborted = err instanceof DOMException && err.name === 'AbortError'
        setState({
          status: 'error',
          message: aborted
            ? 'The request timed out. Please check your connection and try again.'
            : 'Something went wrong sending your request. Please try again in a moment.',
        })
        return false
      }
    },
    [kind],
  )

  const reset = useCallback(() => setState({ status: 'idle' }), [])
  return { state, submit, reset }
}
