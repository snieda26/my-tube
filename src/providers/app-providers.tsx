'use client'

import { ReactNode } from 'react'
import { QueryProvider } from './query-provider'
import { AuthProvider } from '@/modules/auth/context/context'
import { Toaster } from 'react-hot-toast'

interface AppProvidersProps {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster position="bottom-right" />
      </AuthProvider>
    </QueryProvider>
  )
}
