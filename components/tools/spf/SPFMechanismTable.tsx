'use client'

/**
 * SPF Mechanism Table Component
 * Displays detailed breakdown of SPF mechanisms with expandable includes
 */

import { useState } from 'react'
import { ChevronRight, Info, Loader2 } from 'lucide-react'
import type { SPFMechanism } from '@/lib/types'
import { getMechanismTypeName, getMechanismIcon, formatQualifier } from '@/lib/utils/spf'
import Tooltip from '@/components/ui/Tooltip'

interface SPFMechanismTableProps {
  mechanisms: SPFMechanism[]
  domain: string
}

interface NestedMechanisms {
  [domain: string]: SPFMechanism[]
}

export default function SPFMechanismTable({ mechanisms, domain }: SPFMechanismTableProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState<Set<string>>(new Set())
  const [nestedMechanisms, setNestedMechanisms] = useState<NestedMechanisms>({})

  if (mechanisms.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No mechanisms found in SPF record
      </div>
    )
  }

  const fetchNestedSPF = async (includeDomain: string) => {
    if (nestedMechanisms[includeDomain]) {
      return // Already fetched
    }

    setLoading(prev => new Set(prev).add(includeDomain))

    try {
      const response = await fetch(`/api/tools/spf-checker/${includeDomain}`)
      const data = await response.json()

      setNestedMechanisms(prev => ({
        ...prev,
        [includeDomain]: data.spf.parsed?.mechanisms || []
      }))
    } catch (error) {
      console.error(`Failed to fetch SPF for ${includeDomain}:`, error)
      setNestedMechanisms(prev => ({
        ...prev,
        [includeDomain]: []
      }))
    } finally {
      setLoading(prev => {
        const next = new Set(prev)
        next.delete(includeDomain)
        return next
      })
    }
  }

  const handleToggleExpand = async (mechanism: SPFMechanism) => {
    if (mechanism.type !== 'include') return

    const includeDomain = mechanism.value
    const isExpanded = expanded.has(includeDomain)

    if (isExpanded) {
      // Collapse
      setExpanded(prev => {
        const next = new Set(prev)
        next.delete(includeDomain)
        return next
      })
    } else {
      // Expand and fetch if needed
      if (!nestedMechanisms[includeDomain]) {
        await fetchNestedSPF(includeDomain)
      }
      setExpanded(prev => new Set(prev).add(includeDomain))
    }
  }

  const getQualifierTooltip = (qualifier: string) => {
    const tooltips: { [key: string]: string } = {
      '+': 'Pass: Accept mail from this source',
      '-': 'Fail: Reject mail from this source',
      '~': 'SoftFail: Accept but mark as suspicious',
      '?': 'Neutral: Neither permit nor deny',
    }
    return tooltips[qualifier] || 'Unknown qualifier'
  }

  const getMechanismTooltip = (type: string) => {
    const tooltips: { [key: string]: string } = {
      'include': 'Delegates SPF check to another domain',
      'a': 'Authorizes IP addresses from the A record',
      'mx': 'Authorizes IP addresses from the MX record',
      'ip4': 'Directly authorizes an IPv4 address or range',
      'ip6': 'Directly authorizes an IPv6 address or range',
      'all': 'Default policy for sources not matched by other mechanisms',
      'exists': 'Checks if a domain name exists',
      'ptr': 'Deprecated: Checks reverse DNS (not recommended)',
      'redirect': 'Replaces the entire SPF record with another domain\'s record',
    }
    return tooltips[type] || 'SPF mechanism'
  }

  const renderMechanismRow = (mechanism: SPFMechanism, index: number, depth: number = 0, parentDomain: string = domain) => {
    const icon = getMechanismIcon(mechanism.type)
    const typeName = getMechanismTypeName(mechanism.type)
    const qualifierName = formatQualifier(mechanism.qualifier)
    const isInclude = mechanism.type === 'include'
    const includeDomain = mechanism.value
    const isExpanded = expanded.has(includeDomain)
    const isLoading = loading.has(includeDomain)
    const nested = nestedMechanisms[includeDomain] || []
    const rowKey = `${parentDomain}-${mechanism.type}-${mechanism.value}-${index}-${depth}`

    // Determine status based on mechanism
    let statusClass = 'text-green-600'
    let statusIcon = '✓'
    let statusText = 'Valid'

    if (mechanism.type === 'all' && mechanism.qualifier !== '-') {
      statusClass = 'text-yellow-600'
      statusIcon = '⚠'
      statusText = 'Use -all'
    } else if (mechanism.type === 'ptr') {
      statusClass = 'text-yellow-600'
      statusIcon = '⚠'
      statusText = 'Deprecated'
    }

    // Qualifier color
    let qualifierClass = 'text-gray-900'
    if (mechanism.qualifier === '-') {
      qualifierClass = 'text-red-600 font-semibold'
    } else if (mechanism.qualifier === '~') {
      qualifierClass = 'text-yellow-600 font-semibold'
    } else if (mechanism.qualifier === '?') {
      qualifierClass = 'text-gray-500'
    }

    const indentClass = depth > 0 ? `pl-${depth * 8}` : ''

    return (
      <>
        <tr
          key={rowKey}
          className={`hover:bg-gray-50 ${isInclude ? 'cursor-pointer' : ''} ${depth > 0 ? 'bg-gray-50' : ''}`}
          onClick={() => isInclude && handleToggleExpand(mechanism)}
        >
          <td className={`px-6 py-4 whitespace-nowrap ${indentClass}`}>
            <div className="flex items-center gap-2">
              {isInclude && (
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
              )}
              <span className="text-xl">{icon}</span>
              <Tooltip content={getMechanismTooltip(mechanism.type)}>
                <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                  {typeName}
                  <Info className="w-3 h-3 text-gray-400" />
                </span>
              </Tooltip>
            </div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <Tooltip content={getQualifierTooltip(mechanism.qualifier)}>
              <span className={`text-sm ${qualifierClass} flex items-center gap-1`}>
                {mechanism.qualifier} ({qualifierName})
                <Info className="w-3 h-3 text-gray-400" />
              </span>
            </Tooltip>
          </td>
          <td className="px-6 py-4">
            <span className="text-sm text-gray-900 font-mono break-all">
              {mechanism.value || '—'}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`text-sm font-medium ${statusClass}`}>
              {statusIcon} {statusText}
            </span>
          </td>
        </tr>

        {isInclude && isExpanded && (
          <tr key={`${rowKey}-nested`} className="bg-blue-50">
            <td colSpan={4} className="px-6 py-4">
              {isLoading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading nested mechanisms from {includeDomain}...
                </div>
              ) : nested.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">
                    Nested mechanisms from {includeDomain}:
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <tbody>
                        {nested.map((nestedMech, nestedIndex) => renderMechanismRow(nestedMech, nestedIndex, depth + 1, includeDomain))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-600">
                  No mechanisms found in {includeDomain} or failed to load
                </div>
              )}
            </td>
          </tr>
        )}
      </>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qualifier
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {mechanisms.map((mechanism, index) => renderMechanismRow(mechanism, index, 0))}
        </tbody>
      </table>
    </div>
  )
}
