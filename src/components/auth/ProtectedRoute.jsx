// src/components/auth/ProtectedRoute.jsx - Updated for cloud storage
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = ({ children, requireCloudStorage = true }) => {
  const { sessionToken, cloudProviders } = useAuthStore();
  
  // Check if we have an active session
  if (!sessionToken) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if cloud storage is required and connected
  if (requireCloudStorage && (!cloudProviders || cloudProviders.length === 0)) {
    return <Navigate to="/login" replace />;
  }
  
  // User has session and required cloud storage
  return children;
};

export default ProtectedRoute;