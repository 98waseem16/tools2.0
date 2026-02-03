'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SaveButtonProps {
  text?: {
    idle?: string
    saving?: string
    saved?: string
  }
  className?: string
  onSave?: () => Promise<void> | void
}

// Sendmarc blue: 600 = #0073EA (primary CTA), 700 = #005BB5 (hover)
const SENDMARC_BLUE_600 = '#0073EA'
const SENDMARC_BLUE_700 = '#005BB5'

export function SaveButton({
  text = {
    idle: 'Save',
    saving: 'Saving...',
    saved: 'Saved!',
  },
  className,
  onSave,
}: SaveButtonProps) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  const handleSave = async () => {
    if (status === 'idle') {
      setStatus('saving')
      try {
        if (onSave) {
          await onSave()
        } else {
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
        setStatus('saved')
        setTimeout(() => {
          setStatus('idle')
        }, 2000)
      } catch (error) {
        setStatus('idle')
        console.error('Save failed:', error)
      }
    }
  }

  const buttonVariants = {
    idle: {
      backgroundColor: SENDMARC_BLUE_600,
      color: 'white',
      scale: 1,
    },
    saving: {
      backgroundColor: SENDMARC_BLUE_600,
      color: 'white',
      scale: 1,
    },
    saved: {
      backgroundColor: SENDMARC_BLUE_700,
      color: 'white',
      scale: 1,
    },
  }

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={handleSave}
        animate={status}
        variants={buttonVariants}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-95',
          'bg-sendmarc-blue-600 hover:bg-sendmarc-blue-700',
          className
        )}
        style={{ minWidth: '150px' }}
        whileHover={status === 'idle' ? { scale: 1.02 } : {}}
        whileTap={status === 'idle' ? { scale: 0.98 } : {}}
      >
        <AnimatePresence mode="wait">
          {status === 'saving' && (
            <motion.span
              key="saving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              {text.saving}
            </motion.span>
          )}
          {status === 'saved' && (
            <motion.span
              key="saved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              {text.saved}
            </motion.span>
          )}
          {status === 'idle' && (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {text.idle}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
