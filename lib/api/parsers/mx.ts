/**
 * MX Parser
 * Converts Nightcrawler MX responses to internal MXAnalysis type
 */

import type { MXAnalysis, MXRecord, RecordStatus, Check } from '@/lib/types'
import type { NightcrawlerMXResponse } from '../nightcrawler'

/**
 * Parse Nightcrawler MX response into MXAnalysis
 */
export function parseMXResponse(
  domain: string,
  response: NightcrawlerMXResponse
): MXAnalysis {
  const { mailservers = [], mx_provider } = response

  // Determine status
  let status: RecordStatus = 'missing'
  if (mailservers.length > 0) {
    status = 'valid'
  }

  // Build checks array
  const checks: Check[] = []
  let checkId = 0

  // Records exist check
  checks.push({
    id: `mx-${checkId++}`,
    status: mailservers.length > 0 ? 'pass' : 'fail',
    message: mailservers.length > 0
      ? `${mailservers.length} MX record${mailservers.length > 1 ? 's' : ''} found`
      : 'No MX records found',
    details: mailservers.length === 0 ? 'Add MX records to receive email' : undefined,
  })

  // Redundancy check
  if (mailservers.length > 0) {
    const redundancyStatus = mailservers.length >= 2 ? 'pass' : 'warning'
    checks.push({
      id: `mx-${checkId++}`,
      status: redundancyStatus,
      message: mailservers.length >= 2
        ? 'Multiple MX records provide redundancy'
        : 'Only one MX record configured',
      details: mailservers.length === 1
        ? 'Consider adding backup MX records for redundancy'
        : undefined,
    })
  }

  // Valid priorities check
  if (mailservers.length > 1) {
    const priorities = mailservers.map((r) => r.preference)
    const uniquePriorities = new Set(priorities)
    if (uniquePriorities.size !== priorities.length) {
      checks.push({
        id: `mx-${checkId++}`,
        status: 'warning',
        message: 'Duplicate MX priorities detected',
        details: 'MX records should have unique priorities for proper mail routing',
      })
    } else {
      checks.push({
        id: `mx-${checkId++}`,
        status: 'pass',
        message: 'MX priorities are unique and properly configured',
      })
    }
  }

  // Provider detection
  if (mx_provider) {
    checks.push({
      id: `mx-${checkId++}`,
      status: 'pass',
      message: `Email provider: ${mx_provider}`,
    })
  }

  // Calculate score (0-5)
  let score = 0
  if (mailservers.length > 0) score = 2
  if (mailservers.length >= 2) score = 4
  if (mailservers.length >= 2 && mx_provider) score = 5

  // Transform records to internal format
  const mxRecords: MXRecord[] = mailservers.map((r) => ({
    priority: r.preference,
    hostname: r.exchange,
    ipAddresses: [], // API doesn't provide IPs in this response
  }))

  return {
    status,
    score: Math.round(score),
    records: mxRecords,
    provider: mx_provider || null,
    checks,
  }
}
