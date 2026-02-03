import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/layout'
import { Clock, Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import { getAllArticleSlugs, getArticleBySlug } from '@/lib/utils/mdx'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: `${article.title} | Sendmarc Tools`,
    description: article.description,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      tags: article.tags,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // Dynamically import the MDX content
  let MDXContent
  try {
    MDXContent = (await import(`@/content/learn/${slug}.mdx`)).default
  } catch (error) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Article Header */}
      <section className="bg-sendmarc-blue-950 py-12">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </Link>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="inline-block px-3 py-1 bg-sendmarc-blue-800 text-white text-sm font-medium rounded-full">
                  {article.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white">{article.title}</h1>

              <p className="text-lg text-white/80">{article.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70 pt-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{article.readingTime}</span>
                </div>
              </div>

              {article.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Tag className="w-4 h-4 text-white/70" />
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-white/70 bg-sendmarc-blue-800 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Article Content */}
      <section className="py-12 bg-white">
        <Container>
          <article className="max-w-4xl mx-auto prose prose-lg max-w-none">
            <MDXContent />
          </article>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-sendmarc-blue-950 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Need Help Implementing Email Security?
              </h2>
              <p className="text-white/80 mb-6">
                Sendmarc provides automated email security management with expert support
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
          </div>
        </Container>
      </section>

      {/* Back to Articles */}
      <section className="py-8 bg-white border-t border-sendmarc-gray-200">
        <Container>
          <div className="max-w-4xl mx-auto">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-sendmarc-blue-600 hover:text-sendmarc-blue-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all articles
            </Link>
          </div>
        </Container>
      </section>
    </div>
  )
}
