/**
 * SPF Parser
 * Converts Nightcrawler SPF responses to internal SPFAnalysis type
 */

import type { SPFAnalysis, SPFParsed, SPFStatus, Check, SPFMechanism, SPFQualifier, SPFMechanismType } from '@/lib/types'
import type { NightcrawlerSPFResponse } from '../nightcrawler'
import { detectServicesFromSPF } from '@/lib/api/services/detector'
import { runBestPracticeChecks } from '@/lib/validation/spf-best-practices'

/**
 * Estimate DNS lookups for a mechanism
 */
function estimateLookups(mechanism: string): number {
  // Mechanisms that require DNS lookups
  const lookupMechanisms = ['include', 'a', 'mx', 'exists', 'redirect', 'ptr']
  return lookupMechanisms.includes(mechanism.toLowerCase()) ? 1 : 0
}

/**
 * Parse Nightcrawler SPF response into SPFAnalysis
 */
export function parseSPFResponse(
  domain: string,
  response: NightcrawlerSPFResponse
): SPFAnalysis {
  const { record, summary, status: apiStatus, checks: apiChecks = [] } = response

  // Extract the actual SPF record string
  const recordString = record?.entries?.[0] || null

  // Determine status
  let status: SPFStatus = 'missing'
  if (recordString) {
    if (apiStatus === 'OK') {
      status = 'valid'
    } else {
      status = 'invalid'
    }
  }

  // Build checks array
  const checks: Check[] = []
  let checkId = 0

  // Record exists check
  checks.push({
    id: `spf-${checkId++}`,
    status: recordString ? 'pass' : 'fail',
    message: recordString ? 'SPF record found' : 'No SPF record found',
    details: recordString ? undefined : 'Add an SPF record to authorize sending servers',
  })

  // Add API checks
  apiChecks.forEach((check) => {
    checks.push({
      id: `spf-${checkId++}`,
      status: check.status === 'OK' ? 'pass' : check.status === 'WARNING' ? 'warning' : 'fail',
      message: check.msg,
      details: check.params ? JSON.stringify(check.params) : undefined,
    })
  })

  // Extract mechanisms from record_parts
  const mechanisms: SPFMechanism[] = summary?.record_parts
    ?.filter((part: Record<string, string>) => 'mechanism' in part && part.mechanism !== 'v')
    ?.map((part: Record<string, string>, index: number) => {
      const mechanismType = part.mechanism as SPFMechanismType
      const qualifier = (part.qualifier || '+') as SPFQualifier
      const value = part.value || ''

      return {
        type: mechanismType,
        qualifier,
        value,
        lookups: estimateLookups(mechanismType),
      }
    }) || []

  // Build parsed object from summary
  const lookupCount = summary?.num_lookup || 0
  const parsedData: SPFParsed | null = summary
    ? {
        version: 'spf1',
        mechanisms: mechanisms,
        allQualifier: summary.all_qualifier === '~' ? '~all' : summary.all_qualifier === '-' ? '-all' : summary.all_qualifier === '?' ? '?all' : '+all',
        lookupCount: lookupCount,
        secondaryLookupCount: summary.num_secondary_lookup || 0,
        voidLookupCount: summary.num_void_lookup || 0,
        maxLookups: 10,
        recordSize: summary.root_record_size || recordString?.length || 0,
        redirectedTo: summary.redirected_to || null,
      }
    : null

  // DNS lookup count check
  if (lookupCount > 0) {
    const lookupStatus = lookupCount <= 10 ? 'pass' : 'fail'
    checks.push({
      id: `spf-${checkId++}`,
      status: lookupStatus,
      message: `DNS lookup count: ${lookupCount}/10`,
      details:
        lookupCount > 10
          ? 'SPF lookup limit exceeded. Reduce includes and redirects.'
          : lookupCount > 8
          ? 'Close to SPF lookup limit. Consider optimization.'
          : undefined,
    })
  }

  // All mechanism check
  if (parsedData?.allQualifier) {
    // Both -all and ~all are acceptable; only +all and ?all are problematic
    const allStatus =
      (parsedData.allQualifier === '-all' || parsedData.allQualifier === '~all') ? 'pass' : 'fail'

    checks.push({
      id: `spf-${checkId++}`,
      status: allStatus,
      message: `All mechanism: ${parsedData.allQualifier}`,
      details:
        parsedData.allQualifier === '+all' || parsedData.allQualifier === '?all'
          ? 'Using +all or ?all allows any server to send email. Use -all or ~all instead.'
          : undefined,
    })
  }

  // Run M3AAWG best practice checks
  const bestPracticeChecks = runBestPracticeChecks(parsedData, recordString, response)
  checks.push(...bestPracticeChecks)

  // Detect services from mechanisms
  const detectedServices = mechanisms.length > 0
    ? detectServicesFromSPF(mechanisms)
    : []

  // Calculate score (0-5)
  let score = 0
  if (recordString && apiStatus === 'OK') score = 1
  if (lookupCount > 0 && lookupCount <= 10) score = 2
  // Both ~all and -all are good (score 3-5)
  if (parsedData?.allQualifier === '~all' || parsedData?.allQualifier === '-all') {
    score = 3
    if (lookupCount <= 8) score = 4
    if (lookupCount <= 5) score = 5
  }

  // Build recommendations
  const recommendations: string[] = []
  if (!recordString) {
    recommendations.push('Add an SPF record to authorize your sending servers')
  } else if (lookupCount > 10) {
    recommendations.push('Reduce SPF DNS lookups by consolidating includes or using IP ranges')
  } else if (lookupCount > 8) {
    recommendations.push('Optimize SPF record to stay well below the 10 lookup limit')
  }
  // Only recommend changes for +all or ?all (not for ~all, which is acceptable)
  if (parsedData?.allQualifier === '+all' || parsedData?.allQualifier === '?all') {
    recommendations.push('Update SPF to use "-all" or "~all" for proper email authentication')
  }

  return {
    status,
    score: Math.round(score),
    record: recordString,
    parsed: parsedData,
    detectedServices,
    checks,
    recommendations,
  }
}
