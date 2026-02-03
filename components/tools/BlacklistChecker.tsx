'use client'

import { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import type { BlacklistResult } from '@/lib/types'

export default function BlacklistChecker() {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<BlacklistResult[] | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setResults(null)

    if (!ip.trim()) {
      setError('Please enter an IP address')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/blacklist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ip: ip.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to check blacklist')
      }

      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const listedCount = results?.filter((r) => r.listed).length || 0
  const cleanCount = results?.filter((r) => !r.listed).length || 0

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ip" className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
              IP Address
            </label>
            <div className="flex gap-3">
              <Input
                id="ip"
                type="text"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                placeholder="e.g., 192.0.2.1 or 2001:db8::1"
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading} className="px-6">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Check
                  </>
                )}
              </Button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-sendmarc-error-light rounded-lg">
              <AlertTriangle className="w-5 h-5 text-sendmarc-error-DEFAULT flex-shrink-0 mt-0.5" />
              <p className="text-sm text-sendmarc-error-dark">{error}</p>
            </div>
          )}
        </form>
      </Card>

      {/* Results Summary */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sendmarc-info-light rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-sendmarc-info-DEFAULT" />
              </div>
              <div>
                <p className="text-sm text-sendmarc-gray-600">Total Checked</p>
                <p className="text-2xl font-bold text-sendmarc-gray-900">{results.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sendmarc-success-light rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT" />
              </div>
              <div>
                <p className="text-sm text-sendmarc-gray-600">Clean</p>
                <p className="text-2xl font-bold text-sendmarc-success-DEFAULT">{cleanCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sendmarc-error-light rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-sendmarc-error-DEFAULT" />
              </div>
              <div>
                <p className="text-sm text-sendmarc-gray-600">Listed</p>
                <p className="text-2xl font-bold text-sendmarc-error-DEFAULT">{listedCount}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Results Table */}
      {results && results.length > 0 && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-sendmarc-gray-50 border-b border-sendmarc-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sendmarc-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sendmarc-gray-700 uppercase tracking-wider">
                    Blacklist
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-sendmarc-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-sendmarc-gray-200">
                {results
                  .sort((a, b) => {
                    // Listed items first
                    if (a.listed && !b.listed) return -1
                    if (!a.listed && b.listed) return 1
                    return a.name.localeCompare(b.name)
                  })
                  .map((result, index) => (
                    <tr key={index} className="hover:bg-sendmarc-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {result.listed ? (
                          <Badge status="error" size="sm">
                            <XCircle className="w-3 h-3 mr-1" />
                            Listed
                          </Badge>
                        ) : (
                          <Badge status="success" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Clean
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-sendmarc-gray-900">{result.name}</span>
                          {result.zone && (
                            <span className="text-xs text-sendmarc-gray-500">{result.zone}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {result.listed ? (
                          <div className="space-y-1">
                            {result.reason && (
                              <p className="text-sm text-sendmarc-gray-700">{result.reason}</p>
                            )}
                            {result.delistUrl && (
                              <a
                                href={result.delistUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-sendmarc-blue-600 hover:text-sendmarc-blue-700 underline"
                              >
                                Request Delisting →
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-sendmarc-gray-500">Not listed</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Help Text */}
      <Card variant="light" className="p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-sendmarc-warning-DEFAULT flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-sendmarc-gray-900">
              How to use this tool
            </p>
            <ul className="text-sm text-sendmarc-gray-700 space-y-1 list-disc list-inside">
              <li>Enter the IP address of your mail server (not a domain name)</li>
              <li>We&apos;ll check it against 100+ DNS-based blacklists (DNSBLs)</li>
              <li>If listed, follow the delisting link to request removal</li>
              <li>Check regularly to maintain good email deliverability</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
