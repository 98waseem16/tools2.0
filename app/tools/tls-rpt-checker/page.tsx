import type { Metadata } from 'next'
import { FileText, Lock, Mail, Shield } from 'lucide-react'
import ToolPageLayout from '@/components/tools/ToolPageLayout'

export const metadata: Metadata = {
  title: 'Free TLS-RPT Checker - Validate TLS Reporting | Sendmarc Tools',
  description:
    'Check your TLS-RPT record instantly. Free TLS-RPT lookup and validation tool that verifies TLS failure reporting configuration.',
  keywords: [
    'TLS-RPT checker',
    'TLS-RPT lookup',
    'TLS reporting',
    'SMTP TLS',
    'TLS-RPT validator',
    'email encryption reporting',
    'TLS failure reports',
    'MTA-STS reporting',
    'STARTTLS',
    'TLS-RPT policy',
  ],
  openGraph: {
    title: 'Free TLS-RPT Checker - Validate TLS Reporting',
    description: 'Check your TLS-RPT record and configure TLS failure reporting.',
    type: 'website',
  },
}

export default function TLSRPTCheckerPage() {
  return (
    <ToolPageLayout
      title="TLS-RPT Checker"
      subtitle="Validate your TLS reporting configuration and monitor email encryption failures"
      whatIsSection={{
        title: 'What is TLS-RPT?',
        content: (
          <>
            <p>
              TLS-RPT (TLS Reporting) is an email security standard that provides reporting on TLS
              connection failures and certificate validation issues when other mail servers attempt
              to deliver email to your domain. It works alongside MTA-STS to give you visibility
              into email encryption problems.
            </p>
            <p>
              TLS-RPT is configured through a DNS TXT record at _smtp._tls.[domain] that specifies
              one or more reporting addresses (email addresses or HTTPS endpoints). When a sending
              mail server encounters TLS issues while delivering to your domain, it sends a detailed
              JSON report to these addresses describing what went wrong.
            </p>
            <p>
              These reports are crucial for identifying configuration issues, certificate problems,
              or potential attacks. TLS-RPT is especially valuable when implementing MTA-STS, as it
              helps you identify problems before enforcing strict TLS requirements.
            </p>
          </>
        ),
      }}
      understandingSection={{
        title: 'Understanding Your TLS-RPT Results',
        items: [
          {
            icon: FileText,
            iconColor: 'bg-sendmarc-success-DEFAULT text-white',
            title: 'Valid - TLS-RPT Configured',
            description:
              'Your TLS-RPT record is properly configured with valid syntax and reporting addresses. You will receive reports about TLS connection failures and certificate issues.',
          },
          {
            icon: Mail,
            iconColor: 'bg-sendmarc-warning-DEFAULT text-white',
            title: 'Warning - Configuration Issues',
            description:
              'Your TLS-RPT record exists but has syntax errors, invalid reporting addresses, or missing required fields. Reports may not be delivered correctly.',
          },
          {
            icon: Lock,
            iconColor: 'bg-sendmarc-info-DEFAULT text-white',
            title: 'Missing - No TLS-RPT Record',
            description:
              'No TLS-RPT record found. You are not receiving reports about TLS connection failures, making it difficult to diagnose email encryption issues.',
          },
        ],
      }}
      commonIssues={[
        {
          title: 'Invalid Reporting Address Format',
          description:
            'The reporting address (rua) in your TLS-RPT record has incorrect syntax or uses an unsupported format.',
          solution:
            'Use the format mailto:address@domain.com for email reporting or https://example.com/reports for HTTPS endpoints. Multiple addresses are separated by commas.',
        },
        {
          title: 'Missing v=TLSRPTv1 Tag',
          description:
            'Your TLS-RPT record doesn&apos;t include the required version tag v=TLSRPTv1, causing it to be invalid.',
          solution:
            'Ensure your record starts with v=TLSRPTv1; followed by the rua tag. Example: v=TLSRPTv1; rua=mailto:tls-reports@example.com',
        },
        {
          title: 'Unreachable Reporting Endpoint',
          description:
            'The email address or HTTPS endpoint specified for reports cannot receive or process TLS-RPT reports.',
          solution:
            'Verify the email address is valid and monitored, or that the HTTPS endpoint accepts POST requests with JSON payloads. Test the endpoint to ensure it\'s accessible.',
        },
        {
          title: 'No MTA-STS Policy',
          description:
            'TLS-RPT is configured but you don&apos;t have an MTA-STS policy. While TLS-RPT works independently, it\'s most useful alongside MTA-STS.',
          solution:
            'Consider implementing MTA-STS to enforce TLS encryption. TLS-RPT reports will help you validate the MTA-STS configuration before enforcement.',
        },
      ]}
      bestPractices={[
        { text: 'Configure TLS-RPT before implementing MTA-STS to monitor for issues' },
        { text: 'Use dedicated email addresses or HTTPS endpoints for TLS reports' },
        { text: 'Regularly review TLS-RPT reports to identify encryption problems' },
        { text: 'Include multiple reporting addresses for redundancy' },
        { text: 'Set up automated processing of TLS-RPT JSON reports for faster insights' },
        { text: 'Keep TLS-RPT enabled even after MTA-STS enforcement for ongoing monitoring' },
      ]}
      relatedTools={[
        {
          title: 'MTA-STS Checker',
          description: 'Configure MTA-STS encryption enforcement with TLS-RPT monitoring',
          href: '/tools/mta-sts-checker',
          icon: Lock,
        },
        {
          title: 'DMARC Checker',
          description: 'Verify your DMARC policy for email authentication reporting',
          href: '/tools/dmarc-checker',
          icon: Shield,
        },
        {
          title: 'MX Lookup',
          description: 'Check your mail server records and email routing',
          href: '/tools/mx-lookup',
          icon: Mail,
        },
      ]}
    />
  )
}
