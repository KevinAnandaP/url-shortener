'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
// import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { getAllUrls } from '@/lib/utils'
import { motion } from 'framer-motion'
import { BarChart, Lock } from 'lucide-react'
import type { Database } from '@/lib/supabase'

type UrlRow = Database['public']['Tables']['urls']['Row']

interface AnalyticsData {
  totalClicks: number
  totalUniqueVisitors: number
  totalActiveLinks: number
  topPerformingLinks: UrlRow[]
}

export default function AnalyticsPage() {
  const { user, loading } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalClicks: 0,
    totalUniqueVisitors: 0,
    totalActiveLinks: 0,
    topPerformingLinks: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user) return
      
      setIsLoading(true)
      try {
        // Fetch all URLs for the user
        const result = await getAllUrls(1, 100) // Get first 100 URLs
        
        if (!result.error && result.data) {
          const urls = result.data
          
          // Calculate analytics
          const totalClicks = urls.reduce((sum, url) => sum + (url.click_count || 0), 0)
          const totalUniqueVisitors = urls.reduce((sum, url) => sum + (url.unique_clicks || 0), 0)
          const totalActiveLinks = urls.filter(url => url.is_active).length
          
          // Sort by click count for top performing links
          const topPerformingLinks = urls
            .filter(url => (url.click_count || 0) > 0)
            .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
            .slice(0, 5)
          
          setAnalyticsData({
            totalClicks,
            totalUniqueVisitors,
            totalActiveLinks,
            topPerformingLinks
          })
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [user])

  const calculateCTR = () => {
    if (analyticsData.totalClicks === 0 || analyticsData.totalUniqueVisitors === 0) return 0
    return ((analyticsData.totalUniqueVisitors / analyticsData.totalClicks) * 100).toFixed(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        
        <main className="container mx-auto px-4 pt-24 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to access your analytics dashboard and view detailed insights about your links.
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary">
                <BarChart size={20} />
                <span>Click &quot;Sign In&quot; in the navigation to get started</span>
              </div>
            </motion.div>
          </div>
        </main>

        {/* <Footer /> */}
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Analytics
            </h1>
            <p className="text-xl text-muted-foreground">
              Get detailed insights into your link performance
            </p>
          </div>
          
          {/* Analytics Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-lg border border-border bg-card/50 text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {isLoading ? '...' : analyticsData.totalClicks.toLocaleString()}
              </div>
              <div className="text-muted-foreground">Total Clicks</div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-lg border border-border bg-card/50 text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {isLoading ? '...' : analyticsData.totalUniqueVisitors.toLocaleString()}
              </div>
              <div className="text-muted-foreground">Unique Visitors</div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-lg border border-border bg-card/50 text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {isLoading ? '...' : analyticsData.totalActiveLinks}
              </div>
              <div className="text-muted-foreground">Active Links</div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-lg border border-border bg-card/50 text-center"
            >
              <div className="text-3xl font-bold text-primary mb-2">
                {isLoading ? '...' : `${calculateCTR()}%`}
              </div>
              <div className="text-muted-foreground">Unique Rate</div>
            </motion.div>
          </div>
          
          {/* Detailed Analytics */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="p-6 rounded-lg border border-border bg-card/50"
            >
              <h3 className="text-xl font-semibold mb-4">Top Performing Links</h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-border">
                        <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : analyticsData.topPerformingLinks.length > 0 ? (
                  analyticsData.topPerformingLinks.map((url) => (
                    <div key={url.id} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground truncate max-w-xs">
                        {process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/{url.custom_alias || url.short_code}
                      </span>
                      <span className="font-semibold">{url.click_count || 0} clicks</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No clicks yet!</p>
                    <p className="text-sm">Share your links to start seeing data here.</p>
                  </div>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-lg border border-border bg-card/50"
            >
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-border">
                        <div className="h-4 bg-muted rounded w-1/3 animate-pulse"></div>
                        <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : analyticsData.topPerformingLinks.length > 0 ? (
                  analyticsData.topPerformingLinks.slice(0, 4).map((url) => (
                    <div key={`activity-${url.id}`} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm">Link created: {url.custom_alias || url.short_code}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(url.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No activity yet!</p>
                    <p className="text-sm">Create some links to see activity here.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Geographic Data */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="p-6 rounded-lg border border-border bg-card/50"
            >
              <h3 className="text-xl font-semibold mb-4">Geographic Data</h3>
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">🌍</p>
                <p>Geographic tracking coming soon!</p>
                <p className="text-sm">We&apos;ll show where your clicks are coming from.</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="p-6 rounded-lg border border-border bg-card/50"
            >
              <h3 className="text-xl font-semibold mb-4">Device Analytics</h3>
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-2">📊</p>
                <p>Device tracking coming soon!</p>
                <p className="text-sm">We&apos;ll show device types and browser data.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}
