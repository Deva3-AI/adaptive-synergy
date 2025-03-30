
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [] 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();
  
  // For debugging
  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, user, allowedRoles });
  }, [isAuthenticated, loading, user, allowedRoles]);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Use localStorage directly as a fallback
  const hasTokenInLocalStorage = localStorage.getItem('token') !== null;
  const userInLocalStorage = localStorage.getItem('user');
  const isActuallyAuthenticated = isAuthenticated || hasTokenInLocalStorage;
  
  console.log('ProtectedRoute - Fallback check:', { 
    hasTokenInLocalStorage, 
    userInLocalStorage,
    isActuallyAuthenticated
  });
  
  // Redirect to login if not authenticated
  if (!isActuallyAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // For role checking, use user from context or from localStorage
  const effectiveUser = user || (userInLocalStorage ? JSON.parse(userInLocalStorage) : null);
  
  // Check if user role is allowed (if roles specified)
  if (allowedRoles.length > 0 && effectiveUser && !allowedRoles.includes(effectiveUser.role)) {
    console.log('Role not allowed, redirecting based on role', effectiveUser.role);
    // Redirect based on user role
    const redirectPath = effectiveUser.role === 'admin' 
      ? '/app' 
      : `/app/${effectiveUser.role}/dashboard`;
    
    return <Navigate to={redirectPath} replace />;
  }
  
  console.log('All checks passed, rendering children');
  // Render children if authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
