/**
 * Service Logo Enricher
 * Orchestrates logo fetching and enriches detected services with logo URLs
 */

import type { DetectedService } from '@/lib/types'
import { extractBrandDomain } from './domain-mapper'
import { fetchLogosForServices } from './logo-fetcher'

/**
 * Enrich detected services with logo URLs
 * Fetches logos in parallel for all services that have mappable domains
 *
 * @param services - Array of detected services from SPF analysis
 * @returns Enhanced services with logoUrl, logoSource, and domain fields
 *
 * @example
 * const services = [
 *   { name: "Google Workspace", include: "_spf.google.com", status: "good" }
 * ]
 * const enriched = await enrichServicesWithLogos(services)
 * // enriched[0].logoUrl: "https://logo.clearbit.com/google.com"
 * // enriched[0].logoSource: "clearbit"
 * // enriched[0].domain: "google.com"
 */
export async function enrichServicesWithLogos(
  services: DetectedService[]
): Promise<DetectedService[]> {
  // Early return for empty arrays
  if (services.length === 0) {
    return services
  }

  try {
    // Step 1: Extract brand domains for all services
    const servicesToFetch = services
      .map((service) => ({
        service,
        domain: extractBrandDomain(service.include),
      }))
      .filter(({ domain }) => domain !== null) as Array<{
        service: DetectedService
        domain: string
      }>

    // If no valid domains found, return services unchanged
    if (servicesToFetch.length === 0) {
      console.warn('No valid domains found for logo fetching')
      return services
    }

    // Step 2: Fetch logos in parallel for all services
    const logoMap = await fetchLogosForServices(
      servicesToFetch.map(({ service, domain }) => ({
        domain,
        serviceName: service.name,
        size: 128,
      }))
    )

    // Step 3: Enrich services with logo data
    return services.map((service) => {
      const logoResult = logoMap.get(service.name)

      if (logoResult) {
        return {
          ...service,
          logoUrl: logoResult.url,
          logoSource: logoResult.source,
          domain: extractBrandDomain(service.include) || undefined,
        }
      }

      // Return service unchanged if no logo was fetched
      return service
    })
  } catch (error) {
    // Log error but don't fail the entire operation
    console.error('Failed to enrich services with logos:', error)

    // Return original services unchanged on error
    return services
  }
}

/**
 * Enrich a single service with logo URL
 * Useful for dynamically added services
 *
 * @param service - Single detected service
 * @returns Enhanced service with logo data
 */
export async function enrichServiceWithLogo(
  service: DetectedService
): Promise<DetectedService> {
  const enriched = await enrichServicesWithLogos([service])
  return enriched[0] || service
}

/**
 * Pre-fetch logos for common services
 * Can be called on app initialization to warm up the cache
 *
 * @param commonDomains - Array of common service domains to prefetch
 * @returns Map of domain to logo URL
 */
export async function prefetchCommonLogos(
  commonDomains: string[] = [
    'google.com',
    'microsoft.com',
    'mailchimp.com',
    'sendgrid.com',
    'salesforce.com',
    'zendesk.com',
  ]
): Promise<Map<string, string>> {
  try {
    const logoMap = await fetchLogosForServices(
      commonDomains.map((domain) => ({
        domain,
        serviceName: domain, // Use domain as temporary name
      }))
    )

    const results = new Map<string, string>()
    logoMap.forEach((result, key) => {
      results.set(key, result.url)
    })

    return results
  } catch (error) {
    console.error('Failed to prefetch common logos:', error)
    return new Map()
  }
}
