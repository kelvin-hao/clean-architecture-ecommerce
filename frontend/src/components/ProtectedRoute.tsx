import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '~/store/auth.store'

const useIsAuthenticated = () => {
  const accessToken = useAuthStore((s) => s.accessToken)
  const refreshToken = useAuthStore((s) => s.refreshToken)

  return Boolean(accessToken || refreshToken)
}

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const isAuthenticated = useIsAuthenticated()

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}`
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectTo)}`} replace />
  }

  return children
}

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const isAuthenticated = useIsAuthenticated()

  if (isAuthenticated) {
    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/'
    return <Navigate to={redirectTo} replace />
  }

  return children
}
