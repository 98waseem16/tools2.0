import type { Metadata } from 'next'
import { AlertTriangle, CheckCircle, Ban, Mail } from 'lucide-react'
import { Container } from '@/components/layout'
import BlacklistChecker from '@/components/tools/BlacklistChecker'
import Card from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Free IP Blacklist Checker - Check DNSBL Status | Sendmarc Tools',
  description:
    'Check if your IP is blacklisted instantly. Free DNSBL checker that scans 100+ blacklists to verify your mail server reputation and deliverability.',
  keywords: [
    'blacklist checker',
    'DNSBL checker',
    'IP blacklist',
    'email blacklist',
    'RBL checker',
    'spam blacklist',
    'mail server blacklist',
    'IP reputation',
    'delisting',
    'blacklist removal',
  ],
  openGraph: {
    title: 'Free IP Blacklist Checker - Check DNSBL Status',
    description: 'Check if your IP is blacklisted across 100+ DNS blacklists.',
    type: 'website',
  },
}

export default function BlacklistCheckerPage() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Blacklist Checker</h1>
            <p className="text-lg text-white/80">
              Check if your mail server IP is listed on DNS-based blacklists (DNSBLs)
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Tool */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <BlacklistChecker />
          </div>
        </Container>
      </section>

      {/* What Is */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              What are Email Blacklists?
            </h2>
            <div className="prose prose-lg max-w-none text-sendmarc-gray-700 space-y-4">
              <p>
                Email blacklists (also called DNS-based Blackhole Lists or DNSBLs) are databases of
                IP addresses and domains that have been identified as sources of spam, malware, or
                other malicious email activity. Mail servers check these blacklists before accepting
                emails, and being listed can cause your legitimate emails to be rejected or marked
                as spam.
              </p>
              <p>
                There are dozens of major blacklists including Spamhaus, Barracuda, SpamCop, and
                Sorbs, each with different listing criteria and removal processes. An IP can be
                blacklisted for various reasons: sending spam, having an open relay, being
                compromised by malware, poor sender reputation, or even being part of an IP range
                with bad neighbors.
              </p>
              <p>
                Regular blacklist monitoring is crucial for maintaining email deliverability. Even
                if you send legitimate email, a blacklisting can severely impact your business by
                preventing emails from reaching customers. Most blacklists offer removal procedures,
                but prevention through good email practices is always better than cure.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Understanding Results */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              Understanding Blacklist Results
            </h2>
            <div className="space-y-6">
              <Card variant="light" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sendmarc-success-DEFAULT text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                      Clean - Not Listed
                    </h3>
                    <p className="text-sendmarc-gray-600">
                      Your IP address is not listed on any checked blacklists. Your mail server has
                      good reputation and emails should be delivered normally without
                      blacklist-related issues.
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sendmarc-warning-DEFAULT text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                      Minor Listings
                    </h3>
                    <p className="text-sendmarc-gray-600">
                      Your IP is listed on one or more minor or less-critical blacklists. This may
                      impact deliverability to some recipients. Monitor these listings and consider
                      delisting if they persist.
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="light" className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sendmarc-error-DEFAULT text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Ban className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                      Critical Listings
                    </h3>
                    <p className="text-sendmarc-gray-600">
                      Your IP is listed on major blacklists like Spamhaus, Barracuda, or SpamCop.
                      This severely impacts email deliverability. Immediate action is required to
                      identify the cause and request delisting.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      {/* Common Issues */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8">Common Issues</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  Listed on Spamhaus
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Spamhaus is one of the most widely used blacklists. Being listed here severely
                  impacts email deliverability as many mail servers block emails from
                  Spamhaus-listed IPs.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> Visit spamhaus.org, search for your IP, and review the
                  reason for listing. Fix the underlying issue (stop spam, secure compromised
                  systems, etc.), then submit a delisting request. Implement monitoring to prevent
                  re-listing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  Shared Hosting IP Blacklisted
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Your IP is blacklisted because of other customers on the same shared hosting
                  server sending spam, not due to your own actions.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> Contact your hosting provider to request a clean IP
                  address or switch to a dedicated IP/VPS. Consider using a dedicated email service
                  (Google Workspace, Microsoft 365) instead of shared hosting for email.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  Open Relay or Compromised Server
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Your mail server is configured as an open relay or has been compromised, allowing
                  spammers to send email through it.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> Immediately secure your mail server by disabling open
                  relay, changing passwords, updating software, and scanning for malware. Request
                  delisting only after securing the server completely.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                  Poor Email Practices
                </h3>
                <p className="text-sendmarc-gray-600 mb-2">
                  Your IP was blacklisted due to high complaint rates, sending to spam traps, or
                  other poor email sending practices.
                </p>
                <p className="text-sm text-sendmarc-gray-600">
                  <strong>Solution:</strong> Review your email sending practices: use double opt-in,
                  honor unsubscribes immediately, clean your email lists, send only to engaged
                  recipients, and follow email marketing best practices.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Best Practices */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8">Best Practices</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <p className="text-sendmarc-gray-700">
                  Monitor your sending IPs regularly (weekly or after any email issues)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <p className="text-sendmarc-gray-700">
                  Maintain good sender reputation with low complaint and bounce rates
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <p className="text-sendmarc-gray-700">
                  Use authenticated email (SPF, DKIM, DMARC) to prove legitimacy
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <p className="text-sendmarc-gray-700">
                  Implement feedback loops with major ISPs to catch complaints early
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <p className="text-sendmarc-gray-700">
                  Warm up new IPs gradually before sending high volumes
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                <p className="text-sendmarc-gray-700">
                  Keep email lists clean by removing invalid addresses and unengaged recipients
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related Tools */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8 text-center">
              Related Email Security Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/tools/mx-lookup">
                <Card
                  variant="light"
                  className="h-full transition-all duration-200 hover:shadow-medium"
                >
                  <div className="flex flex-col items-center text-center gap-4 p-2">
                    <div className="w-12 h-12 bg-sendmarc-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-sendmarc-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-2">
                        MX Lookup
                      </h3>
                      <p className="text-sm text-sendmarc-gray-600">
                        Find your mail server IP addresses to check for blacklisting
                      </p>
                    </div>
                  </div>
                </Card>
              </a>

              <a href="/tools/spf-checker">
                <Card
                  variant="light"
                  className="h-full transition-all duration-200 hover:shadow-medium"
                >
                  <div className="flex flex-col items-center text-center gap-4 p-2">
                    <div className="w-12 h-12 bg-sendmarc-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-sendmarc-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-2">
                        SPF Checker
                      </h3>
                      <p className="text-sm text-sendmarc-gray-600">
                        Validate SPF to improve sender reputation
                      </p>
                    </div>
                  </div>
                </Card>
              </a>

              <a href="/tools/dmarc-checker">
                <Card
                  variant="light"
                  className="h-full transition-all duration-200 hover:shadow-medium"
                >
                  <div className="flex flex-col items-center text-center gap-4 p-2">
                    <div className="w-12 h-12 bg-sendmarc-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-sendmarc-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-2">
                        DMARC Checker
                      </h3>
                      <p className="text-sm text-sendmarc-gray-600">
                        Verify DMARC for email authentication and reputation
                      </p>
                    </div>
                  </div>
                </Card>
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sendmarc-blue-950">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Protect Your Email Reputation</h2>
            <p className="text-lg text-white/80 mb-8">
              Sendmarc provides automated blacklist monitoring, real-time alerts, and expert
              guidance to maintain your email deliverability.
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
