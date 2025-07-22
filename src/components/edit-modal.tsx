'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save } from 'lucide-react'
import { updateUrl } from '@/lib/utils'
import type { Database } from '@/lib/supabase'

type UrlRow = Database['public']['Tables']['urls']['Row']

interface EditModalProps {
  url: UrlRow
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedUrl: UrlRow) => void
}

export function EditModal({ url, isOpen, onClose, onUpdate }: EditModalProps) {
  const [customAlias, setCustomAlias] = useState(url.custom_alias || '')
  const [originalUrl, setOriginalUrl] = useState(url.original_url)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const updates: { custom_alias?: string | null; original_url?: string } = {}
      
      if (customAlias !== (url.custom_alias || '')) {
        updates.custom_alias = customAlias || null
      }
      
      if (originalUrl !== url.original_url) {
        updates.original_url = originalUrl
      }

      if (Object.keys(updates).length === 0) {
        onClose()
        return
      }

      const result = await updateUrl(url.id, updates)
      
      if (result.success && result.data) {
        onUpdate(result.data)
        onClose()
      } else {
        setError(result.error || 'Failed to update URL')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

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
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Edit URL
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Update your link details
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-muted/80 rounded-xl transition-all duration-200 hover:scale-105 border border-border/50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="originalUrl" className="block text-sm font-semibold text-foreground">
                  Original URL
                </label>
                <input
                  id="originalUrl"
                  type="url"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-border/60 rounded-xl bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-sm"
                  required
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="customAlias" className="block text-sm font-semibold text-foreground">
                  Custom Alias
                  <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                </label>
                <input
                  id="customAlias"
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                  className="w-full px-4 py-3 border border-border/60 rounded-xl bg-background/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-sm"
                  placeholder="my-custom-link"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to keep the current alias
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-border/60 rounded-xl hover:bg-muted/60 transition-all duration-200 font-medium text-sm hover:scale-[0.98]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium text-sm hover:scale-[0.98] shadow-lg"
                >
                  <Save size={16} />
                  <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
