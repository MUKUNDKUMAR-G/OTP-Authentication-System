import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * ProtectedRoute component wrapper that validates authentication
 * before allowing access to protected routes
 */
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Check for stored token in localStorage
        const token = authService.getToken();
        
        // If no token exists, user is not authenticated
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }
        
        // Validate token by calling /auth/me endpoint
        await authService.getMe(token);
        
        // If validation succeeds, user is authenticated
        setIsAuthenticated(true);
        setIsLoading(false);
      } catch (error) {
        // If token is invalid or missing, clear it and mark as not authenticated
        console.error('Token validation failed:', error);
        authService.clearToken();
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  // Show loading state while validating
  if (isLoading) {
    return (
      <div className="page-container">
        <div className="card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if token is invalid or missing
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Allow access to protected routes if token is valid
  return children;
}

export default ProtectedRoute;
