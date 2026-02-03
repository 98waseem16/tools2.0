'use client'

/**
 * SPF Lookup Breakdown Component
 * Visual breakdown of DNS lookup counts with tooltips
 */

import { Info } from 'lucide-react'
import Tooltip from '@/components/ui/Tooltip'

interface SPFLookupBreakdownProps {
  lookupCount: number
  secondaryLookupCount?: number
  voidLookupCount?: number
  maxLookups: number
}

export default function SPFLookupBreakdown({
  lookupCount,
  secondaryLookupCount = 0,
  voidLookupCount = 0,
  maxLookups,
}: SPFLookupBreakdownProps) {
  const totalLookups = lookupCount
  const percentage = (totalLookups / maxLookups) * 100

  // Determine color based on usage
  let progressColor = 'bg-green-500'
  let statusColor = 'text-green-600'
  let statusText = 'Well optimized'

  if (totalLookups > maxLookups) {
    progressColor = 'bg-red-500'
    statusColor = 'text-red-600'
    statusText = 'Limit exceeded!'
  } else if (totalLookups >= 9) {
    progressColor = 'bg-red-500'
    statusColor = 'text-red-600'
    statusText = 'Critical - near limit'
  } else if (totalLookups >= 8) {
    progressColor = 'bg-yellow-500'
    statusColor = 'text-yellow-600'
    statusText = 'Warning - close to limit'
  }

  const primaryLookups = lookupCount - secondaryLookupCount - voidLookupCount

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              DNS Lookup Usage
            </span>
            <Tooltip
              content={
                <div className="space-y-1">
                  <p><strong>RFC 7208 Limit:</strong> SPF is limited to 10 DNS lookups to prevent denial-of-service attacks.</p>
                  <p className="mt-2">Exceeding this limit causes SPF validation to fail, which may result in email delivery issues.</p>
                  <p className="mt-2"><strong>Thresholds:</strong></p>
                  <ul className="mt-1 space-y-1 ml-4 list-disc">
                    <li>0-7 lookups: Safe (green)</li>
                    <li>8-9 lookups: Warning (yellow)</li>
                    <li>10+ lookups: Critical/Failed (red)</li>
                  </ul>
                </div>
              }
              maxWidth={350}
            >
              <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
            </Tooltip>
          </div>
          <Tooltip
            content={`Your SPF record uses ${totalLookups} out of the maximum ${maxLookups} allowed DNS lookups`}
          >
            <span className={`text-sm font-semibold ${statusColor} cursor-help`}>
              {totalLookups}/{maxLookups} {statusText}
            </span>
          </Tooltip>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        {totalLookups > maxLookups && (
          <p className="mt-2 text-sm text-red-600">
            ⚠️ Your SPF record exceeds the 10 lookup limit and may fail validation
          </p>
        )}
      </div>

      {/* Lookup Breakdown Table */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Lookup Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600">Primary Lookups</span>
              <Tooltip
                content={
                  <div>
                    <p><strong>Direct DNS queries</strong> triggered by your SPF mechanisms:</p>
                    <ul className="mt-1 space-y-1 ml-4 list-disc">
                      <li><code>include:</code> - 1 lookup per include</li>
                      <li><code>mx</code> - 1 lookup</li>
                      <li><code>a</code> - 1 lookup</li>
                      <li><code>exists</code> - 1 lookup</li>
                      <li><code>redirect</code> - 1 lookup</li>
                    </ul>
                    <p className="mt-2"><code>ip4</code>, <code>ip6</code>, and <code>all</code> don't trigger lookups.</p>
                  </div>
                }
                maxWidth={350}
              >
                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
              </Tooltip>
            </div>
            <span className="text-sm font-semibold text-gray-900">{primaryLookups}</span>
          </div>

          {secondaryLookupCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm text-gray-600">Secondary Lookups</span>
                <Tooltip
                  content={
                    <div>
                      <p><strong>Nested lookups</strong> from included domains.</p>
                      <p className="mt-2">When you use <code>include:</code>, that domain's SPF record may also contain mechanisms that trigger additional lookups.</p>
                      <p className="mt-2"><strong>Example:</strong></p>
                      <p className="mt-1">If your record includes <code>_spf.google.com</code>, and Google's record contains 3 more includes, those count as secondary lookups.</p>
                      <p className="mt-2">Click on <code>include:</code> mechanisms in the table below to see nested records.</p>
                    </div>
                  }
                  maxWidth={350}
                >
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-gray-900">{secondaryLookupCount}</span>
            </div>
          )}

          {voidLookupCount > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm text-gray-600">Void Lookups</span>
                <Tooltip
                  content={
                    <div>
                      <p><strong>Failed DNS lookups</strong> (NXDOMAIN responses).</p>
                      <p className="mt-2">These occur when a mechanism references a domain that doesn't exist or doesn't have the required DNS record.</p>
                      <p className="mt-2"><strong>Important:</strong> Void lookups still count toward the 10-lookup limit, even though they fail!</p>
                      <p className="mt-2">Common causes:</p>
                      <ul className="mt-1 space-y-1 ml-4 list-disc">
                        <li>Typos in domain names</li>
                        <li>Outdated includes to deleted services</li>
                        <li>Misconfigured DNS records</li>
                      </ul>
                    </div>
                  }
                  maxWidth={350}
                >
                  <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                </Tooltip>
              </div>
              <span className="text-sm font-semibold text-gray-900">{voidLookupCount}</span>
            </div>
          )}

          <div className="pt-2 border-t border-gray-300 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total</span>
            <span className={`text-sm font-bold ${statusColor}`}>
              {totalLookups}/{maxLookups}
            </span>
          </div>
        </div>

        {/* Explanations */}
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-1 text-xs text-gray-500">
          <p><strong>Primary:</strong> Direct lookups from your SPF mechanisms</p>
          {secondaryLookupCount > 0 && <p><strong>Secondary:</strong> Lookups from nested includes (expand table rows to see details)</p>}
          {voidLookupCount > 0 && <p><strong>Void:</strong> Failed lookups (still count toward limit!)</p>}
        </div>
      </div>
    </div>
  )
}
