'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'

export default function Navigation() {
  const [toolsOpen, setToolsOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const toolsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const learnTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (toolsTimeoutRef.current) clearTimeout(toolsTimeoutRef.current)
      if (learnTimeoutRef.current) clearTimeout(learnTimeoutRef.current)
    }
  }, [])

  const handleToolsEnter = () => {
    if (toolsTimeoutRef.current) {
      clearTimeout(toolsTimeoutRef.current)
    }
    setToolsOpen(true)
  }

  const handleToolsLeave = () => {
    toolsTimeoutRef.current = setTimeout(() => {
      setToolsOpen(false)
    }, 200) // 200ms delay before closing
  }

  const handleLearnEnter = () => {
    if (learnTimeoutRef.current) {
      clearTimeout(learnTimeoutRef.current)
    }
    setLearnOpen(true)
  }

  const handleLearnLeave = () => {
    learnTimeoutRef.current = setTimeout(() => {
      setLearnOpen(false)
    }, 200) // 200ms delay before closing
  }

  const toolsLinks = [
    { label: 'All-in-One Analysis', href: '/analyze', separator: false },
    { label: '─────────────────', href: '#', separator: true },
    { label: 'DMARC Checker', href: '/tools/dmarc-checker' },
    { label: 'SPF Checker', href: '/tools/spf-checker' },
    { label: 'DKIM Checker', href: '/tools/dkim-checker' },
    { label: 'MX Lookup', href: '/tools/mx-lookup' },
    { label: 'DNS Lookup', href: '/tools/dns-lookup' },
    { label: '─────────────────', href: '#', separator: true },
    { label: 'Blacklist Checker', href: '/tools/blacklist-checker' },
    { label: 'Header Analyzer', href: '/tools/header-analyzer' },
    { label: 'SPF Policy Tester', href: '/tools/spf-policy-tester' },
    { label: '─────────────────', href: '#', separator: true },
    { label: 'CIDR Calculator', href: '/tools/cidr-calculator' },
    { label: 'DKIM Generator', href: '/tools/dkim-generator' },
  ]

  const learnLinks = [
    { label: 'What is DMARC?', href: '/learn/what-is-dmarc' },
    { label: 'What is SPF?', href: '/learn/what-is-spf' },
    { label: 'What is DKIM?', href: '/learn/what-is-dkim' },
    { label: 'All Articles', href: '/learn' },
  ]

  return (
    <nav className="flex items-center gap-6">
      {/* Tools Dropdown */}
      <div
        className="relative"
        onMouseEnter={handleToolsEnter}
        onMouseLeave={handleToolsLeave}
      >
        <button className="flex items-center gap-1 text-sendmarc-gray-600 hover:text-sendmarc-blue-500 transition-colors py-2">
          Tools <ChevronDown className="w-4 h-4" />
        </button>

        {toolsOpen && (
          <div className="absolute top-full left-0 pt-2 -mt-2">
            <div className="bg-white rounded-lg shadow-lg border border-sendmarc-gray-200 py-2 min-w-[200px] z-50 animate-slide-down">
              {toolsLinks.map((link, index) =>
                link.separator ? (
                  <div key={index} className="border-t border-sendmarc-gray-200 my-2" />
                ) : (
                  <Link
                    key={index}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-sendmarc-gray-700 hover:bg-sendmarc-gray-50 hover:text-sendmarc-blue-500 transition-colors"
                    onClick={() => setToolsOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Learn Dropdown */}
      <div
        className="relative"
        onMouseEnter={handleLearnEnter}
        onMouseLeave={handleLearnLeave}
      >
        <button className="flex items-center gap-1 text-sendmarc-gray-600 hover:text-sendmarc-blue-500 transition-colors py-2">
          Learn <ChevronDown className="w-4 h-4" />
        </button>

        {learnOpen && (
          <div className="absolute top-full left-0 pt-2 -mt-2">
            <div className="bg-white rounded-lg shadow-lg border border-sendmarc-gray-200 py-2 min-w-[180px] z-50 animate-slide-down">
              {learnLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="block px-4 py-2 text-sm text-sendmarc-gray-700 hover:bg-sendmarc-gray-50 hover:text-sendmarc-blue-500 transition-colors"
                  onClick={() => setLearnOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sendmarc.com Link */}
      <a
        href="https://sendmarc.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sendmarc-gray-600 hover:text-sendmarc-blue-500 transition-colors"
      >
        Sendmarc.com
      </a>
    </nav>
  )
}
