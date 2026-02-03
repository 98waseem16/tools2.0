import { Container } from '@/components/layout'

export default function Loading() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero Section */}
      <section className="bg-sendmarc-blue-950 py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-6 animate-pulse" />
            <div className="h-12 bg-white/20 rounded animate-pulse" />
          </div>
        </Container>
      </section>

      {/* Loading Content */}
      <section className="py-12">
        <Container>
          <div className="max-w-5xl mx-auto">
            {/* Executive Summary Skeleton */}
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="w-32 h-32 bg-sendmarc-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-4">
                  <div className="h-8 bg-sendmarc-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-6 bg-sendmarc-gray-200 rounded animate-pulse" />
                  <div className="h-6 bg-sendmarc-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Protocol Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-soft p-6">
                  <div className="h-6 bg-sendmarc-gray-200 rounded w-32 mb-4 animate-pulse" />
                  <div className="h-4 bg-sendmarc-gray-200 rounded w-24 mb-4 animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 bg-sendmarc-gray-200 rounded animate-pulse" />
                    <div className="h-4 bg-sendmarc-gray-200 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-sendmarc-gray-200 rounded w-4/6 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>

            {/* Loading Message */}
            <div className="mt-8 text-center">
              <p className="text-sendmarc-gray-600">
                Analyzing domain... This may take a few seconds.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
