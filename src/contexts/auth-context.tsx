'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { AuthModal } from '@/components/auth-modal'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthModalOpen: boolean
  openAuthModal: () => void
  closeAuthModal: () => void
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const supabase = createClient()

  const openAuthModal = () => setIsAuthModalOpen(true)
  const closeAuthModal = () => setIsAuthModalOpen(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { error: error.message }
    }
    
    return {}
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) {
      return { error: error.message }
    }
    
    return {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
