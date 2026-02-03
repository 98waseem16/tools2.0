'use client'

/**
 * Tooltip for SPF record segments with delay and keyboard focus support.
 * Shows content after 250ms hover; stays open while pointer is over trigger or tooltip.
 */

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface RecordSegmentTooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom'
  delayMs?: number
  className?: string
}

export default function RecordSegmentTooltip({
  content,
  children,
  position = 'top',
  delayMs = 250,
  className = '',
}: RecordSegmentTooltipProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const enterTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const leaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open && triggerRef.current && tooltipRef.current && mounted) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const padding = 8

      let top: number
      let left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2

      if (position === 'top') {
        top = triggerRect.top - tooltipRect.height - padding
      } else {
        top = triggerRect.bottom + padding
      }

      const maxLeft = window.innerWidth - tooltipRect.width - 16
      const maxTop = window.innerHeight - tooltipRect.height - 16
      left = Math.max(16, Math.min(left, maxLeft))
      top = Math.max(16, Math.min(top, maxTop))

      setTooltipPosition({ top, left })
    }
  }, [open, position, mounted])

  const handleMouseEnter = () => {
    clearTimeout(leaveTimerRef.current)
    enterTimerRef.current = setTimeout(() => setOpen(true), delayMs)
  }

  const handleMouseLeave = () => {
    clearTimeout(enterTimerRef.current)
    leaveTimerRef.current = setTimeout(() => setOpen(false), 100)
  }

  const handleFocus = () => {
    clearTimeout(leaveTimerRef.current)
    setOpen(true)
  }

  const handleBlur = () => {
    leaveTimerRef.current = setTimeout(() => setOpen(false), 100)
  }

  useEffect(() => {
    return () => {
      clearTimeout(enterTimerRef.current)
      clearTimeout(leaveTimerRef.current)
    }
  }, [])

  const tooltipEl =
    open && mounted ? (
      <div
        ref={tooltipRef}
        className="fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl max-w-[280px]"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
          opacity: tooltipPosition.top === 0 && tooltipPosition.left === 0 ? 0 : 1,
        }}
        role="tooltip"
      >
        {content}
      </div>
    ) : null

  return (
    <>
      <span
        ref={triggerRef}
        className={`inline ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
        role="button"
      >
        {children}
      </span>
      {mounted && tooltipEl && createPortal(tooltipEl, document.body)}
    </>
  )
}
