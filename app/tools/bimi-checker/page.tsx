import type { Metadata } from 'next'
import { Image, Shield, Mail, Award } from 'lucide-react'
import ToolPageLayout from '@/components/tools/ToolPageLayout'

export const metadata: Metadata = {
  title: 'Free BIMI Checker - Validate Brand Indicators | Sendmarc Tools',
  description:
    'Check your BIMI record instantly. Free BIMI lookup and validation tool that verifies brand logo display configuration for email clients.',
  keywords: [
    'BIMI checker',
    'BIMI lookup',
    'BIMI validator',
    'brand indicators',
    'email logo',
    'VMC certificate',
    'BIMI record',
    'brand logo email',
    'verified mark certificate',
    'BIMI validation',
  ],
  openGraph: {
    title: 'Free BIMI Checker - Validate Brand Indicators',
    description: 'Check your BIMI record and verify brand logo display configuration.',
    type: 'website',
  },
}

export default function BIMICheckerPage() {
  return (
    <ToolPageLayout
      title="BIMI Checker"
      subtitle="Validate your BIMI configuration and display your brand logo in email clients"
      whatIsSection={{
        title: 'What is BIMI?',
        content: (
          <>
            <p>
              Brand Indicators for Message Identification (BIMI) is an email standard that allows
              your brand logo to be displayed next to your emails in supported email clients. When
              properly configured, BIMI shows your logo in the inbox, increasing brand recognition
              and trust while making your legitimate emails more distinguishable from phishing
              attempts.
            </p>
            <p>
              BIMI works through a DNS TXT record at default._bimi.[domain] that points to your logo
              file (SVG format) and optionally a Verified Mark Certificate (VMC). Email clients that
              support BIMI will check this record when displaying your emails. However, BIMI
              requires strong email authentication - your domain must have DMARC enforcement
              (p=quarantine or p=reject) before logos will be displayed.
            </p>
            <p>
              A VMC is a digital certificate that proves your ownership of a trademark, issued by
              certificate authorities. While not always required, VMCs enable logo display in more
              email clients and provide stronger brand protection.
            </p>
          </>
        ),
      }}
      understandingSection={{
        title: 'Understanding Your BIMI Results',
        items: [
          {
            icon: Image,
            iconColor: 'bg-sendmarc-success-DEFAULT text-white',
            title: 'Valid - BIMI Configured',
            description:
              'Your BIMI record is properly configured with a valid logo URL and optionally a VMC. Your brand logo can be displayed in supported email clients if DMARC requirements are met.',
          },
          {
            icon: Award,
            iconColor: 'bg-sendmarc-info-DEFAULT text-white',
            title: 'Logo Only - No VMC',
            description:
              'Your BIMI record includes a logo URL but no Verified Mark Certificate. Logo display is limited to email clients that don\'t require VMC. Consider obtaining a VMC for broader support.',
          },
          {
            icon: Shield,
            iconColor: 'bg-sendmarc-warning-DEFAULT text-white',
            title: 'Missing - No BIMI Record',
            description:
              'No BIMI record found. Your brand logo will not be displayed in email clients. BIMI is optional but beneficial for brand recognition and email trust.',
          },
        ],
      }}
      commonIssues={[
        {
          title: 'DMARC Not at Enforcement',
          description:
            'Your domain has BIMI configured but DMARC policy is set to p=none. Email clients require DMARC enforcement (p=quarantine or p=reject) before displaying BIMI logos.',
          solution:
            'Upgrade your DMARC policy to p=quarantine or p=reject. Start with pct=10 (10% enforcement) and gradually increase after monitoring reports. Only then will BIMI logos display.',
        },
        {
          title: 'Logo Not in SVG Tiny PS Format',
          description:
            'Your BIMI logo uses an incorrect file format. BIMI requires SVG Tiny Portable/Secure (SVG Tiny PS) format, not standard SVG, PNG, or other formats.',
          solution:
            'Convert your logo to SVG Tiny PS format, which is a restricted subset of SVG. Many BIMI service providers offer logo conversion tools. Host it on HTTPS with proper CORS headers.',
        },
        {
          title: 'Logo URL Not Accessible',
          description:
            'The logo URL in your BIMI record returns errors, requires authentication, or is not served over HTTPS.',
          solution:
            'Host your BIMI logo on a publicly accessible HTTPS server. Ensure the SSL certificate is valid, CORS headers allow access, and the Content-Type is image/svg+xml.',
        },
        {
          title: 'Missing VMC for Gmail/Yahoo',
          description:
            'Your BIMI record works but doesn&apos;t include a Verified Mark Certificate. Major email clients like Gmail require VMC for logo display.',
          solution:
            'Obtain a VMC from authorized certificate authorities (like DigiCert or Entrust). This requires proof of trademark ownership. Add the VMC URL to your BIMI record with a=',
        },
      ]}
      bestPractices={[
        { text: 'Ensure DMARC is set to p=quarantine or p=reject before implementing BIMI' },
        { text: 'Use SVG Tiny PS format for your logo with proper dimensions (square aspect ratio)' },
        { text: 'Host your logo on a reliable HTTPS server with valid SSL certificate' },
        { text: 'Obtain a VMC to enable logo display in Gmail, Yahoo, and other major clients' },
        { text: 'Test your BIMI logo with BIMI validators before publishing the record' },
        { text: 'Use the default selector (default._bimi) unless you have specific needs' },
      ]}
      relatedTools={[
        {
          title: 'DMARC Checker',
          description: 'Verify DMARC enforcement required for BIMI logo display',
          href: '/tools/dmarc-checker',
          icon: Shield,
        },
        {
          title: 'SPF Checker',
          description: 'Validate SPF authentication required for DMARC',
          href: '/tools/spf-checker',
          icon: Mail,
        },
        {
          title: 'DKIM Checker',
          description: 'Validate DKIM signatures required for DMARC',
          href: '/tools/dkim-checker',
          icon: Shield,
        },
      ]}
    />
  )
}
