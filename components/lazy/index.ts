/**
 * Lazy Loading Components
 *
 * This file exports lazily-loaded versions of heavy components
 * to improve initial page load performance and reduce bundle size.
 *
 * NOTE: This file is prepared for future use when report sections
 * and other heavy components are implemented. Currently includes
 * only existing standalone tool components.
 */

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'
import React from 'react'

// Loading fallback components
import {
  CardSkeleton,
} from '@/components/ui/LoadingSkeleton'

// Create loading component wrapper
const LoadingCard = () => React.createElement(CardSkeleton)

/**
 * Lazy load standalone tools (heavy interactive components)
 * These are client-side only components with form interactions
 */
export const LazyBlacklistChecker = dynamic(
  () => import('@/components/tools/BlacklistChecker'),
  {
    loading: LoadingCard,
    ssr: false, // Client-side only
  }
)

export const LazyHeaderAnalyzer = dynamic(
  () => import('@/components/tools/HeaderAnalyzer'),
  {
    loading: LoadingCard,
    ssr: false,
  }
)

export const LazySPFPolicyTester = dynamic(
  () => import('@/components/tools/SPFPolicyTester'),
  {
    loading: LoadingCard,
    ssr: false,
  }
)

export const LazyCIDRCalculator = dynamic(
  () => import('@/components/tools/CIDRCalculator'),
  {
    loading: LoadingCard,
    ssr: false,
  }
)

export const LazyDKIMGenerator = dynamic(
  () => import('@/components/tools/DKIMGenerator'),
  {
    loading: LoadingCard,
    ssr: false,
  }
)

/**
 * Type-safe lazy loading helper
 * Wraps dynamic import with proper types
 *
 * Usage:
 * const LazyComponent = lazyLoad(
 *   () => import('./HeavyComponent'),
 *   { loading: () => <Skeleton />, ssr: false }
 * )
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: () => React.ReactElement
    ssr?: boolean
  }
): T {
  return dynamic(importFn, {
    loading: options?.loading,
    ssr: options?.ssr ?? true,
  }) as unknown as T
}

/**
 * Future components to lazy load when implemented:
 *
 * Report Sections:
 * - LazyDMARCSection
 * - LazySPFSection
 * - LazyDKIMSection
 * - LazyMXSection
 * - LazyMTASTSSection
 * - LazyTLSRPTSection
 * - LazyBIMISection
 * - LazyDNSSection
 * - LazyBlacklistSection
 *
 * Visualizations:
 * - LazyScoreCircle
 * - LazyCharts (if using recharts)
 */
