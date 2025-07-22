'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Menu, X, User, LogOut, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut, openAuthModal } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-4 left-4 right-4 mx-auto max-w-6xl z-50 transition-all duration-300 ${
        isMenuOpen ? 'rounded-lg' : 'rounded-full'
      }`}
    >
      <div className="relative group">
        {/* Animated gradient border */}
        <div className="absolute -inset-0.5 bg-gradient-border opacity-75 rounded-full blur-sm group-hover:opacity-100 transition duration-500 animate-gradient-x"></div>
        
        <div className={`relative bg-gradient-card/90 backdrop-blur-xl border border-white/20 shadow-gradient transition-all duration-300 ${
          isMenuOpen ? 'rounded-lg' : 'rounded-full'
        }`}>
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link href="/">
                <motion.div 
                  className="flex items-center cursor-pointer group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="relative mr-3">
                    <div className="p-2 bg-gradient-primary rounded-lg shadow-gradient group-hover:shadow-gradient-lg transition-all duration-300">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-3 h-3 text-warning animate-pulse" />
                    </div>
                  </div>
                  <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    ShortLink
                  </span>
                </motion.div>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center justify-center space-x-8">
                <Link 
                  href="/#features"
                  className="group relative text-muted-foreground hover:text-foreground transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-gradient-secondary/30"
                >
                  <span className="relative z-10">Features</span>
                  <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                </Link>
                {user && (
                  <>
                    <Link 
                      href="/dashboard"
                      className="group relative text-muted-foreground hover:text-foreground transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-gradient-secondary/30"
                    >
                      <span className="relative z-10">Dashboard</span>
                      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                    </Link>
                    <Link 
                      href="/analytics"
                      className="group relative text-muted-foreground hover:text-foreground transition-all duration-300 font-medium py-2 px-3 rounded-lg hover:bg-gradient-secondary/30"
                    >
                      <span className="relative z-10">Analytics</span>
                      <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                    </Link>
                  </>
                )}
              </nav>

              {/* Desktop Auth */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <div className="relative group">
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-secondary/50 backdrop-blur-sm border border-white/10">
                        <div className="p-1.5 bg-gradient-success rounded-lg">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {user.email?.split('@')[0]}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="group relative p-2 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-gradient-secondary/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Sign Out
                      </div>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="group relative px-6 py-2 text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-primary opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                    
                    <span className="relative z-10">Sign In</span>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </button>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden group relative p-2 text-foreground rounded-lg transition-all duration-300 hover:bg-gradient-secondary/30"
              >
                <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                {isMenuOpen ? (
                  <X className="w-5 h-5 relative z-10" />
                ) : (
                  <Menu className="w-5 h-5 relative z-10" />
                )}
              </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 pt-4 border-t border-border space-y-3"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-border opacity-30 rounded-lg blur-sm"></div>
                  <div className="relative p-4 bg-gradient-secondary/30 backdrop-blur-sm rounded-lg border border-white/10 space-y-3">
                    <Link 
                      href="/#features"
                      onClick={() => setIsMenuOpen(false)}
                      className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-gradient-accent/10"
                    >
                      Features
                    </Link>
                    {user && (
                      <>
                        <Link 
                          href="/dashboard"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-gradient-accent/10"
                        >
                          Dashboard
                        </Link>
                        <Link 
                          href="/analytics"
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2 px-3 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-gradient-accent/10"
                        >
                          Analytics
                        </Link>
                      </>
                    )}
                    
                    <div className="pt-3 border-t border-border/50">
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 py-2 px-3 bg-gradient-success/10 rounded-lg border border-success/20">
                            <div className="p-1.5 bg-gradient-success rounded-lg">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-sm font-medium text-foreground">
                              {user.email}
                            </span>
                          </div>
                          <button
                            onClick={handleSignOut}
                            className="group relative w-full flex items-center space-x-2 py-2 px-3 text-muted-foreground hover:text-foreground transition-all duration-300 rounded-lg hover:bg-destructive/10"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            openAuthModal()
                            setIsMenuOpen(false)
                          }}
                          className="group relative w-full py-3 px-4 text-white font-medium rounded-lg overflow-hidden transition-all duration-300"
                        >
                          <div className="absolute inset-0 bg-gradient-primary"></div>
                          <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                          <span className="relative z-10">Sign In</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
