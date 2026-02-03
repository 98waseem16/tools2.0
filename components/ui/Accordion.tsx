'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import StatusIcon from './StatusIcon'
import type { CheckStatus } from '@/lib/types'

export interface AccordionProps {
  title: string
  subtitle?: string
  status?: CheckStatus
  defaultOpen?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export default function Accordion({
  title,
  subtitle,
  status,
  defaultOpen = false,
  children,
  actions,
  className = '',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={`border-b border-white/10 ${className}`}>
      <div
        className="expandable-header"
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-1">
          {status && <StatusIcon status={status} />}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && (
              <p className="text-sm text-white/70 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {actions && (
            <div onClick={(e) => e.stopPropagation()}>{actions}</div>
          )}
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      <div
        className={`expandable-content ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-6">{children}</div>
      </div>
    </div>
  )
}
