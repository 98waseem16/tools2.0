/**
 * TLS-RPT Parser
 * Converts Nightcrawler TLS-RPT responses to internal TLSRPTAnalysis type
 */

import type { TLSRPTAnalysis, Check } from '@/lib/types'
import type { NightcrawlerTLSRPTResponse } from '../nightcrawler'

/**
 * Parse Nightcrawler TLS-RPT response into TLSRPTAnalysis
 */
export function parseTLSRPTResponse(
  domain: string,
  response: NightcrawlerTLSRPTResponse
): TLSRPTAnalysis {
  const { record, parsed, valid, errors = [], warnings = [] } = response

  // Determine status (TLS-RPT only uses 'valid' or 'missing')
  const status: 'valid' | 'missing' = record && valid ? 'valid' : 'missing'

  // Build checks array
  const checks: Check[] = []
  let checkId = 0

  // Record exists check
  checks.push({
    id: `tls-rpt-${checkId++}`,
    status: record ? 'pass' : 'fail',
    message: record ? 'TLS-RPT record found' : 'No TLS-RPT record found',
    details: record
      ? undefined
      : 'TLS-RPT provides reporting on TLS connection failures and certificate issues',
  })

  // Valid record check
  if (record) {
    checks.push({
      id: `tls-rpt-${checkId++}`,
      status: valid ? 'pass' : 'fail',
      message: valid ? 'TLS-RPT record is valid' : 'TLS-RPT record has syntax errors',
      details: errors.length > 0 ? errors.join('; ') : undefined,
    })
  }

  // Version check
  if (parsed?.version) {
    checks.push({
      id: `tls-rpt-${checkId++}`,
      status: 'pass',
      message: `Version: ${parsed.version}`,
    })
  }

  // Reporting addresses check
  if (parsed?.reportingAddresses && parsed.reportingAddresses.length > 0) {
    checks.push({
      id: `tls-rpt-${checkId++}`,
      status: 'pass',
      message: `${parsed.reportingAddresses.length} reporting address${
        parsed.reportingAddresses.length > 1 ? 'es' : ''
      } configured`,
    })
  } else if (record) {
    checks.push({
      id: `tls-rpt-${checkId++}`,
      status: 'fail',
      message: 'No reporting addresses configured',
      details: 'TLS-RPT record must specify at least one reporting address (rua=)',
    })
  }

  // Add warnings
  warnings.forEach((warning) => {
    checks.push({
      id: `tls-rpt-${checkId++}`,
      status: 'warning',
      message: warning,
    })
  })

  // Calculate score (0-5)
  let score = 0
  if (record) score = 2
  if (record && valid) score = 3
  if (parsed?.reportingAddresses && parsed.reportingAddresses.length > 0) score = 4
  if (
    parsed?.reportingAddresses &&
    parsed.reportingAddresses.length > 0 &&
    parsed.version === 'TLSRPTv1'
  )
    score = 5

  return {
    status,
    score: Math.round(score),
    record: record || null,
    reportingAddresses: parsed?.reportingAddresses || [],
    checks,
  }
}
