'use client'

/**
 * Service Popover Component
 * Shows detected service information in a hover popover
 */

import React from 'react'
import * as Popover from '@radix-ui/react-popover'
import type { DetectedService } from '@/lib/types'
import ServicePopoverContent from './ServicePopoverContent'

interface ServicePopoverProps {
  service: DetectedService
  children: React.ReactNode
  lookupCount?: number
}

export default function ServicePopover({ service, children, lookupCount }: ServicePopoverProps) {
  const [open, setOpen] = React.useState(false)
  const timerRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setOpen(true), 200)
  }

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setOpen(false), 100)
  }

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {children}
        </span>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={5}
          align="start"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ServicePopoverContent service={service} lookupCount={lookupCount} />
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
