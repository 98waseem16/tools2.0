import { CheckCircle2, XCircle, AlertTriangle, Info } from 'lucide-react'
import type { CheckStatus } from '@/lib/types'

export interface StatusIconProps {
  status: CheckStatus
  size?: number
  className?: string
}

export default function StatusIcon({ status, size = 20, className = '' }: StatusIconProps) {
  const icons = {
    pass: {
      Icon: CheckCircle2,
      colorClass: 'text-sendmarc-success',
    },
    fail: {
      Icon: XCircle,
      colorClass: 'text-sendmarc-error',
    },
    warning: {
      Icon: AlertTriangle,
      colorClass: 'text-sendmarc-warning',
    },
    info: {
      Icon: Info,
      colorClass: 'text-sendmarc-info',
    },
  }

  const { Icon, colorClass } = icons[status]

  return <Icon className={`${colorClass} ${className}`} size={size} />
}
