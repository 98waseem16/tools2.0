/**
 * MTA-STS Parser
 * Converts Nightcrawler MTA-STS responses to internal MTASTSAnalysis type
 */

import type { MTASTSAnalysis, Check, MTASTSMode } from '@/lib/types'
import type { NightcrawlerMTASTSResponse } from '../nightcrawler'

/**
 * Parse Nightcrawler MTA-STS response into MTASTSAnalysis
 */
export function parseMTASTSResponse(
  domain: string,
  response: NightcrawlerMTASTSResponse
): MTASTSAnalysis {
  const { record, policy, valid, errors = [], warnings = [] } = response

  // Determine status based on policy mode
  let status: 'enforcing' | 'testing' | 'none' | 'missing' = 'missing'
  if (policy?.mode === 'enforce') {
    status = 'enforcing'
  } else if (policy?.mode === 'testing') {
    status = 'testing'
  } else if (policy?.mode === 'none') {
    status = 'none'
  } else if (record && !policy) {
    status = 'none' // Has DNS record but no valid policy
  }

  // Build checks array
  const checks: Check[] = []
  let checkId = 0

  // DNS record check
  checks.push({
    id: `mta-sts-${checkId++}`,
    status: record ? 'pass' : 'fail',
    message: record ? 'MTA-STS DNS record found' : 'No MTA-STS DNS record found',
    details: record ? undefined : 'MTA-STS provides encryption enforcement for email delivery',
  })

  // Policy file check
  checks.push({
    id: `mta-sts-${checkId++}`,
    status: policy ? 'pass' : 'fail',
    message: policy ? 'MTA-STS policy file found' : 'No MTA-STS policy file found',
    details: policy
      ? undefined
      : 'Policy file should be hosted at https://mta-sts.' + domain + '/.well-known/mta-sts.txt',
  })

  // Mode check
  if (policy?.mode) {
    const mode = policy.mode as MTASTSMode
    const modeStatus = mode === 'enforce' ? 'pass' : mode === 'testing' ? 'warning' : 'fail'
    checks.push({
      id: `mta-sts-${checkId++}`,
      status: modeStatus,
      message: `Policy mode: ${mode}`,
      details:
        mode === 'testing'
          ? 'Testing mode does not enforce TLS. Upgrade to "enforce" for protection.'
          : mode === 'none'
          ? 'Mode "none" disables MTA-STS protection.'
          : undefined,
    })
  }

  // Max age check
  if (policy?.maxAge !== undefined) {
    const maxAge = policy.maxAge
    const maxAgeStatus = maxAge >= 86400 ? 'pass' : 'warning'
    const days = Math.floor(maxAge / 86400)
    checks.push({
      id: `mta-sts-${checkId++}`,
      status: maxAgeStatus,
      message: `Max age: ${days} day${days !== 1 ? 's' : ''}`,
      details: maxAge < 86400 ? 'Consider setting max_age to at least 86400 (1 day)' : undefined,
    })
  }

  // MX patterns check
  if (policy?.mxPatterns && policy.mxPatterns.length > 0) {
    checks.push({
      id: `mta-sts-${checkId++}`,
      status: 'pass',
      message: `${policy.mxPatterns.length} MX pattern${policy.mxPatterns.length > 1 ? 's' : ''} configured`,
    })
  } else if (policy) {
    checks.push({
      id: `mta-sts-${checkId++}`,
      status: 'fail',
      message: 'No MX patterns configured',
      details: 'MTA-STS policy must specify authorized MX hostnames',
    })
  }

  // Add warnings
  warnings.forEach((warning) => {
    checks.push({
      id: `mta-sts-${checkId++}`,
      status: 'warning',
      message: warning,
    })
  })

  // Add errors
  errors.forEach((error) => {
    checks.push({
      id: `mta-sts-${checkId++}`,
      status: 'fail',
      message: error,
    })
  })

  // Calculate score (0-5)
  let score = 0
  if (record) score = 1
  if (policy) score = 2
  if (policy?.mode === 'testing') score = 3
  if (policy?.mode === 'enforce') score = 4
  if (policy?.mode === 'enforce' && policy?.maxAge && policy.maxAge >= 86400) score = 5

  return {
    status,
    score: Math.round(score),
    record: record || null,
    policy: policy
      ? {
          version: 'STSv1',
          mode: (policy.mode as MTASTSMode) || 'none',
          maxAge: policy.maxAge || 0,
          mx: policy.mxPatterns || [],
        }
      : null,
    checks,
  }
}
