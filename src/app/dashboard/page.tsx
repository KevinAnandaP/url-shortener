'use client'

import { UrlDashboard } from '@/components/url-dashboard'
import { Header } from '@/components/header'
// import { Footer } from '@/components/footer'
import { useAuth } from '@/contexts/auth-context'
import { motion } from 'framer-motion'
import { User, Lock } from 'lucide-react'

export default function DashboardPage() {
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
                Please sign in to access your URL dashboard and manage your shortened links.
              </p>
              <div className="flex items-center justify-center space-x-2 text-primary">
                <User size={20} />
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
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              URL Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Monitor and manage all your shortened URLs in one place
            </p>
          </div>
          <UrlDashboard />
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  )
}
