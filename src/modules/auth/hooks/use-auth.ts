import { useAuthContext } from '../context/context'

export function useAuth() {
  return useAuthContext()
}

export function useLogin() {
  const { login, isLoading } = useAuthContext()
  return { login, isLoading }
}

export function useCurrentUser() {
  const { user, isLoading } = useAuthContext()
  return { user, isLoading }
}

export function useRegister() {
  const { register, isLoading } = useAuthContext()
  return { register, isLoading }
}

export function useLogout() {
  const { logout } = useAuthContext()
  return { logout }
}
