import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Label + control + error wiring in one place so every field is announced correctly. */
export function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
  className,
}: {
  id: string
  label: string
  required?: boolean
  hint?: string
  error?: string
  children: (aria: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string; 'aria-required'?: boolean }) => ReactNode
  className?: string
}) {
  const describedBy = [error ? `${id}-error` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium tracking-tight">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-0.5 text-destructive">
            *
          </span>
        ) : (
          <span className="ml-1.5 font-normal text-muted-foreground">(optional)</span>
        )}
      </label>
      {children({ id, 'aria-invalid': !!error, 'aria-describedby': describedBy, 'aria-required': required || undefined })}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export const controlCls =
  'w-full rounded-xl border border-input bg-background px-3.5 text-[0.98rem] text-foreground transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground/70 focus-visible:border-foreground focus-visible:ring-[3px] focus-visible:ring-foreground/15 focus-visible:outline-none aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15'
