/**
 * SPF Checker API Route
 * Dedicated endpoint for standalone SPF analysis
 */

import { NextRequest, NextResponse } from 'next/server'
import { nightcrawler } from '@/lib/api/nightcrawler'
import { parseSPFResponse } from '@/lib/api/parsers/spf'
import { buildIncludeTree, analyzeRecordComplexity, validateMechanisms, optimizeSPF } from '@/lib/utils/spf'
import { enrichServicesWithLogos } from '@/lib/api/services/logo-enricher'
import type { SPFAnalysisResult } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain } = await params

    // Validate domain
    if (!domain || domain.length === 0) {
      return NextResponse.json(
        { error: 'Domain parameter is required' },
        { status: 400 }
      )
    }

    // Fetch SPF data from Nightcrawler
    const spfResponse = await nightcrawler.explainSPF(domain, {
      strategy: 'fast',
      timeout: 5,
    })

    // Parse the SPF response
    const spf = parseSPFResponse(domain, spfResponse)

    // Build include tree if mechanisms exist
    const includeTree = spf.parsed?.mechanisms
      ? buildIncludeTree(spf.parsed.mechanisms, domain)
      : undefined

    // Analyze complexity
    const complexity = spf.parsed
      ? analyzeRecordComplexity(spf.parsed)
      : undefined

    // Validate mechanisms
    const validations = spf.parsed?.mechanisms
      ? validateMechanisms(spf.parsed.mechanisms)
      : []

    // Generate optimization recommendations
    const optimizations = spf.parsed
      ? optimizeSPF(spf.parsed)
      : []

    // Enrich detected services with logos (non-blocking)
    if (spf.detectedServices && spf.detectedServices.length > 0) {
      try {
        spf.detectedServices = await enrichServicesWithLogos(spf.detectedServices)
      } catch (error) {
        // Log error but continue without logos - non-blocking operation
        console.error('Failed to fetch service logos:', error)
      }
    }

    // Build the complete analysis result
    const result: SPFAnalysisResult = {
      domain,
      spf,
      includeTree: includeTree ?? undefined,
      complexity,
      validations,
      optimizations,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('SPF Checker API Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to analyze SPF record',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
