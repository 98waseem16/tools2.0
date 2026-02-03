'use client'

import DomainInput from './DomainInput'

export interface DomainInputHeroProps {
  title?: string
  subtitle?: string
  className?: string
  analyzePath?: string  // Custom path for domain analysis (e.g., '/tools/spf-checker/analyze/')
}

export default function DomainInputHero({
  title = 'Check Your Email Security',
  subtitle = 'Comprehensive email authentication analysis for DMARC, SPF, DKIM, and more',
  className = '',
  analyzePath,
}: DomainInputHeroProps) {
  return (
    <div className={`text-center ${className}`}>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
      </h1>
      <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
        {subtitle}
      </p>
      <div className="max-w-2xl mx-auto">
        <DomainInput
          placeholder="Enter your domain (e.g., example.com)"
          size="lg"
          autoFocus={true}
          onSubmit={analyzePath ? (domain) => {
            window.location.href = `${analyzePath}${domain}`
          } : undefined}
        />
      </div>
      <p className="text-sm text-white/60 mt-4">
        Free analysis • No sign-up required • Results in seconds
      </p>
    </div>
  )
}
