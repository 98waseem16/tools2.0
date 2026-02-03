import { FileQuestion } from 'lucide-react'
import Link from 'next/link'
import { Container } from '@/components/layout'
import Button from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50 flex items-center justify-center">
      <Container>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-sendmarc-info-light rounded-full flex items-center justify-center mx-auto mb-4">
            <FileQuestion className="w-8 h-8 text-sendmarc-info-DEFAULT" />
          </div>
          <h1 className="text-6xl font-bold text-sendmarc-gray-900 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-sendmarc-gray-900 mb-2">Page Not Found</h2>
          <p className="text-sendmarc-gray-600 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="space-y-3">
            <Link href="/">
              <Button fullWidth>Go to Homepage</Button>
            </Link>
            <Link href="/tools/dmarc-checker">
              <Button variant="secondary" fullWidth>
                Check DMARC Record
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  )
}
