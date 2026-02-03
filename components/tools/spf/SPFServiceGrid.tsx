'use client'

/**
 * SPF Service Grid Component
 * Display detected email services from SPF includes
 */

import type { DetectedService } from '@/lib/types'

interface SPFServiceGridProps {
  services: DetectedService[]
}

export default function SPFServiceGrid({ services }: SPFServiceGridProps) {
  if (services.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No services detected from SPF includes</p>
        <p className="text-sm text-gray-400 mt-1">
          Services are identified from include: mechanisms
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((service, index) => {
        // Determine status styling
        let statusClass = 'bg-green-100 text-green-800'
        let statusIcon = '✓'

        if (service.status === 'caution') {
          statusClass = 'bg-yellow-100 text-yellow-800'
          statusIcon = '⚠'
        } else if (service.status === 'warning') {
          statusClass = 'bg-red-100 text-red-800'
          statusIcon = '✗'
        }

        // Category badge color
        let categoryClass = 'bg-blue-100 text-blue-800'
        if (service.category === 'esp') {
          categoryClass = 'bg-purple-100 text-purple-800'
        } else if (service.category === 'crm') {
          categoryClass = 'bg-pink-100 text-pink-800'
        } else if (service.category === 'helpdesk') {
          categoryClass = 'bg-indigo-100 text-indigo-800'
        } else if (service.category === 'transactional') {
          categoryClass = 'bg-cyan-100 text-cyan-800'
        }

        return (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {/* Service Icon and Name */}
                <div className="flex items-center gap-3 mb-2">
                  {/* Show dynamic logo if available */}
                  {service.logoUrl ? (
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <img
                        src={service.logoUrl}
                        alt={`${service.name} logo`}
                        className="w-full h-full object-contain rounded"
                        onError={(e) => {
                          // Hide on error, rely on service name
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : service.icon && !service.icon.startsWith('/') ? (
                    <span className="text-2xl flex-shrink-0">{service.icon}</span>
                  ) : null}

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {service.name}
                    </h4>
                    {/* Optional: Show logo source in development mode */}
                    {service.logoSource && process.env.NODE_ENV === 'development' && (
                      <span className="text-xs text-gray-400">
                        ({service.logoSource})
                      </span>
                    )}
                  </div>
                </div>

                {/* Include Mechanism */}
                <p className="text-xs font-mono text-gray-600 mb-2 break-all">
                  include:{service.include}
                </p>

                {/* Category Badge */}
                {service.category && (
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${categoryClass}`}>
                    {service.category.replace('-', ' ').toUpperCase()}
                  </span>
                )}

                {/* Note */}
                {service.note && (
                  <p className="mt-2 text-xs text-gray-500">{service.note}</p>
                )}
              </div>

              {/* Status Badge */}
              <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded ${statusClass}`}>
                {statusIcon}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
