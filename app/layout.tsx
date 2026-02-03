import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header, Footer } from '@/components/layout'
import SkipToContent from '@/components/ui/SkipToContent'

// Load Inter font as fallback for NeueHaasDisplay
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-primary',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sendmarc Tools - Free Email Security Analysis',
  description: 'Check your domain\'s DMARC, SPF, DKIM, and email authentication setup. Free comprehensive email security analysis tools.',
  keywords: ['DMARC', 'SPF', 'DKIM', 'email security', 'domain analysis', 'email authentication'],
  authors: [{ name: 'Sendmarc' }],
  creator: 'Sendmarc',
  publisher: 'Sendmarc',
  metadataBase: new URL('https://tools.sendmarc.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tools.sendmarc.com',
    title: 'Sendmarc Tools - Free Email Security Analysis',
    description: 'Check your domain\'s DMARC, SPF, DKIM, and email authentication setup.',
    siteName: 'Sendmarc Tools',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sendmarc Tools - Free Email Security Analysis',
    description: 'Check your domain\'s DMARC, SPF, DKIM, and email authentication setup.',
    creator: '@sendmarc',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <SkipToContent />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
