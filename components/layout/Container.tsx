import { HTMLAttributes } from 'react'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export default function Container({
  size = 'lg',
  className = '',
  children,
  ...props
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <div
      className={`container-main ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
