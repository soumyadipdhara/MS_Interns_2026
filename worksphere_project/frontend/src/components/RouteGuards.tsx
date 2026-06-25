import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FullPageLoader } from './Loaders'

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return <Outlet />
}

export function AdminRoute() {
  const { isAdmin, isLoading } = useAuth()

  if (isLoading) return <FullPageLoader />
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
