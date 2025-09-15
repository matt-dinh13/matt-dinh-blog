"use client"

import { useEffect, useRef } from 'react'

interface UseAutosaveDraftOptions<T> {
  key: string
  data: T
  onRestore?: (data: T) => void
  debounceMs?: number
}

export function useAutosaveDraft<T>({ key, data, onRestore, debounceMs = 1000 }: UseAutosaveDraftOptions<T>) {
  const timeoutRef = useRef<number | null>(null)
  const mountedRef = useRef(false)

  // Offer restore on mount if draft exists
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const saved = JSON.parse(raw) as { timestamp: number; data: T }
        if (saved && saved.data && onRestore && !mountedRef.current) {
          const shouldRestore = typeof window !== 'undefined' && window.confirm('Restore unsaved draft for this form?')
          if (shouldRestore) {
            onRestore(saved.data)
          }
        }
      }
    } catch {
      // ignore
    } finally {
      mountedRef.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced save on data changes
  useEffect(() => {
    if (!mountedRef.current) return

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      try {
        const payload = { timestamp: Date.now(), data }
        localStorage.setItem(key, JSON.stringify(payload))
      } catch {
        // ignore storage errors
      }
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [key, data, debounceMs])

  // Provide a clear method via return cleanup function
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const clear = () => {
    try { localStorage.removeItem(key) } catch { /* ignore */ }
  }

  return { clear }
} 