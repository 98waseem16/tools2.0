'use client'

/**
 * SPF Validation Panel Component
 * Displays validation checks and issues from both API and local validation
 */

import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import type { Check } from '@/lib/types'
import Tooltip from '@/components/ui/Tooltip'

interface SPFValidationPanelProps {
  checks: Check[]
  validations: Check[]
}

interface CheckItemProps {
  check: Check
}

function CheckItem({ check }: CheckItemProps) {
  const getIcon = () => {
    switch (check.status) {
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
      default:
        return <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
    }
  }

  return (
    <div className="flex items-start gap-3 py-2">
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{check.message}</p>
        {check.details && (
          <p className="text-xs text-gray-600 mt-1">{check.details}</p>
        )}
      </div>
    </div>
  )
}

export default function SPFValidationPanel({ checks, validations }: SPFValidationPanelProps) {
  // Combine both check sources
  const allChecks = [...checks, ...validations]

  // Categorize by status
  const failures = allChecks.filter(c => c.status === 'fail')
  const warnings = allChecks.filter(c => c.status === 'warning')
  const passes = allChecks.filter(c => c.status === 'pass')
  const infos = allChecks.filter(c => c.status === 'info')

  // Overall status
  const hasFailures = failures.length > 0
  const hasWarnings = warnings.length > 0
  const hasIssues = hasFailures || hasWarnings

  // Status badge
  let statusBadge = (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
      <CheckCircle className="w-4 h-4" />
      All Checks Passed
    </span>
  )

  if (hasFailures) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
        <XCircle className="w-4 h-4" />
        {failures.length} Critical Issue{failures.length !== 1 ? 's' : ''}
      </span>
    )
  } else if (hasWarnings) {
    statusBadge = (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
        <AlertCircle className="w-4 h-4" />
        {warnings.length} Warning{warnings.length !== 1 ? 's' : ''}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-semibold text-gray-900">Validation Results</h4>
          <Tooltip
            content={
              <div>
                <p><strong>Validation checks</strong> analyze your SPF record for:</p>
                <ul className="mt-1 space-y-1 ml-4 list-disc">
                  <li>Syntax errors and invalid mechanisms</li>
                  <li>RFC compliance issues</li>
                  <li>Deprecated or problematic configurations</li>
                  <li>DNS resolution failures</li>
                </ul>
                <p className="mt-2">Fix any failures or warnings to ensure proper email authentication.</p>
              </div>
            }
            maxWidth={350}
          >
            <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
          </Tooltip>
        </div>
        {statusBadge}
      </div>

      {/* Failures */}
      {failures.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5 text-red-700" />
            <h5 className="text-sm font-semibold text-red-900">
              Critical Issues ({failures.length})
            </h5>
          </div>
          <div className="space-y-1">
            {failures.map(check => (
              <CheckItem key={check.id} check={check} />
            ))}
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-5 h-5 text-yellow-700" />
            <h5 className="text-sm font-semibold text-yellow-900">
              Warnings ({warnings.length})
            </h5>
          </div>
          <div className="space-y-1">
            {warnings.map(check => (
              <CheckItem key={check.id} check={check} />
            ))}
          </div>
        </div>
      )}

      {/* Info Messages */}
      {infos.length > 0 && !hasIssues && (
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-blue-700" />
            <h5 className="text-sm font-semibold text-blue-900">
              Information ({infos.length})
            </h5>
          </div>
          <div className="space-y-1">
            {infos.map(check => (
              <CheckItem key={check.id} check={check} />
            ))}
          </div>
        </div>
      )}

      {/* Success State */}
      {!hasIssues && passes.length > 0 && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-r-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-700" />
            <p className="text-sm font-medium text-green-900">
              ✓ All validation checks passed ({passes.length} checks)
            </p>
          </div>
        </div>
      )}

      {/* No Checks Available */}
      {allChecks.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            No validation checks available
          </p>
        </div>
      )}
    </div>
  )
}
