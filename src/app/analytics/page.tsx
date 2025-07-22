'use client'

import { Header } from '@/components/header'
// import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { BarChart, Lock } from 'lucide-react'

export default function AnalyticsPage() {
  const { user, loading } = useAuth()

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
            <div className="p-6 rounded-lg border border-border bg-card/50 text-center">
              <div className="text-3xl font-bold text-primary mb-2">1.2K+</div>
              <div className="text-muted-foreground">Total Clicks</div>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card/50 text-center">
              <div className="text-3xl font-bold text-primary mb-2">856</div>
              <div className="text-muted-foreground">Unique Visitors</div>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card/50 text-center">
              <div className="text-3xl font-bold text-primary mb-2">42</div>
              <div className="text-muted-foreground">Active Links</div>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card/50 text-center">
              <div className="text-3xl font-bold text-primary mb-2">2.8%</div>
              <div className="text-muted-foreground">CTR Rate</div>
            </div>
          </div>
          
          {/* Detailed Analytics */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="p-6 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-semibold mb-4">Top Performing Links</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/demo</span>
                  <span className="font-semibold">245 clicks</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/github</span>
                  <span className="font-semibold">189 clicks</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/portfolio</span>
                  <span className="font-semibold">156 clicks</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">{process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000'}/blog</span>
                  <span className="font-semibold">98 clicks</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">New link created</span>
                  <span className="text-xs text-muted-foreground">2 mins ago</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">Link clicked</span>
                  <span className="text-xs text-muted-foreground">5 mins ago</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-sm">Custom alias set</span>
                  <span className="text-xs text-muted-foreground">12 mins ago</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Link shared</span>
                  <span className="text-xs text-muted-foreground">28 mins ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Geographic Data */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-semibold mb-4">Top Countries</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🇺🇸</span>
                    <span>United States</span>
                  </div>
                  <span className="font-semibold">342 clicks</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🇬🇧</span>
                    <span>United Kingdom</span>
                  </div>
                  <span className="font-semibold">189 clicks</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🇩🇪</span>
                    <span>Germany</span>
                  </div>
                  <span className="font-semibold">156 clicks</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🇫🇷</span>
                    <span>France</span>
                  </div>
                  <span className="font-semibold">98 clicks</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card/50">
              <h3 className="text-xl font-semibold mb-4">Device Types</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📱</span>
                    <span>Mobile</span>
                  </div>
                  <span className="font-semibold">582 clicks (68%)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">💻</span>
                    <span>Desktop</span>
                  </div>
                  <span className="font-semibold">245 clicks (29%)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">📟</span>
                    <span>Tablet</span>
                  </div>
                  <span className="font-semibold">26 clicks (3%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}
