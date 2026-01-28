import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

/**
 * Protected route component for admin-only pages
 * Checks if user has admin custom claim
 */
const AdminRoute = () => {
  const { user, isLoading } = useAuthStore();
  const { refreshClaims } = useAuthStore();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/admin/dashboard' }} />;
  }

  // Check for admin custom claim
  // Note: Custom claims are available in the ID token
  const isAdmin = user.admin === true;

  // Try to refresh claims once on mount if the user exists but isn't marked admin yet.
  // This covers the case where admin claim was set server-side after the user logged in.
  useEffect(() => {
    if (user && !isAdmin) {
      // refreshClaims is async but we don't need to await here
      refreshClaims().catch(err => console.warn('AdminRoute: refreshClaims failed', err))
    }
  }, [user, isAdmin, refreshClaims])

  // Redirect to home if not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have administrator privileges to access this page.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  // User is an admin, render the protected routes
  return <Outlet />;
};

export default AdminRoute;
