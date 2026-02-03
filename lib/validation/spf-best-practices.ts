/**
 * M3AAWG SPF Best Practices Knowledge Base
 * Based on M3AAWG SPF Best Current Practices (August 2017)
 *
 * This module implements industry-standard validation checks for SPF records,
 * covering syntax issues, over-authorization risks, deprecated features,
 * performance optimizations, and monitoring recommendations.
 */

import type { SPFParsed, Check, SPFMechanism } from '@/lib/types'
import type { NightcrawlerSPFResponse } from '@/lib/api/nightcrawler'

/**
 * Best practice check category
 */
export type CheckCategory =
  | 'syntax'             // RFC compliance, parsing issues
  | 'over-authorization' // Security risks, too permissive
  | 'deprecated'         // Obsolete features
  | 'performance'        // Optimization opportunities
  | 'monitoring'         // DMARC integration, reporting

/**
 * Best practice check definition
 */
interface BestPracticeCheck {
  id: string
  category: CheckCategory
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  impact: string[]
  recommendations: string[]
  m3aawgSection?: string
  validator: (
    parsed: SPFParsed | null,
    record: string | null,
    response: NightcrawlerSPFResponse
  ) => Check | null
}

/**
 * Format impact and recommendations for check details
 */
function formatCheckDetails(impact: string[], recommendations: string[], m3aawgSection?: string): string {
  let details = ''

  if (impact.length > 0) {
    details += 'Impact:\n' + impact.map(i => `• ${i}`).join('\n')
  }

  if (recommendations.length > 0) {
    if (details) details += '\n\n'
    details += 'Recommendations:\n' + recommendations.map(r => `• ${r}`).join('\n')
  }

  if (m3aawgSection) {
    if (details) details += '\n\n'
    details += `M3AAWG Section: ${m3aawgSection}`
  }

  return details
}

/**
 * M3AAWG Best Practice Checks
 */
const BEST_PRACTICE_CHECKS: BestPracticeCheck[] = [
  // ========================================
  // SYNTAX ISSUES (Section 3.2.1)
  // ========================================

  {
    id: 'bp-multiple-records',
    category: 'syntax',
    severity: 'critical',
    title: 'Multiple SPF Records Detected',
    description: 'Only ONE SPF TXT record should exist per domain',
    impact: [
      'Unpredictable SPF evaluation behavior',
      'Email servers may use wrong record',
      'Some emails may be incorrectly rejected or accepted'
    ],
    recommendations: [
      'Combine all SPF mechanisms into a single TXT record',
      'Delete duplicate SPF records from DNS'
    ],
    m3aawgSection: '3.2.1',
    validator: (parsed, record, response) => {
      // Check if API returned multiple SPF records
      const entries = response.record?.entries || []
      if (entries.length > 1) {
        return {
          id: 'bp-multiple-records',
          status: 'fail',
          message: `Multiple SPF records detected (${entries.length} records)`,
          details: formatCheckDetails(
            [
              'Unpredictable SPF evaluation behavior',
              'Email servers may use wrong record',
              'Some emails may be incorrectly rejected or accepted'
            ],
            [
              'Combine all SPF mechanisms into a single TXT record',
              'Delete duplicate SPF records from DNS'
            ],
            '3.2.1'
          )
        }
      }
      return null
    }
  },

  {
    id: 'bp-unresolvable-hostname',
    category: 'syntax',
    severity: 'critical',
    title: 'Unresolvable Hostname in Mechanism',
    description: 'include:, a:, or mx: points to non-existent domain',
    impact: [
      'SPF check fails with DNS error',
      'Counts toward 10 lookup limit',
      'May cause legitimate emails to be rejected'
    ],
    recommendations: [
      'Verify all domains in include:, a:, mx: resolve correctly',
      'Remove broken mechanisms',
      'Contact third-party provider if their include: is broken'
    ],
    m3aawgSection: '3.2.1',
    validator: (parsed, record, response) => {
      // Check Nightcrawler API checks for DNS errors
      const dnsErrors = response.checks?.filter(check =>
        check.msg.toLowerCase().includes('nxdomain') ||
        check.msg.toLowerCase().includes('dns error') ||
        check.msg.toLowerCase().includes('not found') ||
        check.msg.toLowerCase().includes('unresolvable')
      ) || []

      if (dnsErrors.length > 0) {
        return {
          id: 'bp-unresolvable-hostname',
          status: 'fail',
          message: 'Unresolvable hostname detected in SPF record',
          details: formatCheckDetails(
            [
              'SPF check fails with DNS error',
              'Counts toward 10 lookup limit',
              'May cause legitimate emails to be rejected'
            ],
            [
              'Verify all domains in include:, a:, mx: resolve correctly',
              'Remove broken mechanisms',
              'Contact third-party provider if their include: is broken'
            ],
            '3.2.1'
          )
        }
      }
      return null
    }
  },

  {
    id: 'bp-type99-deprecated',
    category: 'deprecated',
    severity: 'warning',
    title: 'SPF Type 99 Record Detected',
    description: 'SPF-specific DNS record type (Type 99) is obsolete',
    impact: [
      'Modern email servers ignore Type 99 records',
      'Only TXT records are used for SPF',
      'Wastes DNS resources'
    ],
    recommendations: [
      'Delete Type 99 SPF record from DNS',
      'Ensure SPF TXT record is present'
    ],
    m3aawgSection: '3.2.1',
    validator: (parsed, record, response) => {
      // Check if Nightcrawler reported Type 99
      const type99Check = response.checks?.find(check =>
        check.msg.toLowerCase().includes('type 99') ||
        check.msg.toLowerCase().includes('spf rr')
      )

      if (type99Check) {
        return {
          id: 'bp-type99-deprecated',
          status: 'warning',
          message: 'SPF Type 99 record detected (deprecated)',
          details: formatCheckDetails(
            [
              'Modern email servers ignore Type 99 records',
              'Only TXT records are used for SPF',
              'Wastes DNS resources'
            ],
            [
              'Delete Type 99 SPF record from DNS',
              'Ensure SPF TXT record is present'
            ],
            '3.2.1'
          )
        }
      }
      return null
    }
  },

  {
    id: 'bp-redirect-positioning',
    category: 'syntax',
    severity: 'warning',
    title: 'Redirect Directive Positioning Issue',
    description: 'redirect: must be last mechanism and cannot coexist with all',
    impact: [
      'Redirect ignored if not last',
      'Conflicting directives cause unpredictable behavior'
    ],
    recommendations: [
      'Move redirect: to end of record',
      'Remove all mechanism if using redirect:',
      'Or remove redirect: if using all mechanism'
    ],
    m3aawgSection: '3.2.1',
    validator: (parsed, record, response) => {
      if (!parsed) return null

      const redirectIndex = parsed.mechanisms.findIndex(m => m.type === 'redirect')
      const allIndex = parsed.mechanisms.findIndex(m => m.type === 'all')

      if (redirectIndex !== -1) {
        // redirect: should be last
        if (redirectIndex !== parsed.mechanisms.length - 1) {
          return {
            id: 'bp-redirect-positioning',
            status: 'warning',
            message: 'redirect: directive is not last in record',
            details: formatCheckDetails(
              [
                'Redirect ignored if not last',
                'Conflicting directives cause unpredictable behavior'
              ],
              [
                'Move redirect: to end of record'
              ],
              '3.2.1'
            )
          }
        }

        // redirect: conflicts with all
        if (allIndex !== -1) {
          return {
            id: 'bp-redirect-positioning',
            status: 'warning',
            message: 'redirect: and all mechanism both present (conflicting)',
            details: formatCheckDetails(
              [
                'Conflicting directives cause unpredictable behavior'
              ],
              [
                'Remove all mechanism if using redirect:',
                'Or remove redirect: if using all mechanism'
              ],
              '3.2.1'
            )
          }
        }
      }
      return null
    }
  },

  {
    id: 'bp-record-size',
    category: 'syntax',
    severity: 'warning',
    title: 'SPF Record Approaching Size Limit',
    description: 'DNS TXT records have a 255 character per string limit',
    impact: [
      'Records >255 chars may be split or truncated',
      'Some email servers may not handle long records correctly',
      'Potential for parsing errors'
    ],
    recommendations: [
      'Keep SPF record under 255 characters',
      'Use SPF flattening services for complex records',
      'Consolidate IP addresses into CIDR blocks'
    ],
    m3aawgSection: '3.1',
    validator: (parsed, record, response) => {
      if (!parsed) return null

      if (parsed.recordSize > 400) {
        return {
          id: 'bp-record-size',
          status: 'fail',
          message: `SPF record is ${parsed.recordSize} characters (critically long)`,
          details: formatCheckDetails(
            [
              'Record exceeds recommended DNS TXT limits',
              'High risk of truncation or parsing errors',
              'Email servers may reject or misparse the record'
            ],
            [
              'URGENTLY reduce record size below 400 characters',
              'Use SPF flattening services',
              'Consolidate IP addresses into CIDR blocks',
              'Remove unused include: mechanisms'
            ],
            '3.1'
          )
        }
      }

      if (parsed.recordSize > 255) {
        return {
          id: 'bp-record-size',
          status: 'warning',
          message: `SPF record is ${parsed.recordSize} characters (exceeds single string limit)`,
          details: formatCheckDetails(
            [
              'Records >255 chars may be split or truncated',
              'Some email servers may not handle long records correctly',
              'Potential for parsing errors'
            ],
            [
              'Keep SPF record under 255 characters',
              'Use SPF flattening services for complex records',
              'Consolidate IP addresses into CIDR blocks'
            ],
            '3.1'
          )
        }
      }

      return null
    }
  },

  // ========================================
  // OVER-AUTHORIZATION (Section 3.2.2)
  // ========================================

  {
    id: 'bp-wide-netblocks',
    category: 'over-authorization',
    severity: 'warning',
    title: 'Wide CIDR Netblock Detected',
    description: '/8 or /16 netblocks authorize excessive IP addresses',
    impact: [
      'Authorizes millions of IPs to send email',
      'Increases spoofing risk',
      'Violates principle of least privilege'
    ],
    recommendations: [
      'Use /24 or smaller netblocks when possible',
      'List individual IPs if only a few servers',
      'Consult with network team for actual sending IPs'
    ],
    m3aawgSection: '3.2.2',
    validator: (parsed, record, response) => {
      if (!parsed) return null

      const wideBlocks: { mechanism: SPFMechanism; ipCount: number }[] = []

      parsed.mechanisms.forEach(m => {
        if (m.type === 'ip4' && m.value.includes('/')) {
          const mask = parseInt(m.value.split('/')[1])
          if (mask <= 16) {
            const ipCount = Math.pow(2, 32 - mask)
            wideBlocks.push({ mechanism: m, ipCount })
          }
        } else if (m.type === 'ip6' && m.value.includes('/')) {
          const mask = parseInt(m.value.split('/')[1])
          if (mask <= 48) {
            const ipCount = Math.pow(2, 128 - mask)
            wideBlocks.push({ mechanism: m, ipCount })
          }
        }
      })

      if (wideBlocks.length > 0) {
        const blockList = wideBlocks
          .map(b => `${b.mechanism.value} (${b.ipCount.toLocaleString()} IPs)`)
          .join(', ')

        return {
          id: 'bp-wide-netblocks',
          status: 'warning',
          message: `Wide CIDR blocks detected: ${blockList}`,
          details: formatCheckDetails(
            [
              'Authorizes millions of IPs to send email',
              'Increases spoofing risk',
              'Violates principle of least privilege'
            ],
            [
              'Use /24 or smaller netblocks when possible',
              'List individual IPs if only a few servers',
              'Consult with network team for actual sending IPs'
            ],
            '3.2.2'
          )
        }
      }

      return null
    }
  },

  {
    id: 'bp-unvetted-includes',
    category: 'over-authorization',
    severity: 'info',
    title: 'Review Third-Party SPF Includes',
    description: 'Ensure all include: mechanisms are from trusted sources',
    impact: [
      'Third-party can add IPs without your knowledge',
      'Over-authorization if provider is compromised',
      'Lookups consumed by nested includes'
    ],
    recommendations: [
      'Regularly audit include: mechanisms',
      'Remove unused third-party services',
      'Consider IP flattening for untrusted providers',
      'Monitor DMARC reports for unexpected senders'
    ],
    m3aawgSection: '3.2.2',
    validator: (parsed, record, response) => {
      if (!parsed) return null

      const includes = parsed.mechanisms.filter(m => m.type === 'include')

      if (includes.length > 5) {
        return {
          id: 'bp-unvetted-includes',
          status: 'warning',
          message: `${includes.length} include: mechanisms detected - review regularly`,
          details: formatCheckDetails(
            [
              'Third-party can add IPs without your knowledge',
              'Over-authorization if provider is compromised',
              'Lookups consumed by nested includes'
            ],
            [
              'Regularly audit include: mechanisms',
              'Remove unused third-party services',
              'Consider IP flattening for untrusted providers',
              'Monitor DMARC reports for unexpected senders'
            ],
            '3.2.2'
          )
        }
      }

      return null
    }
  },

  // ========================================
  // DEPRECATED FEATURES (Section 3.2.3)
  // ========================================

  {
    id: 'bp-senderid-deprecated',
    category: 'deprecated',
    severity: 'warning',
    title: 'SenderID (spf2.0) is Deprecated',
    description: 'spf2.0 records are obsolete and ignored',
    impact: [
      'Modern email servers only use spf1',
      'spf2.0 is not evaluated',
      'Wastes DNS resources'
    ],
    recommendations: [
      'Remove spf2.0 records',
      'Only use v=spf1 records'
    ],
    m3aawgSection: '3.2.3',
    validator: (parsed, record, response) => {
      if (record && record.toLowerCase().includes('spf2.0')) {
        return {
          id: 'bp-senderid-deprecated',
          status: 'warning',
          message: 'SenderID (spf2.0) record detected (obsolete)',
          details: formatCheckDetails(
            [
              'Modern email servers only use spf1',
              'spf2.0 is not evaluated',
              'Wastes DNS resources'
            ],
            [
              'Remove spf2.0 records',
              'Only use v=spf1 records'
            ],
            '3.2.3'
          )
        }
      }
      return null
    }
  },

  {
    id: 'bp-a-mx-performance',
    category: 'performance',
    severity: 'info',
    title: 'A/MX Mechanisms Cause Extra DNS Lookups',
    description: 'a: and mx: mechanisms require DNS queries',
    impact: [
      'Each a: or mx: consumes 1 DNS lookup',
      'Slower SPF evaluation',
      'Contributes to 10 lookup limit'
    ],
    recommendations: [
      'Consider using ip4:/ip6: instead of a:',
      'List mail server IPs directly when possible',
      'Reserve mx: only when mail servers change frequently'
    ],
    m3aawgSection: '3.2.3',
    validator: (parsed, record, response) => {
      if (!parsed) return null

      const aMechs = parsed.mechanisms.filter(m => m.type === 'a' || m.type === 'mx')

      if (aMechs.length > 2) {
        const mechList = aMechs.map(m => `${m.type}:${m.value || ''}`).join(', ')
        return {
          id: 'bp-a-mx-performance',
          status: 'warning',
          message: `${aMechs.length} a:/mx: mechanisms detected: ${mechList}`,
          details: formatCheckDetails(
            [
              'Each a: or mx: consumes 1 DNS lookup',
              'Slower SPF evaluation',
              'Contributes to 10 lookup limit'
            ],
            [
              'Consider using ip4:/ip6: instead of a:',
              'List mail server IPs directly when possible',
              'Reserve mx: only when mail servers change frequently'
            ],
            '3.2.3'
          )
        }
      }

      return null
    }
  },

  // ========================================
  // MONITORING (Section 4)
  // ========================================

  {
    id: 'bp-dmarc-recommendation',
    category: 'monitoring',
    severity: 'info',
    title: 'DMARC Monitoring Recommended',
    description: 'Use DMARC to monitor SPF effectiveness',
    impact: [
      'No visibility into SPF failures',
      'Cannot detect misconfigurations',
      'Miss unauthorized sending attempts'
    ],
    recommendations: [
      'Implement DMARC with p=none for monitoring',
      'Review DMARC aggregate reports regularly',
      'Move to p=quarantine or p=reject once confident'
    ],
    m3aawgSection: '4',
    validator: (parsed, record, response) => {
      // Always return info suggestion for DMARC
      return {
        id: 'bp-dmarc-recommendation',
        status: 'pass',
        message: 'Consider implementing DMARC for SPF monitoring',
        details: formatCheckDetails(
          [
            'No visibility into SPF failures without DMARC',
            'Cannot detect misconfigurations',
            'Miss unauthorized sending attempts'
          ],
          [
            'Implement DMARC with p=none for monitoring',
            'Review DMARC aggregate reports regularly',
            'Move to p=quarantine or p=reject once confident',
            'Use our DMARC checker to analyze your DMARC record'
          ],
          '4'
        )
      }
    }
  }
]

/**
 * Run all M3AAWG best practice checks
 * @param parsed - Parsed SPF data
 * @param record - Raw SPF record string
 * @param response - Nightcrawler API response
 * @returns Array of check results
 */
export function runBestPracticeChecks(
  parsed: SPFParsed | null,
  record: string | null,
  response: NightcrawlerSPFResponse
): Check[] {
  const results: Check[] = []

  for (const check of BEST_PRACTICE_CHECKS) {
    const result = check.validator(parsed, record, response)
    if (result) {
      results.push(result)
    }
  }

  return results
}
