/**
 * Email header parsing utilities
 */

export interface ParsedHeader {
  name: string
  value: string
}

export interface AuthenticationResults {
  spf?: {
    result: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none'
    domain?: string
    ip?: string
  }
  dkim?: {
    result: 'pass' | 'fail' | 'none'
    domain?: string
    selector?: string
  }
  dmarc?: {
    result: 'pass' | 'fail' | 'none'
    policy?: string
  }
}

export interface ReceivedHop {
  from: string
  by: string
  timestamp?: string
  protocol?: string
}

export interface ParsedEmail {
  headers: ParsedHeader[]
  from?: string
  to?: string
  subject?: string
  date?: string
  messageId?: string
  receivedPath: ReceivedHop[]
  authentication: AuthenticationResults
}

/**
 * Parse email headers from raw text
 */
export function parseEmailHeaders(rawHeaders: string): ParsedEmail {
  const lines = rawHeaders.split('\n')
  const headers: ParsedHeader[] = []
  let currentHeader: ParsedHeader | null = null

  // Parse headers (handle multi-line headers)
  for (const line of lines) {
    if (line.match(/^[\s\t]/) && currentHeader) {
      // Continuation of previous header
      currentHeader.value += ' ' + line.trim()
    } else if (line.includes(':')) {
      // New header
      if (currentHeader) {
        headers.push(currentHeader)
      }
      const colonIndex = line.indexOf(':')
      currentHeader = {
        name: line.substring(0, colonIndex).trim(),
        value: line.substring(colonIndex + 1).trim(),
      }
    }
  }

  if (currentHeader) {
    headers.push(currentHeader)
  }

  // Extract key headers
  const from = headers.find((h) => h.name.toLowerCase() === 'from')?.value
  const to = headers.find((h) => h.name.toLowerCase() === 'to')?.value
  const subject = headers.find((h) => h.name.toLowerCase() === 'subject')?.value
  const date = headers.find((h) => h.name.toLowerCase() === 'date')?.value
  const messageId = headers.find((h) => h.name.toLowerCase() === 'message-id')?.value

  // Parse Received headers for routing path
  const receivedPath = parseReceivedHeaders(
    headers.filter((h) => h.name.toLowerCase() === 'received')
  )

  // Parse authentication results
  const authentication = parseAuthenticationResults(headers)

  return {
    headers,
    from,
    to,
    subject,
    date,
    messageId,
    receivedPath,
    authentication,
  }
}

/**
 * Parse Received headers to show email routing path
 */
function parseReceivedHeaders(receivedHeaders: ParsedHeader[]): ReceivedHop[] {
  return receivedHeaders.map((header) => {
    const value = header.value
    const hop: ReceivedHop = {
      from: '',
      by: '',
    }

    // Extract "from" field
    const fromMatch = value.match(/from\s+([^\s]+)/i)
    if (fromMatch) {
      hop.from = fromMatch[1]
    }

    // Extract "by" field
    const byMatch = value.match(/by\s+([^\s]+)/i)
    if (byMatch) {
      hop.by = byMatch[1]
    }

    // Extract timestamp
    const timestampMatch = value.match(/;\s*(.+)$/)
    if (timestampMatch) {
      hop.timestamp = timestampMatch[1].trim()
    }

    // Extract protocol
    const protocolMatch = value.match(/with\s+([^\s]+)/i)
    if (protocolMatch) {
      hop.protocol = protocolMatch[1]
    }

    return hop
  })
}

/**
 * Parse authentication results from headers
 */
function parseAuthenticationResults(headers: ParsedHeader[]): AuthenticationResults {
  const results: AuthenticationResults = {}

  // Look for Authentication-Results header
  const authHeader = headers.find(
    (h) => h.name.toLowerCase() === 'authentication-results'
  )?.value

  if (authHeader) {
    // Parse SPF
    const spfMatch = authHeader.match(/spf=(\w+)(?:\s+\(([^)]+)\))?/i)
    if (spfMatch) {
      results.spf = {
        result: spfMatch[1].toLowerCase() as any,
      }
      // Try to extract domain and IP from the context
      const domainMatch = authHeader.match(/envelope-from=([^\s;]+)/i)
      if (domainMatch) {
        results.spf.domain = domainMatch[1]
      }
    }

    // Parse DKIM
    const dkimMatch = authHeader.match(/dkim=(\w+)(?:\s+\(([^)]+)\))?/i)
    if (dkimMatch) {
      results.dkim = {
        result: dkimMatch[1].toLowerCase() as any,
      }
      // Try to extract domain
      const dkimDomainMatch = authHeader.match(/header\.d=([^\s;]+)/i)
      if (dkimDomainMatch) {
        results.dkim.domain = dkimDomainMatch[1]
      }
      // Try to extract selector
      const dkimSelectorMatch = authHeader.match(/header\.s=([^\s;]+)/i)
      if (dkimSelectorMatch) {
        results.dkim.selector = dkimSelectorMatch[1]
      }
    }

    // Parse DMARC
    const dmarcMatch = authHeader.match(/dmarc=(\w+)(?:\s+\(([^)]+)\))?/i)
    if (dmarcMatch) {
      results.dmarc = {
        result: dmarcMatch[1].toLowerCase() as any,
      }
      // Try to extract policy
      const policyMatch = authHeader.match(/policy\.applied=(\w+)/i)
      if (policyMatch) {
        results.dmarc.policy = policyMatch[1]
      }
    }
  }

  // Also check for individual SPF/DKIM headers
  const receivedSpf = headers.find((h) => h.name.toLowerCase() === 'received-spf')?.value
  if (receivedSpf && !results.spf) {
    const result = receivedSpf.split(' ')[0].toLowerCase()
    results.spf = {
      result: result as any,
    }
  }

  const dkimSignature = headers.find((h) => h.name.toLowerCase() === 'dkim-signature')
  if (dkimSignature && !results.dkim) {
    results.dkim = {
      result: 'pass',
    }
    // Extract domain from DKIM-Signature
    const domainMatch = dkimSignature.value.match(/d=([^;]+)/i)
    if (domainMatch) {
      results.dkim.domain = domainMatch[1].trim()
    }
    // Extract selector
    const selectorMatch = dkimSignature.value.match(/s=([^;]+)/i)
    if (selectorMatch) {
      results.dkim.selector = selectorMatch[1].trim()
    }
  }

  return results
}

/**
 * Read .eml file and extract headers
 */
export async function parseEMLFile(file: File): Promise<string> {
  const text = await file.text()
  // Extract just the headers (everything before first blank line)
  const headerEnd = text.indexOf('\n\n')
  if (headerEnd !== -1) {
    return text.substring(0, headerEnd)
  }
  return text
}
