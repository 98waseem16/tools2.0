'use client'

/**
 * SPF Record Display - Record-first hero with progressive disclosure.
 * Hero: single minimalist line of record text (SPFRecordLine) with hover tooltips.
 * Copy button; mechanism breakdown and raw record in a collapsible section.
 */

import { useState, useEffect } from 'react'
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react'
import * as Collapsible from '@radix-ui/react-collapsible'
import SPFRecordLine from './SPFRecordLine'
import MechanismLine from './MechanismLine'
import type { SPFData, DetectedService, Check as ValidationCheck } from '@/lib/types'

interface SPFRecordDisplayProps {
  spf: SPFData
  services: DetectedService[]
  checks: ValidationCheck[]
  lookupCount: number
  mechanismLookupMap?: Map<string, number>
}

export default function SPFRecordDisplay({
  spf,
  services,
  checks,
  lookupCount,
  mechanismLookupMap: initialLookupMap,
}: SPFRecordDisplayProps) {
  const [copied, setCopied] = useState(false)
  const [breakdownOpen, setBreakdownOpen] = useState(false)
  const [showRaw, setShowRaw] = useState(false)
  const [nestedLookupCounts, setNestedLookupCounts] = useState<Map<string, number>>(
    initialLookupMap || new Map()
  )

  // Fetch nested lookup counts for all includes on mount (for SPFRecordLine and MechanismLine)
  useEffect(() => {
    const fetchNestedLookups = async () => {
      if (!spf.parsed?.mechanisms) return

      const expandableMechanisms = spf.parsed.mechanisms.filter(
        (m) => m.type === 'include' || m.type === 'redirect'
      )
      if (expandableMechanisms.length === 0) return

      try {
        const results = await Promise.allSettled(
          expandableMechanisms.map(async (mechanism) => {
            const response = await fetch(`/api/tools/spf-checker/${mechanism.value}`)
            const data = await response.json()
            return {
              domain: mechanism.value.toLowerCase(),
              lookups: data.spf?.parsed?.lookupCount || 1,
            }
          })
        )

        const lookupMap = new Map(nestedLookupCounts)
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            lookupMap.set(result.value.domain, result.value.lookups)
          }
        })
        setNestedLookupCounts(lookupMap)
      } catch (error) {
        console.error('Failed to fetch nested lookups:', error)
      }
    }

    fetchNestedLookups()
  }, [spf.parsed?.mechanisms])

  const handleCopy = async () => {
    if (!spf.record) return
    try {
      await navigator.clipboard.writeText(spf.record)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!spf.parsed?.mechanisms?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No SPF record mechanisms found</p>
        </div>
      </div>
    )
  }

  const recordSize = spf.record ? new Blob([spf.record]).size : 0
  const isOversized = recordSize > 255

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      {/* Hero: minimalist record line */}
      <div className="px-6 py-5 bg-slate-50/80 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              SPF record
            </p>
            <SPFRecordLine
              parsed={spf.parsed}
              services={services}
              mechanismLookupMap={nestedLookupCounts}
            />
            {isOversized && (
              <p className="mt-2 text-xs text-red-600 font-medium">
                Record exceeds 255-byte UDP limit ({recordSize} bytes)
              </p>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 transition-colors"
            aria-label="Copy record"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progressive disclosure: SPF tree */}
      <Collapsible.Root open={breakdownOpen} onOpenChange={setBreakdownOpen}>
        <Collapsible.Trigger asChild>
          <button
            type="button"
            className="w-full px-6 py-4 flex items-center gap-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-t border-gray-200 transition-colors"
          >
            {breakdownOpen ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
            SPF tree
          </button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-4">
            {/* Per-mechanism rows (existing MechanismLine list) */}
            <div className="space-y-2">
              {spf.parsed.mechanisms.map((mechanism, index) => {
                const actualLookups = nestedLookupCounts.get(mechanism.value.toLowerCase())
                return (
                  <MechanismLine
                    key={index}
                    mechanism={mechanism}
                    checks={checks}
                    lookupCount={lookupCount}
                    services={services}
                    actualNestedLookups={actualLookups}
                  />
                )
              })}
            </div>

            {/* View raw record (optional, in breakdown) */}
            <div className="pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowRaw(!showRaw)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                {showRaw ? 'Hide raw record' : 'View raw record'}
              </button>
              {showRaw && spf.record && (
                <pre className="mt-2 p-4 bg-gray-900 text-gray-100 text-xs font-mono rounded-lg overflow-x-auto whitespace-pre-wrap break-all">
                  {spf.record}
                </pre>
              )}
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  )
}
