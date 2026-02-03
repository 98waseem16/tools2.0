import { InputHTMLAttributes, forwardRef } from 'react'
import { X } from 'lucide-react'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  inputSize?: 'sm' | 'md' | 'lg'
  clearable?: boolean
  onClear?: () => void
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      iconPosition = 'left',
      inputSize = 'md',
      clearable = false,
      onClear,
      className = '',
      disabled,
      value,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2.5',
      lg: 'text-lg px-5 py-3',
    }

    const baseClasses = 'input'
    const errorClass = error ? 'input-error' : ''
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : ''

    const inputClasses = `${baseClasses} ${sizeClasses[inputSize]} ${errorClass} ${disabledClass} ${className}`

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-sendmarc-blue-950 mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sendmarc-gray-400">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={`${inputClasses} ${icon && iconPosition === 'left' ? 'pl-10' : ''} ${
              clearable && value ? 'pr-10' : icon && iconPosition === 'right' ? 'pr-10' : ''
            }`}
            disabled={disabled}
            value={value}
            {...props}
          />

          {icon && iconPosition === 'right' && !clearable && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sendmarc-gray-400">
              {icon}
            </div>
          )}

          {clearable && value && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sendmarc-gray-400 hover:text-sendmarc-gray-600 transition-colors"
              aria-label="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-sendmarc-error">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-sendmarc-gray-600">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
