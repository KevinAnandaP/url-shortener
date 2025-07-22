'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { deleteUrl } from '@/lib/utils'
import type { Database } from '@/lib/supabase'

type UrlRow = Database['public']['Tables']['urls']['Row']

interface DeleteModalProps {
  url: UrlRow
  isOpen: boolean
  onClose: () => void
  onDelete: (urlId: string) => void
}

export function DeleteModal({ url, isOpen, onClose, onDelete }: DeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDelete = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await deleteUrl(url.id)
      
      if (result.success) {
        onDelete(url.id)
        onClose()
      } else {
        setError(result.error || 'Failed to delete URL')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${url.custom_alias || url.short_code}`

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="bg-card/95 backdrop-blur-lg border border-border/80 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-black/25 ring-1 ring-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                    Delete URL
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-muted/80 rounded-xl transition-all duration-200 hover:scale-105 border border-border/50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <p className="text-muted-foreground">
                Are you sure you want to delete this shortened URL? This action cannot be undone and all associated analytics data will be lost.
              </p>
              
              <div className="p-4 bg-muted/30 border border-border/50 rounded-xl space-y-3">
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Short URL</div>
                  <div className="text-sm text-muted-foreground break-all font-mono bg-background/50 p-2 rounded-lg">
                    {shortUrl}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground mb-1">Original URL</div>
                  <div className="text-sm text-muted-foreground break-all bg-background/50 p-2 rounded-lg">
                    {url.original_url}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl mb-6"
              >
                {error}
              </motion.div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/60 transition-all duration-200 font-medium text-sm hover:scale-[0.98]"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium text-sm hover:scale-[0.98] shadow-lg"
              >
                <Trash2 size={16} />
                <span>{isLoading ? 'Deleting...' : 'Delete URL'}</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
