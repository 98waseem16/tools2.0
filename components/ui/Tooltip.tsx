'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  trigger?: 'hover' | 'click'
  maxWidth?: number
  className?: string
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  trigger = 'hover',
  maxWidth = 300,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isVisible && triggerRef.current && tooltipRef.current && mounted) {
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'bottom':
          top = triggerRect.bottom + 8
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2
          break
        case 'left':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.left - tooltipRect.width - 8
          break
        case 'right':
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2
          left = triggerRect.right + 8
          break
      }

      // Keep tooltip within viewport with padding
      const padding = 16
      const maxLeft = window.innerWidth - tooltipRect.width - padding
      const maxTop = window.innerHeight - tooltipRect.height - padding

      left = Math.max(padding, Math.min(left, maxLeft))
      top = Math.max(padding, Math.min(top, maxTop))

      setTooltipPosition({ top, left })
    }
  }, [isVisible, position, mounted])

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsVisible(true)
    }
  }

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsVisible(false)
    }
  }

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        trigger === 'click' &&
        isVisible &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isVisible, trigger])

  const arrowClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
    left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
    right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
  }

  const tooltipContent = isVisible && mounted ? (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-xl pointer-events-none"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
        maxWidth: `${maxWidth}px`,
        opacity: tooltipPosition.top === 0 && tooltipPosition.left === 0 ? 0 : 1,
        transition: 'opacity 0.15s ease-in-out',
      }}
    >
      <div className="relative z-10">{content}</div>
      <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${arrowClasses[position]}`} />
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        className={`inline-block ${className}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </div>

      {mounted && tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  )
}
