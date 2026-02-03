'use client'

import { useState } from 'react'
import { Key, Copy, AlertTriangle, Terminal } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import CopyButton from '@/components/ui/CopyButton'

export default function DKIMGenerator() {
  const [domain, setDomain] = useState('')
  const [selector, setSelector] = useState('default')
  const [keySize, setKeySize] = useState<1024 | 2048>(2048)
  const [showInstructions, setShowInstructions] = useState(false)

  const handleGenerate = () => {
    if (!domain.trim() || !selector.trim()) {
      return
    }
    setShowInstructions(true)
  }

  const opensslCommands = [
    `# Generate ${keySize}-bit private key`,
    `openssl genrsa -out ${selector}.private ${keySize}`,
    '',
    '# Extract public key',
    `openssl rsa -in ${selector}.private -pubout -outform PEM -out ${selector}.public`,
    '',
    '# Format public key for DNS (remove headers and newlines)',
    `cat ${selector}.public | grep -v "BEGIN\\|END" | tr -d "\\n"`,
  ].join('\n')

  const dnsRecordName = `${selector}._domainkey.${domain}`
  const dnsRecordValue = 'v=DKIM1; k=rsa; p=<paste_your_public_key_here>'

  return (
    <div className="space-y-8">
      {/* Configuration Form */}
      <Card className="p-8">
        <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-6">
          DKIM Configuration
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
              Domain
            </label>
            <Input
              id="domain"
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
            />
          </div>

          <div>
            <label htmlFor="selector" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
              Selector
            </label>
            <Input
              id="selector"
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="default"
            />
            <p className="text-xs text-sendmarc-gray-500 mt-1">
              Common selectors: default, mail, google, selector1
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
              Key Size
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="keySize"
                  value="1024"
                  checked={keySize === 1024}
                  onChange={() => setKeySize(1024)}
                  className="w-4 h-4 text-sendmarc-blue-500 focus:ring-sendmarc-blue-500"
                />
                <span className="text-sm text-sendmarc-gray-700">1024-bit (legacy)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="keySize"
                  value="2048"
                  checked={keySize === 2048}
                  onChange={() => setKeySize(2048)}
                  className="w-4 h-4 text-sendmarc-blue-500 focus:ring-sendmarc-blue-500"
                />
                <span className="text-sm text-sendmarc-gray-700">2048-bit (recommended)</span>
              </label>
            </div>
          </div>

          <Button onClick={handleGenerate} fullWidth disabled={!domain.trim() || !selector.trim()}>
            <Key className="w-4 h-4 mr-2" />
            Show Generation Instructions
          </Button>
        </div>
      </Card>

      {/* Security Warning */}
      <Card variant="light" className="p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-sendmarc-warning-DEFAULT flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-sendmarc-gray-900">Security Notice</p>
            <p className="text-sm text-sendmarc-gray-700">
              For security reasons, DKIM private keys should NEVER be generated in a browser or
              transmitted over the internet. Use the OpenSSL commands below on your mail server or
              local machine to generate keys securely.
            </p>
          </div>
        </div>
      </Card>

      {/* OpenSSL Instructions */}
      {showInstructions && (
        <>
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sendmarc-blue-500" />
                <h3 className="text-lg font-semibold text-sendmarc-gray-900">
                  Step 1: Generate Keys with OpenSSL
                </h3>
              </div>
              <CopyButton text={opensslCommands} />
            </div>
            <div className="bg-sendmarc-gray-900 text-sendmarc-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="whitespace-pre">{opensslCommands}</pre>
            </div>
            <p className="text-sm text-sendmarc-gray-600 mt-3">
              Run these commands on your mail server or local machine. Keep the private key file
              (.private) secure and never share it.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-sendmarc-blue-500" />
                <h3 className="text-lg font-semibold text-sendmarc-gray-900">
                  Step 2: Create DNS TXT Record
                </h3>
              </div>
              <CopyButton text={dnsRecordName} />
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
                  Record Name
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-sendmarc-gray-50 px-4 py-2 rounded-lg font-mono text-sm text-sendmarc-gray-900">
                    {dnsRecordName}
                  </div>
                  <CopyButton text={dnsRecordName} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
                  Record Type
                </label>
                <div className="bg-sendmarc-gray-50 px-4 py-2 rounded-lg font-mono text-sm text-sendmarc-gray-900">
                  TXT
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
                  Record Value
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-sendmarc-gray-50 px-4 py-2 rounded-lg font-mono text-sm text-sendmarc-gray-900 break-all">
                    {dnsRecordValue}
                  </div>
                  <CopyButton text={dnsRecordValue} />
                </div>
                <p className="text-xs text-sendmarc-gray-500 mt-2">
                  Replace &lt;paste_your_public_key_here&gt; with the output from the last OpenSSL
                  command
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-sendmarc-blue-500" />
              <h3 className="text-lg font-semibold text-sendmarc-gray-900">
                Step 3: Configure Your Mail Server
              </h3>
            </div>

            <div className="space-y-3 text-sm text-sendmarc-gray-700">
              <p>Configure your mail server to sign outgoing emails with the private key:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Copy the private key file to your mail server</li>
                <li>
                  Set appropriate permissions (chmod 600 {selector}.private)
                </li>
                <li>Configure your mail server (Postfix, Exim, etc.) to use the key</li>
                <li>Specify the selector name and domain in the configuration</li>
                <li>Restart your mail server to apply changes</li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Copy className="w-5 h-5 text-sendmarc-blue-500" />
              <h3 className="text-lg font-semibold text-sendmarc-gray-900">Step 4: Test DKIM</h3>
            </div>

            <div className="space-y-3 text-sm text-sendmarc-gray-700">
              <p>After configuration, test your DKIM setup:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Send a test email from your domain</li>
                <li>Check the email headers for DKIM-Signature</li>
                <li>Use our DKIM Checker tool to verify the DNS record</li>
                <li>Send an email to a test service to verify the signature passes</li>
              </ul>
            </div>
          </Card>
        </>
      )}

      {/* Help Text */}
      <Card variant="light" className="p-6">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-sendmarc-info-DEFAULT flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-sendmarc-gray-900">About DKIM Keys</p>
            <ul className="text-sm text-sendmarc-gray-700 space-y-1 list-disc list-inside">
              <li>Private keys must be kept secure and never shared or transmitted</li>
              <li>2048-bit keys are recommended for security (1024-bit is deprecated)</li>
              <li>You can have multiple DKIM keys with different selectors</li>
              <li>Rotate keys periodically (every 6-12 months) for best security</li>
              <li>Keep old selectors active during key rotation to avoid disruption</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
