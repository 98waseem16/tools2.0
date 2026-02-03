import { NextRequest, NextResponse } from 'next/server'
import { nightcrawler } from '@/lib/api/nightcrawler'
import { parseDMARCResponse, parseSPFResponse, parseDKIMResponse, parseMXResponse } from '@/lib/api/parsers'
import { validateAndNormalizeDomain } from '@/lib/utils/domain'
import { COMMON_DKIM_SELECTORS } from '@/lib/constants'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * GET /api/analyze/[domain]
 * Comprehensive domain analysis for all email authentication protocols
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  try {
    const { domain: rawDomain } = await params

    // Validate and normalize domain
    const domain = validateAndNormalizeDomain(rawDomain)
    if (!domain) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const strategy = searchParams.get('strategy') as 'fast' | 'fresh' | null
    const lookupOptions = strategy ? { strategy } : undefined

    // Perform all lookups in parallel for speed
    const [dmarcResponse, spfResponse, mxResponse] = await Promise.allSettled([
      nightcrawler.explainDMARC(domain, lookupOptions),
      nightcrawler.explainSPF(domain, lookupOptions),
      nightcrawler.lookupMX(domain, lookupOptions),
    ])

    // DKIM lookup - try multiple selectors in parallel
    const dkimSelectors = COMMON_DKIM_SELECTORS.slice(0, 10) // Try first 10 selectors
    const dkimResults = await Promise.allSettled(
      dkimSelectors.map((selector) =>
        nightcrawler.lookupDKIM(domain, selector, lookupOptions)
      )
    )

    // Parse DMARC
    const dmarcAnalysis =
      dmarcResponse.status === 'fulfilled'
        ? parseDMARCResponse(domain, dmarcResponse.value)
        : {
            status: 'error' as const,
            score: 0,
            record: null,
            parsed: null,
            checks: [
              {
                id: 'dmarc-0',
                status: 'fail' as const,
                message: 'Failed to lookup DMARC record',
                details:
                  dmarcResponse.status === 'rejected'
                    ? dmarcResponse.reason?.message || 'Unknown error'
                    : undefined,
              },
            ],
            recommendations: ['Unable to analyze DMARC record'],
          }

    // Parse SPF
    const spfAnalysis =
      spfResponse.status === 'fulfilled'
        ? parseSPFResponse(domain, spfResponse.value)
        : {
            status: 'missing' as const,
            score: 0,
            record: null,
            parsed: null,
            detectedServices: [],
            checks: [
              {
                id: 'spf-0',
                status: 'fail' as const,
                message: 'Failed to lookup SPF record',
                details:
                  spfResponse.status === 'rejected'
                    ? spfResponse.reason?.message || 'Unknown error'
                    : undefined,
              },
            ],
            recommendations: ['Unable to analyze SPF record'],
          }

    // Parse DKIM
    const dkimSelectors_parsed = dkimResults
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return parseDKIMResponse(domain, dkimSelectors[index], result.value)
        }
        return null
      })
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .filter((s) => s.status === 'valid') // Only include valid selectors

    const dkimAnalysis = {
      selectors: dkimSelectors_parsed,
      recommendations: dkimSelectors_parsed.length === 0
        ? ['Add DKIM signing to your email infrastructure']
        : dkimSelectors_parsed.some((s) => s.keyLength && s.keyLength < 2048)
        ? ['Upgrade DKIM keys to 2048 bits or higher']
        : [],
    }

    // Parse MX
    const mxAnalysis =
      mxResponse.status === 'fulfilled'
        ? parseMXResponse(domain, mxResponse.value)
        : {
            status: 'missing' as const,
            score: 0,
            records: [],
            checks: [
              {
                id: 'mx-0',
                status: 'fail' as const,
                message: 'Failed to lookup MX records',
                details:
                  mxResponse.status === 'rejected'
                    ? mxResponse.reason?.message || 'Unknown error'
                    : undefined,
              },
            ],
            provider: null,
          }

    // Calculate overall score (0-100)
    const categoryScores = {
      dmarc: dmarcAnalysis.score,
      spf: spfAnalysis.score,
      dkim: dkimAnalysis.selectors.length > 0 ? 4 : 0,
      mx: mxAnalysis.score,
    }

    const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0)
    const maxScore = 20 // 5 points each for DMARC, SPF, DKIM, MX
    const overallScore = Math.round((totalScore / maxScore) * 100)

    // Determine risk level
    let riskLevel: 'critical' | 'high' | 'medium' | 'low' = 'critical'
    if (overallScore >= 80) riskLevel = 'low'
    else if (overallScore >= 60) riskLevel = 'medium'
    else if (overallScore >= 40) riskLevel = 'high'

    // Generate summary
    const passCount = [
      dmarcAnalysis.status === 'valid',
      spfAnalysis.status === 'valid',
      dkimAnalysis.selectors.length > 0,
      mxAnalysis.status === 'valid',
    ].filter(Boolean).length

    const summary = `Your domain has ${passCount} out of 4 core email authentication protocols configured. ${
      overallScore >= 80
        ? 'Your email security is well-configured.'
        : overallScore >= 60
        ? 'Your email security needs some improvements.'
        : 'Your email security needs significant improvements to prevent spoofing.'
    }`

    // Build response
    const response = {
      domain,
      timestamp: new Date().toISOString(),
      score: overallScore,
      riskLevel,
      summary,
      protocols: {
        dmarc: dmarcAnalysis,
        spf: spfAnalysis,
        dkim: dkimAnalysis,
        mx: mxAnalysis,
      },
      detectedServices: [],
      detectedCompetitors: null,
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze domain',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
