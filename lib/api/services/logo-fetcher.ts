/**
 * Multi-Strategy Logo Fetcher
 * Fetches service logos using multiple strategies with automatic fallbacks
 */

export interface LogoResult {
  url: string
  source: 'clearbit' | 'favicon' | 'avatar'
  cached: boolean
}

export interface LogoFetchOptions {
  domain: string
  serviceName: string
  size?: number
  timeout?: number
}

/**
 * Strategy 1: Clearbit Logo API
 * High-quality branded logos from company domains
 * Free tier: 100 requests/month, then rate limited
 *
 * @param domain - Brand domain (e.g., "google.com")
 * @param timeout - Request timeout in milliseconds (default: 3000)
 * @returns Logo URL if available, null otherwise
 */
async function fetchClearbitLogo(
  domain: string,
  timeout = 3000
): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    // Clearbit automatically returns logo or 404
    const url = `https://logo.clearbit.com/${domain}`
    const response = await fetch(url, {
      signal: controller.signal,
      method: 'HEAD', // Check if exists without downloading full image
      cache: 'force-cache', // Use browser cache
    })

    clearTimeout(timeoutId)

    if (response.ok) {
      return url
    }
  } catch (error) {
    // Timeout or network error - proceed to fallback
    if (error instanceof Error && error.name !== 'AbortError') {
      console.warn(`Clearbit logo fetch failed for ${domain}:`, error.message)
    }
  }

  return null
}

/**
 * Strategy 2: Google Favicon Service
 * Universal fallback that returns favicon for any domain
 * Free, unlimited, reliable
 *
 * @param domain - Brand domain (e.g., "google.com")
 * @param size - Icon size in pixels (default: 128)
 * @returns Favicon URL (always returns a URL)
 */
function getFaviconUrl(domain: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
}

/**
 * Strategy 3: Generated Avatar
 * Ultimate fallback - generates colored avatar with first letter
 * Always works, no external dependencies after initial load
 *
 * @param serviceName - Name of the service (e.g., "Google Workspace")
 * @returns Generated avatar URL
 */
function getAvatarUrl(serviceName: string): string {
  const initial = serviceName.charAt(0).toUpperCase()

  // Color palette for consistent branding
  const colors = [
    '3b82f6', // blue
    '8b5cf6', // purple
    'ec4899', // pink
    '10b981', // green
    'f59e0b', // amber
    '06b6d4', // cyan
    'ef4444', // red
    '14b8a6', // teal
  ]

  // Deterministic color selection based on first character
  const colorIndex = serviceName.charCodeAt(0) % colors.length
  const color = colors[colorIndex]

  // Use UI Avatars API (free, no rate limits)
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initial)}&background=${color}&color=fff&size=128&bold=true&format=svg`
}

/**
 * Verify if a URL returns a valid image
 * Used for favicon fallback verification
 *
 * @param url - URL to verify
 * @param timeout - Request timeout in milliseconds
 * @returns true if URL is accessible, false otherwise
 */
async function verifyImageUrl(url: string, timeout = 2000): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      signal: controller.signal,
      method: 'HEAD',
      cache: 'force-cache',
    })

    clearTimeout(timeoutId)

    return response.ok
  } catch {
    return false
  }
}

/**
 * Main logo fetching function with automatic fallback cascade
 * Tries strategies in order: Clearbit → Google Favicon → Generated Avatar
 *
 * @param options - Logo fetch options
 * @returns LogoResult with URL and metadata
 *
 * @example
 * const result = await fetchServiceLogo({
 *   domain: "google.com",
 *   serviceName: "Google Workspace"
 * })
 * // result.url: "https://logo.clearbit.com/google.com"
 * // result.source: "clearbit"
 */
export async function fetchServiceLogo(
  options: LogoFetchOptions
): Promise<LogoResult> {
  const { domain, serviceName, size = 128, timeout = 3000 } = options

  // Strategy 1: Try Clearbit (high quality, branded)
  const clearbitUrl = await fetchClearbitLogo(domain, timeout)
  if (clearbitUrl) {
    return {
      url: clearbitUrl,
      source: 'clearbit',
      cached: false,
    }
  }

  // Strategy 2: Try Google Favicon (reliable fallback)
  const faviconUrl = getFaviconUrl(domain, size)
  const faviconValid = await verifyImageUrl(faviconUrl, Math.min(timeout, 2000))

  if (faviconValid) {
    return {
      url: faviconUrl,
      source: 'favicon',
      cached: false,
    }
  }

  // Strategy 3: Generated avatar (always works)
  return {
    url: getAvatarUrl(serviceName),
    source: 'avatar',
    cached: false,
  }
}

/**
 * Batch fetch logos for multiple services in parallel
 * Uses Promise.allSettled() to continue even if some fetches fail
 *
 * @param services - Array of services to fetch logos for
 * @returns Map of service name to LogoResult
 *
 * @example
 * const services = [
 *   { domain: "google.com", serviceName: "Google Workspace" },
 *   { domain: "mailchimp.com", serviceName: "Mailchimp" }
 * ]
 * const logos = await fetchLogosForServices(services)
 * // logos.get("Google Workspace") // LogoResult
 */
export async function fetchLogosForServices(
  services: Array<{ domain: string; serviceName: string; size?: number }>
): Promise<Map<string, LogoResult>> {
  const results = new Map<string, LogoResult>()

  // Fetch all logos in parallel
  const fetchPromises = services.map(async ({ domain, serviceName, size }) => {
    const result = await fetchServiceLogo({ domain, serviceName, size })
    return { key: serviceName, result }
  })

  // Use allSettled to continue even if some fail
  const settled = await Promise.allSettled(fetchPromises)

  // Collect successful results
  settled.forEach((outcome) => {
    if (outcome.status === 'fulfilled') {
      results.set(outcome.value.key, outcome.value.result)
    }
  })

  return results
}

/**
 * Preload logo URLs for faster display
 * Useful for client-side prefetching
 *
 * @param urls - Array of logo URLs to preload
 */
export function preloadLogos(urls: string[]): void {
  if (typeof window === 'undefined') return

  urls.forEach((url) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    link.as = 'image'
    document.head.appendChild(link)
  })
}
