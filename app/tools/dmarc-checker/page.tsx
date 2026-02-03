import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout'
import { DomainInputHero } from '@/components/domain-input'
import Card from '@/components/ui/Card'
import { Shield, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Free DMARC Checker - Verify Your DMARC Record | Sendmarc Tools',
  description: 'Check your DMARC record instantly. Free DMARC lookup and validation tool. Verify your DMARC policy, analyze configuration, and get recommendations to prevent email spoofing.',
  keywords: ['DMARC checker', 'DMARC lookup', 'DMARC validator', 'check DMARC record', 'DMARC policy', 'email authentication'],
}

export default function DMARCCheckerPage() {
  const relatedTools = [
    {
      title: 'SPF Checker',
      description: 'Validate your SPF record and check DNS lookups',
      href: '/tools/spf-checker',
      icon: CheckCircle,
    },
    {
      title: 'DKIM Checker',
      description: 'Test DKIM signatures and verify email signing',
      href: '/tools/dkim-checker',
      icon: Shield,
    },
    {
      title: 'MX Lookup',
      description: 'Check mail server records and routing',
      href: '/tools/mx-lookup',
      icon: ArrowRight,
    },
  ]

  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero Section */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <DomainInputHero
            title="DMARC Checker"
            subtitle="Instantly check your DMARC record and verify email authentication configuration"
          />
        </Container>
      </section>

      {/* What is DMARC */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              What is DMARC?
            </h2>
            <div className="prose prose-lg max-w-none text-sendmarc-gray-700 space-y-4">
              <p>
                <strong>DMARC (Domain-based Message Authentication, Reporting, and Conformance)</strong> is an email
                authentication protocol that protects your domain from being used in email spoofing and phishing attacks.
                It works with SPF and DKIM to verify that emails claiming to be from your domain are actually authorized.
              </p>
              <p>
                DMARC tells receiving email servers how to handle emails that fail authentication checks. You can set
                policies to monitor suspicious emails (p=none), send them to spam (p=quarantine), or reject them entirely
                (p=reject). DMARC also provides reports showing who is sending email on behalf of your domain.
              </p>
              <p>
                Without DMARC, attackers can easily impersonate your domain to send fraudulent emails to your customers,
                partners, or employees. This damages your brand reputation and puts recipients at risk of phishing attacks.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Understanding Your Results */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              Understanding Your DMARC Results
            </h2>
            <div className="space-y-6">
              <Card variant="light" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sendmarc-success-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                      DMARC Record Found
                    </h3>
                    <p className="text-sendmarc-gray-600">
                      Your domain has a DMARC record published. Our checker will analyze your policy settings, alignment
                      modes, and reporting configuration to ensure maximum protection.
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sendmarc-warning-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-sendmarc-warning-DEFAULT" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                      Policy Configuration
                    </h3>
                    <p className="text-sendmarc-gray-600">
                      We check if your DMARC policy is set to the recommended "reject" level, applied to 100% of emails,
                      and properly configured for subdomain protection. We also verify your alignment modes (SPF and DKIM).
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sendmarc-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-sendmarc-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                      Reporting Setup
                    </h3>
                    <p className="text-sendmarc-gray-600">
                      Our tool verifies that you have aggregate reporting addresses (rua) configured to receive DMARC
                      reports. These reports show you who is sending email on your domain and help identify authentication
                      issues.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Common Issues */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8">
              Common DMARC Issues
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  No DMARC Record Found
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Your domain doesn't have a DMARC record published. This means your domain is vulnerable to email
                  spoofing attacks.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> Add a DMARC record to your DNS. Start with a monitoring policy
                  (p=none) and gradually move to enforcement (p=quarantine or p=reject).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  Policy Set to "None"
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Your DMARC policy is set to "none" which only monitors emails but doesn't protect against spoofing.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> After monitoring for a period and fixing any authentication issues, upgrade
                  to p=quarantine or p=reject for active protection.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  Low Percentage Application
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Your DMARC policy is only applied to a percentage of emails (e.g., pct=50), leaving gaps in protection.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> Gradually increase the percentage to 100% to ensure all emails are protected
                  by your DMARC policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  No Reporting Configured
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Your DMARC record doesn't have reporting addresses (rua=) configured, so you won't receive DMARC reports.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> Add rua= tags to your DMARC record to receive aggregate reports about email
                  authentication activity on your domain.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Best Practices */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8">
              DMARC Best Practices
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sendmarc-gray-700">
                    <strong>Start with monitoring:</strong> Begin with p=none to collect data without affecting email
                    delivery, then gradually move to enforcement.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sendmarc-gray-700">
                    <strong>Use enforcement policies:</strong> Upgrade to p=quarantine or p=reject for active protection
                    against email spoofing and phishing.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sendmarc-gray-700">
                    <strong>Configure reporting:</strong> Set up aggregate reporting (rua=) to monitor who is sending
                    email on your domain and identify authentication issues.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sendmarc-gray-700">
                    <strong>Protect subdomains:</strong> Set a subdomain policy (sp=) to ensure subdomains are also
                    protected from spoofing attacks.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sendmarc-gray-700">
                    <strong>Apply to 100% of emails:</strong> Ensure your DMARC policy is applied to all emails (pct=100
                    or omit the pct tag) for complete protection.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <div>
                  <p className="text-sendmarc-gray-700">
                    <strong>Regular monitoring:</strong> Continuously monitor your DMARC reports to catch and fix
                    authentication issues before they impact email delivery.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Tools */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8 text-center">
              Related Email Security Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card
                    variant="light"
                    className="h-full transition-all duration-200 hover:shadow-medium"
                  >
                    <div className="flex flex-col items-center text-center gap-4 p-2">
                      <div className="w-12 h-12 bg-sendmarc-blue-100 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-6 h-6 text-sendmarc-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-2">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-sendmarc-gray-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sendmarc-blue-950">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Help with DMARC Implementation?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Sendmarc provides automated DMARC management, real-time monitoring, and expert support to protect
              your domain from email spoofing and phishing attacks.
            </p>
            <a
              href="https://sendmarc.com/start-trial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-sendmarc-blue-950 px-8 py-3 rounded-lg font-semibold hover:bg-sendmarc-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
