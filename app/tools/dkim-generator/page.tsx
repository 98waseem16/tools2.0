import type { Metadata } from 'next'
import { Container } from '@/components/layout'
import DKIMGenerator from '@/components/tools/DKIMGenerator'

export const metadata: Metadata = {
  title: 'Free DKIM Generator - Generate DKIM Keys | Sendmarc Tools',
  description:
    'Generate DKIM RSA key pairs securely. Free DKIM generator with OpenSSL instructions for creating 1024-bit or 2048-bit DKIM keys for email authentication.',
  keywords: [
    'DKIM generator',
    'DKIM key generator',
    'generate DKIM keys',
    'DKIM RSA keys',
    'DKIM setup',
    'email authentication keys',
    'DKIM configuration',
    'OpenSSL DKIM',
    '2048-bit DKIM',
    'DKIM selector',
  ],
  openGraph: {
    title: 'Free DKIM Generator - Generate DKIM Keys',
    description: 'Generate DKIM RSA key pairs with OpenSSL instructions.',
    type: 'website',
  },
}

export default function DKIMGeneratorPage() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">DKIM Generator</h1>
            <p className="text-lg text-white/80">
              Generate DKIM RSA key pairs securely using OpenSSL for email authentication
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Tool */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <DKIMGenerator />
          </div>
        </Container>
      </section>

      {/* What Is */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              What is DKIM Key Generation?
            </h2>
            <div className="prose prose-lg max-w-none text-sendmarc-gray-700 space-y-4">
              <p>
                DKIM (DomainKeys Identified Mail) uses asymmetric cryptography with a pair of RSA
                keys: a private key kept secret on your mail server, and a public key published in
                DNS. When you send an email, your server signs it with the private key. Recipients
                retrieve your public key from DNS and verify the signature, proving the email
                came from your domain and wasn&apos;t tampered with.
              </p>
              <p>
                Generating DKIM keys requires creating an RSA key pair using cryptographic tools
                like OpenSSL. The key size (1024-bit or 2048-bit) determines security strength -
                2048-bit keys are now recommended as 1024-bit is considered deprecated. Each key
                pair is associated with a &quot;selector&quot; (like &quot;default&quot; or
                &quot;google&quot;) allowing multiple keys per domain for rotation and multi-server
                setups.
              </p>
              <p>
                This tool provides secure OpenSSL commands for generating DKIM keys on your own
                server or machine. Never generate private keys in a browser or share them online -
                they must remain secret to maintain email security and prevent impersonation.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
