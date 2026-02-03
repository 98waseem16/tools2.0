/**
 * DKIM Parser
 * Converts Nightcrawler DKIM responses to internal DKIMSelector type
 */

import type { Check } from '@/lib/types'
import type { NightcrawlerDKIMResponse } from '../nightcrawler'

export interface DKIMSelector {
  selector: string
  status: 'valid' | 'invalid' | 'missing'
  record: string | null
  keyType: string | null
  keyLength: number | null
  checks: Check[]
}

/**
 * Parse Nightcrawler DKIM response into DKIMSelector
 */
export function parseDKIMResponse(
  domain: string,
  selector: string,
  response: NightcrawlerDKIMResponse
): DKIMSelector {
  const { record, parsed, valid, errors = [], warnings = [] } = response

  // Determine status
  let status: 'valid' | 'invalid' | 'missing' = 'missing'
  if (record) {
    if (errors.length > 0) {
      status = 'invalid'
    } else if (valid) {
      status = 'valid'
    }
  }

  // Build checks array
  const checks: Check[] = []
  let checkId = 0

  // Record exists check
  if (record) {
    checks.push({
      id: `dkim-${selector}-${checkId++}`,
      status: 'pass',
      message: `DKIM record found for selector "${selector}"`,
    })

    // Valid record check
    checks.push({
      id: `dkim-${selector}-${checkId++}`,
      status: valid ? 'pass' : 'fail',
      message: valid ? 'DKIM record is valid' : 'DKIM record has syntax errors',
      details: errors.length > 0 ? errors.join('; ') : undefined,
    })

    // Key length check
    if (parsed?.publicKey) {
      const keyLength = estimateKeyLength(parsed.publicKey)
      const keyStatus = keyLength >= 2048 ? 'pass' : keyLength >= 1024 ? 'warning' : 'fail'
      checks.push({
        id: `dkim-${selector}-${checkId++}`,
        status: keyStatus,
        message: `Key length: ~${keyLength} bits`,
        details:
          keyLength < 1024
            ? 'Key is too short. Use at least 2048 bits for security.'
            : keyLength < 2048
            ? '1024-bit keys are deprecated. Upgrade to 2048 bits or higher.'
            : undefined,
      })
    }

    // Algorithm check
    if (parsed?.algorithm) {
      const algoStatus = parsed.algorithm === 'rsa-sha256' ? 'pass' : 'warning'
      checks.push({
        id: `dkim-${selector}-${checkId++}`,
        status: algoStatus,
        message: `Algorithm: ${parsed.algorithm}`,
        details: parsed.algorithm === 'rsa-sha1' ? 'SHA-1 is deprecated. Use rsa-sha256.' : undefined,
      })
    }

    // Add warnings
    warnings.forEach((warning) => {
      checks.push({
        id: `dkim-${selector}-${checkId++}`,
        status: 'warning',
        message: warning,
      })
    })
  }

  // Estimate key length
  const keyLength = parsed?.publicKey ? estimateKeyLength(parsed.publicKey) : null

  return {
    selector,
    status,
    record: record || null,
    keyType: parsed?.keyType || null,
    keyLength,
    checks,
  }
}

/**
 * Estimate RSA key length from base64 public key
 */
function estimateKeyLength(publicKey: string): number {
  // Remove whitespace and calculate byte length
  const cleanKey = publicKey.replace(/\s/g, '')
  const byteLength = (cleanKey.length * 3) / 4

  // RSA public key DER structure adds overhead
  // Approximate bit length based on byte length
  if (byteLength >= 400) return 4096
  if (byteLength >= 250) return 2048
  if (byteLength >= 150) return 1024
  if (byteLength >= 80) return 512
  return 256
}
