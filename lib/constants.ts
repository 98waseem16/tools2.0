// ============================================
// SENDMARC TOOLS 2.0 - Constants
// ============================================

import { ServiceStatus } from './types'

// ===================
// Known Email Services (SPF Detection)
// ===================

interface KnownService {
  name: string
  patterns: string[]
  category: 'email-provider' | 'esp' | 'crm' | 'helpdesk' | 'transactional' | 'other'
  status: ServiceStatus
  note?: string
  icon?: string
}

export const KNOWN_SERVICES: KnownService[] = [
  // ===== Email Providers =====
  {
    name: 'Google Workspace',
    patterns: ['_spf.google.com', 'googlemail.com'],
    category: 'email-provider',
    status: 'good',
    icon: '/icons/google.svg'
  },
  {
    name: 'Microsoft 365',
    patterns: ['spf.protection.outlook.com', 'sharepointonline.com'],
    category: 'email-provider',
    status: 'good',
    icon: '/icons/microsoft.svg'
  },
  {
    name: 'Zoho Mail',
    patterns: ['zoho.com', 'zoho.eu'],
    category: 'email-provider',
    status: 'good',
    icon: '/icons/zoho.svg'
  },
  {
    name: 'ProtonMail',
    patterns: ['protonmail.ch'],
    category: 'email-provider',
    status: 'good',
    icon: '/icons/protonmail.svg'
  },
  {
    name: 'Fastmail',
    patterns: ['messagingengine.com'],
    category: 'email-provider',
    status: 'good',
    icon: '/icons/fastmail.svg'
  },
  {
    name: 'Mimecast',
    patterns: ['mimecast.com', '_netblocks.mimecast.com'],
    category: 'email-provider',
    status: 'good',
    icon: '/icons/mimecast.svg'
  },

  // ===== Marketing ESPs =====
  {
    name: 'Mailchimp',
    patterns: ['servers.mcsv.net', 'mcsv.net', 'mailchimp.com'],
    category: 'esp',
    status: 'caution',
    note: 'High-volume marketing ESP - ensure DKIM is properly configured',
    icon: '/icons/mailchimp.svg'
  },
  {
    name: 'Constant Contact',
    patterns: ['spf.constantcontact.com', 'constantcontact.com'],
    category: 'esp',
    status: 'caution',
    note: 'Marketing ESP - monitor for deliverability issues',
    icon: '/icons/constantcontact.svg'
  },
  {
    name: 'Campaign Monitor',
    patterns: ['cmail1.com', 'cmail2.com', 'createsend.com'],
    category: 'esp',
    status: 'caution',
    note: 'Marketing ESP',
    icon: '/icons/campaignmonitor.svg'
  },
  {
    name: 'Klaviyo',
    patterns: ['klaviyo.com'],
    category: 'esp',
    status: 'caution',
    note: 'E-commerce marketing platform',
    icon: '/icons/klaviyo.svg'
  },
  {
    name: 'ActiveCampaign',
    patterns: ['acems1.com', 'activecampaign.com'],
    category: 'esp',
    status: 'caution',
    note: 'Marketing automation platform',
    icon: '/icons/activecampaign.svg'
  },
  {
    name: 'Brevo (Sendinblue)',
    patterns: ['sendinblue.com', 'brevo.com'],
    category: 'esp',
    status: 'caution',
    note: 'Marketing and transactional email platform',
    icon: '/icons/brevo.svg'
  },
  {
    name: 'GetResponse',
    patterns: ['getresponse.com'],
    category: 'esp',
    status: 'caution',
    note: 'Marketing automation platform',
    icon: '/icons/getresponse.svg'
  },
  {
    name: 'ConvertKit',
    patterns: ['convertkit.com', 'ck.page'],
    category: 'esp',
    status: 'caution',
    note: 'Creator marketing platform',
    icon: '/icons/convertkit.svg'
  },

  // ===== CRM =====
  {
    name: 'HubSpot',
    patterns: ['hubspot.net', '_spf.hubspot.com', 'hubspot.com'],
    category: 'crm',
    status: 'good',
    icon: '/icons/hubspot.svg'
  },
  {
    name: 'Salesforce',
    patterns: ['_spf.salesforce.com', 'salesforce.com'],
    category: 'crm',
    status: 'good',
    icon: '/icons/salesforce.svg'
  },
  {
    name: 'Pipedrive',
    patterns: ['pipedrive.com'],
    category: 'crm',
    status: 'good',
    icon: '/icons/pipedrive.svg'
  },
  {
    name: 'Marketo',
    patterns: ['mktomail.com', 'mktdns.com'],
    category: 'crm',
    status: 'good',
    icon: '/icons/marketo.svg'
  },

  // ===== Helpdesk =====
  {
    name: 'Zendesk',
    patterns: ['mail.zendesk.com', 'zendesk.com'],
    category: 'helpdesk',
    status: 'good',
    icon: '/icons/zendesk.svg'
  },
  {
    name: 'Freshdesk',
    patterns: ['email.freshdesk.com', 'freshdesk.com'],
    category: 'helpdesk',
    status: 'good',
    icon: '/icons/freshdesk.svg'
  },
  {
    name: 'Intercom',
    patterns: ['intercom.io', 'intercom-mail.com'],
    category: 'helpdesk',
    status: 'good',
    icon: '/icons/intercom.svg'
  },
  {
    name: 'Help Scout',
    patterns: ['helpscout.net'],
    category: 'helpdesk',
    status: 'good',
    icon: '/icons/helpscout.svg'
  },
  {
    name: 'Front',
    patterns: ['frontapp.com'],
    category: 'helpdesk',
    status: 'good',
    icon: '/icons/front.svg'
  },

  // ===== Transactional =====
  {
    name: 'Amazon SES',
    patterns: ['amazonses.com'],
    category: 'transactional',
    status: 'good',
    icon: '/icons/aws.svg'
  },
  {
    name: 'SendGrid',
    patterns: ['sendgrid.net'],
    category: 'transactional',
    status: 'caution',
    note: 'Monitor for abuse - popular platform can have deliverability challenges',
    icon: '/icons/sendgrid.svg'
  },
  {
    name: 'Postmark',
    patterns: ['spf.mtasv.net', 'mtasv.net'],
    category: 'transactional',
    status: 'good',
    note: 'High deliverability transactional service',
    icon: '/icons/postmark.svg'
  },
  {
    name: 'Mailgun',
    patterns: ['mailgun.org'],
    category: 'transactional',
    status: 'caution',
    note: 'Monitor delivery reputation',
    icon: '/icons/mailgun.svg'
  },
  {
    name: 'Mandrill',
    patterns: ['mandrillapp.com'],
    category: 'transactional',
    status: 'good',
    note: 'Mailchimp transactional service',
    icon: '/icons/mandrill.svg'
  },
  {
    name: 'SparkPost',
    patterns: ['sparkpostmail.com'],
    category: 'transactional',
    status: 'good',
    icon: '/icons/sparkpost.svg'
  },
  {
    name: 'Mailjet',
    patterns: ['mailjet.com'],
    category: 'transactional',
    status: 'good',
    icon: '/icons/mailjet.svg'
  },

  // ===== Other =====
  {
    name: 'Shopify',
    patterns: ['shops.shopify.com', 'shopify.com'],
    category: 'other',
    status: 'good',
    icon: '/icons/shopify.svg'
  },
  {
    name: 'Stripe',
    patterns: ['stripe.com'],
    category: 'other',
    status: 'good',
    icon: '/icons/stripe.svg'
  },
  {
    name: 'DocuSign',
    patterns: ['docusign.com', 'docusign.net'],
    category: 'other',
    status: 'good',
    icon: '/icons/docusign.svg'
  },
  {
    name: 'Squarespace',
    patterns: ['squarespace.com'],
    category: 'other',
    status: 'good',
    icon: '/icons/squarespace.svg'
  },
  {
    name: 'Wix',
    patterns: ['wix.com'],
    category: 'other',
    status: 'good',
    icon: '/icons/wix.svg'
  },
  {
    name: 'Calendly',
    patterns: ['calendly.com'],
    category: 'other',
    status: 'good',
    icon: '/icons/calendly.svg'
  },
]

// ===================
// Competitor Detection Patterns
// ===================

interface CompetitorPattern {
  name: string
  displayName: string
  dmarcRua: string[]
  spfIncludes: string[]
  mxRecords: string[]
}

export const COMPETITOR_PATTERNS: CompetitorPattern[] = [
  {
    name: 'proofpoint',
    displayName: 'Proofpoint',
    dmarcRua: ['proofpoint.com', 'pphosted.com'],
    spfIncludes: ['pphosted.com', 'proofpoint.com'],
    mxRecords: ['pphosted.com']
  },
  {
    name: 'valimail',
    displayName: 'Valimail',
    dmarcRua: ['valimail.com', 'vali.email'],
    spfIncludes: ['valimail.com'],
    mxRecords: []
  },
  {
    name: 'dmarcian',
    displayName: 'Dmarcian',
    dmarcRua: ['dmarcian.com', 'dmarcian.eu'],
    spfIncludes: [],
    mxRecords: []
  },
  {
    name: 'agari',
    displayName: 'Agari',
    dmarcRua: ['agari.com'],
    spfIncludes: [],
    mxRecords: []
  },
  {
    name: 'mimecast',
    displayName: 'Mimecast',
    dmarcRua: ['mimecast.com'],
    spfIncludes: ['mimecast.com'],
    mxRecords: ['mimecast.com']
  },
  {
    name: 'barracuda',
    displayName: 'Barracuda',
    dmarcRua: ['barracuda.com', 'barracudanetworks.com'],
    spfIncludes: ['barracudanetworks.com'],
    mxRecords: ['barracudanetworks.com']
  },
  {
    name: 'easydmarc',
    displayName: 'EasyDMARC',
    dmarcRua: ['easydmarc.com', 'easydmarc.us'],
    spfIncludes: [],
    mxRecords: []
  },
  {
    name: 'ondmarc',
    displayName: 'OnDMARC (Red Sift)',
    dmarcRua: ['ondmarc.com', 'redsift.io'],
    spfIncludes: [],
    mxRecords: []
  },
]

// ===================
// Common DKIM Selectors
// ===================

export const COMMON_DKIM_SELECTORS = [
  // Google
  'google', 'google1', 'google2', 'googlemail',
  
  // Microsoft
  'selector1', 'selector2',
  
  // Generic/common
  'default', 'dkim', 'mail', 'email', 'k1', 'k2', 's1', 's2', 's',
  
  // ESPs
  'mailchimp', 'mc', 'mandrill', 'mcsv',
  'sendgrid', 'sg', 'smtpapi', 's1._domainkey', 's2._domainkey',
  'amazonses', 'ses',
  'postmark', 'pm', '20230601',
  'mailgun', 'mg', 'mailo',
  'hubspot', 'hs1', 'hs2',
  'zendesk', 'zendesk1', 'zendesk2', 'zd1', 'zd2',
  'freshdesk', 'fd1', 'fd2',
  'intercom', 'ic1', 'ic2',
  'salesforce', 'sf1', 'sf2', 'sf',
  'klaviyo', 'kl', 'kl._domainkey',
  
  // Hosting/transactional
  'cm', 'cmail', 'cmail1', 'cmail2',
  'smtp', 'smtp2go',
  'turbo-smtp',
  'elasticemail',
  'mailjet', 'mailjet._domainkey',
  
  // Other common
  'dkim1', 'dkim2',
  'selector', 'myselector',
  'key1', 'key2',
  '202301', '202401', '2023', '2024',
]

// ===================
// DNSBL (Blacklist) Servers
// ===================

interface DNSBL {
  name: string
  zone: string
  description: string
  website?: string
}

export const DNSBL_SERVERS: DNSBL[] = [
  // Spamhaus (most important)
  { 
    name: 'Spamhaus ZEN', 
    zone: 'zen.spamhaus.org', 
    description: 'Combined Spamhaus blocklist (SBL+XBL+PBL)',
    website: 'https://www.spamhaus.org'
  },
  { 
    name: 'Spamhaus SBL', 
    zone: 'sbl.spamhaus.org', 
    description: 'Spamhaus Block List - verified spam sources'
  },
  { 
    name: 'Spamhaus XBL', 
    zone: 'xbl.spamhaus.org', 
    description: 'Exploits Block List - hijacked/infected systems'
  },
  { 
    name: 'Spamhaus PBL', 
    zone: 'pbl.spamhaus.org', 
    description: 'Policy Block List - dynamic/residential IPs'
  },
  
  // Other major lists
  { 
    name: 'Barracuda', 
    zone: 'b.barracudacentral.org', 
    description: 'Barracuda Reputation Block List',
    website: 'https://www.barracudacentral.org'
  },
  { 
    name: 'SpamCop', 
    zone: 'bl.spamcop.net', 
    description: 'SpamCop Blocking List',
    website: 'https://www.spamcop.net'
  },
  { 
    name: 'CBL', 
    zone: 'cbl.abuseat.org', 
    description: 'Composite Blocking List - botnet/compromised hosts'
  },
  { 
    name: 'SORBS', 
    zone: 'dnsbl.sorbs.net', 
    description: 'SORBS Combined DNSBL'
  },
  { 
    name: 'SURBL', 
    zone: 'multi.surbl.org', 
    description: 'SURBL - URI/domain blacklist'
  },
  
  // UCEPROTECT levels
  { 
    name: 'UCEPROTECT Level 1', 
    zone: 'dnsbl-1.uceprotect.net', 
    description: 'Individual IP addresses'
  },
  { 
    name: 'UCEPROTECT Level 2', 
    zone: 'dnsbl-2.uceprotect.net', 
    description: 'IP ranges from problematic providers'
  },
  { 
    name: 'UCEPROTECT Level 3', 
    zone: 'dnsbl-3.uceprotect.net', 
    description: 'Entire ASNs (use with caution)'
  },
  
  // Additional lists
  { 
    name: 'Invaluement', 
    zone: 'dnsbl.invaluement.com', 
    description: 'Invaluement DNSBL'
  },
  { 
    name: 'Truncate', 
    zone: 'truncate.gbudb.net', 
    description: 'Truncate DNSBL'
  },
  { 
    name: 'PSBL', 
    zone: 'psbl.surriel.com', 
    description: 'Passive Spam Block List'
  },
  { 
    name: 'JustSpam', 
    zone: 'dnsbl.justspam.org', 
    description: 'JustSpam DNSBL'
  },
  { 
    name: 'Mailspike BL', 
    zone: 'bl.mailspike.net', 
    description: 'Mailspike Blocklist'
  },
  { 
    name: 'WPBL', 
    zone: 'db.wpbl.info', 
    description: 'Weighted Private Block List'
  },
]

// ===================
// Email Provider Detection (from MX records)
// ===================

interface EmailProvider {
  name: string
  patterns: string[]
  icon?: string
}

export const EMAIL_PROVIDERS: EmailProvider[] = [
  { name: 'Google Workspace', patterns: ['google.com', 'googlemail.com', 'aspmx.l.google.com'], icon: '/icons/google.svg' },
  { name: 'Microsoft 365', patterns: ['outlook.com', 'protection.outlook.com', 'mail.protection.outlook.com'], icon: '/icons/microsoft.svg' },
  { name: 'Zoho Mail', patterns: ['zoho.com', 'zoho.eu', 'zoho.in'], icon: '/icons/zoho.svg' },
  { name: 'ProtonMail', patterns: ['protonmail.ch', 'proton.me'], icon: '/icons/protonmail.svg' },
  { name: 'Fastmail', patterns: ['messagingengine.com', 'fastmail.com'], icon: '/icons/fastmail.svg' },
  { name: 'Mimecast', patterns: ['mimecast.com', '_netblocks.mimecast.com'], icon: '/icons/mimecast.svg' },
  { name: 'Proofpoint', patterns: ['pphosted.com', 'proofpoint.com'], icon: '/icons/proofpoint.svg' },
  { name: 'Barracuda', patterns: ['barracudanetworks.com', 'barracuda.com'], icon: '/icons/barracuda.svg' },
  { name: 'GoDaddy', patterns: ['secureserver.net'], icon: '/icons/godaddy.svg' },
  { name: 'Rackspace', patterns: ['emailsrvr.com'], icon: '/icons/rackspace.svg' },
  { name: 'Amazon WorkMail', patterns: ['awsapps.com'], icon: '/icons/aws.svg' },
  { name: 'Namecheap', patterns: ['registrar-servers.com', 'privateemail.com'], icon: '/icons/namecheap.svg' },
]

// ===================
// DNS Provider Detection (from NS records)
// ===================

interface DNSProvider {
  name: string
  patterns: string[]
}

export const DNS_PROVIDERS: DNSProvider[] = [
  { name: 'Cloudflare', patterns: ['cloudflare.com'] },
  { name: 'AWS Route 53', patterns: ['awsdns'] },
  { name: 'Google Cloud DNS', patterns: ['googledomains.com', 'google.com'] },
  { name: 'Azure DNS', patterns: ['azure-dns.com', 'azure-dns.net'] },
  { name: 'GoDaddy', patterns: ['domaincontrol.com'] },
  { name: 'Namecheap', patterns: ['registrar-servers.com'] },
  { name: 'DigitalOcean', patterns: ['digitalocean.com'] },
  { name: 'DNSimple', patterns: ['dnsimple.com'] },
  { name: 'NS1', patterns: ['nsone.net'] },
  { name: 'Dyn', patterns: ['dynect.net'] },
]

// ===================
// Score Thresholds
// ===================

export const SCORE_THRESHOLDS = {
  overall: {
    excellent: 90,  // 90-100
    good: 70,       // 70-89
    fair: 50,       // 50-69
    poor: 0,        // 0-49
  },
  category: {
    excellent: 5,   // 5/5
    good: 4,        // 4/5
    fair: 3,        // 3/5
    poor: 0,        // 0-2/5
  }
}

// ===================
// Risk Level Mapping
// ===================

export function getOverallRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 90) return 'low'
  if (score >= 70) return 'medium'
  if (score >= 50) return 'high'
  return 'critical'
}

export function getCategoryRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
  if (score >= 5) return 'low'
  if (score >= 4) return 'medium'
  if (score >= 3) return 'high'
  return 'critical'
}

// ===================
// DMARC Policy Scoring
// ===================

export const DMARC_POLICY_SCORES = {
  'reject': 5,
  'quarantine': 3,
  'none': 1,
  'missing': 0,
}

// ===================
// SPF All Mechanism Scoring
// ===================

export const SPF_ALL_SCORES = {
  '-all': 5,   // Hard fail - best
  '~all': 3,   // Soft fail - acceptable
  '?all': 1,   // Neutral - weak
  '+all': 0,   // Pass all - dangerous!
}
