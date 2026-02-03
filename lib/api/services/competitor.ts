/**
 * Competitor Detector
 * Identifies competitor DMARC/email security products in use
 */

import { COMPETITOR_PATTERNS } from '@/lib/constants'
import type { CompetitorDetection, CompetitorName } from '@/lib/types'

/**
 * Detect competitors from DMARC rua addresses
 */
export function detectCompetitorFromDMARC(ruaAddresses: string[]): CompetitorDetection | null {
  if (ruaAddresses.length === 0) return null

  const ruaLower = ruaAddresses.map((r) => r.toLowerCase())

  for (const competitor of COMPETITOR_PATTERNS) {
    const matches = ruaLower.some((rua) =>
      competitor.dmarcRua.some((pattern) => rua.includes(pattern.toLowerCase()))
    )

    if (matches) {
      return {
        detected: competitor.name as CompetitorName,
        signals: [`DMARC reporting to ${competitor.displayName}`],
        confidence: 'high',
      }
    }
  }

  return null
}

/**
 * Detect competitors from SPF includes
 */
export function detectCompetitorFromSPF(includes: string[]): CompetitorDetection | null {
  if (includes.length === 0) return null

  const includesLower = includes.map((i) => i.toLowerCase())

  for (const competitor of COMPETITOR_PATTERNS) {
    const matches = includesLower.some((include) =>
      competitor.spfIncludes.some((pattern) => include.includes(pattern.toLowerCase()))
    )

    if (matches) {
      return {
        detected: competitor.name as CompetitorName,
        signals: [`SPF includes ${competitor.displayName} servers`],
        confidence: 'medium',
      }
    }
  }

  return null
}

/**
 * Detect competitors from MX records
 */
export function detectCompetitorFromMX(mxHostnames: string[]): CompetitorDetection | null {
  if (mxHostnames.length === 0) return null

  const mxLower = mxHostnames.map((m) => m.toLowerCase())

  for (const competitor of COMPETITOR_PATTERNS) {
    const matches = mxLower.some((mx) =>
      competitor.mxRecords.some((pattern) => mx.includes(pattern.toLowerCase()))
    )

    if (matches) {
      return {
        detected: competitor.name as CompetitorName,
        signals: [`Mail routed through ${competitor.displayName}`],
        confidence: 'high',
      }
    }
  }

  return null
}

/**
 * Detect all competitors from analysis data
 */
export interface CompetitorDetectionInput {
  dmarcRuaAddresses?: string[]
  spfIncludes?: string[]
  mxHostnames?: string[]
}

export function detectCompetitor(input: CompetitorDetectionInput): CompetitorDetection | null {
  // Check DMARC first (highest confidence)
  const dmarcDetection = input.dmarcRuaAddresses
    ? detectCompetitorFromDMARC(input.dmarcRuaAddresses)
    : null
  if (dmarcDetection) return dmarcDetection

  // Check MX records (high confidence)
  const mxDetection = input.mxHostnames
    ? detectCompetitorFromMX(input.mxHostnames)
    : null
  if (mxDetection) return mxDetection

  // Check SPF includes (medium confidence)
  const spfDetection = input.spfIncludes
    ? detectCompetitorFromSPF(input.spfIncludes)
    : null
  if (spfDetection) return spfDetection

  return null
}
