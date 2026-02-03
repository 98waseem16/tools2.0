/**
 * Nightcrawler API Integration
 * Wrapper functions for all Nightcrawler endpoints
 */

import { createAPIClient, type APIClient } from './client'

export type LookupStrategy = 'fast' | 'fresh'

export interface LookupOptions {
  strategy?: LookupStrategy
  timeout?: number // 1-10 seconds
}

// Nightcrawler API Response Types
export interface NightcrawlerDMARCResponse {
  record?: {
    rdtype: string
    domain: string
    full_domain: string
    ttl: number
    cnames: string[]
    ns_addr: string
    ns_proto: string
    entries: string[]
    inherited_from: string | null
    organizational_domain: string
  }
  record_status?: string
  summary?: {
    organizational_domain: string
    policy: string
    subdomain_policy: string
    nondomain_policy: string
    policy_percentage: number
    testing: boolean
    dkim_alignment: string
    spf_alignment: string
    aggregate_reporting_interval: number
    aggregate_reporting_addresses: string[]
    failure_reporting_options: Record<string, string>
    failure_reporting_format: string
    failure_reporting_addresses: string[]
    dmarc_providers: string[]
    is_dmarcbis: boolean
    record_parts: Record<string, string>
  }
  status?: string
  checks?: Array<{
    msg_code: string
    msg: string
    status: string
    params?: Record<string, any>
  }>
  directives?: Array<{
    directive: string
    title: string
    value: string
    status: string
    checks: Array<{
      msg_code: string
      msg: string
      status: string
      params?: Record<string, any>
    }>
  }>
}

export interface NightcrawlerSPFResponse {
  record?: {
    rdtype: string
    domain: string
    full_domain: string
    ttl: number
    cnames: string[]
    ns_addr: string
    ns_proto: string
    entries: string[]
  }
  record_status?: string
  summary?: {
    all_qualifier: string
    all_qualifier_name: string
    num_lookup: number
    num_secondary_lookup: number
    num_void_lookup: number
    lookup_status: string
    root_record_size: number
    redirected_to: string | null
    record_parts: Array<Record<string, string>>
  }
  status?: string
  checks?: Array<{
    msg_code: string
    msg: string
    status: string
    params?: Record<string, any>
  }>
}

export interface NightcrawlerDKIMResponse {
  selector: string
  record?: string
  parsed?: {
    version?: string
    keyType?: string
    publicKey?: string
    algorithm?: string
    serviceType?: string
    flags?: string
    notes?: string
  }
  valid?: boolean
  errors?: string[]
  warnings?: string[]
}

export interface NightcrawlerMXResponse {
  rdtype: string
  domain: string
  full_domain: string
  ttl: number
  cnames: string[]
  ns_addr: string
  ns_proto: string
  mailservers: Array<{
    preference: number
    exchange: string
  }>
  mx_provider?: string
}

export interface NightcrawlerMTASTSResponse {
  record?: string
  policy?: {
    version?: string
    mode?: 'testing' | 'enforce' | 'none'
    maxAge?: number
    mxPatterns?: string[]
  }
  valid?: boolean
  errors?: string[]
  warnings?: string[]
}

export interface NightcrawlerTLSRPTResponse {
  record?: string
  parsed?: {
    version?: string
    reportingAddresses?: string[]
  }
  valid?: boolean
  errors?: string[]
  warnings?: string[]
}

export interface NightcrawlerBIMIResponse {
  record?: string
  parsed?: {
    version?: string
    logoUrl?: string
    certificateUrl?: string
  }
  valid?: boolean
  errors?: string[]
  warnings?: string[]
}

export interface NightcrawlerBlacklistResponse {
  ip: string
  listed: boolean
  lists?: Array<{
    name: string
    listed: boolean
    details?: string
  }>
}

export interface NightcrawlerScoreResponse {
  domain: string
  score: number
  maxScore: number
  breakdown: {
    dmarc?: { score: number; max: number; details?: string }
    spf?: { score: number; max: number; details?: string }
    dkim?: { score: number; max: number; details?: string }
    mx?: { score: number; max: number; details?: string }
    mtaSts?: { score: number; max: number; details?: string }
    tlsRpt?: { score: number; max: number; details?: string }
    bimi?: { score: number; max: number; details?: string }
  }
  riskLevel?: 'critical' | 'high' | 'medium' | 'low'
  recommendations?: string[]
}

/**
 * Nightcrawler API Client
 * Client is created lazily on first use so the build can succeed without env vars.
 */
class NightcrawlerAPI {
  private _client: APIClient | null = null
  private get client(): APIClient {
    if (!this._client) this._client = createAPIClient()
    return this._client
  }

  /**
   * Build query string from options
   */
  private buildQueryString(options?: LookupOptions): string {
    if (!options) return ''
    const params = new URLSearchParams()
    if (options.strategy) params.append('strategy', options.strategy)
    if (options.timeout) params.append('timeout', options.timeout.toString())
    return params.toString() ? `?${params.toString()}` : ''
  }

  /**
   * DMARC Lookup
   */
  async lookupDMARC(domain: string, options?: LookupOptions): Promise<NightcrawlerDMARCResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerDMARCResponse>(`/lookup/dmarc/${domain}${query}`)
  }

  /**
   * DMARC Explain (with validation)
   */
  async explainDMARC(domain: string, options?: LookupOptions): Promise<NightcrawlerDMARCResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerDMARCResponse>(`/explain/dmarc/${domain}${query}`)
  }

  /**
   * SPF Lookup
   */
  async lookupSPF(domain: string, options?: LookupOptions): Promise<NightcrawlerSPFResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerSPFResponse>(`/lookup/spf/${domain}${query}`)
  }

  /**
   * SPF Explain (with validation and lookup counting)
   */
  async explainSPF(domain: string, options?: LookupOptions): Promise<NightcrawlerSPFResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerSPFResponse>(`/explain/spf/${domain}${query}`)
  }

  /**
   * DKIM Lookup
   */
  async lookupDKIM(domain: string, selector: string, options?: LookupOptions): Promise<NightcrawlerDKIMResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerDKIMResponse>(`/lookup/dkim/${domain}/${selector}${query}`)
  }

  /**
   * DKIM Explain (with validation)
   */
  async explainDKIM(domain: string, selector: string, options?: LookupOptions): Promise<NightcrawlerDKIMResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerDKIMResponse>(`/explain/dkim/${domain}/${selector}${query}`)
  }

  /**
   * MX Lookup
   */
  async lookupMX(domain: string, options?: LookupOptions): Promise<NightcrawlerMXResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerMXResponse>(`/lookup/mx/${domain}${query}`)
  }

  /**
   * MX Explain (with validation)
   */
  async explainMX(domain: string, options?: LookupOptions): Promise<NightcrawlerMXResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerMXResponse>(`/explain/mx/${domain}${query}`)
  }

  /**
   * MTA-STS Lookup
   */
  async lookupMTASTS(domain: string, options?: LookupOptions): Promise<NightcrawlerMTASTSResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerMTASTSResponse>(`/lookup/mta-sts/${domain}${query}`)
  }

  /**
   * MTA-STS Explain (with validation)
   */
  async explainMTASTS(domain: string, options?: LookupOptions): Promise<NightcrawlerMTASTSResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerMTASTSResponse>(`/explain/mta-sts/${domain}${query}`)
  }

  /**
   * TLS-RPT Lookup
   */
  async lookupTLSRPT(domain: string, options?: LookupOptions): Promise<NightcrawlerTLSRPTResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerTLSRPTResponse>(`/lookup/tls-rpt/${domain}${query}`)
  }

  /**
   * TLS-RPT Explain (with validation)
   */
  async explainTLSRPT(domain: string, options?: LookupOptions): Promise<NightcrawlerTLSRPTResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerTLSRPTResponse>(`/explain/tls-rpt/${domain}${query}`)
  }

  /**
   * BIMI Lookup
   */
  async lookupBIMI(domain: string, options?: LookupOptions): Promise<NightcrawlerBIMIResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerBIMIResponse>(`/lookup/bimi/${domain}${query}`)
  }

  /**
   * BIMI Explain (with validation)
   */
  async explainBIMI(domain: string, options?: LookupOptions): Promise<NightcrawlerBIMIResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerBIMIResponse>(`/explain/bimi/${domain}${query}`)
  }

  /**
   * Blacklist Check
   */
  async checkBlacklist(ip: string, options?: LookupOptions): Promise<NightcrawlerBlacklistResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerBlacklistResponse>(`/blacklisted/${ip}${query}`)
  }

  /**
   * Domain Score (comprehensive)
   */
  async getDomainScore(domain: string, options?: LookupOptions): Promise<NightcrawlerScoreResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerScoreResponse>(`/score/${domain}${query}`)
  }

  /**
   * Domain Score Lite (faster, less detail)
   */
  async getDomainScoreLite(domain: string, options?: LookupOptions): Promise<NightcrawlerScoreResponse> {
    const query = this.buildQueryString(options)
    return this.client.get<NightcrawlerScoreResponse>(`/score-lite/${domain}${query}`)
  }
}

// Export singleton instance
export const nightcrawler = new NightcrawlerAPI()
