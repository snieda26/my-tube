/**
 * Authentication Context
 * Provides auth state and methods throughout the app
 */

'use client'

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authService } from '../services/auth.service'
import type { AuthContextValue, LoginDto, RegisterDto, User } from '../types/auth.types'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  /**
   * Initialize auth state on mount
   * Attempts to restore session from existing token
   */
  const initializeAuth = useCallback(async () => {
    try {
      const token = authService.getAccessToken()

      if (token) {
        // Token exists, fetch user profile
        const profile = await authService.getProfile()
        setUser(profile)
      }
    } catch (error) {
      // Token invalid or expired, will be handled by interceptor
      console.error('Failed to initialize auth:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Login user
   */
  const login = useCallback(
    async (credentials: LoginDto) => {
      try {
        setIsLoading(true)
        const response = await authService.login(credentials)
        setUser(response.account)
        toast.success('Welcome back!')
        router.push('/')
      } catch (error: any) {
        const message = error.response?.data?.message || 'Login failed'
        toast.error(message)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  /**
   * Register new user
   */
  const register = useCallback(
    async (data: RegisterDto) => {
      try {
        setIsLoading(true)
        const response = await authService.register(data)
        setUser(response.account)
        toast.success('Account created successfully!')
        router.push('/')
      } catch (error: any) {
        const message = error.response?.data?.message || 'Registration failed'
        toast.error(message)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [router]
  )

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Clear state even on error
      setUser(null)
      router.push('/auth/login')
    }
  }, [router])

  /**
   * Refresh authentication state
   * Useful after token refresh or manual profile update
   */
  const refreshAuth = useCallback(async () => {
    try {
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Failed to refresh auth:', error)
      setUser(null)
    }
  }, [])

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}

