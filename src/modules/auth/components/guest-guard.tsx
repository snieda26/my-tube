'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/use-auth'

interface GuestGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function GuestGuard({
  children,
  redirectTo = '/',
}: GuestGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, router, redirectTo])

  if (isLoading) {
    return null
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}

