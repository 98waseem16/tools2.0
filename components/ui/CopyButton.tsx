'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Button from './Button'

export interface CopyButtonProps {
  text: string
  variant?: 'icon' | 'text' | 'button'
  onCopy?: () => void
  className?: string
}

export default function CopyButton({
  text,
  variant = 'icon',
  onCopy,
  className = '',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopy?.()

      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleCopy}
        className={`copy-btn ${className}`}
        aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <Check className="w-4 h-4 text-sendmarc-success" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>
    )
  }

  if (variant === 'text') {
    return (
      <button
        onClick={handleCopy}
        className={`text-sm text-sendmarc-blue-500 hover:text-sendmarc-blue-600 transition-colors ${className}`}
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            Copied!
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <Copy className="w-3.5 h-3.5" />
            Copy
          </span>
        )}
      </button>
    )
  }

  // Button variant
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleCopy}
      icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      className={className}
    >
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  )
}
