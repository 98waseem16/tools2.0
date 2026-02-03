'use client'

/**
 * Mechanism Line Component
 * Displays a single SPF mechanism with status indicator and interactions
 */

import { useState, useEffect } from 'react'
import * as Collapsible from '@radix-ui/react-collapsible'
import { ChevronDown, ChevronRight } from 'lucide-react'
import ServicePopover from './ServicePopover'
import {
  getMechanismStatus,
  getStatusColorClasses,
  getStatusIcon,
  isExpandableMechanism,
  findServiceForMechanism,
} from '@/lib/utils/spf-status'
import type { SPFMechanism, Check, DetectedService } from '@/lib/types'

interface MechanismLineProps {
  mechanism: SPFMechanism
  checks: Check[]
  lookupCount: number
  services: DetectedService[]
  level?: number
  onExpand?: (domain: string) => void
  actualNestedLookups?: number // Pre-calculated lookup count from parent fetch
}

export default function MechanismLine({
  mechanism,
  checks,
  lookupCount,
  services,
  level = 0,
  onExpand,
  actualNestedLookups,
}: MechanismLineProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoadingNested, setIsLoadingNested] = useState(false)
  const [nestedMechanisms, setNestedMechanisms] = useState<SPFMechanism[]>([])
  const [nestedLookupCount, setNestedLookupCount] = useState<number | null>(null)

  // Update lookup count when prop changes
  useEffect(() => {
    if (actualNestedLookups !== undefined) {
      setNestedLookupCount(actualNestedLookups)
    }
  }, [actualNestedLookups])

  const status = getMechanismStatus(mechanism, checks, lookupCount)
  const colors = getStatusColorClasses(status)
  const icon = getStatusIcon(status)
  const canExpand = isExpandableMechanism(mechanism)
  const service = findServiceForMechanism(mechanism, services)

  // Format mechanism type display
  const formatType = (type: string) => {
    return type.replace('_', ' ')
  }

  // Format qualifier display
  const getQualifierDisplay = () => {
    switch (mechanism.qualifier) {
      case '+':
        return <span className="text-green-600">+</span>
      case '-':
        return <span className="text-red-600">-</span>
      case '~':
        return <span className="text-yellow-600">~</span>
      case '?':
        return <span className="text-gray-500">?</span>
      default:
        return null
    }
  }

  // Handle expansion (fetch nested SPF record)
  const handleExpand = async () => {
    if (!canExpand) return

    if (!isExpanded && nestedMechanisms.length === 0) {
      setIsLoadingNested(true)
      try {
        // Fetch nested SPF record
        const response = await fetch(`/api/tools/spf-checker/${mechanism.value}`)
        const data = await response.json()

        if (data.spf?.parsed?.mechanisms) {
          setNestedMechanisms(data.spf.parsed.mechanisms)
        }

        // Store the total lookup count for this include
        if (data.spf?.parsed?.lookupCount) {
          setNestedLookupCount(data.spf.parsed.lookupCount)
        }
      } catch (error) {
        console.error('Failed to fetch nested SPF:', error)
      } finally {
        setIsLoadingNested(false)
      }
    }

    setIsExpanded(!isExpanded)
    if (onExpand) {
      onExpand(mechanism.value)
    }
  }

  // Indentation for nested levels
  const indentClass = level > 0 ? `ml-${level * 6}` : ''

  return (
    <div className={indentClass}>
      <Collapsible.Root open={isExpanded} onOpenChange={handleExpand}>
        {/* Main mechanism line */}
        <div
          className={`flex items-center gap-2 py-2 px-3 rounded-md transition-colors ${colors.bg} border ${colors.border} hover:shadow-sm`}
        >
          {/* Status icon */}
          <span className={`text-lg font-bold ${colors.icon} flex-shrink-0`}>{icon}</span>

          {/* Qualifier */}
          {getQualifierDisplay() && (
            <span className="text-sm font-mono font-bold flex-shrink-0">
              {getQualifierDisplay()}
            </span>
          )}

          {/* Type */}
          <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text} flex-shrink-0`}>
            {formatType(mechanism.type)}
          </span>

          {/* Value (with service popover for include mechanisms) */}
          <div className="flex-1 min-w-0 flex items-center gap-2">
            {service ? (
              <ServicePopover service={service}>
                <span
                  className="text-sm font-mono hover:underline cursor-help truncate"
                  onMouseEnter={(e) => e.stopPropagation()}
                >
                  {mechanism.value}
                </span>
              </ServicePopover>
            ) : (
              <span className="text-sm font-mono truncate">{mechanism.value}</span>
            )}

            {/* Service logo (inline) */}
            {service?.logoUrl && (
              <div className="w-4 h-4 flex-shrink-0">
                <img
                  src={service.logoUrl}
                  alt=""
                  className="w-full h-full object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* DNS Lookup badge for include/redirect/a/mx mechanisms */}
          {(mechanism.type === 'include' ||
            mechanism.type === 'redirect' ||
            mechanism.type === 'a' ||
            mechanism.type === 'mx') && (
            <div className="flex-shrink-0">
              <span
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                title={
                  nestedLookupCount !== null
                    ? `This include uses ${nestedLookupCount} total DNS lookups (including nested)`
                    : 'This mechanism uses 1 DNS lookup'
                }
              >
                {nestedLookupCount !== null ? `+${nestedLookupCount}` : '+1'} DNS
              </span>
            </div>
          )}

          {/* Expand button for include/redirect */}
          {canExpand && (
            <Collapsible.Trigger asChild>
              <button
                className={`flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors ${colors.text}`}
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isLoadingNested ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
                ) : isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            </Collapsible.Trigger>
          )}
        </div>

        {/* Nested mechanisms (when expanded) */}
        {canExpand && (
          <Collapsible.Content className="mt-2 ml-6 space-y-2">
            {nestedMechanisms.length > 0 ? (
              <>
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <span>↳ Nested SPF Record</span>
                  {nestedLookupCount !== null && nestedLookupCount > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700">
                      {nestedLookupCount} total DNS lookups
                    </span>
                  )}
                </div>
                {nestedMechanisms.map((nestedMech, index) => (
                  <MechanismLine
                    key={index}
                    mechanism={nestedMech}
                    checks={checks}
                    lookupCount={lookupCount}
                    services={services}
                    level={level + 1}
                    onExpand={onExpand}
                  />
                ))}
              </>
            ) : (
              !isLoadingNested && (
                <div className="text-xs text-gray-500 italic">No mechanisms found</div>
              )
            )}
          </Collapsible.Content>
        )}
      </Collapsible.Root>
    </div>
  )
}
