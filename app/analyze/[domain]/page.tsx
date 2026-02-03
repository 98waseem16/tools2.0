import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout'
import { DomainInput } from '@/components/domain-input'
import { validateAndNormalizeDomain } from '@/lib/utils/domain'

interface PageProps {
  params: Promise<{ domain: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  const normalizedDomain = validateAndNormalizeDomain(domain)

  if (!normalizedDomain) {
    return {
      title: 'Invalid Domain - Sendmarc Tools',
    }
  }

  return {
    title: `${normalizedDomain} - Email Security Analysis | Sendmarc Tools`,
    description: `Comprehensive DMARC, SPF, DKIM, and MX analysis for ${normalizedDomain}. Check your email authentication setup.`,
  }
}

export default async function AnalyzePage({ params }: PageProps) {
  const { domain: rawDomain } = await params

  // Validate domain
  const domain = validateAndNormalizeDomain(rawDomain)
  if (!domain) {
    notFound()
  }

  // Fetch analysis results
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const response = await fetch(`${baseUrl}/api/analyze/${domain}`, {
    cache: 'no-store', // Always get fresh data for now
  })

  if (!response.ok) {
    return (
      <div className="min-h-screen bg-sendmarc-gray-50">
        {/* Hero Section */}
        <section className="bg-sendmarc-blue-950 py-12">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-white mb-6 text-center">
                Analysis Error
              </h1>
              <DomainInput size="lg" />
            </div>
          </Container>
        </section>

        {/* Error Message */}
        <section className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-sendmarc-error-light border border-sendmarc-error-DEFAULT rounded-xl p-8">
                <h2 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                  Unable to Analyze Domain
                </h2>
                <p className="text-sendmarc-gray-600">
                  We encountered an error while analyzing {domain}. Please try again or contact support if the issue persists.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    )
  }

  const data = await response.json()

  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero Section with Domain Input */}
      <section className="bg-sendmarc-blue-950 py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 text-center">
              Email Security Analysis
            </h1>
            <DomainInput size="lg" />
          </div>
        </Container>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Executive Summary */}
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                {/* Score Circle */}
                <div className="flex-shrink-0">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={
                          data.score >= 80
                            ? '#15B546'
                            : data.score >= 60
                            ? '#D4A017'
                            : '#B71322'
                        }
                        strokeWidth="12"
                        strokeDasharray={`${(data.score / 100) * 339.292} 339.292`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-sendmarc-gray-900">
                        {data.score}
                      </span>
                      <span className="text-sm text-sendmarc-gray-600">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Summary Text */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-sendmarc-gray-900">{domain}</h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        data.riskLevel === 'low'
                          ? 'bg-sendmarc-success-light text-sendmarc-success-DEFAULT'
                          : data.riskLevel === 'medium'
                          ? 'bg-sendmarc-warning-light text-sendmarc-warning-DEFAULT'
                          : 'bg-sendmarc-error-light text-sendmarc-error-DEFAULT'
                      }`}
                    >
                      {data.riskLevel === 'low'
                        ? 'Low Risk'
                        : data.riskLevel === 'medium'
                        ? 'Medium Risk'
                        : data.riskLevel === 'high'
                        ? 'High Risk'
                        : 'Critical Risk'}
                    </span>
                  </div>
                  <p className="text-lg text-sendmarc-gray-700 mb-4">{data.summary}</p>
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sendmarc-success-DEFAULT font-semibold">
                        ✓ {
                          (data.protocols.dmarc.status === 'valid' ? 1 : 0) +
                          (data.protocols.spf.status === 'valid' ? 1 : 0) +
                          (data.protocols.dkim.selectors.length > 0 ? 1 : 0) +
                          (data.protocols.mx.status === 'valid' ? 1 : 0)
                        } Passed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sendmarc-error-DEFAULT font-semibold">
                        ✗ {4 - (
                          (data.protocols.dmarc.status === 'valid' ? 1 : 0) +
                          (data.protocols.spf.status === 'valid' ? 1 : 0) +
                          (data.protocols.dkim.selectors.length > 0 ? 1 : 0) +
                          (data.protocols.mx.status === 'valid' ? 1 : 0)
                        )} Issues
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Protocol Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DMARC Card */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-sendmarc-gray-900">DMARC</h3>
                  <span
                    className={`text-2xl ${
                      data.protocols.dmarc.status === 'valid'
                        ? 'text-sendmarc-success-DEFAULT'
                        : 'text-sendmarc-error-DEFAULT'
                    }`}
                  >
                    {data.protocols.dmarc.status === 'valid' ? '✓' : '✗'}
                  </span>
                </div>
                <div className="text-sm text-sendmarc-gray-600 mb-3">
                  Score: {data.protocols.dmarc.score}/5
                </div>
                {data.protocols.dmarc.record && (
                  <div className="bg-sendmarc-gray-50 rounded p-3 mb-3 font-mono text-xs break-all">
                    {data.protocols.dmarc.record}
                  </div>
                )}
                <ul className="space-y-2">
                  {data.protocols.dmarc.checks.slice(0, 3).map((check: any) => (
                    <li key={check.id} className="flex items-start gap-2 text-sm">
                      <span
                        className={
                          check.status === 'pass'
                            ? 'text-sendmarc-success-DEFAULT'
                            : check.status === 'warning'
                            ? 'text-sendmarc-warning-DEFAULT'
                            : 'text-sendmarc-error-DEFAULT'
                        }
                      >
                        {check.status === 'pass' ? '✓' : check.status === 'warning' ? '⚠' : '✗'}
                      </span>
                      <span className="text-sendmarc-gray-700">{check.message}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SPF Card */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-sendmarc-gray-900">SPF</h3>
                  <span
                    className={`text-2xl ${
                      data.protocols.spf.status === 'valid'
                        ? 'text-sendmarc-success-DEFAULT'
                        : 'text-sendmarc-error-DEFAULT'
                    }`}
                  >
                    {data.protocols.spf.status === 'valid' ? '✓' : '✗'}
                  </span>
                </div>
                <div className="text-sm text-sendmarc-gray-600 mb-3">
                  Score: {data.protocols.spf.score}/5
                </div>
                {data.protocols.spf.record && (
                  <div className="bg-sendmarc-gray-50 rounded p-3 mb-3 font-mono text-xs break-all">
                    {data.protocols.spf.record}
                  </div>
                )}
                <ul className="space-y-2">
                  {data.protocols.spf.checks.slice(0, 3).map((check: any) => (
                    <li key={check.id} className="flex items-start gap-2 text-sm">
                      <span
                        className={
                          check.status === 'pass'
                            ? 'text-sendmarc-success-DEFAULT'
                            : check.status === 'warning'
                            ? 'text-sendmarc-warning-DEFAULT'
                            : 'text-sendmarc-error-DEFAULT'
                        }
                      >
                        {check.status === 'pass' ? '✓' : check.status === 'warning' ? '⚠' : '✗'}
                      </span>
                      <span className="text-sendmarc-gray-700">{check.message}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DKIM Card */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-sendmarc-gray-900">DKIM</h3>
                  <span
                    className={`text-2xl ${
                      data.protocols.dkim.selectors.length > 0
                        ? 'text-sendmarc-success-DEFAULT'
                        : 'text-sendmarc-error-DEFAULT'
                    }`}
                  >
                    {data.protocols.dkim.selectors.length > 0 ? '✓' : '✗'}
                  </span>
                </div>
                <div className="text-sm text-sendmarc-gray-600 mb-3">
                  {data.protocols.dkim.selectors.length} selector
                  {data.protocols.dkim.selectors.length !== 1 ? 's' : ''} found
                </div>
                {data.protocols.dkim.selectors.length > 0 ? (
                  <ul className="space-y-2">
                    {data.protocols.dkim.selectors.slice(0, 3).map((selector: any) => (
                      <li key={selector.selector} className="flex items-start gap-2 text-sm">
                        <span className="text-sendmarc-success-DEFAULT">✓</span>
                        <span className="text-sendmarc-gray-700">
                          Selector: <span className="font-mono">{selector.selector}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-sendmarc-gray-600">
                    No DKIM records found for common selectors
                  </p>
                )}
              </div>

              {/* MX Card */}
              <div className="bg-white rounded-xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-sendmarc-gray-900">MX Records</h3>
                  <span
                    className={`text-2xl ${
                      data.protocols.mx.status === 'valid'
                        ? 'text-sendmarc-success-DEFAULT'
                        : 'text-sendmarc-error-DEFAULT'
                    }`}
                  >
                    {data.protocols.mx.status === 'valid' ? '✓' : '✗'}
                  </span>
                </div>
                <div className="text-sm text-sendmarc-gray-600 mb-3">
                  {data.protocols.mx.records.length} record
                  {data.protocols.mx.records.length !== 1 ? 's' : ''} found
                </div>
                {data.protocols.mx.records.length > 0 ? (
                  <ul className="space-y-2">
                    {data.protocols.mx.records.slice(0, 3).map((record: any, index: number) => (
                      <li key={index} className="text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-sendmarc-gray-500 font-mono text-xs">
                            {record.priority}
                          </span>
                          <span className="text-sendmarc-gray-700 font-mono text-xs break-all">
                            {record.hostname}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-sendmarc-gray-600">No MX records found</p>
                )}
              </div>
            </div>

            {/* CTA Banner */}
            <div className="mt-12 bg-sendmarc-blue-950 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-3">
                Want Complete Email Security?
              </h2>
              <p className="text-lg text-white/80 mb-6 max-w-2xl mx-auto">
                Sendmarc provides automated DMARC management, real-time monitoring, and expert support
                to protect your domain from email spoofing and phishing attacks.
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
          </div>
        </Container>
      </section>
    </div>
  )
}
