'use client'

import { useState, useCallback } from 'react'
import type { User } from '../types/auth.types'

// Mock user data - in real app this would come from API
const MOCK_USER: User = {
	id: '1',
	email: 'demo@mytube.com',
	name: 'Demo User',
	emailVerified: true,
	createdAt: new Date().toISOString(),
	channel: {
		id: 'ch-1',
		handle: 'demo-channel',
		avatarPath: null,
	},
}

export const AUTH_QUERY_KEY = ['auth', 'profile']

export function useAuth() {
	// For demo purposes, start authenticated
	// Set to `null` to start as logged out
	const [user, setUser] = useState<User | null>(MOCK_USER)
	const [isLoading] = useState(false)

	const login = useCallback(() => {
		setUser(MOCK_USER)
	}, [])

	const logout = useCallback(() => {
		setUser(null)
	}, [])

	return {
		user,
		isLoading,
		isAuthenticated: !!user,
		error: null,
		login,
		logout,
	}
}

// Simplified hooks for compatibility
export function useLogin() {
	const { login } = useAuth()
	return {
		mutate: login,
		isPending: false,
	}
}

export function useRegister() {
	const { login } = useAuth()
	return {
		mutate: login,
		isPending: false,
	}
}

export function useLogout() {
	const { logout } = useAuth()
	return {
		mutate: logout,
		isPending: false,
	}
}

