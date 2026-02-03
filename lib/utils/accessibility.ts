/**
 * Accessibility utility functions
 */

/**
 * Generate a unique ID for form elements
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get ARIA label for status indicators
 */
export function getStatusAriaLabel(status: string): string {
  switch (status) {
    case 'pass':
    case 'valid':
    case 'success':
      return 'Status: Passed'
    case 'fail':
    case 'invalid':
    case 'error':
      return 'Status: Failed'
    case 'warning':
    case 'caution':
      return 'Status: Warning'
    case 'info':
    case 'neutral':
      return 'Status: Information'
    case 'missing':
    case 'none':
      return 'Status: Not configured'
    default:
      return `Status: ${status}`
  }
}

/**
 * Announce message to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message

  document.body.appendChild(announcement)

  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Focus trap for modals/dialogs
 */
export function createFocusTrap(element: HTMLElement) {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  element.addEventListener('keydown', handleTabKey)

  return () => {
    element.removeEventListener('keydown', handleTabKey)
  }
}

/**
 * Skip to main content link helper
 */
export function skipToMainContent() {
  const main = document.querySelector('main')
  if (main) {
    main.setAttribute('tabindex', '-1')
    main.focus()
  }
}
