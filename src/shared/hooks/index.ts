/**
 * Shared Hooks Barrel Export
 * 
 * Centralized exports for all shared hooks
 * Provides clean imports throughout the application
 * 
 * Usage:
 * import { useAuth, useLogin, useRoleGuard } from '@/shared/hooks';
 */

// Authentication Hooks
export {
  useAuth,
  useAuthStatus,
  useAuthActions,
  useUser,
  useInitializeAuth,
  useRoleGuard,
  useResourceAccess,
  useAuthError,
  useLogin,
  useLogout,
} from './useAuth';

// Re-export types
export type { UseAuthReturn } from './useAuth';
