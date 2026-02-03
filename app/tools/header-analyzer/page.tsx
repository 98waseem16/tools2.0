import type { Metadata } from 'next'
import { Container } from '@/components/layout'
import HeaderAnalyzer from '@/components/tools/HeaderAnalyzer'

export const metadata: Metadata = {
  title: 'Free Email Header Analyzer - Parse Email Headers | Sendmarc Tools',
  description:
    'Analyze email headers instantly. Free email header parser that extracts routing information, SPF/DKIM/DMARC authentication results, and sender details.',
  keywords: [
    'email header analyzer',
    'email header parser',
    'parse email headers',
    'email headers',
    'email routing',
    'email authentication',
    'SPF DKIM DMARC headers',
    'received headers',
    'email trace',
    'eml file parser',
  ],
  openGraph: {
    title: 'Free Email Header Analyzer - Parse Email Headers',
    description: 'Analyze email headers and verify authentication results.',
    type: 'website',
  },
}

export default function HeaderAnalyzerPage() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Email Header Analyzer</h1>
            <p className="text-lg text-white/80">
              Parse email headers to view routing path, authentication results, and sender details
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Tool */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <HeaderAnalyzer />
          </div>
        </Container>
      </section>

      {/* What Is */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              What are Email Headers?
            </h2>
            <div className="prose prose-lg max-w-none text-sendmarc-gray-700 space-y-4">
              <p>
                Email headers contain metadata about an email message, including routing
                information, sender details, authentication results, and timestamps. Headers are
                created by mail servers as the email travels from sender to recipient, providing a
                complete audit trail of the email&apos;s journey.
              </p>
              <p>
                Key information in headers includes Received fields (showing each server that
                handled the email), Authentication-Results (SPF, DKIM, DMARC verification), Return-Path
                (actual sender), and various IDs for tracking. Analyzing headers is crucial for
                troubleshooting delivery issues, identifying spam or phishing attempts, and
                verifying email authentication.
              </p>
              <p>
                Headers are normally hidden by email clients but can be viewed through client
                settings or by saving emails as .eml files. Understanding headers helps diagnose
                email problems, trace message origins, and verify legitimate senders.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
