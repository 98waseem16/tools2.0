import { NextRequest, NextResponse } from 'next/server'
import { nightcrawler } from '@/lib/api/nightcrawler'

export const dynamic = 'force-dynamic'

/**
 * API route for blacklist checking
 * POST /api/blacklist
 * Body: { ip: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ip } = body

    if (!ip) {
      return NextResponse.json({ error: 'IP address is required' }, { status: 400 })
    }

    // Validate IP format (basic IPv4/IPv6 check)
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){7}[0-9a-fA-F]{0,4}$/

    if (!ipv4Regex.test(ip) && !ipv6Regex.test(ip)) {
      return NextResponse.json({ error: 'Invalid IP address format' }, { status: 400 })
    }

    // Call Nightcrawler API
    const result = await nightcrawler.checkBlacklist(ip)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Blacklist check error:', error)
    return NextResponse.json(
      { error: 'Failed to check blacklist' },
      { status: 500 }
    )
  }
}
