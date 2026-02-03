'use client'

/**
 * Shared content for service popover (provider name, category, DNS lookups, note).
 * Used by ServicePopover and by SPFRecordLine include/redirect segments.
 */

import type { DetectedService } from '@/lib/types'

interface ServicePopoverContentProps {
  service: DetectedService
  lookupCount?: number
}

function getCategoryDisplay(category?: string) {
  switch (category) {
    case 'email-provider':
      return 'Email Provider'
    case 'esp':
      return 'Email Service Platform'
    case 'crm':
      return 'CRM System'
    case 'helpdesk':
      return 'Helpdesk / Support'
    case 'transactional':
      return 'Transactional Email'
    case 'other':
      return 'Other Service'
    default:
      return 'Service'
  }
}

function getStatusBadge(service: DetectedService) {
  switch (service.status) {
    case 'good':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-800">
          ✓ Valid
        </span>
      )
    case 'caution':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
          ⚠ Caution
        </span>
      )
    case 'warning':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-red-100 text-red-800">
          ✗ Warning
        </span>
      )
    default:
      return null
  }
}

export default function ServicePopoverContent({ service, lookupCount }: ServicePopoverContentProps) {
  return (
    <>
      <div className="flex items-start gap-3 mb-3">
        {service.logoUrl ? (
          <div className="w-10 h-10 flex-shrink-0 rounded bg-gray-100 p-1.5">
            <img
              src={service.logoUrl}
              alt={`${service.name} logo`}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>
        ) : service.icon && !service.icon.startsWith('/') ? (
          <span className="text-3xl flex-shrink-0">{service.icon}</span>
        ) : null}

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{service.name}</h4>
          <p className="text-xs text-gray-600">{getCategoryDisplay(service.category)}</p>
        </div>

        {getStatusBadge(service)}
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-1">Include mechanism:</p>
        <code className="block text-xs font-mono bg-gray-100 text-gray-900 px-2 py-1 rounded break-all">
          include:{service.include}
        </code>
      </div>

      {lookupCount !== undefined && lookupCount > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{lookupCount} DNS lookup{lookupCount !== 1 ? 's' : ''}</span>{' '}
            (including nested)
          </p>
        </div>
      )}

      {service.note && (
        <div className="text-xs text-gray-700 bg-blue-50 border border-blue-200 rounded px-2 py-1.5">
          {service.note}
        </div>
      )}

      {service.domain && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Domain: <span className="font-mono text-gray-900">{service.domain}</span>
          </p>
        </div>
      )}
    </>
  )
}
