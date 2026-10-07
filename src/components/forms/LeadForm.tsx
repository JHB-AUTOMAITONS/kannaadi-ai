import { useRef, useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2, ChevronDown, Loader2 } from 'lucide-react'
import { Field, controlCls } from '@/components/forms/Field'
import { BUSINESSES } from '@/data/businesses'
import { useFormSubmit } from '@/hooks/use-form-submit'
import { cn } from '@/lib/utils'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^[+()\-.\s\d]{7,20}$/

type Kind = 'demo' | 'contact'
type Errors = Partial<Record<string, string>>

const TOPICS = ['Virtual try on demo', 'Partnership or integration', 'Events and activations', 'Press or media', 'Something else']

const SELECT_CHEVRON = (
  <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
)

/**
 * Demo-request and contact form. Client-side validation, an explicit loading / success / error state,
 * and honest delivery (see useFormSubmit): the success panel only appears once the endpoint has confirmed.
 */
export function LeadForm({ kind, className }: { kind: Kind; className?: string }) {
  const { state, submit, reset } = useFormSubmit(kind)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState<{ name: string; email: string } | null>(null)
  const form = useRef<HTMLFormElement>(null)
  const demo = kind === 'demo'

  const validate = (d: Record<string, string>): Errors => {
    const e: Errors = {}
    if (d.name.trim().length < 2) e.name = 'Please enter your name.'
    if (demo && d.company.trim().length < 2) e.company = 'Please enter your company.'
    if (!EMAIL.test(d.email.trim())) e.email = 'Please enter a valid email address.'
    if (d.phone.trim() && !PHONE.test(d.phone.trim())) e.phone = 'Use digits, spaces, + or - only.'
    if (demo && !d.businessType) e.businessType = 'Please choose your business type.'
    if (!demo && !d.topic) e.topic = 'Please choose a topic.'
    if (!demo && d.message.trim().length < 10) e.message = 'Please add a short message (at least 10 characters).'
    return e
  }

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const fd = new FormData(ev.currentTarget)
    const data: Record<string, string> = { name: '', company: '', email: '', phone: '', businessType: '', topic: '', message: '', website: '' }
    for (const [k, v] of fd.entries()) data[k] = String(v)
    // honeypot: real people never see this field
    if (data.website) {
      setSent({ name: data.name, email: data.email })
      return
    }
    delete data.website
    const found = validate(data)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v.trim()))
    if (await submit(payload)) setSent({ name: data.name.trim(), email: data.email.trim() })
  }

  if (sent || state.status === 'success') {
    return (
      <div role="status" className={cn('flex flex-col items-start gap-4 py-4', className)}>
        <span className="grid size-12 place-items-center rounded-full bg-lumen text-ink">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </span>
        <h2 className="t-2">{demo ? 'Demo request sent.' : 'Message sent.'}</h2>
        <p className="max-w-[44ch] text-[1rem] leading-relaxed text-muted-foreground">
          Thanks{sent?.name ? `, ${sent.name.split(' ')[0]}` : ''}. We have your {demo ? 'request' : 'message'} and will reply to{' '}
          <strong className="font-medium text-foreground">{sent?.email}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            reset()
            setSent(null)
            setErrors({})
          }}
          className="text-sm font-medium underline underline-offset-4 hover:no-underline"
        >
          Send another
        </button>
      </div>
    )
  }

  const busy = state.status === 'submitting'
  const clear = (name: string) => errors[name] && setErrors((e) => ({ ...e, [name]: undefined }))

  return (
    <form ref={form} onSubmit={onSubmit} noValidate aria-busy={busy} className={cn('flex flex-col gap-4', className)}>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${kind}-name`} label="Name" required error={errors.name}>
          {(a) => <input {...a} name="name" type="text" autoComplete="name" onChange={() => clear('name')} className={cn(controlCls, 'h-12')} />}
        </Field>
        {demo ? (
          <Field id="demo-company" label="Company" required error={errors.company}>
            {(a) => <input {...a} name="company" type="text" autoComplete="organization" onChange={() => clear('company')} className={cn(controlCls, 'h-12')} />}
          </Field>
        ) : (
          <Field id="contact-email" label="Email" required error={errors.email}>
            {(a) => <input {...a} name="email" type="email" inputMode="email" autoComplete="email" onChange={() => clear('email')} className={cn(controlCls, 'h-12')} />}
          </Field>
        )}
      </div>

      {demo && (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="demo-email" label="Work email" required error={errors.email}>
            {(a) => <input {...a} name="email" type="email" inputMode="email" autoComplete="email" onChange={() => clear('email')} className={cn(controlCls, 'h-12')} />}
          </Field>
          <Field id="demo-phone" label="Phone" error={errors.phone}>
            {(a) => <input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" onChange={() => clear('phone')} className={cn(controlCls, 'h-12')} />}
          </Field>
        </div>
      )}

      <Field id={demo ? 'demo-type' : 'contact-topic'} label={demo ? 'Business type' : 'Topic'} required error={demo ? errors.businessType : errors.topic}>
        {(a) => (
          <div className="relative">
            <select
              {...a}
              name={demo ? 'businessType' : 'topic'}
              defaultValue=""
              onChange={() => clear(demo ? 'businessType' : 'topic')}
              className={cn(controlCls, 'h-12 appearance-none pr-10')}
            >
              <option value="" disabled>
                {demo ? 'Select your business type' : 'What is this about?'}
              </option>
              {(demo ? [...BUSINESSES.map((b) => b.name), 'Online store / ecommerce', 'Other'] : TOPICS).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            {SELECT_CHEVRON}
          </div>
        )}
      </Field>

      <Field id={`${kind}-message`} label="Message" required={!demo} error={errors.message} hint={demo ? 'What do you sell, and where would you like try-on to live?' : undefined}>
        {(a) => <textarea {...a} name="message" rows={demo ? 4 : 5} onChange={() => clear('message')} className={cn(controlCls, 'min-h-28 resize-y py-3')} />}
      </Field>

      {/* honeypot */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${kind}-website`}>Leave this field empty</label>
        <input id={`${kind}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === 'error' && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 text-sm">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-destructive" />
          <p>{state.message}</p>
        </div>
      )}
      {Object.values(errors).some(Boolean) && (
        <p className="sr-only" role="alert">
          The form has errors. Please review the highlighted fields.
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="group/cta mt-1 inline-flex h-[3.4rem] items-center justify-center gap-3 rounded-full bg-lumen px-7 text-base font-medium text-ink transition-colors duration-300 hover:bg-ink hover:text-ivory focus-visible:outline-2 focus-visible:outline-offset-4 disabled:pointer-events-none disabled:opacity-70"
      >
        {busy ? (
          <>
            <Loader2 aria-hidden="true" className="size-5 animate-spin" /> Sending…
          </>
        ) : demo ? (
          'Request a demo'
        ) : (
          'Send message'
        )}
      </button>
      <p className="text-xs text-muted-foreground">We’ll use your details to reply to this request.</p>
    </form>
  )
}
