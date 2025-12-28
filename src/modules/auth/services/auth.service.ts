/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

import apiClient from '@/infrastructure/api/client'
import Cookies from 'js-cookie'
import { AUTH_ENDPOINTS } from '../config/api.config'
import type {
  LoginDto,
  RegisterDto,
  AuthResponse,
  RefreshResponse,
  User,
} from '../types/auth.types'

class AuthService {
  /**
   * Register new user account
   */
  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    )

    // Store access token in httpOnly-like cookie
    this.setAccessToken(response.data.accessToken)

    return response.data
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      AUTH_ENDPOINTS.LOGIN,
      credentials
    )

    // Store access token
    this.setAccessToken(response.data.accessToken)

    return response.data
  }

  /**
   * Logout user and clear tokens
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT)
    } finally {
      // Always clear token, even if API call fails
      this.clearAccessToken()
    }
  }

  /**
   * Refresh access token using refresh token cookie
   */
  async refreshToken(): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>(
      AUTH_ENDPOINTS.REFRESH
    )

    this.setAccessToken(response.data.accessToken)

    return response.data
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(AUTH_ENDPOINTS.PROFILE)
    return response.data
  }

  /**
   * Get current access token from cookies
   */
  getAccessToken(): string | undefined {
    return Cookies.get('accessToken')
  }

  /**
   * Store access token in cookie
   */
  private setAccessToken(token: string): void {
    Cookies.set('accessToken', token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
  }

  /**
   * Clear access token from cookie
   */
  private clearAccessToken(): void {
    Cookies.remove('accessToken')
  }
}

export const authService = new AuthService()

