import Link from 'next/link'
import { Container } from '@/components/layout'
import Button from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50 flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-sendmarc-error-light rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-sendmarc-error-DEFAULT" />
          </div>
          <h1 className="text-3xl font-bold text-sendmarc-gray-900 mb-4">
            Invalid Domain
          </h1>
          <p className="text-lg text-sendmarc-gray-600 mb-8">
            The domain you entered is not valid. Please check the domain and try again.
          </p>
          <Link href="/">
            <Button variant="primary" size="lg">
              Return Home
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
