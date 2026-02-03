'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Container } from '@/components/layout'
import Button from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-sendmarc-gray-50 flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-sendmarc-error-light rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-sendmarc-error-DEFAULT" />
          </div>
          <h2 className="text-2xl font-bold text-sendmarc-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sendmarc-gray-600 mb-6">
            We encountered an unexpected error. Please try again.
          </p>
          <div className="space-y-3">
            <Button onClick={reset} fullWidth>
              Try Again
            </Button>
            <Button
              variant="secondary"
              onClick={() => (window.location.href = '/')}
              fullWidth
            >
              Go to Homepage
            </Button>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-sendmarc-gray-600 cursor-pointer">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-sendmarc-error-dark bg-sendmarc-error-light p-3 rounded overflow-auto max-h-40">
                {error.message}
              </pre>
            </details>
          )}
        </div>
      </Container>
    </div>
  )
}
