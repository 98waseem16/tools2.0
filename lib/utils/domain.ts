/**
 * Domain Validation and Normalization Utilities
 */

/**
 * Normalize a domain input by removing protocol, www, paths, etc.
 */
export function normalizeDomain(input: string): string {
  let domain = input.trim().toLowerCase()

  // Remove protocol (http://, https://, etc.)
  domain = domain.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '')

  // Remove www. prefix
  domain = domain.replace(/^www\./, '')

  // Remove path, query, and fragment
  domain = domain.split('/')[0]
  domain = domain.split('?')[0]
  domain = domain.split('#')[0]

  // Remove port
  domain = domain.split(':')[0]

  // Remove trailing dot
  domain = domain.replace(/\.$/, '')

  return domain
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  // Basic domain regex
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i

  if (!domain || domain.length === 0) {
    return false
  }

  if (domain.length > 253) {
    return false
  }

  // Check each label (part between dots)
  const labels = domain.split('.')
  for (const label of labels) {
    if (label.length === 0 || label.length > 63) {
      return false
    }
  }

  return domainRegex.test(domain)
}

/**
 * Validate and normalize domain input
 * Returns normalized domain or null if invalid
 */
export function validateAndNormalizeDomain(input: string): string | null {
  const normalized = normalizeDomain(input)

  if (!isValidDomain(normalized)) {
    return null
  }

  return normalized
}

/**
 * Get error message for invalid domain
 */
export function getDomainValidationError(input: string): string | null {
  const normalized = normalizeDomain(input)

  if (!normalized || normalized.length === 0) {
    return 'Please enter a domain name'
  }

  if (normalized.length > 253) {
    return 'Domain name is too long (max 253 characters)'
  }

  if (!normalized.includes('.')) {
    return 'Please enter a valid domain (e.g., example.com)'
  }

  if (!isValidDomain(normalized)) {
    return 'Invalid domain format. Please enter a valid domain (e.g., example.com)'
  }

  return null
}

/**
 * Extract domain from email address
 */
export function extractDomainFromEmail(email: string): string | null {
  const match = email.match(/@([a-z0-9.-]+\.[a-z]{2,})$/i)
  return match ? match[1].toLowerCase() : null
}

/**
 * Check if input looks like an email address
 */
export function isEmailAddress(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
}

/**
 * Parse domain input - handles domains and email addresses
 */
export function parseDomainInput(input: string): {
  domain: string | null
  error: string | null
  wasEmail: boolean
} {
  const trimmed = input.trim()

  // Check if it's an email
  if (isEmailAddress(trimmed)) {
    const domain = extractDomainFromEmail(trimmed)
    if (domain) {
      return {
        domain: validateAndNormalizeDomain(domain),
        error: null,
        wasEmail: true,
      }
    }
    return {
      domain: null,
      error: 'Could not extract domain from email address',
      wasEmail: true,
    }
  }

  // Treat as domain
  const normalized = validateAndNormalizeDomain(trimmed)
  if (normalized) {
    return {
      domain: normalized,
      error: null,
      wasEmail: false,
    }
  }

  return {
    domain: null,
    error: getDomainValidationError(trimmed),
    wasEmail: false,
  }
}
