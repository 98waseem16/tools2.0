'use client'

/**
 * Horizontal stats bar: Status | DNS lookups | Services | Score.
 * Used at the bottom of the SPF analysis page.
 */

import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import type { SPFData, DetectedService } from '@/lib/types'

interface StatsBarProps {
  spf: SPFData
  lookupCount: number
  services: DetectedService[]
  onShowLookupBreakdown?: () => void
  onShowServices?: () => void
  onShowValidation?: () => void
}

export default function StatsBar({
  spf,
  lookupCount,
  services,
  onShowLookupBreakdown,
  onShowServices,
  onShowValidation,
}: StatsBarProps) {
  const StatusBadge = () => {
    switch (spf.status) {
      case 'valid':
        return (
          <button
            onClick={onShowValidation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Valid
          </button>
        )
      case 'invalid':
        return (
          <button
            onClick={onShowValidation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            Invalid
          </button>
        )
      case 'missing':
        return (
          <button
            onClick={onShowValidation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            <AlertCircle className="w-4 h-4" />
            Missing
          </button>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing...
          </span>
        )
    }
  }

  const getLookupStatusColor = () => {
    if (lookupCount > 10) return 'text-red-600 bg-red-50'
    if (lookupCount > 8) return 'text-yellow-600 bg-yellow-50'
    return 'text-green-600 bg-green-50'
  }

  const getLookupIcon = () => {
    if (lookupCount > 10) return '⚠️'
    if (lookupCount > 8) return '⚡'
    return '✓'
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status</span>
          <StatusBadge />
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <button
          onClick={onShowLookupBreakdown}
          className="flex items-center gap-2 hover:bg-gray-50 rounded-md px-2 py-1 transition-colors group"
        >
          <span className="text-sm text-gray-600">DNS lookups</span>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-semibold ${getLookupStatusColor()} group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-current transition-all`}
          >
            {getLookupIcon()} {lookupCount}/10
          </span>
        </button>
        <div className="h-6 w-px bg-gray-200" />
        {services.length > 0 && (
          <>
            <button
              onClick={onShowServices}
              className="flex items-center gap-2 hover:bg-gray-50 rounded-md px-2 py-1 transition-colors group"
            >
              <span className="text-sm text-gray-600">Services</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm font-semibold bg-blue-50 text-blue-700 group-hover:ring-2 group-hover:ring-offset-1 group-hover:ring-blue-500 transition-all">
                📧 {services.length}
              </span>
            </button>
            <div className="h-6 w-px bg-gray-200" />
          </>
        )}
        {spf.score !== undefined && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Score</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-semibold bg-gray-100 text-gray-900">
              {spf.score}/5
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
