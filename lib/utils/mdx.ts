import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content/learn')

export interface ArticleMetadata {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  readingTime: string
}

/**
 * Get all article slugs
 */
export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }

  const files = fs.readdirSync(contentDirectory)
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

/**
 * Get article metadata by slug
 */
export function getArticleBySlug(slug: string): ArticleMetadata | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(fileContents)

    return {
      slug,
      title: data.title || '',
      description: data.description || '',
      date: data.date || '',
      author: data.author || '',
      category: data.category || '',
      tags: data.tags || [],
      readingTime: data.readingTime || '',
    }
  } catch (error) {
    return null
  }
}

/**
 * Get all articles sorted by date (newest first)
 */
export function getAllArticles(): ArticleMetadata[] {
  const slugs = getAllArticleSlugs()
  const articles = slugs
    .map((slug) => getArticleBySlug(slug))
    .filter((article): article is ArticleMetadata => article !== null)

  // Sort by date (newest first)
  return articles.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return dateB - dateA
  })
}

/**
 * Get articles by category
 */
export function getArticlesByCategory(category: string): ArticleMetadata[] {
  const allArticles = getAllArticles()
  return allArticles.filter((article) => article.category === category)
}

/**
 * Get articles by tag
 */
export function getArticlesByTag(tag: string): ArticleMetadata[] {
  const allArticles = getAllArticles()
  return allArticles.filter((article) => article.tags.includes(tag))
}
