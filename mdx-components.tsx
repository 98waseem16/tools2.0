import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-sendmarc-gray-900 mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-sendmarc-gray-900 mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold text-sendmarc-gray-900 mb-3 mt-6">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold text-sendmarc-gray-900 mb-2 mt-4">{children}</h4>
    ),
    p: ({ children }) => <p className="text-sendmarc-gray-700 mb-4 leading-relaxed">{children}</p>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
    li: ({ children }) => <li className="text-sendmarc-gray-700">{children}</li>,
    a: ({ href, children }) => (
      <Link
        href={href || '#'}
        className="text-sendmarc-blue-600 hover:text-sendmarc-blue-700 underline"
      >
        {children}
      </Link>
    ),
    code: ({ children }) => (
      <code className="bg-sendmarc-gray-100 text-sendmarc-gray-900 px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-sendmarc-gray-900 text-sendmarc-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-sendmarc-blue-500 pl-4 italic text-sendmarc-gray-600 mb-4">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-sendmarc-gray-200">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 bg-sendmarc-gray-50 text-left text-xs font-medium text-sendmarc-gray-700 uppercase tracking-wider">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-sm text-sendmarc-gray-700 border-b border-sendmarc-gray-200">
        {children}
      </td>
    ),
    strong: ({ children }) => <strong className="font-semibold text-sendmarc-gray-900">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    hr: () => <hr className="my-8 border-sendmarc-gray-200" />,
    ...components,
  }
}
