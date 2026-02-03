import type { Metadata } from 'next'
import { Shield, AlertTriangle, Search, Mail } from 'lucide-react'
import ToolPageLayout from '@/components/tools/ToolPageLayout'

export const metadata: Metadata = {
  title: 'Free SPF Checker - Validate Your SPF Record | Sendmarc Tools',
  description:
    'Check your SPF record instantly. Free SPF lookup and validation tool that identifies syntax errors, DNS lookup limits, and email service authorization issues.',
  keywords: [
    'SPF checker',
    'SPF lookup',
    'SPF validator',
    'SPF record check',
    'verify SPF',
    'SPF DNS',
    'SPF test',
    'email authentication',
    'sender policy framework',
    'SPF validation',
  ],
  openGraph: {
    title: 'Free SPF Checker - Validate Your SPF Record',
    description: 'Check your SPF record instantly and fix email deliverability issues.',
    type: 'website',
  },
}

export default function SPFCheckerPage() {
  return (
    <ToolPageLayout
      title="SPF Checker"
      subtitle="Validate your SPF record and ensure your emails are authenticated properly"
      analyzePath="/tools/spf-checker/analyze/"
      whatIsSection={{
        title: 'What is an SPF Record?',
        content: (
          <>
            <p>
              Sender Policy Framework (SPF) is an email authentication protocol that allows domain
              owners to specify which mail servers are authorized to send emails on behalf of their
              domain. SPF records are published as DNS TXT records and help prevent email spoofing
              and phishing attacks.
            </p>
            <p>
              When an email is received, the recipient&apos;s mail server checks the SPF record to
              verify that the sending server is authorized. If the server isn&apos;t listed in the
              SPF record, the email may be marked as spam or rejected entirely. A properly
              configured SPF record is essential for email deliverability.
            </p>
            <p>
              SPF records use mechanisms (like ip4, include, mx) and qualifiers (+, -, ~, ?) to
              define authorization rules. The record must stay under the 10 DNS lookup limit to
              remain valid.
            </p>
          </>
        ),
      }}
      understandingSection={{
        title: 'Understanding Your SPF Results',
        items: [
          {
            icon: Shield,
            iconColor: 'bg-sendmarc-success-DEFAULT text-white',
            title: 'Pass - SPF is Valid',
            description:
              'Your SPF record is correctly configured with valid syntax, under the 10 DNS lookup limit, and includes proper mechanisms. Your emails should authenticate successfully.',
          },
          {
            icon: AlertTriangle,
            iconColor: 'bg-sendmarc-warning-DEFAULT text-white',
            title: 'Warning - SPF Needs Attention',
            description:
              'Your SPF record exists but has issues like too many DNS lookups (over 10), uses ~all (softfail) instead of -all (fail), or has deprecated mechanisms. Fix these to improve security.',
          },
          {
            icon: Search,
            iconColor: 'bg-sendmarc-error-DEFAULT text-white',
            title: 'Fail - SPF is Missing or Invalid',
            description:
              'No SPF record found, or the record has syntax errors that make it invalid. This seriously impacts email deliverability and makes your domain vulnerable to spoofing.',
          },
        ],
      }}
      commonIssues={[
        {
          title: 'Too Many DNS Lookups (Over 10)',
          description:
            'SPF has a hard limit of 10 DNS lookups. Each include: and mx mechanism counts toward this limit. Exceeding 10 lookups causes SPF to fail.',
          solution:
            'Flatten your SPF record by replacing include: statements with the actual IP addresses they resolve to. Use SPF flattening services or consolidate email providers.',
        },
        {
          title: 'Using ~all (Softfail) Instead of -all',
          description:
            'The ~all qualifier causes unauthorized emails to be marked as suspicious but still delivered, reducing SPF effectiveness.',
          solution:
            'Change ~all to -all to strictly reject unauthorized senders. Only use ~all during initial testing periods.',
        },
        {
          title: 'Multiple SPF Records',
          description:
            'Having more than one SPF record (multiple TXT records starting with v=spf1) causes all SPF records to be invalid per RFC specifications.',
          solution:
            'Combine all SPF mechanisms into a single TXT record. Remove duplicate SPF records and merge all authorized sources into one record.',
        },
        {
          title: 'Missing Email Service Providers',
          description:
            'Your SPF record doesn&apos;t include all the email services you use (like marketing platforms, CRMs, or transactional email services), causing legitimate emails to fail SPF.',
          solution:
            'Add include: statements for all email services you use. Common examples: include:_spf.google.com (Google Workspace), include:spf.protection.outlook.com (Microsoft 365).',
        },
      ]}
      bestPractices={[
        { text: 'Keep your SPF record under 10 DNS lookups to ensure it validates correctly' },
        { text: 'Use -all (hardfail) to reject unauthorized senders and prevent spoofing' },
        { text: 'Include all legitimate email services (Google, Microsoft, Mailchimp, etc.)' },
        { text: 'Regularly audit your SPF record when adding or removing email services' },
        { text: 'Use ip4: and ip6: mechanisms for dedicated sending IPs when possible' },
        { text: 'Avoid using ptr: mechanism as it\'s deprecated and inefficient' },
      ]}
      relatedTools={[
        {
          title: 'DMARC Checker',
          description: 'Verify your DMARC policy and email security configuration',
          href: '/tools/dmarc-checker',
          icon: Shield,
        },
        {
          title: 'DKIM Checker',
          description: 'Validate your DKIM signatures for email authentication',
          href: '/tools/dkim-checker',
          icon: Mail,
        },
        {
          title: 'MX Lookup',
          description: 'Check your mail server records and email routing',
          href: '/tools/mx-lookup',
          icon: Search,
        },
      ]}
    />
  )
}
