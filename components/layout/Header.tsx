import Link from 'next/link'
import Container from './Container'
import Navigation from './Navigation'

export default function Header() {
  return (
    <header className="bg-white border-b border-sendmarc-gray-200 sticky top-0 z-40">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/sendmarc-logo.png"
              alt="Sendmarc"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-lg text-sendmarc-blue-950">
              SENDMARC <span className="font-normal text-sendmarc-gray-600">Tools</span>
            </span>
          </Link>

          {/* Navigation */}
          <Navigation />
        </div>
      </Container>
    </header>
  )
}
