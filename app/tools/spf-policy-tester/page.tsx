import type { Metadata } from 'next'
import { Container } from '@/components/layout'
import SPFPolicyTester from '@/components/tools/SPFPolicyTester'

export const metadata: Metadata = {
  title: 'Free SPF Policy Tester - Test IP Authorization | Sendmarc Tools',
  description:
    'Test if an IP address is authorized by an SPF policy. Free SPF evaluation tool that checks sender authorization and shows the evaluation path.',
  keywords: [
    'SPF tester',
    'SPF policy test',
    'SPF evaluation',
    'test SPF record',
    'SPF authorization',
    'SPF validator',
    'sender policy framework test',
    'SPF check IP',
    'email authorization',
    'SPF mechanism test',
  ],
  openGraph: {
    title: 'Free SPF Policy Tester - Test IP Authorization',
    description: 'Test if an IP address is authorized by an SPF policy.',
    type: 'website',
  },
}

export default function SPFPolicyTesterPage() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">SPF Policy Tester</h1>
            <p className="text-lg text-white/80">
              Test if an IP address is authorized to send email for a domain based on its SPF policy
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Tool */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <SPFPolicyTester />
          </div>
        </Container>
      </section>

      {/* What Is */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              What is SPF Policy Testing?
            </h2>
            <div className="prose prose-lg max-w-none text-sendmarc-gray-700 space-y-4">
              <p>
                SPF (Sender Policy Framework) policy testing evaluates whether a specific IP address
                is authorized to send email on behalf of a domain according to that domain&apos;s
                published SPF record. When an email is received, mail servers perform this exact
                check to determine if the sending server is legitimate.
              </p>
              <p>
                The test works by parsing the domain&apos;s SPF record from DNS, evaluating each
                mechanism in order (ip4, ip6, include, mx, a, etc.), and determining if the sending
                IP matches any of the authorized sources. The result can be pass (IP is authorized),
                fail (IP is explicitly not authorized), softfail (IP probably not authorized),
                neutral (no statement), or none (no SPF record exists).
              </p>
              <p>
                Understanding SPF evaluation is crucial for troubleshooting email delivery issues.
                If legitimate emails are failing SPF checks, you may need to add missing IP ranges
                or includes to your SPF record. This tool helps you verify your SPF configuration
                before emails bounce or end up in spam folders.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
