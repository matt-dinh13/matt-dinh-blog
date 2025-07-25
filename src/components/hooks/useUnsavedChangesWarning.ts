import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * useUnsavedChangesWarning
 *
 * Shows a confirmation popup if the user tries to navigate away with unsaved changes.
 * Intercepts:
 *   - Next.js router navigation (push, replace, back)
 *   - <a> and <Link> clicks inside the document
 *   - Browser tab close/refresh (beforeunload)
 *
 * Usage:
 *   useUnsavedChangesWarning(hasUnsavedChanges)
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  const router = useRouter()

  useEffect(() => {
    if (!hasUnsavedChanges) return

    // 1. Intercept browser tab close/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    // 2. Intercept Next.js router navigation
    const originalPush = router.push
    const originalReplace = router.replace
    const originalBack = router.back
    let blocked = false

    router.push = function (...args) {
      if (hasUnsavedChanges && !blocked) {
        if (!window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
          blocked = true
          return
        }
      }
      return originalPush.apply(this, args)
    }
    router.replace = function (...args) {
      if (hasUnsavedChanges && !blocked) {
        if (!window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
          blocked = true
          return
        }
      }
      return originalReplace.apply(this, args)
    }
    router.back = function (...args) {
      if (hasUnsavedChanges && !blocked) {
        if (!window.confirm('You have unsaved changes. Are you sure you want to leave this page?')) {
          blocked = true
          return
        }
      }
      return originalBack.apply(this, args)
    }

    // 3. Intercept <a> and <Link> clicks
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target && target.closest('a')) {
        const anchor = target.closest('a') as HTMLAnchorElement
        // Only intercept if it's a local link
        if (anchor && anchor.href && anchor.origin === window.location.origin) {
          if (hasUnsavedChanges) {
            const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave this page?')
            if (!confirmed) {
              e.preventDefault()
              e.stopPropagation()
            }
          }
        }
      }
    }
    document.addEventListener('click', handleDocumentClick, true)

    // Cleanup
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleDocumentClick, true)
      router.push = originalPush
      router.replace = originalReplace
      router.back = originalBack
    }
  }, [hasUnsavedChanges, router])
} 