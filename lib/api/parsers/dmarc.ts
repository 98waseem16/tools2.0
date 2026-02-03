/**
 * DMARC Parser
 * Converts Nightcrawler DMARC responses to internal DMARCAnalysis type
 */

import type { DMARCAnalysis, DMARCParsed, RecordStatus, Check, AlignmentMode } from '@/lib/types'
import type { NightcrawlerDMARCResponse } from '../nightcrawler'

/**
 * Parse Nightcrawler DMARC response into DMARCAnalysis
 */
export function parseDMARCResponse(
  domain: string,
  response: NightcrawlerDMARCResponse
): DMARCAnalysis {
  const { record, summary, status: apiStatus, checks: apiChecks = [] } = response

  // Extract the actual DMARC record string
  const recordString = record?.entries?.[0] || null

  // Determine status
  let status: RecordStatus = 'missing'
  if (recordString) {
    if (apiStatus === 'OK') {
      status = 'valid'
    } else {
      status = 'invalid'
    }
  }

  // Build checks array from API checks
  const checks: Check[] = []
  let checkId = 0

  // Record exists check
  checks.push({
    id: `dmarc-${checkId++}`,
    status: recordString ? 'pass' : 'fail',
    message: recordString ? 'DMARC record found' : 'No DMARC record found',
    details: recordString ? undefined : 'Add a DMARC record to protect your domain from spoofing',
  })

  // Add API checks
  apiChecks.forEach((check) => {
    checks.push({
      id: `dmarc-${checkId++}`,
      status: check.status === 'OK' ? 'pass' : check.status === 'WARNING' ? 'warning' : 'fail',
      message: check.msg,
      details: check.params ? JSON.stringify(check.params) : undefined,
    })
  })

  // Build parsed object from summary
  const parsedData: DMARCParsed | null = summary
    ? {
        version: 'DMARC1',
        policy: (summary.policy as any) || 'none',
        subdomainPolicy: (summary.subdomain_policy as any) || null,
        percentage: summary.policy_percentage || 100,
        aggregateReports: summary.aggregate_reporting_addresses || [],
        forensicReports: summary.failure_reporting_addresses || [],
        alignmentMode: {
          spf: (summary.spf_alignment === 'strict' ? 'strict' : 'relaxed') as AlignmentMode,
          dkim: (summary.dkim_alignment === 'strict' ? 'strict' : 'relaxed') as AlignmentMode,
        },
        failureOptions: summary.failure_reporting_options ? Object.values(summary.failure_reporting_options) : null,
        reportInterval: summary.aggregate_reporting_interval || null,
      }
    : null

  // Policy check
  if (parsedData?.policy) {
    const policyStatus = parsedData.policy === 'reject' ? 'pass' : parsedData.policy === 'quarantine' ? 'warning' : 'fail'
    checks.push({
      id: `dmarc-${checkId++}`,
      status: policyStatus,
      message: `Policy is set to "${parsedData.policy}"`,
      details:
        parsedData.policy === 'none'
          ? 'Policy "none" provides monitoring only. Upgrade to "quarantine" or "reject" for protection.'
          : parsedData.policy === 'quarantine'
          ? 'Consider upgrading to "reject" for maximum protection.'
          : undefined,
    })
  }

  // Percentage check
  if (parsedData?.percentage !== undefined) {
    const percentageStatus = parsedData.percentage === 100 ? 'pass' : 'warning'
    checks.push({
      id: `dmarc-${checkId++}`,
      status: percentageStatus,
      message: `Policy applied to ${parsedData.percentage}% of messages`,
      details:
        parsedData.percentage < 100
          ? 'Consider applying policy to 100% of messages for full protection.'
          : undefined,
    })
  }

  // Aggregate reporting check
  if (parsedData?.aggregateReports && parsedData.aggregateReports.length > 0) {
    checks.push({
      id: `dmarc-${checkId++}`,
      status: 'pass',
      message: `Aggregate reports configured (${parsedData.aggregateReports.length} address${parsedData.aggregateReports.length > 1 ? 'es' : ''})`,
    })
  } else if (recordString) {
    checks.push({
      id: `dmarc-${checkId++}`,
      status: 'warning',
      message: 'No aggregate reporting addresses configured',
      details: 'Add rua= tag to receive DMARC aggregate reports',
    })
  }

  // Calculate score (0-5)
  let score = 0
  if (recordString && apiStatus === 'OK') score = 1
  if (parsedData?.policy === 'quarantine') score = 3
  if (parsedData?.policy === 'reject') score = 4
  if (parsedData?.policy === 'reject' && parsedData?.percentage === 100) score = 5

  // Build recommendations
  const recommendations: string[] = []
  if (!recordString) {
    recommendations.push('Add a DMARC record to protect your domain from email spoofing')
  } else if (parsedData?.policy === 'none') {
    recommendations.push('Upgrade your DMARC policy from "none" to "quarantine" or "reject"')
  } else if (parsedData?.policy === 'quarantine') {
    recommendations.push('Consider upgrading to policy="reject" for maximum protection')
  }
  if (parsedData && parsedData.percentage < 100) {
    recommendations.push('Apply DMARC policy to 100% of your email messages')
  }
  if (parsedData && parsedData.aggregateReports.length === 0) {
    recommendations.push('Add aggregate reporting addresses (rua=) to monitor email authentication')
  }

  return {
    status,
    score: Math.round(score),
    record: recordString,
    parsed: parsedData,
    checks,
    recommendations,
  }
}
