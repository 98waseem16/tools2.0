'use client'

import { Component, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import Button from './Button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-sendmarc-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-sendmarc-error-light rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-sendmarc-error-DEFAULT" />
            </div>
            <h2 className="text-2xl font-bold text-sendmarc-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-sendmarc-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                fullWidth
              >
                Refresh Page
              </Button>
              <Button
                variant="secondary"
                onClick={() => (window.location.href = '/')}
                fullWidth
              >
                Go to Homepage
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-sendmarc-gray-600 cursor-pointer">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-sendmarc-error-dark bg-sendmarc-error-light p-3 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
