import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * API route for DKIM key generation
 * POST /api/dkim-generate
 * Body: { domain: string, selector: string, keySize: number }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, selector, keySize } = body

    if (!domain || !selector) {
      return NextResponse.json(
        { error: 'Domain and selector are required' },
        { status: 400 }
      )
    }

    if (keySize !== 1024 && keySize !== 2048) {
      return NextResponse.json(
        { error: 'Key size must be 1024 or 2048 bits' },
        { status: 400 }
      )
    }

    // Note: This is a placeholder - actual RSA key generation should be done server-side
    // with a proper crypto library like node:crypto or a dedicated service
    // For security reasons, generating keys in the browser is not recommended

    return NextResponse.json({
      error: 'DKIM key generation requires server-side crypto implementation',
      message:
        'For security, DKIM keys should be generated using OpenSSL or your mail server tools. See the instructions below.',
      instructions: {
        openssl: [
          'Generate private key:',
          `openssl genrsa -out ${selector}.private ${keySize}`,
          '',
          'Generate public key:',
          `openssl rsa -in ${selector}.private -pubout -outform PEM -out ${selector}.public`,
          '',
          'Extract public key for DNS (remove headers/newlines):',
          `cat ${selector}.public | grep -v "BEGIN\\|END" | tr -d "\\n"`,
        ],
        dnsRecord: {
          name: `${selector}._domainkey.${domain}`,
          type: 'TXT',
          value: 'v=DKIM1; k=rsa; p=<your_public_key_here>',
        },
      },
    })
  } catch (error) {
    console.error('DKIM generation error:', error)
    return NextResponse.json(
      { error: 'Failed to process DKIM generation request' },
      { status: 500 }
    )
  }
}
