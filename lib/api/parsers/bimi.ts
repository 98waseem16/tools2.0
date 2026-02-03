/**
 * BIMI Parser
 * Converts Nightcrawler BIMI responses to internal BIMIAnalysis type
 */

import type { BIMIAnalysis, Check } from '@/lib/types'
import type { NightcrawlerBIMIResponse } from '../nightcrawler'

/**
 * Parse Nightcrawler BIMI response into BIMIAnalysis
 */
export function parseBIMIResponse(
  domain: string,
  response: NightcrawlerBIMIResponse
): BIMIAnalysis {
  const { record, parsed, valid, errors = [], warnings = [] } = response

  // Determine status (BIMI only uses 'valid' or 'missing')
  const status: 'valid' | 'missing' = record && valid ? 'valid' : 'missing'

  // Build checks array
  const checks: Check[] = []
  let checkId = 0

  // Record exists check
  checks.push({
    id: `bimi-${checkId++}`,
    status: record ? 'pass' : 'info',
    message: record ? 'BIMI record found' : 'No BIMI record found',
    details: record
      ? undefined
      : 'BIMI displays your brand logo in supported email clients. Requires DMARC enforcement.',
  })

  // Valid record check
  if (record) {
    checks.push({
      id: `bimi-${checkId++}`,
      status: valid ? 'pass' : 'fail',
      message: valid ? 'BIMI record is valid' : 'BIMI record has syntax errors',
      details: errors.length > 0 ? errors.join('; ') : undefined,
    })
  }

  // Version check
  if (parsed?.version) {
    checks.push({
      id: `bimi-${checkId++}`,
      status: 'pass',
      message: `Version: ${parsed.version}`,
    })
  }

  // Logo URL check
  if (parsed?.logoUrl) {
    checks.push({
      id: `bimi-${checkId++}`,
      status: 'pass',
      message: 'Logo URL configured',
      details: parsed.logoUrl,
    })
  } else if (record) {
    checks.push({
      id: `bimi-${checkId++}`,
      status: 'fail',
      message: 'No logo URL configured',
      details: 'BIMI record must specify a logo URL (l=)',
    })
  }

  // Certificate URL check (VMC)
  if (parsed?.certificateUrl) {
    checks.push({
      id: `bimi-${checkId++}`,
      status: 'pass',
      message: 'Verified Mark Certificate (VMC) configured',
      details: 'VMC enables logo display in more email clients',
    })
  } else if (record && parsed?.logoUrl) {
    checks.push({
      id: `bimi-${checkId++}`,
      status: 'info',
      message: 'No VMC configured',
      details: 'VMC is optional but recommended for broader logo display support',
    })
  }

  // Add warnings
  warnings.forEach((warning) => {
    checks.push({
      id: `bimi-${checkId++}`,
      status: 'warning',
      message: warning,
    })
  })

  // Calculate score (0-5)
  let score = 0
  if (record) score = 2
  if (record && valid) score = 3
  if (parsed?.logoUrl) score = 4
  if (parsed?.logoUrl && parsed?.certificateUrl) score = 5

  return {
    status,
    score: Math.round(score),
    record: record || null,
    logoUrl: parsed?.logoUrl || null,
    certificateUrl: parsed?.certificateUrl || null,
    checks,
  }
}
