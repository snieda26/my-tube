/**
 * Authentication Hooks
 * Convenient hooks for auth operations
 */

'use client'

import { useAuthContext } from '../context/auth.context'

/**
 * Main auth hook
 * Provides access to user, auth state, and auth methods
 */
export function useAuth() {
  return useAuthContext()
}

/**
 * Hook to check if user is authenticated
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  const { user, isLoading } = useAuthContext()
  return { user, isLoading }
}

/**
 * Hook for login functionality
 */
export function useLogin() {
  const { login, isLoading } = useAuthContext()
  return { login, isLoading }
}

/**
 * Hook for register functionality
 */
export function useRegister() {
  const { register, isLoading } = useAuthContext()
  return { register, isLoading }
}

/**
 * Hook for logout functionality
 */
export function useLogout() {
  const { logout } = useAuthContext()
  return { logout }
}

