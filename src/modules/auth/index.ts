export { AuthProvider, useAuthContext } from './context/auth.context'

export {
  useAuth,
  useIsAuthenticated,
  useCurrentUser,
  useLogin,
  useRegister,
  useLogout,
} from './hooks/use-auth'

export { AuthGuard } from './components/auth-guard'
export { GuestGuard } from './components/guest-guard'

export { authService } from './services/auth.service'

export type {
  User,
  Channel,
  LoginDto,
  RegisterDto,
  AuthResponse,
  RefreshResponse,
  AuthContextValue,
} from './types/auth.types'

