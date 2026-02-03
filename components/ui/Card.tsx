import { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'dark'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  rounded?: 'md' | 'lg' | 'xl' | '2xl'
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

export default function Card({
  variant = 'light',
  padding = 'md',
  rounded = 'xl',
  shadow = 'sm',
  className = '',
  children,
  ...props
}: CardProps) {
  // Variant styles
  const variantClasses = {
    light: 'card',
    dark: 'card-dark',
  }

  // Padding styles
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }

  // Rounded styles
  const roundedClasses = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }

  // Shadow styles
  const shadowClasses = {
    none: '',
    sm: 'shadow-soft',
    md: 'shadow-medium',
    lg: 'shadow-strong',
  }

  const allClasses = `${variantClasses[variant]} ${paddingClasses[padding]} ${roundedClasses[rounded]} ${shadowClasses[shadow]} ${className}`

  return (
    <div className={allClasses} {...props}>
      {children}
    </div>
  )
}
