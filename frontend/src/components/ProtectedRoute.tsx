import { Navigate } from 'react-router-dom'
import { useAuthStore } from '~/store/auth.store'

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to='/login' />

  return children
}
