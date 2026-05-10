'use client'

import { useFormContext, Controller } from 'react-hook-form'
import { cn } from '@/lib/utils'

// ─── FieldWrapper ─────────────────────────────────────────────────────────────
export function FieldWrapper({ label, name, children, hint }: {
  label: string
  name: string
  children: React.ReactNode
  hint?: string
}) {
  const { formState: { errors } } = useFormContext()
  // Walk nested paths like "address.city"
  const error = name.split('.').reduce((acc: unknown, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
    return undefined
  }, errors) as { message?: string } | undefined

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-warm-800">{label}</label>
      {hint && <p className="text-xs text-warm-400">{hint}</p>}
      {children}
      {error?.message && (
        <p className="text-xs text-red-500">{error.message}</p>
      )}
    </div>
  )
}

// ─── TextField ────────────────────────────────────────────────────────────────
export function TextField({ name, label, placeholder, type = 'text', hint, maxLength }: {
  name: string
  label: string
  placeholder?: string
  type?: string
  hint?: string
  maxLength?: number
}) {
  const { register, formState: { errors } } = useFormContext()
  const hasError = name.split('.').reduce((acc: unknown, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
    return undefined
  }, errors)

  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm',
          hasError
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
            : 'border-warm-300 focus:border-sage-500 focus:ring-sage-500/20'
        )}
      />
    </FieldWrapper>
  )
}

// ─── TextareaField ────────────────────────────────────────────────────────────
export function TextareaField({ name, label, placeholder, rows = 4, hint }: {
  name: string
  label: string
  placeholder?: string
  rows?: number
  hint?: string
}) {
  const { register, formState: { errors } } = useFormContext()
  const hasError = name.split('.').reduce((acc: unknown, k) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[k]
    return undefined
  }, errors)

  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <textarea
        {...register(name)}
        rows={rows}
        placeholder={placeholder}
        className={cn(
          'w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 outline-none transition-all text-warm-900 placeholder:text-warm-300 text-sm resize-none',
          hasError
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
            : 'border-warm-300 focus:border-sage-500 focus:ring-sage-500/20'
        )}
      />
    </FieldWrapper>
  )
}

// ─── RadioGroupField ──────────────────────────────────────────────────────────
export function RadioGroupField({ name, label, options, hint }: {
  name: string
  label: string
  options: string[]
  hint?: string
}) {
  const { register, watch } = useFormContext()
  const current = watch(name)

  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <label
            key={opt}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all text-sm select-none',
              current === opt
                ? 'border-sage-500 bg-sage-50 text-sage-700 font-medium'
                : 'border-warm-300 bg-white text-warm-700 hover:border-warm-400'
            )}
          >
            <input {...register(name)} type="radio" value={opt} className="sr-only" />
            {opt}
          </label>
        ))}
      </div>
    </FieldWrapper>
  )
}

// ─── YesNoField ───────────────────────────────────────────────────────────────
export function YesNoField({ name, label, hint }: {
  name: string
  label: string
  hint?: string
}) {
  return <RadioGroupField name={name} label={label} options={['Yes', 'No']} hint={hint} />
}

// ─── CheckboxGroupField ───────────────────────────────────────────────────────
export function CheckboxGroupField({ name, label, options, hint }: {
  name: string
  label: string
  options: string[]
  hint?: string
}) {
  const { control } = useFormContext()

  return (
    <FieldWrapper label={label} name={name} hint={hint}>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {options.map(opt => {
              const checked = (field.value as string[]).includes(opt)
              return (
                <label
                  key={opt}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-full border cursor-pointer transition-all text-sm select-none',
                    checked
                      ? 'border-sage-500 bg-sage-50 text-sage-700 font-medium'
                      : 'border-warm-300 bg-white text-warm-700 hover:border-warm-400'
                  )}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={e => {
                      const current = field.value as string[]
                      field.onChange(
                        e.target.checked
                          ? [...current, opt]
                          : current.filter(v => v !== opt)
                      )
                    }}
                  />
                  {opt}
                </label>
              )
            })}
          </div>
        )}
      />
    </FieldWrapper>
  )
}

// ─── CheckboxField (single boolean) ───────────────────────────────────────────
export function CheckboxField({ name, label }: {
  name: string
  label: string
}) {
  const { register } = useFormContext()
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <input
        {...register(name)}
        type="checkbox"
        className="mt-0.5 w-5 h-5 rounded border border-warm-300 accent-sage-600 flex-shrink-0"
      />
      <span className="text-sm text-warm-700 leading-relaxed">{label}</span>
    </label>
  )
}

// ─── ConditionalField ─────────────────────────────────────────────────────────
export function ConditionalField({ watchField, triggerValue, children }: {
  watchField: string
  triggerValue: string
  children: React.ReactNode
}) {
  const { watch } = useFormContext()
  const value = watch(watchField)
  if (value !== triggerValue) return null
  return (
    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
      {children}
    </div>
  )
}

// ─── SectionDivider ───────────────────────────────────────────────────────────
export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <div className="h-px flex-1 bg-warm-200" />
      <span className="text-xs font-semibold tracking-widest uppercase text-warm-400 shrink-0">
        {title}
      </span>
      <div className="h-px flex-1 bg-warm-200" />
    </div>
  )
}
