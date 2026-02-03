import Link from 'next/link'
import Container from './Container'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const toolsLinks = [
    { label: 'DMARC Checker', href: '/tools/dmarc-checker' },
    { label: 'SPF Checker', href: '/tools/spf-checker' },
    { label: 'DKIM Checker', href: '/tools/dkim-checker' },
    { label: 'MX Lookup', href: '/tools/mx-lookup' },
    { label: 'Blacklist Checker', href: '/tools/blacklist-checker' },
    { label: 'Header Analyzer', href: '/tools/header-analyzer' },
  ]

  const resourcesLinks = [
    { label: 'What is DMARC?', href: '/learn/what-is-dmarc' },
    { label: 'What is SPF?', href: '/learn/what-is-spf' },
    { label: 'What is DKIM?', href: '/learn/what-is-dkim' },
    { label: 'All Articles', href: '/learn' },
  ]

  const companyLinks = [
    { label: 'About Sendmarc', href: 'https://sendmarc.com/about' },
    { label: 'Contact Us', href: 'https://sendmarc.com/contact' },
    { label: 'Privacy Policy', href: 'https://sendmarc.com/privacy' },
  ]

  return (
    <footer className="bg-sendmarc-blue-950 text-white py-12 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/sendmarc-logo.png"
                alt="Sendmarc"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg">
                SENDMARC <span className="font-normal text-white/70">Tools</span>
              </span>
            </div>
            <p className="text-sm text-white/70">
              Free email security analysis tools to help you protect your domain from phishing and spoofing attacks.
            </p>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-2">
              {toolsLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              {resourcesLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/60">
          <p>© {currentYear} Sendmarc. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  )
}
