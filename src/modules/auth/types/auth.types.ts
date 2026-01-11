export interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  channel?: Channel
}

export interface Channel {
  id: string
  handle: string
  avatarPath?: string
  bannerPath?: string
  bio?: string
}

export interface LoginDto {
  email: string
  password: string
  recaptchaToken?: string
}

export interface RegisterDto {
  email: string
  password: string
  confirmPassword: string
  name?: string
  recaptchaToken?: string
}

export interface AuthResponse {
  account: User
  accessToken: string
}

export interface RefreshResponse {
  accessToken: string
}

export interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginDto) => Promise<void>
  register: (data: RegisterDto) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}
