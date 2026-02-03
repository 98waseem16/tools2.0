/**
 * SPF Utility Functions
 * Helper functions for SPF analysis, validation, and optimization
 */

import type { SPFMechanism, SPFParsed, Check, SPFIncludeNode, ComplexityRating, SPFComplexityAnalysis } from '@/lib/types'

/**
 * Estimate DNS lookups for a mechanism
 */
export function estimateLookups(mechanism: string, value?: string): number {
  // Mechanisms that require DNS lookups
  const lookupMechanisms = ['include', 'a', 'mx', 'exists', 'redirect', 'ptr']
  return lookupMechanisms.includes(mechanism.toLowerCase()) ? 1 : 0
}

/**
 * Build include tree from mechanisms
 * Note: This builds a simple tree from the direct mechanisms
 * For full recursive expansion, additional API calls would be needed
 */
export function buildIncludeTree(mechanisms: SPFMechanism[], domain: string): SPFIncludeNode | null {
  const includeMechanisms = mechanisms.filter(m => m.type === 'include')

  if (includeMechanisms.length === 0) {
    return null
  }

  // Build root node
  const rootNode: SPFIncludeNode = {
    domain,
    mechanism: { type: 'include', qualifier: '+', value: domain, lookups: 0 },
    lookups: includeMechanisms.reduce((sum, m) => sum + m.lookups, 0),
    children: [],
    depth: 0,
  }

  // Add child nodes for each include
  rootNode.children = includeMechanisms.map((mech) => ({
    domain: mech.value,
    mechanism: mech,
    lookups: mech.lookups,
    children: [], // Would need recursive API calls to expand
    depth: 1,
  }))

  return rootNode
}

/**
 * Analyze SPF record complexity
 */
export function analyzeRecordComplexity(parsed: SPFParsed): SPFComplexityAnalysis {
  const { mechanisms, lookupCount, recordSize } = parsed
  const mechanismCount = mechanisms.length

  let rating: ComplexityRating = 'simple'
  const suggestions: string[] = []

  // Determine complexity rating
  if (mechanismCount > 10 || lookupCount > 8) {
    rating = 'complex'
    suggestions.push('Consider simplifying your SPF record to improve deliverability')
  } else if (mechanismCount > 5 || lookupCount > 5) {
    rating = 'moderate'
  }

  // Record size check (DNS TXT record soft limit is 255 chars per string, 512 total)
  if (recordSize && recordSize > 450) {
    suggestions.push('SPF record is approaching DNS TXT record size limit')
  }

  // Too many lookups
  if (lookupCount > 8) {
    suggestions.push('Close to 10 lookup limit - consider consolidating includes or using IP ranges')
  }

  // Too many mechanisms
  if (mechanismCount > 8) {
    suggestions.push('Many mechanisms defined - consider grouping related IPs into CIDR blocks')
  }

  // Check for consolidation opportunities
  const ip4Count = mechanisms.filter(m => m.type === 'ip4').length
  const ip6Count = mechanisms.filter(m => m.type === 'ip6').length

  if (ip4Count > 3) {
    suggestions.push(`${ip4Count} separate IPv4 entries - consider consolidating into CIDR blocks`)
  }
  if (ip6Count > 2) {
    suggestions.push(`${ip6Count} separate IPv6 entries - consider consolidating into larger ranges`)
  }

  // Good complexity
  if (rating === 'simple' && lookupCount <= 5) {
    suggestions.push('Well-optimized SPF record with efficient lookup usage')
  }

  return {
    rating,
    mechanismCount,
    lookupCount,
    recordSize: recordSize || 0,
    suggestions,
  }
}

/**
 * Validate mechanisms for common issues
 */
export function validateMechanisms(mechanisms: SPFMechanism[]): Check[] {
  const checks: Check[] = []
  let checkId = 0

  // Check for deprecated ptr mechanism
  const hasPTR = mechanisms.some(m => m.type === 'ptr')
  checks.push({
    id: `mech-${checkId++}`,
    status: hasPTR ? 'warning' : 'pass',
    message: hasPTR ? 'Deprecated PTR mechanism detected' : 'No deprecated mechanisms',
    details: hasPTR ? 'The ptr: mechanism is deprecated and should be avoided' : undefined,
  })

  // Check for exists mechanism (rarely used, often misconfigured)
  const hasExists = mechanisms.some(m => m.type === 'exists')
  if (hasExists) {
    checks.push({
      id: `mech-${checkId++}`,
      status: 'warning',
      message: 'EXISTS mechanism detected',
      details: 'The exists: mechanism is complex and rarely needed. Ensure it is configured correctly.',
    })
  }

  // Validate IP mechanisms have values
  const ipMechanisms = mechanisms.filter(m => m.type === 'ip4' || m.type === 'ip6')
  ipMechanisms.forEach((mech, index) => {
    if (!mech.value) {
      checks.push({
        id: `mech-${checkId++}`,
        status: 'fail',
        message: `${mech.type.toUpperCase()} mechanism missing value`,
        details: 'IP mechanisms must specify an IP address or CIDR block',
      })
    } else {
      // Basic CIDR validation
      const isCIDR = mech.value.includes('/')
      if (mech.type === 'ip4' && isCIDR) {
        const [ip, mask] = mech.value.split('/')
        const maskNum = parseInt(mask, 10)
        if (maskNum < 0 || maskNum > 32) {
          checks.push({
            id: `mech-${checkId++}`,
            status: 'fail',
            message: `Invalid IPv4 CIDR notation: ${mech.value}`,
            details: 'IPv4 netmask must be between 0 and 32',
          })
        }
      } else if (mech.type === 'ip6' && isCIDR) {
        const [ip, mask] = mech.value.split('/')
        const maskNum = parseInt(mask, 10)
        if (maskNum < 0 || maskNum > 128) {
          checks.push({
            id: `mech-${checkId++}`,
            status: 'fail',
            message: `Invalid IPv6 CIDR notation: ${mech.value}`,
            details: 'IPv6 netmask must be between 0 and 128',
          })
        }
      }
    }
  })

  // Check for include mechanisms with values
  const includeMechanisms = mechanisms.filter(m => m.type === 'include')
  includeMechanisms.forEach((mech) => {
    if (!mech.value) {
      checks.push({
        id: `mech-${checkId++}`,
        status: 'fail',
        message: 'INCLUDE mechanism missing domain',
        details: 'Include mechanisms must specify a domain to include',
      })
    }
  })

  // Check for suspicious qualifiers
  const failQualifiers = mechanisms.filter(m => m.qualifier === '-' && m.type !== 'all')
  if (failQualifiers.length > 0) {
    checks.push({
      id: `mech-${checkId++}`,
      status: 'warning',
      message: `${failQualifiers.length} mechanism(s) using hard fail (-)`,
      details: 'Hard fail (-) on non-all mechanisms can cause legitimate emails to be rejected',
    })
  }

  // If no issues found
  if (checks.length === 0 || checks.every(c => c.status === 'pass')) {
    checks.push({
      id: `mech-${checkId++}`,
      status: 'pass',
      message: 'All mechanisms are properly configured',
    })
  }

  return checks
}

/**
 * Generate SPF optimization recommendations
 */
export function optimizeSPF(parsed: SPFParsed): string[] {
  const recommendations: string[] = []
  const { mechanisms, lookupCount, allQualifier, recordSize } = parsed

  // Lookup optimization
  if (lookupCount > 8) {
    recommendations.push('Reduce DNS lookups by consolidating includes or flattening your SPF record')
  }

  // IP consolidation
  const ip4Mechanisms = mechanisms.filter(m => m.type === 'ip4')
  if (ip4Mechanisms.length > 3) {
    recommendations.push('Consolidate multiple IPv4 addresses into larger CIDR blocks to reduce record length')
  }

  const ip6Mechanisms = mechanisms.filter(m => m.type === 'ip6')
  if (ip6Mechanisms.length > 2) {
    recommendations.push('Consolidate IPv6 addresses into larger CIDR ranges')
  }

  // Include optimization
  const includeMechanisms = mechanisms.filter(m => m.type === 'include')
  if (includeMechanisms.length > 5) {
    recommendations.push('Consider whether all include mechanisms are necessary - remove unused services')
  }

  // All mechanism optimization
  if (allQualifier === '~all') {
    recommendations.push('Upgrade to "-all" (hard fail) for stronger email authentication once confident in your configuration')
  } else if (allQualifier === '+all' || allQualifier === '?all') {
    recommendations.push('Change to "-all" or "~all" - current setting allows any server to send email')
  }

  // Record size optimization
  if (recordSize && recordSize > 400) {
    recommendations.push('SPF record is long - consider SPF flattening services or consolidating mechanisms')
  }

  // Mechanism order optimization
  const allMechIndex = mechanisms.findIndex(m => m.type === 'all')
  if (allMechIndex !== -1 && allMechIndex < mechanisms.length - 1) {
    recommendations.push('Move "all" mechanism to the end of your SPF record for optimal processing')
  }

  // Check for redundant mechanisms
  const includeValues = includeMechanisms.map(m => m.value.toLowerCase())
  const duplicates = includeValues.filter((v, i) => includeValues.indexOf(v) !== i)
  if (duplicates.length > 0) {
    recommendations.push('Duplicate include mechanisms detected - remove redundant entries')
  }

  // If well optimized
  if (recommendations.length === 0) {
    recommendations.push('SPF record is well-optimized with no immediate improvements needed')
  }

  return recommendations
}

/**
 * Segment of the SPF record for display (record-first UI)
 */
export interface SPFRecordSegment {
  text: string
  mechanism?: SPFMechanism
  isVersion?: boolean
  isAll?: boolean
}

/**
 * Build display segments from parsed SPF for record-first UI.
 * Each segment is one React node (version, mechanism, or all).
 */
export function buildRecordSegments(parsed: SPFParsed | null): SPFRecordSegment[] {
  if (!parsed?.mechanisms?.length) return []

  const segments: SPFRecordSegment[] = []

  // Version: "v=spf1"
  const versionText = parsed.version.startsWith('v=') ? parsed.version : `v=${parsed.version}`
  segments.push({ text: versionText, isVersion: true })

  for (const m of parsed.mechanisms) {
    const q = m.qualifier !== '+' ? m.qualifier : ''
    if (m.type === 'all') {
      segments.push({ text: ` ${q}all`, mechanism: m, isAll: true })
    } else if (m.type === 'redirect') {
      segments.push({ text: ` ${q}redirect=${m.value}`, mechanism: m })
    } else {
      // include, a, mx, ip4, ip6, exists, ptr
      const sep = m.value ? ':' : ''
      segments.push({ text: ` ${q}${m.type}${sep}${m.value}`, mechanism: m })
    }
  }

  return segments
}

/**
 * Format qualifier for display
 */
export function formatQualifier(qualifier: string): string {
  const map: Record<string, string> = {
    '+': 'Pass',
    '-': 'Fail',
    '~': 'SoftFail',
    '?': 'Neutral',
  }
  return map[qualifier] || qualifier
}

/**
 * Get mechanism type display name
 */
export function getMechanismTypeName(type: string): string {
  const names: Record<string, string> = {
    'all': 'All',
    'include': 'Include',
    'a': 'A Record',
    'mx': 'MX Record',
    'ip4': 'IPv4',
    'ip6': 'IPv6',
    'exists': 'Exists',
    'redirect': 'Redirect',
    'ptr': 'PTR (Deprecated)',
  }
  return names[type.toLowerCase()] || type.toUpperCase()
}

/**
 * Get mechanism icon/emoji
 */
export function getMechanismIcon(type: string): string {
  const icons: Record<string, string> = {
    'all': '🌐',
    'include': '📥',
    'a': '🔗',
    'mx': '📧',
    'ip4': '🌍',
    'ip6': '🌏',
    'exists': '🔍',
    'redirect': '↪️',
    'ptr': '⚠️',
  }
  return icons[type.toLowerCase()] || '📋'
}

/**
 * Analyze CIDR block size for over-authorization
 * Returns analysis of how many IPs are authorized by this CIDR block
 */
export function analyzeCIDRSize(
  cidr: string,
  type: 'ip4' | 'ip6'
): {
  size: 'wide' | 'moderate' | 'narrow'
  ipCount: number
  recommendation: string
} {
  const [ip, mask] = cidr.split('/')
  const maskNum = parseInt(mask, 10)

  if (type === 'ip4') {
    const ipCount = Math.pow(2, 32 - maskNum)

    if (maskNum <= 16) {
      return {
        size: 'wide',
        ipCount,
        recommendation: 'Use /24 or smaller netblocks to reduce over-authorization risk'
      }
    }

    if (maskNum <= 20) {
      return {
        size: 'moderate',
        ipCount,
        recommendation: 'Consider using narrower range if possible'
      }
    }

    return {
      size: 'narrow',
      ipCount,
      recommendation: 'Good CIDR size for email authorization'
    }
  } else {
    // IPv6 analysis
    const ipCount = Math.pow(2, 128 - maskNum)

    if (maskNum <= 48) {
      return {
        size: 'wide',
        ipCount,
        recommendation: 'Use /64 or smaller netblocks for IPv6'
      }
    }

    return {
      size: 'narrow',
      ipCount,
      recommendation: 'Good CIDR size for IPv6'
    }
  }
}

/**
 * Check for referential loops in includes
 * Detects if any include: mechanism points back to the same domain
 */
export function detectIncludeLoops(
  mechanisms: SPFMechanism[],
  domain: string
): string[] {
  const loops: string[] = []

  mechanisms.forEach((m) => {
    if (m.type === 'include' && m.value.includes(domain)) {
      loops.push(m.value)
    }
  })

  return loops
}
