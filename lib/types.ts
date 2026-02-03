// ============================================
// SENDMARC TOOLS 2.0 - TypeScript Types
// ============================================

// ===================
// Core Analysis Types
// ===================

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type CheckStatus = 'pass' | 'fail' | 'warning' | 'info'
export type RecordStatus = 'valid' | 'invalid' | 'missing' | 'error'

export interface Check {
  id: string
  status: CheckStatus
  message: string
  details?: string
  learnMoreUrl?: string
}

// ===================
// DMARC Types
// ===================

export type DMARCPolicy = 'none' | 'quarantine' | 'reject'
export type AlignmentMode = 'relaxed' | 'strict'

export interface DMARCParsed {
  version: string
  policy: DMARCPolicy
  subdomainPolicy: DMARCPolicy | null
  percentage: number
  aggregateReports: string[]       // rua addresses
  forensicReports: string[]        // ruf addresses
  alignmentMode: {
    spf: AlignmentMode
    dkim: AlignmentMode
  }
  failureOptions: string[] | null   // fo tag (failure reporting options)
  reportInterval: number | null    // ri tag (seconds)
}

export interface DMARCAnalysis {
  status: RecordStatus
  score: number                    // 0-5
  record: string | null
  parsed: DMARCParsed | null
  checks: Check[]
  recommendations: string[]
}

// ===================
// SPF Types
// ===================

export type SPFQualifier = '+' | '-' | '~' | '?'
/** Final "all" mechanism value: -all, ~all, +all, ?all */
export type SPFAllQualifier = '-all' | '~all' | '+all' | '?all'
export type SPFMechanismType = 'all' | 'include' | 'a' | 'mx' | 'ip4' | 'ip6' | 'exists' | 'redirect' | 'ptr'
export type SPFStatus = 'valid' | 'invalid' | 'missing' | 'permerror' | 'temperror'
export type ServiceStatus = 'good' | 'caution' | 'warning'

export interface SPFMechanism {
  type: SPFMechanismType
  qualifier: SPFQualifier
  value: string
  lookups: number                  // DNS lookups this mechanism uses
}

export interface DetectedService {
  name: string                     // "Google Workspace", "Mailchimp", etc.
  include: string                  // The actual include mechanism
  status: ServiceStatus
  note?: string                    // Warning message if applicable
  icon?: string                    // URL to service icon (emoji or fallback)
  category?: 'email-provider' | 'esp' | 'crm' | 'helpdesk' | 'transactional' | 'other'

  // Dynamic logo fields (added by logo enrichment)
  logoUrl?: string                 // Fetched logo URL from external API
  logoSource?: 'clearbit' | 'favicon' | 'avatar' // Which strategy was used
  domain?: string                  // Canonical brand domain (e.g., "google.com")
}

export interface SPFParsed {
  version: string
  mechanisms: SPFMechanism[]
  allQualifier: SPFAllQualifier   // The final -all, ~all, +all, ?all
  lookupCount: number
  secondaryLookupCount?: number    // Lookups from nested includes
  voidLookupCount?: number         // NXDOMAIN responses
  maxLookups: number               // Always 10 per RFC
  recordSize?: number              // Character count of SPF record
  redirectedTo?: string | null     // Domain if using redirect= mechanism
}

export interface SPFAnalysis {
  status: SPFStatus
  score: number                    // 0-5
  record: string | null
  parsed: SPFParsed | null
  detectedServices: DetectedService[]
  checks: Check[]
  recommendations: string[]
}

/** Alias for SPFAnalysis (used by SPF checker UI) */
export type SPFData = SPFAnalysis

export interface SPFIncludeNode {
  domain: string
  mechanism: SPFMechanism
  lookups: number
  children: SPFIncludeNode[]
  depth: number
}

export type ComplexityRating = 'simple' | 'moderate' | 'complex'

export interface SPFComplexityAnalysis {
  rating: ComplexityRating
  mechanismCount: number
  lookupCount: number
  recordSize: number
  suggestions: string[]
}

export interface SPFAnalysisResult {
  domain: string
  spf: SPFAnalysis
  includeTree?: SPFIncludeNode
  complexity?: SPFComplexityAnalysis
  validations: Check[]
  optimizations: string[]
}

// ===================
// DKIM Types
// ===================

export interface DKIMSelector {
  selector: string
  status: 'found' | 'missing'
  keyLength?: number               // 1024, 2048, etc.
  algorithm?: string               // rsa-sha256, etc.
  record?: string
  publicKey?: string
}

export interface DKIMAnalysis {
  status: 'found' | 'partial' | 'missing'
  score: number                    // 0-5
  selectors: DKIMSelector[]
  checks: Check[]
  recommendations: string[]
}

// ===================
// MX Types
// ===================

export interface MXRecord {
  priority: number
  hostname: string
  ip?: string
}

export interface MXAnalysis {
  status: RecordStatus
  score: number
  records: MXRecord[]
  provider: string | null          // "Google Workspace", "Microsoft 365", etc.
  checks: Check[]
}

// ===================
// MTA-STS Types
// ===================

export type MTASTSMode = 'enforce' | 'testing' | 'none'

export interface MTASTSPolicy {
  version: string
  mode: MTASTSMode
  maxAge: number
  mx: string[]
}

export interface MTASTSAnalysis {
  status: 'enforcing' | 'testing' | 'none' | 'missing'
  score: number
  record: string | null
  policy: MTASTSPolicy | null
  checks: Check[]
}

// ===================
// TLS-RPT Types
// ===================

export interface TLSRPTAnalysis {
  status: 'valid' | 'missing'
  score: number
  record: string | null
  reportingAddresses: string[]
  checks: Check[]
}

// ===================
// BIMI Types
// ===================

export interface BIMIAnalysis {
  status: 'valid' | 'missing'
  score: number
  record: string | null
  logoUrl: string | null
  certificateUrl: string | null
  checks: Check[]
}

// ===================
// DNS Types
// ===================

export interface DNSAnalysis {
  provider: string | null          // "Cloudflare", "AWS Route 53", etc.
  nameservers: string[]
  aRecord: string | null
  aaaaRecord: string | null
  ttl?: number
}

// ===================
// Blacklist Types
// ===================

export interface BlacklistResult {
  name: string
  zone: string
  listed: boolean
  description?: string
  reason?: string
  delistUrl?: string
}

export interface BlacklistAnalysis {
  status: 'clean' | 'listed' | 'checking' | 'error'
  ip: string
  listedOn: string[]
  results: BlacklistResult[]
  checkedCount: number
}

// ===================
// Competitor Detection
// ===================

export type CompetitorName = 'proofpoint' | 'valimail' | 'dmarcian' | 'agari' | 'mimecast' | 'barracuda' | null

export interface CompetitorDetection {
  detected: CompetitorName
  signals: string[]
  confidence: 'high' | 'medium' | 'low'
}

// ===================
// CTA Types
// ===================

export type CTAType = 'trial' | 'demo' | 'competitor' | 'upgrade' | 'bimi' | 'monitoring' | 'none'

export interface CTA {
  type: CTAType
  priority: number
  headline: string
  message: string
  buttonText: string
  buttonUrl: string
}

// ===================
// Main Analysis Response
// ===================

export interface OverallScore {
  score: number                    // 0-100
  riskLevel: RiskLevel
  summary: {
    good: string[]
    warnings: string[]
    critical: string[]
  }
  humanSummary: string             // Plain English summary
}

export interface AnalysisResponse {
  domain: string
  timestamp: string
  overall: OverallScore
  dmarc: DMARCAnalysis
  spf: SPFAnalysis
  dkim: DKIMAnalysis
  mx: MXAnalysis
  mtaSts: MTASTSAnalysis
  tlsRpt: TLSRPTAnalysis
  bimi: BIMIAnalysis
  dns: DNSAnalysis
  blacklist: BlacklistAnalysis
  competitor: CompetitorDetection
  cta: CTA
}

// ===================
// API Request Types
// ===================

export interface AnalyzeRequest {
  domain: string
}

export interface BlacklistCheckRequest {
  ip: string
}

export interface SPFTestRequest {
  domain: string
  ip: string
}

export interface DKIMGenerateRequest {
  domain: string
  selector: string
  keySize: 1024 | 2048
}

export interface HeaderAnalyzeRequest {
  headers: string
}

// ===================
// UI Component Props
// ===================

export interface StatusCardProps {
  protocol: string
  score: number
  maxScore?: number
  status: CheckStatus
  label?: string
  onClick?: () => void
}

export interface ScoreCircleProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  animated?: boolean
}

export interface ExpandableSectionProps {
  title: string
  subtitle?: string
  status: CheckStatus
  defaultOpen?: boolean
  children: React.ReactNode
}

export interface DNSRecordDisplayProps {
  record: string
  label?: string
  variant?: 'light' | 'dark'
  copyable?: boolean
}

export interface ServiceBadgeProps {
  service: DetectedService
  size?: 'sm' | 'md'
}

export interface ContextualCTAProps {
  cta: CTA
  variant?: 'inline' | 'banner' | 'card'
}

// ===================
// Utility Types
// ===================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type APIResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
  code?: string
}
