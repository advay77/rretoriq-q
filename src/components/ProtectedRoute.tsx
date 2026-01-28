import React, { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// LoadingSpinner component inline
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-white">
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Loading...</p>
    </div>
  </div>
)

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireProfileCompletion?: boolean
  redirectTo?: string
}

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireProfileCompletion = true,
  redirectTo = '/login' 
}: ProtectedRouteProps) => {
  const { 
    isAuthenticated, 
    user, 
    profileCompleted, 
    isNewUser, 
    isLoading,
    checkProfileCompletion 
  } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    // Re-check profile completion on route change
    if (user && requireProfileCompletion) {
      checkProfileCompletion(user.id)
    }
  }, [user, checkProfileCompletion, requireProfileCompletion])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  if (!requireAuth && isAuthenticated) {
    // Allow access to profile completion even if authenticated
    if (location.pathname === '/complete-profile') {
      return <>{children}</>
    }
    
    // Check if profile needs completion first
    if ((!profileCompleted || isNewUser) && location.pathname !== '/complete-profile') {
      return <Navigate to="/complete-profile" replace />
    }
    
    // Redirect authenticated users based on their role
    if (user?.admin) {
      return <Navigate to="/admin/dashboard" replace />
    }
    
    return <Navigate to="/dashboard" replace />
  }

  // Allow access to profile completion page
  if (location.pathname === '/complete-profile') {
    return <>{children}</>
  }

  // Allow admin users to bypass profile completion to access admin dashboard
  if (user?.admin && location.pathname.startsWith('/admin')) {
    return <>{children}</>
  }

  // Redirect to profile completion if required and not completed
  if (requireAuth && requireProfileCompletion && (!profileCompleted || isNewUser)) {
    return <Navigate to="/complete-profile" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute