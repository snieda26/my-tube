/**
 * Auth Module Barrel Export
 */

// Context
export { AuthProvider, useAuthContext } from './context/auth.context'

// Hooks
export {
  useAuth,
  useIsAuthenticated,
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
} from './hooks/use-auth'

// Guards
export { AuthGuard } from './components/auth-guard'
export { GuestGuard } from './components/guest-guard'

// Services
export { authService } from './services/auth.service'

// Types
export type {
  User,
  Channel,
  LoginDto,
  RegisterDto,
  AuthResponse,
  RefreshResponse,
  AuthContextValue,
} from './types/auth.types'

