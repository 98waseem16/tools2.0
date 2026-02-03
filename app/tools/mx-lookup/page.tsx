import type { Metadata } from 'next'
import { Server, Mail, Shield, Search } from 'lucide-react'
import ToolPageLayout from '@/components/tools/ToolPageLayout'

export const metadata: Metadata = {
  title: 'Free MX Lookup - Check Mail Server Records | Sendmarc Tools',
  description:
    'Check your MX records instantly. Free MX lookup tool that identifies mail servers, priorities, email providers, and configuration issues.',
  keywords: [
    'MX lookup',
    'MX record check',
    'mail server lookup',
    'MX records',
    'email server check',
    'MX validator',
    'mail exchange',
    'MX priority',
    'email routing',
    'DNS MX',
  ],
  openGraph: {
    title: 'Free MX Lookup - Check Mail Server Records',
    description: 'Check your MX records and verify email server configuration.',
    type: 'website',
  },
}

export default function MXLookupPage() {
  return (
    <ToolPageLayout
      title="MX Lookup"
      subtitle="Check your mail server records and verify email routing configuration"
      whatIsSection={{
        title: 'What are MX Records?',
        content: (
          <>
            <p>
              Mail Exchange (MX) records are DNS records that specify which mail servers are
              responsible for receiving emails for your domain. When someone sends an email to your
              domain, their mail server looks up your MX records to determine where to deliver the
              message.
            </p>
            <p>
              MX records include a priority value (lower numbers = higher priority) and a hostname
              pointing to your mail server. Multiple MX records provide redundancy - if the primary
              server is unavailable, the sender tries the next highest priority server. This ensures
              reliable email delivery even during server outages.
            </p>
            <p>
              Your MX records reveal which email provider you use (Google Workspace, Microsoft 365,
              etc.) and whether your configuration follows best practices for redundancy and
              reliability.
            </p>
          </>
        ),
      }}
      understandingSection={{
        title: 'Understanding Your MX Results',
        items: [
          {
            icon: Server,
            iconColor: 'bg-sendmarc-success-DEFAULT text-white',
            title: 'Valid - Proper MX Configuration',
            description:
              'Your domain has valid MX records with proper priorities, multiple servers for redundancy, and correct hostname resolution. Emails should be delivered reliably.',
          },
          {
            icon: Mail,
            iconColor: 'bg-sendmarc-warning-DEFAULT text-white',
            title: 'Warning - Configuration Issues',
            description:
              'Your MX records exist but may have issues like missing redundancy (only one server), equal priorities, or resolution problems. Consider adding backup mail servers.',
          },
          {
            icon: Search,
            iconColor: 'bg-sendmarc-error-DEFAULT text-white',
            title: 'Missing - No MX Records',
            description:
              'No MX records found for your domain. Email cannot be delivered to your domain. You must configure MX records pointing to your mail servers.',
          },
        ],
      }}
      commonIssues={[
        {
          title: 'No Redundancy (Single MX Record)',
          description:
            'Your domain has only one MX record. If that mail server goes down, all incoming email will be rejected or delayed until the server recovers.',
          solution:
            'Add at least one backup MX record with a higher priority number. Most email providers offer multiple mail servers automatically (e.g., Google Workspace provides 5 MX records).',
        },
        {
          title: 'Equal Priority Values',
          description:
            'Multiple MX records have the same priority value, causing unpredictable mail routing and potential delivery issues.',
          solution:
            'Assign different priority values to your MX records. Use priority 10 for primary, 20 for secondary, 30 for tertiary servers to establish clear routing order.',
        },
        {
          title: 'MX Points to CNAME',
          description:
            'Your MX record points to a CNAME record instead of an A record. This violates RFC specifications and causes delivery failures.',
          solution:
            'MX records must point directly to hostnames that resolve to A or AAAA records. Update your MX records to point to the actual mail server hostnames, not aliases.',
        },
        {
          title: 'Hostname Resolution Failure',
          description:
            'One or more MX hostnames don&apos;t resolve to IP addresses, preventing email delivery to those servers.',
          solution:
            'Check that all MX hostnames have corresponding A or AAAA DNS records. Fix any typos in hostnames or create the missing DNS records.',
        },
      ]}
      bestPractices={[
        { text: 'Use multiple MX records (at least 2) for redundancy and reliability' },
        { text: 'Set clear priority values with gaps (10, 20, 30) for proper routing order' },
        { text: 'Ensure all MX hostnames resolve to valid IP addresses' },
        { text: 'Point MX records to A/AAAA records, never to CNAME records' },
        { text: 'Monitor MX record changes and test email delivery after updates' },
        { text: 'Use reputable email providers with proven infrastructure and uptime' },
      ]}
      relatedTools={[
        {
          title: 'SPF Checker',
          description: 'Validate your SPF record and authorized mail servers',
          href: '/tools/spf-checker',
          icon: Shield,
        },
        {
          title: 'DMARC Checker',
          description: 'Verify your DMARC policy and email security configuration',
          href: '/tools/dmarc-checker',
          icon: Shield,
        },
        {
          title: 'DNS Lookup',
          description: 'Check all DNS records for your domain',
          href: '/tools/dns-lookup',
          icon: Server,
        },
      ]}
    />
  )
}
