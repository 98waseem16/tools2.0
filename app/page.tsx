import Link from 'next/link'
import { Container } from '@/components/layout'
import { DomainInputHero } from '@/components/domain-input'
import Card from '@/components/ui/Card'
import { Shield, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'

export default function Home() {
  const tools = [
    {
      title: 'DMARC Checker',
      description: 'Verify your DMARC policy and email authentication setup',
      href: '/tools/dmarc-checker',
      icon: Shield,
    },
    {
      title: 'SPF Checker',
      description: 'Validate SPF records and authorized sending servers',
      href: '/tools/spf-checker',
      icon: CheckCircle,
    },
    {
      title: 'DKIM Checker',
      description: 'Test DKIM signatures and email signing configuration',
      href: '/tools/dkim-checker',
      icon: Shield,
    },
    {
      title: 'MX Lookup',
      description: 'Check mail server records and email routing',
      href: '/tools/mx-lookup',
      icon: TrendingUp,
    },
    {
      title: 'Blacklist Checker',
      description: 'Scan your IP against major DNS blacklists',
      href: '/tools/blacklist-checker',
      icon: AlertTriangle,
    },
    {
      title: 'Header Analyzer',
      description: 'Analyze email headers for authentication results',
      href: '/tools/header-analyzer',
      icon: CheckCircle,
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-sendmarc-blue-950 py-20 md:py-32">
        <Container>
          <DomainInputHero />
        </Container>
      </section>

      {/* Value Proposition */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-sendmarc-gray-900 mb-4">
              Protect Your Domain from Email Spoofing
            </h2>
            <p className="text-lg text-sendmarc-gray-600">
              Get a comprehensive analysis of your email authentication setup. Check DMARC, SPF, DKIM,
              and more to ensure your domain is protected from phishing and spoofing attacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sendmarc-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-sendmarc-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                Comprehensive Analysis
              </h3>
              <p className="text-sendmarc-gray-600">
                Check all email authentication protocols including DMARC, SPF, DKIM, MTA-STS, TLS-RPT, and BIMI
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sendmarc-success-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-sendmarc-success-DEFAULT" />
              </div>
              <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                Instant Results
              </h3>
              <p className="text-sendmarc-gray-600">
                Get detailed analysis and recommendations in seconds with our fast DNS lookup service
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sendmarc-warning-light rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-sendmarc-warning-DEFAULT" />
              </div>
              <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                Actionable Insights
              </h3>
              <p className="text-sendmarc-gray-600">
                Receive clear recommendations on how to improve your email security posture
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Tools Grid */}
      <section className="py-16 md:py-24 bg-sendmarc-gray-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-sendmarc-gray-900 mb-4">
              Email Security Tools
            </h2>
            <p className="text-lg text-sendmarc-gray-600">
              Choose a specific tool to analyze individual aspects of your email security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <Link key={index} href={tool.href}>
                <Card
                  variant="light"
                  className="h-full transition-all duration-200 hover:shadow-medium"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sendmarc-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
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
        </Container>
      </section>

      {/* Why Check Email Security */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-sendmarc-gray-900 mb-6">
              Why Check Your Email Security?
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-sendmarc-gray-600 mb-4">
                Email spoofing and phishing attacks cost businesses billions of dollars annually. Without proper
                email authentication, attackers can impersonate your domain to send fraudulent emails, damaging
                your brand reputation and putting your customers at risk.
              </p>
              <p className="text-sendmarc-gray-600 mb-4">
                <strong className="text-sendmarc-gray-900">DMARC (Domain-based Message Authentication, Reporting, and Conformance)</strong> works
                with SPF and DKIM to prevent email spoofing. It tells receiving mail servers how to handle
                unauthenticated emails claiming to be from your domain.
              </p>
              <p className="text-sendmarc-gray-600 mb-4">
                Our free tools help you:
              </p>
              <ul className="list-disc list-inside text-sendmarc-gray-600 space-y-2 mb-4">
                <li>Verify your DMARC, SPF, and DKIM records are correctly configured</li>
                <li>Identify misconfigurations that could allow spoofing</li>
                <li>Detect which email services and providers you&apos;re using</li>
                <li>Get recommendations for improving your email security</li>
                <li>Monitor your domain&apos;s reputation across blacklists</li>
              </ul>
              <p className="text-sendmarc-gray-600">
                Start with a free analysis to see where your domain stands and get actionable recommendations
                for improving your email authentication.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-sendmarc-blue-950">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Protect Your Domain?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Get started with a free email security analysis. No sign-up required.
            </p>
            <DomainInputHero
              title=""
              subtitle=""
              className="max-w-xl mx-auto"
            />
          </div>
        </Container>
      </section>
    </>
  )
}
