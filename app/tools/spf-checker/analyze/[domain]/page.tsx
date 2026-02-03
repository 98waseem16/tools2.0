/**
 * Standalone SPF Analysis Page - REDESIGNED
 * Modern, interactive SPF checker with record-first design
 */

import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { SPFAnalysisResult } from '@/lib/types'
import SPFAnalysisClient from '@/components/tools/spf/SPFAnalysisClient'
import SPFRecordDisplay from '@/components/tools/spf/SPFRecordDisplay'
import MarcyWidget from '@/components/tools/spf/MarcyWidget'
import StatsBar from '@/components/tools/spf/StatsBar'
import { getBaseUrl } from '@/lib/utils'

interface PageProps {
  params: Promise<{ domain: string }>
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { domain } = await params
  return {
    title: `SPF Record Analysis for ${domain} | Sendmarc Tools`,
    description: `Interactive SPF record analysis for ${domain} with inline validation, service detection, and expandable nested records.`,
  }
}

// Fetch SPF analysis data
async function getSPFAnalysis(domain: string): Promise<SPFAnalysisResult> {
  const baseUrl = getBaseUrl()
  const res = await fetch(`${baseUrl}/api/tools/spf-checker/${domain}`, {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch SPF analysis')
  }

  return res.json()
}

export default async function SPFAnalysisPage({ params }: PageProps) {
  const { domain } = await params
  let data: SPFAnalysisResult

  try {
    data = await getSPFAnalysis(domain)
  } catch (error) {
    notFound()
  }

  const { spf, includeTree, complexity, validations, optimizations } = data

  // Get total lookup count from parsed SPF data (already calculated by API)
  const lookupCount = spf.parsed?.lookupCount || 0

  // Merge checks and validations
  const allChecks = [...(spf.checks || []), ...(validations || [])]

  // Extract per-mechanism lookup counts from includeTree
  const mechanismLookupMap = new Map<string, number>()
  if (includeTree?.children) {
    includeTree.children.forEach((child: any) => {
      mechanismLookupMap.set(child.domain.toLowerCase(), child.lookups)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Client-side Navigation */}
      <SPFAnalysisClient domain={domain} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* SPF record (hero) – first substantive content */}
        <SPFRecordDisplay
          spf={spf}
          services={spf.detectedServices || []}
          checks={allChecks}
          lookupCount={lookupCount}
          mechanismLookupMap={mechanismLookupMap}
        />

        {/* Marcy AI summary – inline blue card, full content and CTA (no sidebar) */}
        <MarcyWidget analysisData={data} />

        {/* Horizontal stats bar at bottom */}
        <StatsBar
          spf={spf}
          lookupCount={lookupCount}
          services={spf.detectedServices || []}
        />

        {/* Related Tools */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Full Domain Analysis */}
            <Link
              href={`/tools/domain-analyzer/analyze/${domain}`}
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    Full Domain Analysis
                  </h4>
                  <p className="text-xs text-gray-600">
                    Analyze SPF, DMARC, DKIM, MX, and more in one view
                  </p>
                </div>
              </div>
            </Link>

            {/* SPF Policy Tester */}
            <Link
              href="/tools/spf-tester"
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    SPF Policy Tester
                  </h4>
                  <p className="text-xs text-gray-600">
                    Test if an email address is authorized by your SPF record
                  </p>
                </div>
              </div>
            </Link>

            {/* Learn About SPF */}
            <Link
              href="/learn/spf"
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 p-2 rounded-lg">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Learn About SPF</h4>
                  <p className="text-xs text-gray-600">
                    Understanding SPF records, syntax, and best practices
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
