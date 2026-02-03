/**
 * Marcy Chat API proxy – server-side only.
 * POST with { domain } → calls Marcy with system + user message, returns { response } (markdown).
 * Env: MARCY_API_BASE_URL, MARCY_CHAT_API_KEY (do not expose key to client).
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateAndNormalizeDomain } from '@/lib/utils/domain'
import { randomUUID } from 'crypto'

const MARCY_SYSTEM_MESSAGE = `You are helping a webapp that shows SPF and domain security checks. When you run a domain check, format your response for display in a web UI. The reader is the domain owner or someone responsible for the domain—they are here to get direct value: clear analysis and actionable advice.

CRITICAL: Never use lead-qualification or internal sales language. Do NOT say things like "good lead", "lead for X services", "this domain is a lead", or any wording that treats the visitor as a sales prospect. Address them as the domain owner. Focus only on what matters to them: their SPF/DMARC/DKIM status, what's wrong, and what they should do next.

Do NOT include in your output: scores, TLS-RPT, MTA-STS, or BIMI. Focus only on SPF, DMARC, and DKIM (if relevant).

Use clear headings, short paragraphs, and bullet points. Give: (1) a one-line overall verdict, (2) SPF/DMARC/DKIM status and any issues, (3) concrete next-step recommendations. Keep the reply scannable; avoid long walls of text. Output in markdown only.`

const MARCY_TIMEOUT_MS = 60_000

/** Build user message with explicit domain so Marcy always analyzes the correct domain. */
function buildMarcyUserMessage(domain: string): string {
  return `Analyze the SPF record and the DMARC record for the domain: ${domain}. Tell the domain owner what's wrong with the SPF record and what's wrong with the DMARC record (if anything), and give clear, actionable recommendations. Highlight both SPF and DMARC issues where relevant.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const rawDomain = typeof body.domain === 'string' ? body.domain.trim() : ''

    const domain = validateAndNormalizeDomain(rawDomain)
    if (!domain) {
      return NextResponse.json(
        { error: 'Invalid or missing domain' },
        { status: 400 }
      )
    }

    const baseUrl = process.env.MARCY_API_BASE_URL
    const apiKey = process.env.MARCY_CHAT_API_KEY

    if (!baseUrl || !apiKey) {
      return NextResponse.json(
        { error: 'Marcy API not configured' },
        { status: 503 }
      )
    }

    const url = `${baseUrl.replace(/\/$/, '')}/api/chat/${encodeURIComponent(domain)}`
    const threadId = randomUUID()

    const marcyBody = {
      message: buildMarcyUserMessage(domain),
      message_chain: [{ role: 'system' as const, content: MARCY_SYSTEM_MESSAGE }],
      thread_id: threadId,
      platform: 'tools',
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), MARCY_TIMEOUT_MS)

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify(marcyBody),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId))

    if (!res.ok) {
      const text = await res.text()
      if (res.status === 401) {
        return NextResponse.json({ error: 'Marcy API key missing or invalid' }, { status: 502 })
      }
      if (res.status === 403) {
        return NextResponse.json({ error: 'Marcy API key invalid' }, { status: 502 })
      }
      if (res.status === 429) {
        return NextResponse.json(
          { error: 'Too many requests. Try again later.' },
          { status: 429 }
        )
      }
      if (res.status >= 500) {
        return NextResponse.json(
          { error: 'Marcy service temporarily unavailable. Try again later.' },
          { status: 502 }
        )
      }
      return NextResponse.json(
        { error: text || 'Marcy request failed' },
        { status: 502 }
      )
    }

    const data = await res.json().catch(() => ({}))
    const fullText = typeof data.response === 'string' ? data.response : ''

    // Stream the response so the client can show text progressively
    const CHUNK_SIZE = 24
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        for (let i = 0; i < fullText.length; i += CHUNK_SIZE) {
          controller.enqueue(encoder.encode(fullText.slice(i, i + CHUNK_SIZE)))
        }
        controller.close()
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timed out. Try again later.' },
        { status: 504 }
      )
    }
    console.error('Marcy chat error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI summary' },
      { status: 500 }
    )
  }
}
