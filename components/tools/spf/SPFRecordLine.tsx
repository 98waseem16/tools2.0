'use client'

/**
 * SPF Record Line - Record-first hero view.
 * Displays the SPF record as a single line of text with hoverable segments.
 * Hover shows provider (for includes), DNS lookup count, or short explanation.
 */

import React, { useState, useRef, useEffect } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { buildRecordSegments } from '@/lib/utils/spf'
import { findServiceForMechanism } from '@/lib/utils/spf-status'
import RecordSegmentTooltip from './RecordSegmentTooltip'
import ServicePopoverContent from './ServicePopoverContent'
import type { SPFParsed, SPFMechanism, DetectedService } from '@/lib/types'

interface SPFRecordLineProps {
  parsed: SPFParsed | null
  services: DetectedService[]
  mechanismLookupMap?: Map<string, number>
}

const ALL_QUALIFIER_EXPLANATIONS: Record<string, string> = {
  '-': '-all = reject unauthorized senders (recommended).',
  '~': '~all = softfail — mark as suspicious but deliver.',
  '?': '?all = neutral — no policy.',
  '+': '+all = allow all (insecure — do not use).',
}

const MECHANISM_EXPLANATIONS: Record<string, string> = {
  ip4: 'Authorizes these IPv4 addresses. No DNS lookups.',
  ip6: 'Authorizes these IPv6 addresses. No DNS lookups.',
  a: 'Uses A record(s) of the domain. 1 DNS lookup.',
  mx: 'Uses MX hosts of the domain. 1 DNS lookup.',
  exists: 'Tests for existence of domain. 1 DNS lookup.',
  ptr: 'Uses PTR record (deprecated). 1 DNS lookup.',
}

function getNestedLookups(mechanism: SPFMechanism, map?: Map<string, number>): number | undefined {
  if (!map || (mechanism.type !== 'include' && mechanism.type !== 'redirect')) return undefined
  return map.get(mechanism.value.toLowerCase())
}

export default function SPFRecordLine({
  parsed,
  services,
  mechanismLookupMap,
}: SPFRecordLineProps) {
  const segments = buildRecordSegments(parsed)
  if (segments.length === 0) return null

  const segmentClassName =
    'rounded px-0.5 -mx-0.5 cursor-help transition-colors hover:bg-slate-200/60 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:ring-offset-1 focus:rounded'

  return (
    <div
      className="font-mono text-[15px] leading-relaxed text-gray-900 whitespace-pre-wrap break-all"
      style={{ wordBreak: 'break-word' }}
    >
      {segments.map((seg, index) => {
        if (seg.isVersion) {
          return (
            <RecordSegmentTooltip key={index} content="SPF version" delayMs={250}>
              <span className={segmentClassName}>{seg.text}</span>
            </RecordSegmentTooltip>
          )
        }

        if (seg.isAll && seg.mechanism) {
          const q = seg.mechanism.qualifier
          const explanation = ALL_QUALIFIER_EXPLANATIONS[q] ?? 'Default policy for non-matching senders.'
          const qualifierHoverColor =
            q === '-' ? 'hover:text-red-700/90' : q === '~' ? 'hover:text-amber-700/90' : ''
          return (
            <RecordSegmentTooltip key={index} content={explanation} delayMs={250}>
              <span className={`${segmentClassName} ${qualifierHoverColor}`}>{seg.text}</span>
            </RecordSegmentTooltip>
          )
        }

        if (seg.mechanism) {
          const m = seg.mechanism
          const nestedLookups = getNestedLookups(m, mechanismLookupMap)

          if (m.type === 'include') {
            const service = findServiceForMechanism(m, services)
            const lookups = nestedLookups ?? 1
            if (service) {
              return (
                <IncludeRedirectPopover
                  key={index}
                  segmentText={seg.text}
                  segmentClassName={segmentClassName}
                  service={service}
                  lookupCount={lookups}
                />
              )
            }
            return (
              <RecordSegmentTooltip
                key={index}
                content={
                  <>
                    Include: {m.value}
                    <br />
                    <span className="text-gray-300">
                      {lookups} DNS lookup{lookups !== 1 ? 's' : ''} (including nested)
                    </span>
                  </>
                }
                delayMs={250}
              >
                <span className={segmentClassName}>{seg.text}</span>
              </RecordSegmentTooltip>
            )
          }

          if (m.type === 'redirect') {
            const lookups = nestedLookups ?? 1
            return (
              <RecordSegmentTooltip
                key={index}
                content={
                  <>
                    Redirects to {m.value}
                    <br />
                    <span className="text-gray-300">
                      {lookups} DNS lookup{lookups !== 1 ? 's' : ''}
                    </span>
                  </>
                }
                delayMs={250}
              >
                <span className={segmentClassName}>{seg.text}</span>
              </RecordSegmentTooltip>
            )
          }

          const explanation = MECHANISM_EXPLANATIONS[m.type]
          if (explanation) {
            return (
              <RecordSegmentTooltip key={index} content={explanation} delayMs={250}>
                <span className={segmentClassName}>{seg.text}</span>
              </RecordSegmentTooltip>
            )
          }
        }

        return <span key={index}>{seg.text}</span>
      })}
    </div>
  )
}

/** Popover for include segment when we have a detected service (same content as ServicePopover) */
function IncludeRedirectPopover({
  segmentText,
  segmentClassName,
  service,
  lookupCount,
}: {
  segmentText: string
  segmentClassName: string
  service: DetectedService
  lookupCount: number
}) {
  const [open, setOpen] = useState(false)
  const enterTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const leaveTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  const handleMouseEnter = () => {
    clearTimeout(leaveTimerRef.current)
    enterTimerRef.current = setTimeout(() => setOpen(true), 200)
  }

  const handleMouseLeave = () => {
    clearTimeout(enterTimerRef.current)
    leaveTimerRef.current = setTimeout(() => setOpen(false), 100)
  }

  useEffect(() => {
    return () => {
      clearTimeout(enterTimerRef.current)
      clearTimeout(leaveTimerRef.current)
    }
  }, [])

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <span
          className={segmentClassName}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          tabIndex={0}
          role="button"
        >
          {segmentText}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
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
