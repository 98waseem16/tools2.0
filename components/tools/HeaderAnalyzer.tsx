'use client'

import { useState } from 'react'
import { FileText, Upload, CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { parseEmailHeaders, parseEMLFile, type ParsedEmail } from '@/lib/utils/email-parser'

export default function HeaderAnalyzer() {
  const [input, setInput] = useState('')
  const [parsed, setParsed] = useState<ParsedEmail | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handlePaste = () => {
    const text = input.trim()
    if (!text) {
      setError('Please paste email headers')
      return
    }

    try {
      const result = parseEmailHeaders(text)
      setParsed(result)
      setError(null)
    } catch (err) {
      setError('Failed to parse headers. Please check the format.')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.eml')) {
      setError('Please upload a .eml file')
      return
    }

    try {
      const headers = await parseEMLFile(file)
      setInput(headers)
      const result = parseEmailHeaders(headers)
      setParsed(result)
      setError(null)
    } catch (err) {
      setError('Failed to read file. Please try again.')
    }
  }

  const getAuthBadge = (result?: string) => {
    if (!result || result === 'none') return null

    if (result === 'pass') {
      return (
        <Badge status="success" size="sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          Pass
        </Badge>
      )
    }

    if (result === 'fail') {
      return (
        <Badge status="error" size="sm">
          <XCircle className="w-3 h-3 mr-1" />
          Fail
        </Badge>
      )
    }

    return (
      <Badge status="warning" size="sm">
        <AlertTriangle className="w-3 h-3 mr-1" />
        {result}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <Card className="p-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-sendmarc-gray-700 mb-2">
              Paste Email Headers or Upload .eml File
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste full email headers here... (From:, To:, Received:, etc.)"
              className="w-full h-48 px-4 py-3 border border-sendmarc-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sendmarc-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handlePaste} className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Analyze Headers
            </Button>

            <div className="flex-1">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".eml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="btn btn-secondary w-full flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload .eml File
                </div>
              </label>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-sendmarc-error-light rounded-lg">
              <AlertTriangle className="w-5 h-5 text-sendmarc-error-DEFAULT flex-shrink-0 mt-0.5" />
              <p className="text-sm text-sendmarc-error-dark">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Results */}
      {parsed && (
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">Email Information</h3>
            <div className="space-y-3">
              {parsed.from && (
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-sendmarc-gray-700 w-24">From:</span>
                  <span className="text-sm text-sendmarc-gray-900 flex-1">{parsed.from}</span>
                </div>
              )}
              {parsed.to && (
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-sendmarc-gray-700 w-24">To:</span>
                  <span className="text-sm text-sendmarc-gray-900 flex-1">{parsed.to}</span>
                </div>
              )}
              {parsed.subject && (
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-sendmarc-gray-700 w-24">Subject:</span>
                  <span className="text-sm text-sendmarc-gray-900 flex-1">{parsed.subject}</span>
                </div>
              )}
              {parsed.date && (
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-sendmarc-gray-700 w-24">Date:</span>
                  <span className="text-sm text-sendmarc-gray-900 flex-1">{parsed.date}</span>
                </div>
              )}
              {parsed.messageId && (
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-sendmarc-gray-700 w-24">
                    Message-ID:
                  </span>
                  <span className="text-sm text-sendmarc-gray-900 flex-1 font-mono break-all">
                    {parsed.messageId}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* Authentication Results */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">
              Authentication Results
            </h3>
            <div className="space-y-4">
              {/* SPF */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sendmarc-gray-900">SPF</span>
                    {getAuthBadge(parsed.authentication.spf?.result)}
                  </div>
                  {parsed.authentication.spf?.domain && (
                    <p className="text-sm text-sendmarc-gray-600">
                      Domain: {parsed.authentication.spf.domain}
                    </p>
                  )}
                  {parsed.authentication.spf?.ip && (
                    <p className="text-sm text-sendmarc-gray-600">IP: {parsed.authentication.spf.ip}</p>
                  )}
                </div>
              </div>

              {/* DKIM */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sendmarc-gray-900">DKIM</span>
                    {getAuthBadge(parsed.authentication.dkim?.result)}
                  </div>
                  {parsed.authentication.dkim?.domain && (
                    <p className="text-sm text-sendmarc-gray-600">
                      Domain: {parsed.authentication.dkim.domain}
                    </p>
                  )}
                  {parsed.authentication.dkim?.selector && (
                    <p className="text-sm text-sendmarc-gray-600">
                      Selector: {parsed.authentication.dkim.selector}
                    </p>
                  )}
                </div>
              </div>

              {/* DMARC */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sendmarc-gray-900">DMARC</span>
                    {getAuthBadge(parsed.authentication.dmarc?.result)}
                  </div>
                  {parsed.authentication.dmarc?.policy && (
                    <p className="text-sm text-sendmarc-gray-600">
                      Policy: {parsed.authentication.dmarc.policy}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Routing Path */}
          {parsed.receivedPath.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">Email Routing Path</h3>
              <div className="space-y-4">
                {parsed.receivedPath.map((hop, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-sendmarc-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-sendmarc-blue-700">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-sendmarc-gray-900">
                            {hop.from}
                          </span>
                          <ArrowRight className="w-4 h-4 text-sendmarc-gray-400" />
                          <span className="text-sm font-medium text-sendmarc-gray-900">
                            {hop.by}
                          </span>
                        </div>
                        {hop.protocol && (
                          <p className="text-xs text-sendmarc-gray-600">
                            Protocol: {hop.protocol}
                          </p>
                        )}
                        {hop.timestamp && (
                          <p className="text-xs text-sendmarc-gray-500">{hop.timestamp}</p>
                        )}
                      </div>
                    </div>
                    {index < parsed.receivedPath.length - 1 && (
                      <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-sendmarc-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* All Headers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-4">All Headers</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sendmarc-gray-50 border-b border-sendmarc-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-sendmarc-gray-700 uppercase">
                      Header Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-sendmarc-gray-700 uppercase">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sendmarc-gray-200">
                  {parsed.headers.map((header, index) => (
                    <tr key={index} className="hover:bg-sendmarc-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-sendmarc-gray-900 whitespace-nowrap align-top">
                        {header.name}
                      </td>
                      <td className="px-4 py-2 text-sm text-sendmarc-gray-700 break-all">
                        {header.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Help Text */}
      <Card variant="light" className="p-6">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-sendmarc-info-DEFAULT flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-sendmarc-gray-900">How to get email headers</p>
            <ul className="text-sm text-sendmarc-gray-700 space-y-1 list-disc list-inside">
              <li>
                <strong>Gmail:</strong> Open email → Click three dots → Show original
              </li>
              <li>
                <strong>Outlook:</strong> Open email → File → Properties → Internet headers
              </li>
              <li>
                <strong>Apple Mail:</strong> View → Message → All Headers
              </li>
              <li>Or save/export the email as a .eml file and upload it here</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
