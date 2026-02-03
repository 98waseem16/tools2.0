import Link from 'next/link'
import { Container } from '@/components/layout'
import { DomainInputHero } from '@/components/domain-input'
import Card from '@/components/ui/Card'
import { CheckCircle, LucideIcon } from 'lucide-react'

export interface ToolSection {
  title: string
  content: string | React.ReactNode
}

export interface CommonIssue {
  title: string
  description: string
  solution: string
}

export interface BestPractice {
  text: string
}

export interface RelatedTool {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export interface ToolPageLayoutProps {
  title: string
  subtitle: string
  analyzePath?: string  // Custom path for domain analysis (e.g., '/tools/spf-checker/analyze/')
  whatIsSection: {
    title: string
    content: React.ReactNode
  }
  understandingSection?: {
    title: string
    items: Array<{
      icon: LucideIcon
      iconColor: string
      title: string
      description: string
    }>
  }
  commonIssues: CommonIssue[]
  bestPractices: BestPractice[]
  relatedTools: RelatedTool[]
  ctaTitle?: string
  ctaDescription?: string
}

export default function ToolPageLayout({
  title,
  subtitle,
  analyzePath,
  whatIsSection,
  understandingSection,
  commonIssues,
  bestPractices,
  relatedTools,
  ctaTitle = 'Need Expert Help?',
  ctaDescription = 'Sendmarc provides automated email security management, real-time monitoring, and expert support.',
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen bg-sendmarc-gray-50">
      {/* Hero */}
      <section className="bg-sendmarc-blue-950 py-20">
        <Container>
          <DomainInputHero title={title} subtitle={subtitle} analyzePath={analyzePath} />
        </Container>
      </section>

      {/* What Is */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
              {whatIsSection.title}
            </h2>
            <div className="prose prose-lg max-w-none text-sendmarc-gray-700 space-y-4">
              {whatIsSection.content}
            </div>
          </div>
        </Container>
      </section>

      {/* Understanding Results */}
      {understandingSection && (
        <section className="py-16 bg-sendmarc-gray-50">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-6">
                {understandingSection.title}
              </h2>
              <div className="space-y-6">
                {understandingSection.items.map((item, index) => (
                  <Card key={index} variant="light" className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 ${item.iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sendmarc-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* Common Issues */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8">
              Common Issues
            </h2>
            <div className="space-y-6">
              {commonIssues.map((issue, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-sendmarc-gray-900 mb-3">
                    {issue.title}
                  </h3>
                  <p className="text-sendmarc-gray-600 mb-2">{issue.description}</p>
                  <p className="text-sm text-sendmarc-gray-600">
                    <strong>Solution:</strong> {issue.solution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Best Practices */}
      <section className="py-16 bg-sendmarc-gray-50">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8">
              Best Practices
            </h2>
            <div className="space-y-4">
              {bestPractices.map((practice, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-sendmarc-success-DEFAULT flex-shrink-0 mt-1" />
                  <p className="text-sendmarc-gray-700">{practice.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Related Tools */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-8 text-center">
              Related Email Security Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedTools.map((tool, index) => (
                <Link key={index} href={tool.href}>
                  <Card
                    variant="light"
                    className="h-full transition-all duration-200 hover:shadow-medium"
                  >
                    <div className="flex flex-col items-center text-center gap-4 p-2">
                      <div className="w-12 h-12 bg-sendmarc-blue-100 rounded-lg flex items-center justify-center">
                        <tool.icon className="w-6 h-6 text-sendmarc-blue-500" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-sendmarc-gray-900 mb-2">
                          {tool.title}
                        </h3>
                        <p className="text-sm text-sendmarc-gray-600">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-sendmarc-blue-950">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{ctaTitle}</h2>
            <p className="text-lg text-white/80 mb-8">{ctaDescription}</p>
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
