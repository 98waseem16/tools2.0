import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout'
import Card from '@/components/ui/Card'
import { Clock, Tag, BookOpen } from 'lucide-react'
import { getAllArticles } from '@/lib/utils/mdx'

export const metadata: Metadata = {
  title: 'Learn Email Security - DMARC, SPF, DKIM Guides | Sendmarc Tools',
  description:
    'Learn about email authentication, DMARC, SPF, DKIM, and email security best practices with our comprehensive guides and tutorials.',
  keywords: [
    'email security',
    'DMARC guide',
    'SPF tutorial',
    'DKIM explained',
    'email authentication',
    'email deliverability',
    'phishing protection',
  ],
  openGraph: {
    title: 'Learn Email Security - DMARC, SPF, DKIM Guides',
    description: 'Comprehensive guides on email authentication and security.',
    type: 'website',
  },
}

export default function LearnPage() {
  const articles = getAllArticles()

  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Learn Email Security</h1>
            <p className="text-lg text-white/80">
              Comprehensive guides and tutorials on DMARC, SPF, DKIM, and email authentication
            </p>
          </div>
        </Container>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            {articles.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-sendmarc-gray-400 mx-auto mb-4" />
                <p className="text-sendmarc-gray-600">No articles yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <Link key={article.slug} href={`/learn/${article.slug}`}>
                    <Card className="h-full transition-all duration-200 hover:shadow-medium">
                      <div className="p-6 space-y-4">
                        {/* Category Badge */}
                        <div className="flex items-center gap-2">
                          <span className="inline-block px-3 py-1 bg-sendmarc-blue-100 text-sendmarc-blue-700 text-xs font-medium rounded-full">
                            {article.category}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-semibold text-sendmarc-gray-900 hover:text-sendmarc-blue-600 transition-colors">
                          {article.title}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-sendmarc-gray-600 line-clamp-3">
                          {article.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-xs text-sendmarc-gray-500 pt-4 border-t border-sendmarc-gray-200">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{article.readingTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>{article.tags.length} tags</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sendmarc-blue-950">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Secure Your Email?</h2>
            <p className="text-lg text-white/80 mb-8">
              Sendmarc provides automated email security management, real-time monitoring, and
              expert support to protect your domain.
            </p>
            <a
              href="https://sendmarc.com/start-trial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-sendmarc-blue-950 px-8 py-3 rounded-lg font-semibold hover:bg-sendmarc-gray-100 transition-colors"
            >
              Start Free Trial
            </a>
          </div>
        </Container>
      </section>
    </div>
  )
}
