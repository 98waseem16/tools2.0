import { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status?: 'success' | 'error' | 'warning' | 'info' | 'neutral'
  variant?: 'solid' | 'soft' | 'outline'
  size?: 'sm' | 'md'
  icon?: React.ReactNode
}

export default function Badge({
  status = 'neutral',
  variant = 'solid',
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}: BadgeProps) {
  // Status styles for solid variant (dark backgrounds)
  const solidStatusClasses = {
    success: 'badge-success',
    error: 'badge-error',
    warning: 'badge-warning',
    info: 'badge-info',
    neutral: 'bg-sendmarc-gray-600 text-sendmarc-gray-100',
  }

  // Status styles for soft variant (light backgrounds)
  const softStatusClasses = {
    success: 'badge-success-light',
    error: 'badge-error-light',
    warning: 'badge-warning-light',
    info: 'bg-sendmarc-info-light text-blue-800',
    neutral: 'bg-sendmarc-gray-200 text-sendmarc-gray-700',
  }

  // Status styles for outline variant
  const outlineStatusClasses = {
    success: 'border-sendmarc-success text-sendmarc-success bg-transparent',
    error: 'border-sendmarc-error text-sendmarc-error bg-transparent',
    warning: 'border-sendmarc-warning text-sendmarc-warning bg-transparent',
    info: 'border-sendmarc-info text-sendmarc-info bg-transparent',
    neutral: 'border-sendmarc-gray-300 text-sendmarc-gray-600 bg-transparent',
  }

  // Size styles
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  }

  // Select variant classes
  const variantClasses = {
    solid: solidStatusClasses[status],
    soft: softStatusClasses[status],
    outline: `${outlineStatusClasses[status]} border`,
  }

  const baseClasses = 'badge'
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <span className={allClasses} {...props}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}
