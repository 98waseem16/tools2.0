import type { Metadata } from 'next'
import { Container } from '@/components/layout'
import CIDRCalculator from '@/components/tools/CIDRCalculator'

export const metadata: Metadata = {
  title: 'Free CIDR Calculator - Subnet Calculator | Sendmarc Tools',
  description:
    'Calculate CIDR subnet details, convert IP ranges to CIDR notation, and optimize SPF records. Free subnet calculator with network address, broadcast, and usable hosts.',
  keywords: [
    'CIDR calculator',
    'subnet calculator',
    'IP calculator',
    'CIDR to IP range',
    'IP range to CIDR',
    'subnet mask calculator',
    'network calculator',
    'SPF optimization',
    'IP address calculator',
    'CIDR notation',
  ],
  openGraph: {
    title: 'Free CIDR Calculator - Subnet Calculator',
    description: 'Calculate CIDR subnet details and convert IP ranges.',
    type: 'website',
  },
}

export default function CIDRCalculatorPage() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">CIDR Calculator</h1>
            <p className="text-lg text-white/80">
              Calculate subnet details, convert IP ranges to CIDR, and optimize SPF records
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Tool */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <CIDRCalculator />
          </div>
        </Container>
      </section>

      {/* What Is */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              What is CIDR Notation?
            </h2>
            <div className="prose prose-lg max-w-none text-sendmarc-gray-700 space-y-4">
              <p>
                CIDR (Classless Inter-Domain Routing) notation is a compact way to specify IP
                address ranges using a slash followed by a prefix length. For example, 192.168.1.0/24
                represents all IP addresses from 192.168.1.0 to 192.168.1.255. The /24 indicates
                that the first 24 bits are the network portion, leaving 8 bits for host addresses.
              </p>
              <p>
                CIDR is essential for SPF records in email authentication. When specifying authorized
                sending IPs in your SPF record, using CIDR notation (like ip4:192.168.1.0/24) is more
                efficient than listing individual IP addresses. It allows you to authorize entire
                subnets with a single mechanism, helping you stay under the critical 10 DNS lookup
                limit.
              </p>
              <p>
                This calculator helps you convert between IP ranges and CIDR notation, calculate
                usable host counts, determine subnet masks, and optimize your SPF records by
                consolidating IP addresses into efficient CIDR blocks.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
