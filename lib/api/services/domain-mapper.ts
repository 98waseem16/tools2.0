/**
 * Service Domain Mapper
 * Maps SPF include patterns to canonical brand domains for logo lookup
 */

/**
 * Mapping of SPF include patterns to canonical brand domains
 * Used to extract the correct domain for logo APIs
 */
const SERVICE_DOMAIN_MAP: Record<string, string> = {
  // Email Providers
  'google.com': 'google.com',
  '_spf.google.com': 'google.com',
  'googlemail.com': 'google.com',
  'aspmx.googlemail.com': 'google.com',

  'outlook.com': 'microsoft.com',
  'protection.outlook.com': 'microsoft.com',
  'spf.protection.outlook.com': 'microsoft.com',
  'sharepointonline.com': 'microsoft.com',

  'zoho.com': 'zoho.com',
  'zoho.eu': 'zoho.com',
  'zmailcloud.com': 'zoho.com',

  'protonmail.ch': 'proton.me',
  'protonmail.com': 'proton.me',

  'messagingengine.com': 'fastmail.com',
  'fastmail.com': 'fastmail.com',

  // Email Security / Gateway
  'mimecast.com': 'mimecast.com',
  '_netblocks.mimecast.com': 'mimecast.com',
  'usb._netblocks.mimecast.com': 'mimecast.com',

  'pphosted.com': 'proofpoint.com',
  'proofpoint.com': 'proofpoint.com',

  'barracudanetworks.com': 'barracuda.com',
  'barracuda.com': 'barracuda.com',

  // ESPs (Email Service Providers)
  'mcsv.net': 'mailchimp.com',
  'servers.mcsv.net': 'mailchimp.com',
  'mailchimp.com': 'mailchimp.com',

  'constantcontact.com': 'constantcontact.com',
  'spf.constantcontact.com': 'constantcontact.com',

  'cmail1.com': 'campaignmonitor.com',
  'cmail2.com': 'campaignmonitor.com',
  'createsend.com': 'campaignmonitor.com',

  'klaviyo.com': 'klaviyo.com',
  'klaviyomail.com': 'klaviyo.com',

  'acems1.com': 'activecampaign.com',
  'activecampaign.com': 'activecampaign.com',

  'sendinblue.com': 'brevo.com',
  'brevo.com': 'brevo.com',

  'getresponse.com': 'getresponse.com',

  'convertkit.com': 'convertkit.com',
  'ck.page': 'convertkit.com',

  'aweber.com': 'aweber.com',

  'benchmark.email': 'benchmarkemail.com',
  'benchmarkemail.com': 'benchmarkemail.com',

  // CRM Systems
  'hubspot.net': 'hubspot.com',
  '_spf.hubspot.com': 'hubspot.com',
  'hubspot.com': 'hubspot.com',

  'salesforce.com': 'salesforce.com',
  '_spf.salesforce.com': 'salesforce.com',
  'exacttarget.com': 'salesforce.com',

  'pipedrive.com': 'pipedrive.com',

  'mktomail.com': 'marketo.com',
  'mktdns.com': 'marketo.com',
  'marketo.com': 'marketo.com',

  // Helpdesk / Support
  'zendesk.com': 'zendesk.com',
  'mail.zendesk.com': 'zendesk.com',

  'freshdesk.com': 'freshdesk.com',
  'email.freshdesk.com': 'freshdesk.com',

  'intercom.io': 'intercom.com',
  'intercom-mail.com': 'intercom.com',

  'helpscout.net': 'helpscout.com',
  'helpscoutemail.com': 'helpscout.com',

  'frontapp.com': 'front.com',
  'frontapp.net': 'front.com',

  'kustomer.com': 'kustomer.com',

  // Transactional Email Services
  'amazonses.com': 'aws.amazon.com',
  '_amazonses.com': 'aws.amazon.com',

  'sendgrid.net': 'sendgrid.com',
  'sendgrid.com': 'sendgrid.com',

  'mtasv.net': 'postmarkapp.com',
  'spf.mtasv.net': 'postmarkapp.com',
  'postmarkapp.com': 'postmarkapp.com',

  'mailgun.org': 'mailgun.com',
  'mailgun.com': 'mailgun.com',

  'mandrillapp.com': 'mandrill.com',
  'mandrill.com': 'mandrill.com',

  'sparkpostmail.com': 'sparkpost.com',
  'sparkpost.com': 'sparkpost.com',

  'mailjet.com': 'mailjet.com',
  'mailjet.us': 'mailjet.com',

  'postmark.com': 'postmarkapp.com',

  'socketlabs.com': 'socketlabs.com',

  // Other Services
  'shopify.com': 'shopify.com',
  'shops.shopify.com': 'shopify.com',

  'stripe.com': 'stripe.com',

  'docusign.com': 'docusign.com',
  'docusign.net': 'docusign.com',

  'squarespace.com': 'squarespace.com',

  'wix.com': 'wix.com',

  'calendly.com': 'calendly.com',

  'notion.so': 'notion.so',

  'slack.com': 'slack.com',

  'github.com': 'github.com',

  'atlassian.com': 'atlassian.com',
  'atlassian.net': 'atlassian.com',

  'airtable.com': 'airtable.com',

  'typeform.com': 'typeform.com',
}

/**
 * Extract canonical brand domain from SPF include pattern
 *
 * @param includePattern - The SPF include pattern (e.g., "_spf.google.com", "servers.mcsv.net")
 * @returns Canonical brand domain (e.g., "google.com", "mailchimp.com") or null if not found
 *
 * @example
 * extractBrandDomain("_spf.google.com") // returns "google.com"
 * extractBrandDomain("servers.mcsv.net") // returns "mailchimp.com"
 * extractBrandDomain("sendgrid.net") // returns "sendgrid.com"
 */
export function extractBrandDomain(includePattern: string): string | null {
  const normalized = includePattern.toLowerCase().trim()

  // Direct lookup - fastest path
  if (SERVICE_DOMAIN_MAP[normalized]) {
    return SERVICE_DOMAIN_MAP[normalized]
  }

  // Pattern matching for partial matches
  // Check if the normalized pattern contains any known pattern
  for (const [pattern, domain] of Object.entries(SERVICE_DOMAIN_MAP)) {
    if (normalized.includes(pattern)) {
      return domain
    }
  }

  // Reverse pattern matching - check if any known pattern contains the normalized input
  for (const [pattern, domain] of Object.entries(SERVICE_DOMAIN_MAP)) {
    if (pattern.includes(normalized)) {
      return domain
    }
  }

  // Fallback: Extract base domain (last two parts)
  // e.g., "mail.example.co.uk" -> "co.uk" (not ideal but last resort)
  const parts = normalized.split('.')
  if (parts.length >= 2) {
    const baseDomain = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
    return baseDomain
  }

  return null
}

/**
 * Batch extract brand domains for multiple include patterns
 *
 * @param includePatterns - Array of SPF include patterns
 * @returns Map of include pattern to brand domain
 */
export function extractBrandDomains(
  includePatterns: string[]
): Map<string, string> {
  const results = new Map<string, string>()

  for (const pattern of includePatterns) {
    const domain = extractBrandDomain(pattern)
    if (domain) {
      results.set(pattern, domain)
    }
  }

  return results
}
