/**
 * Service Detector
 * Identifies email services from SPF includes, MX records
 */

import { KNOWN_SERVICES } from '@/lib/constants'
import type { DetectedService, ServiceStatus } from '@/lib/types'

/**
 * Detect services from SPF include mechanisms
 */
export function detectServicesFromSPF(mechanisms: Array<{ type: string; value: string }>): DetectedService[] {
  const detected: DetectedService[] = []
  const detectedNames = new Set<string>() // Prevent duplicates

  // Get only include mechanisms
  const includes = mechanisms
    .filter((m) => m.type === 'include')
    .map((m) => m.value.toLowerCase())

  for (const include of includes) {
    // Check each known service
    for (const service of KNOWN_SERVICES) {
      // Skip if already detected
      if (detectedNames.has(service.name)) continue

      // Check if any pattern matches
      const matches = service.patterns.some((pattern) => include.includes(pattern.toLowerCase()))

      if (matches) {
        detected.push({
          name: service.name,
          include,
          status: service.status as ServiceStatus,
          note: service.note,
          icon: service.icon,
          category: service.category as any,
        })
        detectedNames.add(service.name)
        break // Move to next include
      }
    }
  }

  return detected
}

/**
 * Detect email provider from MX hostnames
 */
export function detectProviderFromMX(mxHostnames: string[]): string | null {
  if (mxHostnames.length === 0) return null

  const hostnamesLower = mxHostnames.map((h) => h.toLowerCase())

  // Check each known email provider
  for (const service of KNOWN_SERVICES) {
    if (service.category !== 'email-provider') continue

    // Check if any MX hostname matches any pattern
    for (const hostname of hostnamesLower) {
      const matches = service.patterns.some((pattern) => hostname.includes(pattern.toLowerCase()))
      if (matches) {
        return service.name
      }
    }
  }

  return null
}

/**
 * Detect all services from SPF analysis
 */
export interface ServiceDetectionInput {
  spfMechanisms?: Array<{ type: string; value: string }>
  mxHostnames?: string[]
}

export function detectAllServices(input: ServiceDetectionInput): {
  detectedServices: DetectedService[]
  emailProvider: string | null
} {
  const detectedServices = input.spfMechanisms
    ? detectServicesFromSPF(input.spfMechanisms)
    : []

  const emailProvider = input.mxHostnames
    ? detectProviderFromMX(input.mxHostnames)
    : null

  return {
    detectedServices,
    emailProvider,
  }
}
