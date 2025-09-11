/**
 * Authentication Zustand Store
 * 
 * Manages user authentication state, login/logout operations, and token management
 * Integrates with JWT utilities for secure token handling
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, LoginCredentials, AuthResponse } from '../types/domain';
import { 
  setAccessToken, 
  getAccessToken, 
  clearTokens, 
  decodeToken, 
  isTokenExpired 
} from '../utils/jwt';
import { authAPI } from '../api/auth';

/**
 * Authentication State Interface
 */
interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Tracks if auth state has been restored from storage

  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  
  // Helpers/Selectors
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  canAccess: (resource: string) => boolean;
}

/**
 * Authentication Store Implementation
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
      isInitialized: false,

      /**
       * Login Action
       * Handles user authentication and token storage
       */
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Call real API for authentication
          const authResponse = await authAPI.login(credentials);
          
          // Store the access token from server
          setAccessToken(authResponse.accessToken);

          // Determine user: prefer server user data, fallback to token payload
          let user: User | null = authResponse.user ?? null;
          if (!user) {
            const payload = decodeToken(authResponse.accessToken);
            if (payload) {
              user = {
                id: payload.sub,
                name: (payload as any).name || 'User',
                email: payload.email || credentials.email,
                role: (payload.roles?.[0] as any) || 'student',
                status: 'active' as any,
                deleted: false,
                createdAt: '',
                updatedAt: '',
              };
            }
          }

          // Update authentication state
          set({
            isAuthenticated: true,
            user: user!,
            isLoading: false,
            error: null,
          });

          console.log('✅ Login successful:', user?.email);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          
          // Clear any stored tokens on login failure
          clearTokens();
          throw error;
        }
      },

      /**
       * Logout Action
       * Clears authentication state and tokens
       */
      logout: async () => {
        set({ isLoading: true });

        try {
          // Call logout API endpoint to invalidate refresh token on server
          await authAPI.logout();
          console.log('✅ Logout API call successful');
        } catch (error) {
          console.warn('⚠️ Logout API call failed, clearing local state anyway:', error);
        } finally {
          // Always clear local tokens and state regardless of API call result
          clearTokens();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
          console.log('✅ Logout completed - local state cleared');
        }
      },

      /**
       * Clear Error Action
       */
      clearError: () => {
        set({ error: null });
      },

      /**
       * Initialize Authentication State
       * Restores authentication from stored tokens on app startup
       */
      initializeAuth: async () => {
        set({ isLoading: true });

        try {
          const accessToken = getAccessToken();
          
          if (accessToken && !isTokenExpired(accessToken)) {
            // Token exists and is valid
            const payload = decodeToken(accessToken);
            
            if (payload) {
              // Reconstruct basic user from token payload
              let user: User = {
                id: payload.sub,
                name: payload.name || 'User',
                email: payload.email || '',
                role: payload.roles?.[0] as any || 'student' as any,
                status: 'active' as any,
                deleted: false,
                createdAt: '',
                updatedAt: '',
              };

              // Optionally fetch fresh user data from API for complete profile
              try {
                const freshUser = await authAPI.getProfile();
                user = freshUser;
                console.log('✅ Fresh user profile fetched from API');
              } catch (profileError) {
                console.warn('⚠️ Failed to fetch fresh profile, using token data:', profileError);
                // Continue with token-based user data
              }

              set({
                isAuthenticated: true,
                user,
                isLoading: false,
                isInitialized: true,
              });

              console.log('✅ Authentication restored from token');
              return;
            }
          }

          // No valid token found
          clearTokens();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            isInitialized: true,
          });

          console.log('ℹ️ No valid authentication token found');
        } catch (error) {
          console.error('❌ Failed to initialize authentication:', error);
          
          // Clear everything on error
          clearTokens();
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Failed to restore authentication',
            isInitialized: true,
          });
        }
      },

      /**
       * Refresh Token Action
       * Attempts to refresh the access token
       */
      refreshToken: async () => {
        set({ isLoading: true });

        try {
          // Call refresh token API (uses httpOnly cookie)
          const response = await authAPI.refreshToken();
          
          // Update access token in memory
          setAccessToken(response.accessToken);
          
          set({ isLoading: false });
          console.log('🔄 Token refresh successful');
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          
          // If refresh fails, logout user to clear invalid state
          await get().logout();
        }
      },

      /**
       * Update User Action
       * Updates user information in the store (local only)
       */
      updateUser: (userUpdate: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userUpdate }
          });
        }
      },

      /**
       * Update Profile Action
       * Updates user profile via API and updates store
       */
      updateProfile: async (profileData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        set({ isLoading: true, error: null });

        try {
          // Call API to update profile
          const updatedUser = await authAPI.updateProfile(profileData as any);
          
          // Update store with fresh user data from server
          set({
            user: updatedUser,
            isLoading: false,
          });
          
          console.log('✅ Profile updated successfully');
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      /**
       * Role Check Helper
       * Checks if current user has specific role
       */
      hasRole: (role: string) => {
        const user = get().user;
        return user?.role === role;
      },

      /**
       * Multiple Role Check Helper
       * Checks if current user has any of the specified roles
       */
      hasAnyRole: (roles: string[]) => {
        const user = get().user;
        return user ? roles.includes(user.role) : false;
      },

      /**
       * Admin Check Helper
       */
      isAdmin: () => {
        return get().hasRole('admin');
      },

      /**
       * Resource Access Helper
       * Basic permission checking (can be extended)
       */
      canAccess: (resource: string) => {
        const { isAuthenticated, user } = get();
        
        if (!isAuthenticated || !user) return false;

        // Basic role-based access control
        switch (user.role) {
          case 'admin':
            return true; // Admins can access everything
          case 'teacher':
            return !resource.includes('admin'); // Teachers can access non-admin resources
          case 'student':
            return resource.includes('student'); // Students can only access student resources
          default:
            return false;
        }
      },
    }),
    {
      name: 'auth-store', // DevTools name
    }
  )
);

/**
 * Auth Store Direct Access
 * 
 * Note: Prefer using the useAuth hooks from @/shared/hooks for component usage.
 * This store should primarily be used for:
 * - Internal authentication logic
 * - Integration with API interceptors
 * - Advanced state management scenarios
 */
