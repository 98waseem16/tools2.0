'use client'

/**
 * Marcy AI summary: inline blue card with full summary and CTA.
 * Fetches and streams summary on mount; no slide-out, all content visible.
 */

import { useState, useEffect, useCallback } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { SaveButton } from '@/components/ui/save-button'
import type { SPFAnalysisResult } from '@/lib/types'

interface MarcyWidgetProps {
  analysisData: SPFAnalysisResult
  specialistCtaHref?: string
  specialistCtaLabel?: string
}

export default function MarcyWidget({
  analysisData,
  specialistCtaHref = 'https://sendmarc.com/contact',
  specialistCtaLabel = 'Talk to a specialist',
}: MarcyWidgetProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState<string | null>(null)

  const fetchMarcySummary = useCallback(async () => {
    const domain = analysisData.domain
    if (!domain) return
    setSummaryError(null)
    setSummaryLoading(true)
    setSummary('')
    try {
      const res = await fetch('/api/marcy/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setSummaryError(data.error || 'Failed to load AI summary')
        setSummary(null)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) {
        setSummaryError('Failed to read response')
        setSummary(null)
        return
      }
      const decoder = new TextDecoder()
      let accumulated = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setSummary(accumulated)
      }
    } catch (err) {
      setSummaryError('Failed to load AI summary')
      setSummary(null)
    } finally {
      setSummaryLoading(false)
    }
  }, [analysisData.domain])

  useEffect(() => {
    fetchMarcySummary()
  }, [fetchMarcySummary])

  return (
    <div className="rounded-xl border-2 border-sendmarc-blue-200 bg-sendmarc-blue-50/50 overflow-hidden">
      <div className="p-6 flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden bg-white ring-2 ring-sendmarc-blue-200 flex items-center justify-center">
          <img
            src="/marcy-avatar.png"
            alt=""
            className="w-full h-full object-cover object-top"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-sendmarc-blue-700 uppercase tracking-wide mb-2">
            Marcy&apos;s analysis
          </p>
          <div className="text-sm text-sendmarc-blue-950 leading-relaxed">
            {summaryLoading && !summary && (
              <div className="flex items-center gap-2 text-sendmarc-blue-700">
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>Getting AI summary…</span>
              </div>
            )}
            {summaryError && !summaryLoading && (
              <div className="space-y-2">
                <p className="text-red-600">{summaryError}</p>
                <button
                  type="button"
                  onClick={fetchMarcySummary}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-sendmarc-blue-700 hover:text-sendmarc-blue-800"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try again
                </button>
              </div>
            )}
            {summary && (
              <div className="marcy-summary text-sendmarc-blue-950 [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_h1]:font-semibold [&_h2]:font-semibold [&_h3]:font-semibold [&_h1]:mt-2 [&_h2]:mt-2 [&_h3]:mt-1.5 [&_h1]:mb-1 [&_h2]:mb-1 [&_h3]:mb-1 [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:ml-4 [&_strong]:font-semibold">
                <ReactMarkdown>{summary}</ReactMarkdown>
                {summaryLoading && (
                  <span className="inline-block w-2 h-4 ml-0.5 bg-sendmarc-blue-400 animate-pulse align-middle" aria-hidden />
                )}
              </div>
            )}
          </div>
          <div className="mt-4">
            <SaveButton
              text={{
                idle: specialistCtaLabel,
                saving: 'Opening…',
                saved: 'Opened!',
              }}
              onSave={async () => {
                window.open(specialistCtaHref, '_blank', 'noopener,noreferrer')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
