import { NextRequest, NextResponse } from 'next/server'
import { nightcrawler } from '@/lib/api/nightcrawler'
import { parseSPFResponse } from '@/lib/api/parsers/spf'

export const dynamic = 'force-dynamic'

/**
 * API route for SPF policy testing
 * POST /api/spf-test
 * Body: { email: string, ip: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, ip } = body

    if (!email || !ip) {
      return NextResponse.json(
        { error: 'Email address and IP address are required' },
        { status: 400 }
      )
    }

    // Extract domain from email
    const emailParts = email.split('@')
    if (emailParts.length !== 2) {
      return NextResponse.json({ error: 'Invalid email address format' }, { status: 400 })
    }
    const domain = emailParts[1]

    // Validate IP format (basic IPv4/IPv6 check)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/

    if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
      return NextResponse.json({ error: 'Invalid IP address format' }, { status: 400 })
    }

    // Get SPF record and explanation
    const [spfLookup, spfExplain] = await Promise.all([
      nightcrawler.lookupSPF(domain),
      nightcrawler.explainSPF(domain),
    ])

    // Parse SPF explanation into mechanisms (Nightcrawler returns summary, not parsed)
    const spfAnalysis = parseSPFResponse(domain, spfExplain)

    // Evaluate SPF (simplified - actual implementation would need full SPF evaluation)
    // This is a placeholder - real SPF evaluation is complex and requires recursive lookups
    const result = {
      domain,
      email,
      ip,
      spfRecord: spfLookup.record,
      result: 'neutral' as 'pass' | 'fail' | 'softfail' | 'neutral' | 'none',
      explanation: 'SPF evaluation requires server-side implementation',
      mechanisms: spfAnalysis.parsed?.mechanisms || [],
      evaluationPath: [] as string[],
    }

    // Basic check: if SPF record doesn't exist
    if (!spfLookup.record) {
      result.result = 'none'
      result.explanation = 'No SPF record found for this domain'
      return NextResponse.json(result)
    }

    // Note: Full SPF evaluation would require:
    // 1. Parse all mechanisms in order
    // 2. Evaluate each mechanism against the IP
    // 3. Handle includes recursively
    // 4. Track DNS lookup count (max 10)
    // 5. Return first match with qualifier
    result.explanation =
      'Full SPF evaluation coming soon. Currently showing SPF record and mechanisms.'

    return NextResponse.json(result)
  } catch (error) {
    console.error('SPF test error:', error)
    return NextResponse.json({ error: 'Failed to test SPF policy' }, { status: 500 })
  }
}
