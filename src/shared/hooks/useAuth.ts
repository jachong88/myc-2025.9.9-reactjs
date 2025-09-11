/**
 * useAuth Hook
 * 
 * Provides a clean, convenient interface for authentication functionality
 * Wraps the Zustand authentication store with React hooks patterns
 */

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import type { LoginCredentials, User } from '../types/domain';

/**
 * Authentication Hook Return Type
 */
export interface UseAuthReturn {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;

  // Role & Permission Helpers
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: boolean;
  canAccess: (resource: string) => boolean;
}

/**
 * Main Authentication Hook
 * 
 * Provides complete authentication functionality in a single hook
 * 
 * @example
 * ```tsx
 * function LoginForm() {
 *   const { login, isLoading, error, clearError } = useAuth();
 *   
 *   const handleLogin = async (credentials) => {
 *     try {
 *       await login(credentials);
 *     } catch (error) {
 *       // Error handling is automatic via the store
 *     }
 *   };
 * }
 * ```
 */
export function useAuth(): UseAuthReturn {
  const store = useAuthStore();

  // Memoize role check for current user (computed from store state)
  const isAdmin = store.user?.role === 'admin';

  return {
    // State
    isAuthenticated: store.isAuthenticated,
    user: store.user,
    isLoading: store.isLoading,
    error: store.error,
    isInitialized: store.isInitialized,

    // Actions
    login: store.login,
    logout: store.logout,
    clearError: store.clearError,
    refreshToken: store.refreshToken,
    updateUser: store.updateUser,

    // Role & Permission Helpers (with computed values for performance)
    hasRole: store.hasRole,
    hasAnyRole: store.hasAnyRole,
    isAdmin,
    canAccess: store.canAccess,
  };
}

/**
 * Authentication Status Hook
 * 
 * Lightweight hook that only provides authentication status
 * Useful for components that only need to know if user is logged in
 */
export function useAuthStatus() {
  return useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
  }));
}

/**
 * Authentication Actions Hook
 * 
 * Provides only the action functions, useful for forms and handlers
 * Avoids re-renders when only state changes
 */
export function useAuthActions() {
  return useAuthStore((state) => ({
    login: state.login,
    logout: state.logout,
    clearError: state.clearError,
    refreshToken: state.refreshToken,
    updateUser: state.updateUser,
  }));
}

/**
 * User Information Hook
 * 
 * Provides current user data and role information
 * Re-renders only when user data changes
 */
export function useUser() {
  return useAuthStore((state) => ({
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    hasRole: state.hasRole,
    hasAnyRole: state.hasAnyRole,
    isAdmin: state.isAdmin,
    canAccess: state.canAccess,
  }));
}

/**
 * Authentication Initialization Hook
 * 
 * Handles authentication initialization on app startup
 * Should be called once at the root of the application
 * 
 * @param autoInitialize - Whether to automatically initialize on mount (default: true)
 */
export function useInitializeAuth(autoInitialize: boolean = true) {
  const { initializeAuth, isInitialized } = useAuthStore((state) => ({
    initializeAuth: state.initializeAuth,
    isInitialized: state.isInitialized,
  }));

  const initialize = useCallback(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  useEffect(() => {
    if (autoInitialize) {
      initialize();
    }
  }, [autoInitialize, initialize]);

  return {
    initialize,
    isInitialized,
  };
}

/**
 * Role Guard Hook
 * 
 * Provides role-based conditional rendering and access control
 * 
 * @param requiredRole - The role required to access the resource
 * @param fallback - What to return if user doesn't have the role
 * 
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { canRender, hasAccess } = useRoleGuard('admin');
 *   
 *   if (!canRender) {
 *     return <div>Access Denied</div>;
 *   }
 *   
 *   return <AdminContent />;
 * }
 * ```
 */
export function useRoleGuard(requiredRole: string | string[]) {
  const { isAuthenticated, hasRole, hasAnyRole } = useUser();

  const hasAccess = isAuthenticated && (
    typeof requiredRole === 'string' 
      ? hasRole(requiredRole)
      : hasAnyRole(requiredRole)
  );

  return {
    hasAccess,
    canRender: hasAccess,
    isAuthenticated,
  };
}

/**
 * Resource Access Hook
 * 
 * Checks if the current user can access a specific resource
 * Useful for conditional UI rendering and navigation guards
 * 
 * @param resource - The resource identifier to check access for
 * 
 * @example
 * ```tsx
 * function UserList() {
 *   const { canAccess } = useResourceAccess('users-management');
 *   
 *   return (
 *     <div>
 *       {canAccess && <AddUserButton />}
 *       <UserTable />
 *     </div>
 *   );
 * }
 * ```
 */
export function useResourceAccess(resource: string) {
  const { canAccess, isAuthenticated, user } = useUser();

  return {
    canAccess: canAccess(resource),
    isAuthenticated,
    userRole: user?.role,
  };
}

/**
 * Authentication Error Hook
 * 
 * Handles authentication errors with automatic cleanup
 * Useful for displaying error messages with timeout
 * 
 * @param autoClearTimeout - Milliseconds after which to auto-clear errors (default: 5000)
 */
export function useAuthError(autoClearTimeout: number = 5000) {
  const { error, clearError } = useAuthStore((state) => ({
    error: state.error,
    clearError: state.clearError,
  }));

  // Auto-clear errors after timeout
  useEffect(() => {
    if (error && autoClearTimeout > 0) {
      const timer = setTimeout(() => {
        clearError();
      }, autoClearTimeout);

      return () => clearTimeout(timer);
    }
  }, [error, clearError, autoClearTimeout]);

  return {
    error,
    hasError: Boolean(error),
    clearError,
  };
}

/**
 * Login Hook
 * 
 * Specialized hook for login operations with enhanced state management
 * Provides additional login-specific state and helpers
 */
export function useLogin() {
  const { login, isLoading, error, clearError, isAuthenticated } = useAuth();

  const performLogin = useCallback(async (credentials: LoginCredentials) => {
    clearError(); // Clear any previous errors
    try {
      await login(credentials);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, [login, clearError]);

  return {
    login: performLogin,
    isLoggingIn: isLoading,
    error,
    clearError,
    isAuthenticated,
  };
}

/**
 * Logout Hook
 * 
 * Specialized hook for logout operations
 * Provides logout-specific state and confirmation handling
 */
export function useLogout() {
  const { logout, isLoading } = useAuth();

  const performLogout = useCallback(async () => {
    try {
      await logout();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }, [logout]);

  return {
    logout: performLogout,
    isLoggingOut: isLoading,
  };
}
