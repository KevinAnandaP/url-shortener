'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, Loader2, Copy, CheckCircle, AlertCircle, Settings, UserCheck, Lock, ExternalLink, Sparkles } from 'lucide-react'
import { createShortUrl } from '@/lib/utils'
import { cn } from '@/lib/cn'
import { useAuth } from '@/contexts/auth-context'

interface ShortenedUrl {
  id: string
  original_url: string
  short_code: string
  custom_alias: string | null
  created_at: string
}

export function UrlShortenerForm() {
  const { user, openAuthModal } = useAuth()
  const [url, setUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null)
  const [error, setError] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    if (!user) {
      openAuthModal()
      return
    }

    setIsLoading(true)
    setError('')
    setShortenedUrl(null)

    try {
      const result = await createShortUrl(url.trim(), customAlias.trim() || undefined)
      
      if (result.success && result.data) {
        setShortenedUrl(result.data)
        setUrl('')
        setCustomAlias('')
        setShowAdvanced(false)
      } else {
        setError(result.error || 'Failed to create short URL')
      }
    } catch {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shortenedUrl) return
    
    const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${shortenedUrl.custom_alias || shortenedUrl.short_code}`
    
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy to clipboard:', err)
    }
  }

  const shortUrl = shortenedUrl 
    ? `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${shortenedUrl.custom_alias || shortenedUrl.short_code}`
    : ''

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="relative group">
        {/* Animated gradient border */}
        <div className="absolute -inset-1 bg-gradient-border opacity-75 rounded-2xl blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
        
        <div className="relative bg-gradient-card backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-gradient-lg">
          {/* Header with icon */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="p-4 bg-gradient-primary rounded-full shadow-gradient animate-float">
                  <Link className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-5 h-5 text-warning animate-pulse" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              URL Shortener
            </h1>
            <p className="text-muted-foreground text-lg">
              Transform long URLs into beautiful, shareable links
            </p>
          </div>

          {/* Authentication Status */}
          <div className="mb-6 relative group">
            <div className="absolute -inset-0.5 bg-gradient-accent opacity-50 rounded-xl blur-sm group-hover:opacity-75 transition duration-300"></div>
            <div className="relative flex items-center justify-between p-4 rounded-xl bg-gradient-secondary/50 backdrop-blur-sm border border-white/10">
              <div className="flex items-center space-x-3">
                {user ? (
                  <>
                    <div className="p-2 bg-gradient-success rounded-lg">
                      <UserCheck className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        Welcome back!
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-2 bg-gradient-warning rounded-lg">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        Authentication Required
                      </span>
                      <div className="text-xs text-muted-foreground">
                        Sign in to create and manage your short URLs
                      </div>
                    </div>
                  </>
                )}
              </div>
              {!user && (
                <button
                  onClick={() => openAuthModal()}
                  className="group relative px-4 py-2 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-primary"></div>
                  <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <span className="relative z-10 text-sm">Sign In</span>
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main URL Input */}
            <div className="space-y-3">
              <label htmlFor="url" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Link className="w-4 h-4" />
                Enter your long URL
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-border opacity-0 group-focus-within:opacity-30 rounded-xl blur-sm transition-opacity duration-300"></div>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/very-long-url-that-needs-shortening"
                  className="relative w-full px-4 py-4 border border-border rounded-xl bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 group-hover:bg-background/90"
                  disabled={isLoading || !user}
                  required
                />
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="group flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300"
                disabled={!user}
              >
                <div className="p-1.5 bg-gradient-secondary rounded-lg group-hover:bg-gradient-primary transition-all duration-300">
                  <Settings className="h-3 w-3 text-white" />
                </div>
                <span>Advanced Options</span>
              </button>
            </div>

            {/* Advanced Options */}
            <AnimatePresence>
              {showAdvanced && user && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label htmlFor="customAlias" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Custom Alias (Optional)
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 group-focus-within:opacity-20 rounded-xl blur-sm transition-opacity duration-300"></div>
                    <input
                      type="text"
                      id="customAlias"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="my-awesome-link"
                      className="relative w-full px-4 py-3 border border-border rounded-xl bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all duration-300 group-hover:bg-background/90"
                      disabled={isLoading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Only letters, numbers, and hyphens are allowed
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-orange-500 opacity-75 rounded-xl blur-sm"></div>
                  <div className="relative flex items-center space-x-3 p-4 bg-destructive/10 backdrop-blur-sm border border-destructive/20 rounded-xl">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    <p className="text-destructive text-sm font-medium">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim() || !user}
              className="group relative w-full py-4 px-6 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-primary opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex items-center justify-center space-x-3">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating your short URL...</span>
                  </>
                ) : (
                  <>
                    <Link className="w-5 h-5" />
                    <span>Shorten URL</span>
                  </>
                )}
              </div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </button>
          </form>

          {/* Success Result */}
          <AnimatePresence>
            {shortenedUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 relative group"
              >
                {/* Success gradient border */}
                <div className="absolute -inset-1 bg-gradient-success opacity-75 rounded-xl blur-sm group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
                
                <div className="relative p-6 bg-gradient-card backdrop-blur-xl rounded-xl border border-success/20">
                  <div className="space-y-6">
                    {/* Success header */}
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gradient-success rounded-xl shadow-gradient">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground">
                          🎉 URL Shortened Successfully!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Your link is ready to share
                        </p>
                      </div>
                    </div>
                    
                    {/* URL display and actions */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-border opacity-50 rounded-lg blur-sm group-hover:opacity-75 transition duration-300"></div>
                      <div className="relative flex items-center gap-3 p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border">
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Your short URL:</div>
                          <div className="font-mono text-lg font-semibold text-foreground break-all">
                            {shortUrl}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={copyToClipboard}
                            className="group relative p-3 bg-gradient-primary rounded-lg text-white hover:scale-110 transition-all duration-200 shadow-gradient"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-5 h-5" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              {copied ? 'Copied!' : 'Copy URL'}
                            </div>
                          </button>
                          
                          <button
                            onClick={() => window.open(shortUrl, '_blank')}
                            className="group relative p-3 bg-gradient-accent rounded-lg text-white hover:scale-110 transition-all duration-200 shadow-gradient"
                            title="Open URL"
                          >
                            <ExternalLink className="w-5 h-5" />
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Open Link
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Copy confirmation */}
                    <AnimatePresence>
                      {copied && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-center"
                        >
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-success rounded-lg text-white text-sm font-medium">
                            <CheckCircle className="w-4 h-4" />
                            Copied to clipboard!
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
