/**
 * ProtectedRoute Component
 * 
 * Provides route-level authentication and authorization protection.
 * Redirects unauthenticated users to login page with return path.
 * Supports optional role-based access control.
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStatus, useUser } from '../../hooks/useAuth';
import { UserRole } from '../../types/domain';

/**
 * Props for ProtectedRoute component
 */
export interface ProtectedRouteProps {
  /** The component/content to render when authenticated */
  children: React.ReactNode;
  
  /** Required role(s) for access - if not provided, any authenticated user can access */
  requiredRole?: UserRole | UserRole[];
  
  /** Custom redirect path for unauthenticated users (defaults to /login) */
  redirectTo?: string;
  
  /** Whether to show loading state during auth initialization */
  showLoading?: boolean;
  
  /** Custom loading component */
  fallback?: React.ReactNode;
}

/**
 * Default loading component
 */
const DefaultLoadingFallback: React.FC = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: 'var(--myc-color-text-secondary, #8c8c8c)',
    }}
  >
    Loading...
  </div>
);

/**
 * ProtectedRoute Component
 * 
 * Wraps components that require authentication. Features:
 * - Authentication checking with loading states
 * - Automatic redirect to login with return path
 * - Optional role-based access control
 * - Customizable loading and redirect behavior
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  redirectTo = '/login',
  showLoading = true,
  fallback,
}) => {
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAuthStatus();
  const { user, hasRole, hasAnyRole } = useUser();

  // Show loading state during auth initialization
  if (!isInitialized && showLoading) {
    return fallback || <DefaultLoadingFallback />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Create return path with current location
    const searchParams = new URLSearchParams();
    searchParams.set('from', `${location.pathname}${location.search}`);
    
    return (
      <Navigate
        to={`${redirectTo}?${searchParams.toString()}`}
        replace
      />
    );
  }

  // Check role-based access if required
  if (requiredRole && user) {
    const hasAccess = Array.isArray(requiredRole)
      ? hasAnyRole(requiredRole)
      : hasRole(requiredRole);

    if (!hasAccess) {
      // Redirect to unauthorized page or dashboard
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render protected content
  return <>{children}</>;
};

/**
 * Higher-order component version of ProtectedRoute
 */
export const withProtectedRoute = <P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) => {
  return (props: P) => (
    <ProtectedRoute {...options}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

export default ProtectedRoute;
