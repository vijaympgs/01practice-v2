import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * PrivateRoute Component
 * 
 * Protects all routes that require authentication.
 * ALWAYS redirects to /login if user is not authenticated.
 * No development mode bypass - authentication is required in all environments.
 */
const PrivateRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // ALWAYS require authentication - no bypasses
  // This ensures users must login before accessing any protected routes
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;














