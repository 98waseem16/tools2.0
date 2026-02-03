'use client'

/**
 * SPF Complexity Analysis Component
 * Displays SPF record complexity rating and optimization suggestions
 */

import { Info } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'
import type { SPFComplexityAnalysis } from '@/lib/types'

interface SPFComplexityAnalysisProps {
  complexity: SPFComplexityAnalysis
}

export default function SPFComplexityAnalysis({ complexity }: SPFComplexityAnalysisProps) {
  const { rating, mechanismCount, lookupCount, recordSize, suggestions } = complexity

  // Rating display
  let ratingColor = 'text-green-600'
  let ratingBg = 'bg-green-100'
  let ratingIcon = '✓'
  let ratingText = 'Simple'

  if (rating === 'complex') {
    ratingColor = 'text-red-600'
    ratingBg = 'bg-red-100'
    ratingIcon = '⚠'
    ratingText = 'Complex'
  } else if (rating === 'moderate') {
    ratingColor = 'text-yellow-600'
    ratingBg = 'bg-yellow-100'
    ratingIcon = '●'
    ratingText = 'Moderate'
  }

  return (
    <div className="space-y-4">
      {/* Complexity Rating */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-medium text-gray-700">Complexity Rating</h4>
            <Tooltip
              content={
                <div className="space-y-1">
                  <p><strong>SPF complexity</strong> is determined by the number of mechanisms and DNS lookups.</p>
                  <p className="mt-2"><strong>Why it matters:</strong></p>
                  <ul className="mt-1 space-y-1 ml-4 list-disc">
                    <li>Complex records are harder to maintain and debug</li>
                    <li>More lookups increase email delivery latency</li>
                    <li>Higher risk of exceeding the 10-lookup limit</li>
                  </ul>
                  <p className="mt-2"><strong>Ratings:</strong></p>
                  <ul className="mt-1 space-y-1 ml-4 list-disc">
                    <li><strong>Simple:</strong> 0-5 mechanisms, &lt;5 lookups</li>
                    <li><strong>Moderate:</strong> 6-10 mechanisms, 5-8 lookups</li>
                    <li><strong>Complex:</strong> 10+ mechanisms or 8+ lookups</li>
                  </ul>
                </div>
              }
              maxWidth={350}
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${ratingBg} ${ratingColor}`}>
              {ratingIcon} {ratingText}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">Based on mechanisms & lookups</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Tooltip
          content={
            <div>
              <p><strong>SPF mechanisms</strong> define which mail servers are authorized to send email.</p>
              <p className="mt-2">Fewer mechanisms mean:</p>
              <ul className="mt-1 space-y-1 ml-4 list-disc">
                <li>Simpler record maintenance</li>
                <li>Easier troubleshooting</li>
                <li>Lower risk of configuration errors</li>
              </ul>
              <p className="mt-2">Best practice: Keep below 10 mechanisms when possible.</p>
            </div>
          }
          maxWidth={300}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center cursor-help hover:border-gray-300 transition-colors">
            <p className="text-2xl font-bold text-gray-900">{mechanismCount}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <p className="text-xs text-gray-500">Mechanisms</p>
              <Info className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </Tooltip>

        <Tooltip
          content={
            <div>
              <p><strong>DNS lookups</strong> are triggered when resolving SPF mechanisms.</p>
              <p className="mt-2"><strong>RFC 7208 hard limit:</strong> 10 lookups maximum</p>
              <p className="mt-2">Mechanisms that trigger lookups:</p>
              <ul className="mt-1 space-y-1 ml-4 list-disc">
                <li><code>include:</code> - 1 lookup per include (plus nested)</li>
                <li><code>a</code> - 1 lookup</li>
                <li><code>mx</code> - 1 lookup</li>
                <li><code>exists</code> - 1 lookup</li>
                <li><code>redirect</code> - 1 lookup</li>
              </ul>
              <p className="mt-2"><code>ip4</code>, <code>ip6</code>, and <code>all</code> don't count.</p>
            </div>
          }
          maxWidth={350}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center cursor-help hover:border-gray-300 transition-colors">
            <p className="text-2xl font-bold text-gray-900">{lookupCount}/10</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <p className="text-xs text-gray-500">DNS Lookups</p>
              <Info className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </Tooltip>

        <Tooltip
          content={
            <div>
              <p><strong>SPF record size</strong> is measured in characters (bytes).</p>
              <p className="mt-2"><strong>UDP DNS limit:</strong> ~255 bytes soft limit</p>
              <p className="mt-2">Records exceeding 255 bytes:</p>
              <ul className="mt-1 space-y-1 ml-4 list-disc">
                <li>May require TCP fallback (slower)</li>
                <li>Some mail servers don't support TCP DNS</li>
                <li>Could cause SPF validation failures</li>
              </ul>
              <p className="mt-2"><strong>Best practice:</strong> Keep records under 255 characters when possible.</p>
              <p className="mt-2">DNS TXT record hard limit is 512 bytes, but staying below 255 ensures better compatibility.</p>
            </div>
          }
          maxWidth={350}
        >
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center cursor-help hover:border-gray-300 transition-colors">
            <p className="text-2xl font-bold text-gray-900">{recordSize}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <p className="text-xs text-gray-500">Characters</p>
              <Info className="w-3 h-3 text-gray-400" />
            </div>
          </div>
        </Tooltip>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💡 Optimization Suggestions
          </h4>
          <ul className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm text-blue-800 flex items-start">
                <span className="mr-2">•</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Complexity Explanation */}
      <div className="bg-gray-50 rounded-lg p-4 text-xs text-gray-600 space-y-1">
        <p><strong>Simple:</strong> 0-5 mechanisms, &lt;5 lookups</p>
        <p><strong>Moderate:</strong> 6-10 mechanisms, 5-8 lookups</p>
        <p><strong>Complex:</strong> 10+ mechanisms or 8+ lookups</p>
      </div>
    </div>
  )
}
