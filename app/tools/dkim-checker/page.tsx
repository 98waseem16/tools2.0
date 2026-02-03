import type { Metadata } from 'next'
import { Mail, Key, Lock, Shield } from 'lucide-react'
import ToolPageLayout from '@/components/tools/ToolPageLayout'

export const metadata: Metadata = {
  title: 'Free DKIM Checker - Validate DKIM Signatures | Sendmarc Tools',
  description:
    'Check your DKIM records instantly. Free DKIM lookup and validation tool that verifies digital signatures, key strength, and email authentication setup.',
  keywords: [
    'DKIM checker',
    'DKIM lookup',
    'DKIM validator',
    'DKIM record check',
    'verify DKIM',
    'DKIM signature',
    'DKIM test',
    'email authentication',
    'DomainKeys',
    'DKIM validation',
  ],
  openGraph: {
    title: 'Free DKIM Checker - Validate DKIM Signatures',
    description: 'Check your DKIM records and verify email authentication.',
    type: 'website',
  },
}

export default function DKIMCheckerPage() {
  return (
    <ToolPageLayout
      title="DKIM Checker"
      subtitle="Validate your DKIM signatures and cryptographic keys for email authentication"
      whatIsSection={{
        title: 'What is DKIM?',
        content: (
          <>
            <p>
              DomainKeys Identified Mail (DKIM) is an email authentication method that uses
              cryptographic signatures to verify that an email hasn&apos;t been tampered with
              during transit. DKIM adds a digital signature to email headers using a private key,
              which recipients can verify using the public key published in your DNS records.
            </p>
            <p>
              When you send an email, your mail server signs it with your private DKIM key. The
              receiving server retrieves your public key from DNS (using the selector and domain)
              and verifies the signature. If the signature matches, the email is authenticated and
              considered legitimate.
            </p>
            <p>
              DKIM records are published as TXT records at [selector]._domainkey.[domain]. Common
              selectors include &quot;default&quot;, &quot;google&quot;, or custom values. Stronger
              encryption (2048-bit keys) provides better security than older 1024-bit keys.
            </p>
          </>
        ),
      }}
      understandingSection={{
        title: 'Understanding Your DKIM Results',
        items: [
          {
            icon: Key,
            iconColor: 'bg-sendmarc-success-DEFAULT text-white',
            title: 'Valid - DKIM Key Found',
            description:
              'Your DKIM public key is published correctly in DNS with valid syntax. The key type, algorithm, and encryption strength are appropriate for secure email authentication.',
          },
          {
            icon: Lock,
            iconColor: 'bg-sendmarc-warning-DEFAULT text-white',
            title: 'Weak Key - Upgrade Recommended',
            description:
              'Your DKIM key exists but uses weak encryption (1024-bit or SHA-1 algorithm). These are deprecated and should be upgraded to 2048-bit with SHA-256 for better security.',
          },
          {
            icon: Mail,
            iconColor: 'bg-sendmarc-error-DEFAULT text-white',
            title: 'Missing - No DKIM Key Found',
            description:
              'No DKIM record found for the checked selector. This means emails from your domain cannot be authenticated with DKIM, reducing deliverability and increasing spoofing risk.',
          },
        ],
      }}
      commonIssues={[
        {
          title: 'Selector Not Found',
          description:
            'The DKIM lookup failed because the selector doesn&apos;t exist in DNS. Common selectors like "default", "google", or "selector1" returned no results.',
          solution:
            'Check your email service provider documentation for the correct DKIM selector. Generate and publish a DKIM record with the correct selector name at [selector]._domainkey.[domain].',
        },
        {
          title: 'Weak 1024-bit Key',
          description:
            'Your DKIM key uses 1024-bit RSA encryption, which is considered weak by modern standards and may be rejected by some mail servers.',
          solution:
            'Generate a new 2048-bit DKIM key pair and update your DNS record. Most email platforms now support 2048-bit keys, which provide significantly better security.',
        },
        {
          title: 'SHA-1 Algorithm',
          description:
            'Your DKIM signature uses the SHA-1 hashing algorithm (h=sha1), which is deprecated due to known vulnerabilities.',
          solution:
            'Upgrade to SHA-256 (h=sha256) by regenerating your DKIM key with SHA-256 support. Update both your mail server configuration and DNS record.',
        },
        {
          title: 'Missing DKIM for Email Service',
          description:
            'Your domain uses email services (like Google Workspace, Microsoft 365, or ESPs) but doesn&apos;t have DKIM configured for them.',
          solution:
            'Follow your email service provider&apos;s DKIM setup guide. Each service may use different selectors (e.g., Google uses "google", Microsoft uses "selector1" and "selector2").',
        },
      ]}
      bestPractices={[
        { text: 'Use 2048-bit RSA keys for strong cryptographic security' },
        { text: 'Enable DKIM signing for all email services and platforms you use' },
        { text: 'Use SHA-256 hashing algorithm instead of deprecated SHA-1' },
        { text: 'Rotate DKIM keys periodically (every 6-12 months) for security' },
        { text: 'Keep multiple selectors active during key rotation to avoid disruption' },
        { text: 'Test DKIM signatures after setup by sending test emails and checking headers' },
      ]}
      relatedTools={[
        {
          title: 'DMARC Checker',
          description: 'Verify your DMARC policy and email security configuration',
          href: '/tools/dmarc-checker',
          icon: Shield,
        },
        {
          title: 'SPF Checker',
          description: 'Validate your SPF record and authorized mail servers',
          href: '/tools/spf-checker',
          icon: Mail,
        },
        {
          title: 'Header Analyzer',
          description: 'Analyze email headers to verify DKIM signatures',
          href: '/tools/header-analyzer',
          icon: Key,
        },
      ]}
    />
  )
}
