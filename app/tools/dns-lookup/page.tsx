import type { Metadata } from 'next'
import { Globe, Server, Shield, Mail } from 'lucide-react'
import ToolPageLayout from '@/components/tools/ToolPageLayout'

export const metadata: Metadata = {
  title: 'Free DNS Lookup - Check DNS Records | Sendmarc Tools',
  description:
    'Check your DNS records instantly. Free DNS lookup tool that displays A, AAAA, NS, TXT, and all DNS record types for any domain.',
  keywords: [
    'DNS lookup',
    'DNS checker',
    'DNS records',
    'nameserver lookup',
    'A record',
    'AAAA record',
    'TXT record',
    'NS record',
    'DNS query',
    'domain lookup',
  ],
  openGraph: {
    title: 'Free DNS Lookup - Check DNS Records',
    description: 'Check all DNS records for any domain instantly.',
    type: 'website',
  },
}

export default function DNSLookupPage() {
  return (
    <ToolPageLayout
      title="DNS Lookup"
      subtitle="Check all DNS records for your domain including A, AAAA, NS, TXT, and more"
      whatIsSection={{
        title: 'What is DNS?',
        content: (
          <>
            <p>
              The Domain Name System (DNS) is the internet&apos;s phonebook, translating
              human-readable domain names (like example.com) into IP addresses that computers use to
              communicate. DNS records store various types of information about your domain,
              including where your website is hosted, where email should be delivered, and security
              configurations.
            </p>
            <p>
              Different DNS record types serve different purposes: A records point to IPv4
              addresses, AAAA records point to IPv6 addresses, MX records specify mail servers, TXT
              records contain text data (like SPF, DMARC, and verification codes), and NS records
              identify your authoritative nameservers.
            </p>
            <p>
              Proper DNS configuration is critical for website accessibility, email delivery, and
              security. Misconfigured DNS records can cause downtime, email failures, and security
              vulnerabilities.
            </p>
          </>
        ),
      }}
      understandingSection={{
        title: 'Understanding DNS Record Types',
        items: [
          {
            icon: Globe,
            iconColor: 'bg-sendmarc-info-DEFAULT text-white',
            title: 'A and AAAA Records',
            description:
              'A records map your domain to IPv4 addresses (like 192.0.2.1), while AAAA records map to IPv6 addresses. These determine where your website or services are hosted.',
          },
          {
            icon: Server,
            iconColor: 'bg-sendmarc-success-DEFAULT text-white',
            title: 'NS Records',
            description:
              'Nameserver (NS) records identify which DNS servers are authoritative for your domain. These servers store and provide your DNS records to the internet.',
          },
          {
            icon: Shield,
            iconColor: 'bg-sendmarc-warning-DEFAULT text-white',
            title: 'TXT Records',
            description:
              'Text records store various data including SPF, DMARC, DKIM keys, domain verification codes, and other configuration information critical for email and security.',
          },
        ],
      }}
      commonIssues={[
        {
          title: 'Missing A or AAAA Records',
          description:
            'Your domain has no A or AAAA records, meaning it doesn&apos;t point to any server. Visitors cannot access your website or services.',
          solution:
            'Create an A record pointing to your web server&apos;s IPv4 address. If your server supports IPv6, also add an AAAA record. Check with your hosting provider for the correct IP addresses.',
        },
        {
          title: 'Incorrect Nameservers',
          description:
            'Your domain&apos;s NS records don&apos;t match your DNS provider&apos;s nameservers, causing DNS resolution failures and potential service outages.',
          solution:
            'Update your nameservers at your domain registrar to match your DNS provider&apos;s nameservers. Changes can take up to 48 hours to propagate globally.',
        },
        {
          title: 'Conflicting DNS Records',
          description:
            'Multiple records of the same type with conflicting values cause unpredictable behavior and potential service disruptions.',
          solution:
            'Review and remove duplicate or conflicting records. Ensure each record type has consistent, correct values. Use different hostnames for different services if needed.',
        },
        {
          title: 'Long TTL Values',
          description:
            'Very long Time-To-Live values (like 86400 seconds or 24 hours) slow down DNS changes, causing delays when you need to update records quickly.',
          solution:
            'Use reasonable TTL values (300-3600 seconds). Lower TTLs allow faster updates but increase DNS query load. Temporarily lower TTL before planned DNS changes.',
        },
      ]}
      bestPractices={[
        { text: 'Use both A and AAAA records to support IPv4 and IPv6 connectivity' },
        { text: 'Keep your nameservers consistent across your registrar and DNS provider' },
        { text: 'Use appropriate TTL values (5-60 minutes) for flexibility and performance' },
        { text: 'Regularly audit DNS records and remove outdated or unused entries' },
        { text: 'Use multiple nameservers for redundancy (most providers offer 2-4)' },
        { text: 'Monitor DNS changes with alerting to catch unauthorized modifications' },
      ]}
      relatedTools={[
        {
          title: 'MX Lookup',
          description: 'Check your mail server records and email routing',
          href: '/tools/mx-lookup',
          icon: Mail,
        },
        {
          title: 'SPF Checker',
          description: 'Validate your SPF record in DNS TXT records',
          href: '/tools/spf-checker',
          icon: Shield,
        },
        {
          title: 'DMARC Checker',
          description: 'Check your DMARC policy in DNS TXT records',
          href: '/tools/dmarc-checker',
          icon: Shield,
        },
      ]}
    />
  )
}
