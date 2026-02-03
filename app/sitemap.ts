import { MetadataRoute } from 'next'
import { getAllArticleSlugs } from '@/lib/utils/mdx'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tools.sendmarc.com' // Update with actual domain

  // Static pages
  const staticPages = [
    '',
    '/analyze',
    '/learn',
    '/tools/dmarc-checker',
    '/tools/spf-checker',
    '/tools/dkim-checker',
    '/tools/mx-lookup',
    '/tools/dns-lookup',
    '/tools/mta-sts-checker',
    '/tools/tls-rpt-checker',
    '/tools/bimi-checker',
    '/tools/blacklist-checker',
    '/tools/header-analyzer',
    '/tools/spf-policy-tester',
    '/tools/cidr-calculator',
    '/tools/dkim-generator',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route === '/learn' ? 0.9 : 0.8,
  }))

  // Learn articles
  const articles = getAllArticleSlugs().map((slug) => ({
    url: `${baseUrl}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...articles]
}
