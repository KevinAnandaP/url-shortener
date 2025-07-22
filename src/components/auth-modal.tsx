'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = isLogin ? await signIn(email, password) : await signUp(email, password)
      
      if (result.error) {
        setError(result.error)
      } else {
        if (isLogin) {
          setSuccess('Welcome back!')
          setTimeout(() => {
            onClose()
            setEmail('')
            setPassword('')
            setSuccess('')
          }, 1000)
        } else {
          setSuccess('Account created! Please check your email to verify.')
          setEmail('')
          setPassword('')
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setError('')
    setSuccess('')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="bg-gradient-to-br from-card to-card/80 border border-border/50 rounded-2xl p-8 w-full max-w-md shadow-2xl backdrop-blur-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {isLogin ? 'Welcome Back' : 'Join Us'}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isLogin ? 'Sign in to your account' : 'Create your account'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-secondary/80 rounded-full transition-colors group"
              >
                <X size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-border rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 group-focus-within:text-primary transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border border-border rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-muted-foreground">
                    Minimum 6 characters
                  </p>
                )}
              </div>

              {/* Success Message */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3.5 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium shadow-lg"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  <>
                    <User size={16} />
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
