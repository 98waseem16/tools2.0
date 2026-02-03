import type { Metadata } from 'next'
import { Lock, Shield, Mail, AlertTriangle } from 'lucide-react'
import ToolPageLayout from '@/components/tools/ToolPageLayout'

export const metadata: Metadata = {
  title: 'Free MTA-STS Checker - Validate Email Encryption | Sendmarc Tools',
  description:
    'Check your MTA-STS policy instantly. Free MTA-STS lookup and validation tool that verifies TLS encryption enforcement for email delivery.',
  keywords: [
    'MTA-STS checker',
    'MTA-STS lookup',
    'MTA-STS validator',
    'email encryption',
    'TLS enforcement',
    'SMTP TLS',
    'MTA-STS policy',
    'email security',
    'mail transfer agent',
    'STARTTLS',
  ],
  openGraph: {
    title: 'Free MTA-STS Checker - Validate Email Encryption',
    description: 'Check your MTA-STS policy and verify email encryption enforcement.',
    type: 'website',
  },
}

export default function MTASTSCheckerPage() {
  return (
    <ToolPageLayout
      title="MTA-STS Checker"
      subtitle="Validate your MTA-STS policy and ensure encrypted email delivery"
      whatIsSection={{
        title: 'What is MTA-STS?',
        content: (
          <>
            <p>
              MTA-STS (Mail Transfer Agent Strict Transport Security) is an email security standard
              that enforces TLS encryption for email delivery between mail servers. It prevents
              downgrade attacks and man-in-the-middle attacks by requiring sending servers to use
              encrypted connections when delivering mail to your domain.
            </p>
            <p>
              MTA-STS works through two components: a DNS TXT record at _mta-sts.[domain] that
              declares support, and a policy file hosted at https://mta-sts.[domain]/.well-known/mta-sts.txt
              that specifies the enforcement mode and authorized MX hostnames. The policy can be set
              to &quot;enforce&quot; (reject unencrypted connections), &quot;testing&quot; (report
              but don&apos;t reject), or &quot;none&quot; (disabled).
            </p>
            <p>
              Implementing MTA-STS significantly improves email security by ensuring emails in
              transit are always encrypted, protecting sensitive information from interception.
            </p>
          </>
        ),
      }}
      understandingSection={{
        title: 'Understanding Your MTA-STS Results',
        items: [
          {
            icon: Lock,
            iconColor: 'bg-sendmarc-success-DEFAULT text-white',
            title: 'Enforcing - Full Protection',
            description:
              'Your MTA-STS policy is in enforce mode. All incoming mail servers must use TLS encryption and connect to authorized MX servers. Unencrypted or unauthorized connections are rejected.',
          },
          {
            icon: AlertTriangle,
            iconColor: 'bg-sendmarc-warning-DEFAULT text-white',
            title: 'Testing - Monitoring Mode',
            description:
              'Your policy is in testing mode. TLS failures are reported but emails are still delivered. This is useful for validating your configuration before enforcing.',
          },
          {
            icon: Shield,
            iconColor: 'bg-sendmarc-error-DEFAULT text-white',
            title: 'Missing or None - No Protection',
            description:
              'No MTA-STS policy found, or policy mode is set to "none". Your emails are not protected by enforced TLS encryption, making them vulnerable to interception.',
          },
        ],
      }}
      commonIssues={[
        {
          title: 'Policy File Not Accessible',
          description:
            'The MTA-STS DNS record exists, but the policy file at https://mta-sts.[domain]/.well-known/mta-sts.txt cannot be accessed or returns errors.',
          solution:
            'Host the policy file on a web server at the correct location with HTTPS enabled. Ensure the SSL certificate is valid and the file is publicly accessible. The Content-Type should be text/plain.',
        },
        {
          title: 'MX Hostname Mismatch',
          description:
            'The MX hostnames in your MTA-STS policy don&apos;t match your actual MX records, causing legitimate mail servers to be rejected.',
          solution:
            'Update your MTA-STS policy file to include all MX hostnames from your MX records. Use wildcards (*.example.com) if your MX hostnames share a common domain.',
        },
        {
          title: 'Low max_age Value',
          description:
            'Your policy has a very short max_age value (under 1 day), causing sending servers to re-fetch the policy too frequently.',
          solution:
            'Set max_age to at least 86400 seconds (1 day) for testing mode, and 604800 seconds (7 days) or more for enforce mode. This reduces unnecessary policy fetches.',
        },
        {
          title: 'Stuck in Testing Mode',
          description:
            'Your MTA-STS policy has been in testing mode for an extended period, leaving your email vulnerable to encryption attacks.',
          solution:
            'After validating your configuration with TLS-RPT reports (typically 1-2 weeks), upgrade to enforce mode by changing mode: testing to mode: enforce in your policy file.',
        },
      ]}
      bestPractices={[
        { text: 'Start with testing mode to validate configuration before enforcing' },
        { text: 'Set max_age to 86400+ seconds (1+ days) for stable policies' },
        { text: 'Include all MX hostnames in your policy, using wildcards when appropriate' },
        { text: 'Use TLS-RPT to monitor failures before and after enabling enforcement' },
        { text: 'Ensure your policy file is served over HTTPS with a valid certificate' },
        { text: 'Upgrade to enforce mode once testing shows no issues (after 1-2 weeks)' },
      ]}
      relatedTools={[
        {
          title: 'TLS-RPT Checker',
          description: 'Configure TLS reporting to monitor MTA-STS failures',
          href: '/tools/tls-rpt-checker',
          icon: Mail,
        },
        {
          title: 'MX Lookup',
          description: 'Check your MX records to match with MTA-STS policy',
          href: '/tools/mx-lookup',
          icon: Shield,
        },
        {
          title: 'DMARC Checker',
          description: 'Verify your DMARC policy for complete email security',
          href: '/tools/dmarc-checker',
          icon: Shield,
        },
      ]}
    />
  )
}
