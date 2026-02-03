'use client'

/**
 * SPF Optimization Panel Component
 * Displays comprehensive optimization recommendations
 */

import { Lightbulb, Info } from 'lucide-react'
import type { SPFComplexityAnalysis } from '@/lib/types'
import Tooltip from '@/components/ui/Tooltip'

interface SPFOptimizationPanelProps {
  optimizations: string[]
  complexity?: SPFComplexityAnalysis
}

export default function SPFOptimizationPanel({
  optimizations,
  complexity
}: SPFOptimizationPanelProps) {
  // Merge complexity suggestions with optimizations
  const allRecommendations: string[] = []

  if (complexity) {
    allRecommendations.push(...complexity.suggestions)
  }

  allRecommendations.push(...optimizations)

  // Deduplicate while preserving order
  const uniqueRecommendations = Array.from(new Set(allRecommendations))

  if (uniqueRecommendations.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-green-700" />
          <p className="text-sm font-medium text-green-900">
            Your SPF record is well-optimized. No additional recommendations at this time.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h4 className="text-base font-semibold text-gray-900">Optimization Recommendations</h4>
        <Tooltip
          content={
            <div>
              <p><strong>Optimization recommendations</strong> help improve your SPF record by:</p>
              <ul className="mt-1 space-y-1 ml-4 list-disc">
                <li>Reducing DNS lookup count</li>
                <li>Minimizing record size</li>
                <li>Consolidating mechanisms</li>
                <li>Following best practices</li>
              </ul>
              <p className="mt-2">Implementing these suggestions can improve email deliverability and reduce SPF validation time.</p>
            </div>
          }
          maxWidth={350}
        >
          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
        </Tooltip>
      </div>

      {/* Recommendations List */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3 mb-3">
          <Lightbulb className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="text-sm font-semibold text-blue-900 mb-2">
              {uniqueRecommendations.length} Recommendation{uniqueRecommendations.length !== 1 ? 's' : ''}
            </h5>
            <ul className="space-y-2">
              {uniqueRecommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-900">
                  <span className="text-blue-500 font-semibold flex-shrink-0">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> Always test SPF changes in a staging environment before applying to production.
          Monitor email deliverability metrics after making changes to ensure no negative impact.
        </p>
      </div>
    </div>
  )
}
