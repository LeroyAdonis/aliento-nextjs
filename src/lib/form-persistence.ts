'use client'

import { useEffect, useRef, useState } from 'react'
import type { UseFormReturn, FieldValues } from 'react-hook-form'

const STORAGE_PREFIX = 'aliento:'

function read<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
  } catch {
    // Quota exceeded / disabled — silent fail is fine
  }
}

function remove(key: string): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // ignore
  }
}

/**
 * React Hook Form persistence: restores saved values on mount, writes
 * debounced updates on change, and exposes a `clear` for the success path.
 */
export function useRHFPersistence<T extends FieldValues>(
  methods: UseFormReturn<T>,
  key: string,
  debounceMs = 300,
) {
  const restored = useRef(false)

  useEffect(() => {
    if (restored.current) return
    restored.current = true
    const saved = read<Partial<T>>(key)
    if (saved) {
      methods.reset({ ...methods.getValues(), ...saved } as T)
    }
  }, [key, methods])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const sub = methods.watch((values) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => write(key, values), debounceMs)
    })
    return () => {
      if (timer) clearTimeout(timer)
      sub.unsubscribe()
    }
  }, [key, methods, debounceMs])

  return { clear: () => remove(key) }
}

/**
 * Plain useState wrapper that mirrors its value to localStorage.
 * Always returns the initial value on the first render to avoid SSR
 * hydration mismatches; the saved value is applied after mount.
 */
export function useLocalStorageState<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state from localStorage to avoid SSR hydration mismatch
  // The initializer function runs only on the first render
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + key)
      if (raw) return JSON.parse(raw) as T
    } catch {
      // ignore
    }
    return initial
  })

  // Sync localStorage changes from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') return

    function onStorage(event: StorageEvent) {
      if (event.key === STORAGE_PREFIX + key && event.newValue) {
        try {
          setState(JSON.parse(event.newValue) as T)
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key])

  const set = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value
      write(key, next)
      return next
    })
  }

  const clear = () => {
    remove(key)
    setState(initial)
  }

  return [state, set, clear]
}
