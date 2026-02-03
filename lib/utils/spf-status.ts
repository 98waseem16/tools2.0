/**
 * SPF Status Detection Utilities
 * Determines the visual status of SPF mechanisms based on validation results
 */

import type { SPFMechanism, Check } from '@/lib/types'

export type MechanismStatus = 'success' | 'warning' | 'error' | 'neutral'

/**
 * Determine the visual status of a mechanism based on validation checks
 */
export function getMechanismStatus(
  mechanism: SPFMechanism,
  checks: Check[],
  lookupCount: number
): MechanismStatus {
  // Special handling for 'all' mechanism - check for qualifier-specific issues
  if (mechanism.type === 'all') {
    // Check for checks about this specific qualifier
    const allChecks = checks.filter((c) =>
      c.message.toLowerCase().includes('all mechanism')
    )

    // ~all and -all are good, only +all and ?all are bad
    if (mechanism.qualifier === '~' || mechanism.qualifier === '-') {
      // Check if there's a failure status (only happens with +all or ?all)
      if (allChecks.some((c) => c.status === 'fail')) {
        return 'error'
      }
      return 'success'
    }

    // +all or ?all
    if (allChecks.some((c) => c.status === 'fail')) {
      return 'error'
    }
  }

  // For non-all mechanisms, check if this specific mechanism has validation issues
  // Be careful not to match "all" when checking for include values
  const mechanismChecks = checks.filter((c) => {
    const msg = c.message.toLowerCase()
    const val = mechanism.value.toLowerCase()

    // Skip the "All mechanism" check when evaluating non-all mechanisms
    if (msg.includes('all mechanism:')) {
      return false
    }

    // Check if message specifically mentions this mechanism's value
    return val && msg.includes(val)
  })

  if (mechanismChecks.some((c) => c.status === 'fail')) {
    return 'error'
  }

  if (mechanismChecks.some((c) => c.status === 'warning')) {
    return 'warning'
  }

  // Note: We don't blanket-mark all includes as warnings when lookupCount > 10
  // The global "DNS lookups exceeded" check already communicates this issue
  // Individual mechanisms should only show warnings if they have specific issues

  return 'success'
}

/**
 * Get status color classes for Tailwind
 */
export function getStatusColorClasses(status: MechanismStatus): {
  bg: string
  text: string
  border: string
  icon: string
} {
  switch (status) {
    case 'success':
      return {
        bg: 'bg-green-50',
        text: 'text-green-900',
        border: 'border-green-200',
        icon: 'text-green-600',
      }
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-900',
        border: 'border-yellow-200',
        icon: 'text-yellow-600',
      }
    case 'error':
      return {
        bg: 'bg-red-50',
        text: 'text-red-900',
        border: 'border-red-200',
        icon: 'text-red-600',
      }
    case 'neutral':
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-900',
        border: 'border-gray-200',
        icon: 'text-gray-600',
      }
  }
}

/**
 * Get status icon for mechanism
 */
export function getStatusIcon(status: MechanismStatus): string {
  switch (status) {
    case 'success':
      return '✓'
    case 'warning':
      return '⚠'
    case 'error':
      return '✗'
    case 'neutral':
    default:
      return '○'
  }
}

/**
 * Check if mechanism is expandable (has nested records)
 */
export function isExpandableMechanism(mechanism: SPFMechanism): boolean {
  return mechanism.type === 'include' || mechanism.type === 'redirect'
}

/**
 * Find detected service for a mechanism
 */
export function findServiceForMechanism(
  mechanism: SPFMechanism,
  services: any[]
): any | null {
  if (!mechanism || !services) return null

  return (
    services.find(
      (s) => s.include && s.include.toLowerCase() === mechanism.value.toLowerCase()
    ) || null
  )
}
