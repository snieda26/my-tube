import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { AuthContextValue, LoginDto, RegisterDto, User } from '../types/auth.types'
import { useRouter } from 'next/navigation'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'

interface AuthProviderProps {
  children: React.ReactNode
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  const isAuthenticated = !!user

  const initializeAuth = useCallback(async () => {
    try {
      const token = authService.getAccessToken()

      if (token) {
        const profile = await authService.getProfile()
        setUser(profile)
      }
    } catch (error) {
      console.log('Init auth error:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
      }
    },
    [router]
  )

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

  const logout = useCallback(async () => {
    try {
      await authService.logout()
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      router.push('/auth/login')
    }
  }, [router])

  const refreshAuth = useCallback(async () => {
    try {
      const profile = await authService.getProfile()
      setUser(profile)
    } catch (error) {
      console.error('Failed to refresh auth:', error)
      setUser(null)
    }
  }, [])

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

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('seAuthContext must be used within AuthProvider')
  }

  return context
}
