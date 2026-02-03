/**
 * Loading skeleton components for better perceived performance
 */

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-sendmarc-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-3 bg-sendmarc-gray-200 rounded"></div>
        <div className="h-3 bg-sendmarc-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export function ProtocolCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-sendmarc-gray-200 rounded w-1/3"></div>
        <div className="h-8 w-8 bg-sendmarc-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-sendmarc-gray-200 rounded"></div>
        <div className="h-3 bg-sendmarc-gray-200 rounded w-4/5"></div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      <div className="bg-sendmarc-gray-50 px-6 py-3 border-b border-sendmarc-gray-200">
        <div className="flex gap-4">
          <div className="h-3 bg-sendmarc-gray-300 rounded w-1/4"></div>
          <div className="h-3 bg-sendmarc-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-sendmarc-gray-300 rounded w-1/4"></div>
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-sendmarc-gray-200">
          <div className="flex gap-4">
            <div className="h-3 bg-sendmarc-gray-200 rounded w-1/4"></div>
            <div className="h-3 bg-sendmarc-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-sendmarc-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
      <div className="h-4 bg-sendmarc-gray-200 rounded w-1/3 mb-4"></div>
      <div className="h-6 bg-sendmarc-gray-200 rounded w-full mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-sendmarc-gray-200 rounded"></div>
        <div className="h-3 bg-sendmarc-gray-200 rounded w-5/6"></div>
      </div>
      <div className="flex gap-4 pt-4 border-t border-sendmarc-gray-200">
        <div className="h-3 bg-sendmarc-gray-200 rounded w-1/4"></div>
        <div className="h-3 bg-sendmarc-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero Skeleton */}
      <div className="bg-sendmarc-blue-950 py-20 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="h-10 bg-sendmarc-blue-900 rounded w-2/3 mx-auto"></div>
            <div className="h-6 bg-sendmarc-blue-900 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  )
}
