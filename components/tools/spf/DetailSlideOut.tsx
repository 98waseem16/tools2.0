'use client'

/**
 * Detail Slide-Out Component
 * Reusable slide-out panel for showing detailed information
 */

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'

interface DetailSlideOutProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
}

export default function DetailSlideOut({
  open,
  onOpenChange,
  title,
  description,
  children,
}: DetailSlideOutProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-40" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300 z-50 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4 flex items-start justify-between">
            <div>
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="text-sm text-gray-600 mt-1">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close className="rounded-md p-1 hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
