'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Loader2, Shield } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface SPFTestResult {
  domain: string
  email: string
  ip: string
  spfRecord: string | null
  result: 'pass' | 'fail' | 'softfail' | 'neutral' | 'none'
  explanation: string
  mechanisms: Array<{ type: string; value: string }>
  evaluationPath: string[]
}

export default function SPFPolicyTester() {
  const [email, setEmail] = useState('')
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SPFTestResult | null>(null)

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!email.trim() || !ip.trim()) {
      setError('Please enter both email address and IP address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/spf-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), ip: ip.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to test SPF policy')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'pass':
        return (
          <Badge status="success" size="sm">
            <CheckCircle className="w-4 h-4 mr-1" />
            Pass
          </Badge>
        )
      case 'fail':
        return (
          <Badge status="error" size="sm">
            <XCircle className="w-4 h-4 mr-1" />
            Fail
          </Badge>
        )
      case 'softfail':
        return (
          <Badge status="warning" size="sm">
            <AlertTriangle className="w-4 h-4 mr-1" />
            SoftFail (~all)
          </Badge>
        )
      case 'neutral':
        return (
          <Badge status="info" size="sm">
            <Shield className="w-4 h-4 mr-1" />
            Neutral
          </Badge>
        )
      case 'none':
        return (
          <Badge status="neutral" size="sm">
            <XCircle className="w-4 h-4 mr-1" />
            None
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <Card className="p-8">
        <form onSubmit={handleTest} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sender@example.com"
              disabled={loading}
            />
            <p className="text-xs text-sendmarc-gray-500 mt-1">
              The domain will be extracted from the email address
            </p>
          </div>

          <div>
            <label htmlFor="ip" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
              Sending IP Address
            </label>
            <Input
              id="ip"
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.0.2.1 or 2001:db8::1"
              disabled={loading}
            />
            <p className="text-xs text-sendmarc-gray-500 mt-1">
              The IP address to test against the SPF policy
            </p>
          </div>

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Test SPF Policy
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-sendmarc-error-light rounded-lg">
              <AlertTriangle className="w-5 h-5 text-sendmarc-error-DEFAULT flex-shrink-0 mt-0.5" />
              <p className="text-sm text-sendmarc-error-dark">{error}</p>
            </div>
          )}
        </form>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Result Summary */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-2">SPF Test Result</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-sendmarc-gray-700 w-20">Domain:</span>
                    <span className="text-sm text-sendmarc-gray-900">{result.domain}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-sendmarc-gray-700 w-20">Email:</span>
                    <span className="text-sm text-sendmarc-gray-900">{result.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-sm font-medium text-sendmarc-gray-700 w-20">IP:</span>
                    <span className="text-sm text-sendmarc-gray-900 font-mono">{result.ip}</span>
                  </div>
                </div>
              </div>
              <div>{getResultBadge(result.result)}</div>
            </div>

            <div className="p-4 bg-sendmarc-gray-50 rounded-lg">
              <p className="text-sm text-sendmarc-gray-700">{result.explanation}</p>
            </div>
          </Card>

          {/* SPF Record */}
          {result.spfRecord && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">SPF Record</h3>
              <div className="bg-sendmarc-gray-900 text-sendmarc-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                {result.spfRecord}
              </div>
            </Card>
          )}

          {/* Mechanisms */}
          {result.mechanisms.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">SPF Mechanisms</h3>
              <div className="space-y-2">
                {result.mechanisms.map((mech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-sendmarc-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium text-sendmarc-gray-900 min-w-24">
                      {mech.type}
                    </span>
                    <span className="text-sm text-sendmarc-gray-700 font-mono">{mech.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Evaluation Path */}
          {result.evaluationPath.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">Evaluation Path</h3>
              <div className="space-y-2">
                {result.evaluationPath.map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-sendmarc-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-sendmarc-blue-700">
                        {index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-sendmarc-gray-700 pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Help Text */}
      <Card variant="light" className="p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-sendmarc-info-DEFAULT flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-sendmarc-gray-900">How this tool works</p>
            <ul className="text-sm text-sendmarc-gray-700 space-y-1 list-disc list-inside">
              <li>Enter the sender email address (domain will be extracted)</li>
              <li>Enter the IP address that is sending the email</li>
              <li>We&apos;ll check if the IP is authorized by the domain&apos;s SPF policy</li>
              <li>Result shows pass, fail, softfail, neutral, or none</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
