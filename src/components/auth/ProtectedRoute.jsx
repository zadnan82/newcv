import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  // Get authentication state and user info
  const { isAuthenticated, user } = useAuthStore.getState();
  const authenticated = isAuthenticated();
  
  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If this is an admin-only route and the user is not an admin, redirect to home
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has required role (if any)
  return children;
};

export default ProtectedRoute;