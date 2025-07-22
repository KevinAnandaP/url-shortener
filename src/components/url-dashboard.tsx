'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExternalLink, 
  Copy, 
  Eye, 
  Users, 
  Calendar,
  TrendingUp,
  MoreHorizontal,
  CheckCircle,
  Edit3,
  Trash2,
  BarChart3
} from 'lucide-react'
import { getAllUrls, formatDate, getDomainFromUrl } from '@/lib/utils'
import { cn } from '@/lib/cn'
import { EditModal } from '@/components/edit-modal'
import { DeleteModal } from '@/components/delete-modal'
import type { Database } from '@/lib/supabase'

type UrlRow = Database['public']['Tables']['urls']['Row']

interface UrlStats {
  total_urls: number
  total_clicks: number
  total_unique_visitors: number
}

export function UrlDashboard() {
  const [urls, setUrls] = useState<UrlRow[]>([])
  const [stats, setStats] = useState<UrlStats>({ total_urls: 0, total_clicks: 0, total_unique_visitors: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<{ isOpen: boolean; url: UrlRow | null }>({ isOpen: false, url: null })
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; url: UrlRow | null }>({ isOpen: false, url: null })

  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const result = await getAllUrls(page, ITEMS_PER_PAGE)
        if (!result.error) {
          setUrls(result.data)
          setTotalCount(result.count)
          
          // Calculate stats
          const totalClicks = result.data.reduce((sum, url) => sum + (url.click_count || 0), 0)
          const totalUniqueVisitors = result.data.reduce((sum, url) => sum + (url.unique_clicks || 0), 0)
          
          setStats({
            total_urls: result.count,
            total_clicks: totalClicks,
            total_unique_visitors: totalUniqueVisitors
          })
        }
      } catch (error) {
        console.error('Error fetching URLs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [page])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const copyToClipboard = async (url: UrlRow) => {
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${url.custom_alias || url.short_code}`
    
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedId(url.id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  // Modal handlers
  const handleEdit = (url: UrlRow) => {
    setEditModal({ isOpen: true, url })
    setOpenDropdown(null)
  }

  const handleDelete = (url: UrlRow) => {
    setDeleteModal({ isOpen: true, url })
    setOpenDropdown(null)
  }

  const handleAnalytics = (url: UrlRow) => {
    // Navigate to analytics page with URL ID
    window.open(`/analytics?url=${url.id}`, '_blank')
    setOpenDropdown(null)
  }

  const handleUrlUpdate = (updatedUrl: UrlRow) => {
    setUrls(urls.map(url => url.id === updatedUrl.id ? updatedUrl : url))
  }

  const handleUrlDelete = (urlId: string) => {
    setUrls(urls.filter(url => url.id !== urlId))
    setStats(prev => ({ ...prev, total_urls: prev.total_urls - 1 }))
  }

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="space-y-8"
    >

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent border border-blue-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-400">Total URLs</p>
              <p className="text-3xl font-bold">{stats.total_urls.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Links created</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="group relative overflow-hidden bg-gradient-to-br from-green-500/10 via-green-400/5 to-transparent border border-green-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-400">Total Clicks</p>
              <p className="text-3xl font-bold">{stats.total_clicks.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Engagement score</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <Eye className="h-8 w-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="group relative overflow-hidden bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent border border-purple-500/20 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-purple-400">Unique Visitors</p>
              <p className="text-3xl font-bold">{stats.total_unique_visitors.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Reach & impact</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* URLs Grid - Card Layout */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            Recent URLs
          </h3>
          <div className="text-sm text-muted-foreground">
            {totalCount} {totalCount === 1 ? 'link' : 'links'} total
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : urls.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 space-y-4"
          >
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-400/10 to-gray-600/10 rounded-full flex items-center justify-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No URLs yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Start building your link empire! Create your first short URL above and watch your collection grow.
              </p>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {urls.map((url, index) => (
                  <motion.div
                    key={url.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative bg-gradient-to-br from-card via-card to-card/80 border border-border/50 rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Background gradient effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="relative space-y-4">
                      {/* Header with favicon and title */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="relative">
                            {url.favicon_url ? (
                              <Image 
                                src={url.favicon_url} 
                                alt="" 
                                width={24}
                                height={24}
                                className="rounded-lg shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none'
                                }}
                                unoptimized
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gradient-to-br from-gray-400/20 to-gray-600/20 rounded-lg flex items-center justify-center">
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                              {url.title || getDomainFromUrl(url.original_url)}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {getDomainFromUrl(url.original_url)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions dropdown */}
                        <div className="relative flex-shrink-0">
                          <motion.button
                            onClick={() => setOpenDropdown(openDropdown === url.id ? null : url.id)}
                            className={cn(
                              "p-2.5 rounded-xl transition-all duration-200",
                              openDropdown === url.id
                                ? "bg-primary/15 text-primary shadow-lg shadow-primary/20"
                                : "hover:bg-muted/80 text-muted-foreground hover:text-foreground group-hover:bg-muted/60"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </motion.button>
                          
                          <AnimatePresence>
                            {openDropdown === url.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full right-0 mt-2 w-48 bg-card/95 backdrop-blur-lg border border-border/80 rounded-xl shadow-2xl shadow-black/20 z-50 ring-1 ring-black/5"
                              >
                                <div className="py-2">
                                  <button
                                    onClick={() => handleEdit(url)}
                                    className="w-full px-4 py-3 text-left hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center space-x-3 text-sm font-medium group"
                                  >
                                    <div className="p-1.5 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                      <Edit3 className="h-4 w-4 text-blue-500" />
                                    </div>
                                    <span>Edit Link</span>
                                  </button>
                                  
                                  <button
                                    onClick={() => handleAnalytics(url)}
                                    className="w-full px-4 py-3 text-left hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center space-x-3 text-sm font-medium group"
                                  >
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                                      <BarChart3 className="h-4 w-4 text-purple-500" />
                                    </div>
                                    <span>View Analytics</span>
                                  </button>
                                  
                                  <hr className="my-2 border-border/50" />
                                  
                                  <button
                                    onClick={() => handleDelete(url)}
                                    className="w-full px-4 py-3 text-left hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 flex items-center space-x-3 text-sm font-medium group"
                                  >
                                    <div className="p-1.5 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </div>
                                    <span>Delete Link</span>
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Short URL Display */}
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Short Link</p>
                        <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-xl border border-border/30 group-hover:border-primary/20 transition-colors">
                          <code className="text-sm font-mono flex-1 truncate">
                            {process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/{url.custom_alias || url.short_code}
                          </code>
                          <motion.button
                            onClick={() => copyToClipboard(url)}
                            className={cn(
                              "p-1.5 rounded-lg transition-colors flex-shrink-0",
                              copiedId === url.id 
                                ? "bg-green-500 text-white" 
                                : "hover:bg-primary/10 text-muted-foreground hover:text-primary"
                            )}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {copiedId === url.id ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1.5">
                            <div className="p-1.5 bg-blue-500/10 rounded-lg">
                              <Eye className="h-3.5 w-3.5 text-blue-500" />
                            </div>
                            <span className="text-sm font-medium">{url.click_count || 0}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1.5">
                            <div className="p-1.5 bg-purple-500/10 rounded-lg">
                              <Users className="h-3.5 w-3.5 text-purple-500" />
                            </div>
                            <span className="text-sm font-medium">{url.unique_clicks || 0}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(url.created_at)}</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-border/30">
                        <motion.button
                          onClick={() => openUrl(url.original_url)}
                          className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                          whileHover={{ x: 2 }}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Visit Original</span>
                        </motion.button>
                        
                        <div className="text-xs text-muted-foreground">
                          {url.click_count ? `${((url.unique_clicks || 0) / url.click_count * 100).toFixed(0)}% unique` : 'No clicks yet'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* Modern Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center justify-between p-6 bg-gradient-to-r from-card via-card/80 to-card border border-border/50 rounded-2xl"
        >
          <div className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to{' '}
            <span className="font-medium text-foreground">{Math.min(page * ITEMS_PER_PAGE, totalCount)}</span> of{' '}
            <span className="font-medium text-foreground">{totalCount}</span> links
          </div>
          
          <div className="flex items-center space-x-3">
            <motion.button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={cn(
                "px-4 py-2 text-sm rounded-xl border transition-all duration-200",
                page === 1
                  ? "border-border/30 text-muted-foreground cursor-not-allowed opacity-50"
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              )}
              whileHover={{ scale: page === 1 ? 1 : 1.02 }}
              whileTap={{ scale: page === 1 ? 1 : 0.98 }}
            >
              ← Previous
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Page</span>
              <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-lg border border-primary/20">
                {page}
              </span>
              <span className="text-sm text-muted-foreground">of {totalPages}</span>
            </div>
            
            <motion.button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={cn(
                "px-4 py-2 text-sm rounded-xl border transition-all duration-200",
                page === totalPages
                  ? "border-border/30 text-muted-foreground cursor-not-allowed opacity-50"
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
              )}
              whileHover={{ scale: page === totalPages ? 1 : 1.02 }}
              whileTap={{ scale: page === totalPages ? 1 : 0.98 }}
            >
              Next →
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Edit Modal */}
      {editModal.url && (
        <EditModal
          url={editModal.url}
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, url: null })}
          onUpdate={handleUrlUpdate}
        />
      )}

      {/* Delete Modal */}
      {deleteModal.url && (
        <DeleteModal
          url={deleteModal.url}
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, url: null })}
          onDelete={handleUrlDelete}
        />
      )}
    </motion.div>
  )
}
