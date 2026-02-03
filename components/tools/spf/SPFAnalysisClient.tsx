'use client'

/**
 * Client-side wrapper for SPF Analysis Page - REDESIGNED
 * Compact header with domain and re-analysis input
 */

import DomainInput from '@/components/domain-input/DomainInput'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SPFAnalysisClientProps {
  domain: string
}

export default function SPFAnalysisClient({ domain }: SPFAnalysisClientProps) {
  const handleReanalyze = (newDomain: string) => {
    window.location.href = `/tools/spf-checker/analyze/${newDomain}`
  }

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left side: Back link + Domain */}
          <div className="flex items-center gap-4">
            <Link
              href="/tools/spf-checker"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SPF Analysis</h1>
              <p className="text-sm text-gray-600">
                <span className="font-mono font-semibold">{domain}</span>
              </p>
            </div>
          </div>

          {/* Right side: Re-analyze input */}
          <div className="w-full max-w-xs">
            <DomainInput
              placeholder="Analyze another domain..."
              onSubmit={handleReanalyze}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
