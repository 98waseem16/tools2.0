'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { parseDomainInput } from '@/lib/utils/domain'
import { Search } from 'lucide-react'

export interface DomainInputProps {
  placeholder?: string
  onSubmit?: (domain: string) => void
  autoFocus?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function DomainInput({
  placeholder = 'example.com',
  onSubmit,
  autoFocus = false,
  size = 'md',
  className = '',
}: DomainInputProps) {
  const router = useRouter()
  const [input, setInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (error) setError(null) // Clear error on input change
  }

  const handleClear = () => {
    setInput('')
    setError(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!input.trim()) {
      setError('Please enter a domain name')
      return
    }

    // Parse and validate domain
    const { domain, error: parseError, wasEmail } = parseDomainInput(input)

    if (parseError || !domain) {
      setError(parseError || 'Invalid domain')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call custom onSubmit if provided
      if (onSubmit) {
        onSubmit(domain)
      } else {
        // Default behavior: navigate to analysis page
        router.push(`/analyze/${domain}`)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder={placeholder}
            error={error || undefined}
            icon={<Search className="w-5 h-5" />}
            iconPosition="left"
            inputSize={size}
            clearable={input.length > 0}
            onClear={handleClear}
            autoFocus={autoFocus}
            disabled={loading}
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size={size}
          loading={loading}
          disabled={!input.trim() || loading}
        >
          Analyze
        </Button>
      </div>
    </form>
  )
}
