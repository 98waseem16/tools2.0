/**
 * Performance Optimization Utilities
 *
 * Functions for improving application performance including
 * caching strategies, debouncing, throttling, and more.
 */

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * React Query Cache Configuration
 * Optimized for email security analysis use case
 */
export const cacheConfig = {
  // DNS records change infrequently, cache for 5 minutes
  dnsLookup: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },

  // DMARC/SPF/DKIM records rarely change, cache aggressively
  emailAuth: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },

  // Blacklist results can change frequently, cache briefly
  blacklist: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  },

  // Static content (articles, etc.) cache indefinitely
  staticContent: {
    staleTime: Infinity,
    cacheTime: Infinity,
  },
}

/**
 * Debounce a function call
 * Useful for search inputs, resize handlers, etc.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle a function call
 * Ensures function is called at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * React hook for debounced values
 * Updates value after delay has passed without changes
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * React hook for throttled callback
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const throttledCallback = useRef<((...args: Parameters<T>) => void) | undefined>(undefined)

  useEffect(() => {
    throttledCallback.current = throttle(callback, delay)
  }, [callback, delay])

  return useCallback(
    (...args: Parameters<T>) => {
      if (throttledCallback.current) {
        throttledCallback.current(...args)
      }
    },
    []
  )
}

/**
 * Detect slow network conditions
 * Returns true if connection is slow (2G/3G)
 */
export function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false
  }

  const connection = (navigator as any).connection

  if (!connection) {
    return false
  }

  // Check for slow connection types
  const slowConnections = ['slow-2g', '2g', '3g']
  return slowConnections.includes(connection.effectiveType)
}

/**
 * Preload an image
 * Useful for preloading icons, logos, etc.
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

/**
 * Preload multiple images
 */
export async function preloadImages(srcs: string[]): Promise<void> {
  await Promise.all(srcs.map(src => preloadImage(src)))
}

/**
 * Measure component render time (development only)
 */
export function measureRenderTime(componentName: string) {
  if (process.env.NODE_ENV !== 'development') {
    return {
      start: () => {},
      end: () => {},
    }
  }

  let startTime: number

  return {
    start: () => {
      startTime = performance.now()
    },
    end: () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      console.log(`[Performance] ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
    },
  }
}

/**
 * React hook to measure component mount/update time
 */
export function usePerformanceMonitor(componentName: string) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      console.log(`[Performance] ${componentName} lifecycle: ${renderTime.toFixed(2)}ms`)
    }
  })
}

/**
 * Check if user prefers reduced data usage
 * Used to serve lighter content on slow connections
 */
export function prefersReducedData(): boolean {
  if (typeof navigator === 'undefined' || !('connection' in navigator)) {
    return false
  }

  const connection = (navigator as any).connection
  return connection?.saveData === true
}

/**
 * Get optimal image quality based on connection
 * Returns a quality value (0-100) for image compression
 */
export function getOptimalImageQuality(): number {
  if (prefersReducedData() || isSlowConnection()) {
    return 60 // Lower quality for slow/data-saver mode
  }
  return 85 // High quality for normal connections
}

/**
 * Lazy load callback when element enters viewport
 * Uses Intersection Observer for efficient lazy loading
 */
export function useLazyLoad(
  callback: () => void,
  options?: IntersectionObserverInit
) {
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback()
            observer.unobserve(entry.target)
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before element enters viewport
        ...options,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [callback, options])

  return elementRef
}

/**
 * Measure Web Vitals (LCP, FID, CLS)
 * For performance monitoring in production
 *
 * Note: Requires web-vitals package to be installed
 * Install with: npm install web-vitals
 *
 * Uncomment the code below after installing web-vitals:
 *
 * export async function measureWebVitals() {
 *   if (typeof window === 'undefined') return
 *
 *   try {
 *     const { onCLS, onFID, onLCP, onFCP, onTTFB } = await import('web-vitals')
 *     onCLS((metric) => console.log('[Web Vitals] CLS:', metric))
 *     onFID((metric) => console.log('[Web Vitals] FID:', metric))
 *     onLCP((metric) => console.log('[Web Vitals] LCP:', metric))
 *     onFCP((metric) => console.log('[Web Vitals] FCP:', metric))
 *     onTTFB((metric) => console.log('[Web Vitals] TTFB:', metric))
 *   } catch {
 *     console.log('[Performance] web-vitals package not installed')
 *   }
 * }
 */
export function measureWebVitals() {
  // Placeholder - install web-vitals package and uncomment implementation above
  if (typeof window !== 'undefined') {
    console.log('[Performance] Web Vitals measurement available after installing web-vitals package')
  }
}

/**
 * Simple in-memory cache for expensive computations
 */
export class MemoryCache<T> {
  private cache: Map<string, { value: T; expiry: number }>

  constructor(private defaultTTL: number = 5 * 60 * 1000) {
    this.cache = new Map()
  }

  set(key: string, value: T, ttl?: number): void {
    const expiry = Date.now() + (ttl ?? this.defaultTTL)
    this.cache.set(key, { value, expiry })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    // Clean expired entries first
    this.cache.forEach((value, key) => {
      if (Date.now() > value.expiry) {
        this.cache.delete(key)
      }
    })
    return this.cache.size
  }
}

/**
 * Batch multiple API requests together
 * Useful for reducing network overhead
 */
export function createRequestBatcher<T, R>(
  batchFn: (items: T[]) => Promise<R[]>,
  maxBatchSize: number = 10,
  maxWaitTime: number = 50
) {
  let queue: Array<{
    item: T
    resolve: (result: R) => void
    reject: (error: Error) => void
  }> = []
  let timeoutId: NodeJS.Timeout | null = null

  async function flush() {
    if (queue.length === 0) return

    const batch = queue.splice(0, maxBatchSize)
    const items = batch.map(({ item }) => item)

    try {
      const results = await batchFn(items)
      batch.forEach(({ resolve }, index) => {
        resolve(results[index])
      })
    } catch (error) {
      batch.forEach(({ reject }) => {
        reject(error as Error)
      })
    }

    // Process remaining items if any
    if (queue.length > 0) {
      flush()
    }
  }

  return function batchedRequest(item: T): Promise<R> {
    return new Promise((resolve, reject) => {
      queue.push({ item, resolve, reject })

      if (queue.length >= maxBatchSize) {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        flush()
      } else if (!timeoutId) {
        timeoutId = setTimeout(() => {
          timeoutId = null
          flush()
        }, maxWaitTime)
      }
    })
  }
}
