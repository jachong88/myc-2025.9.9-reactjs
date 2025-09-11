/**
 * Authentication Zustand Store
 * 
 * Manages Firebase Google authentication state, login/logout operations, and user management
 * Integrates with Firebase Auth for secure authentication handling
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { User, LoginCredentials, AuthResponse } from '../types/domain';
import { auth, googleProvider } from '../../config/firebase';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  type User as FirebaseUser
} from 'firebase/auth';

/**
 * Authentication State Interface
 */
interface AuthState {
  // State
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // Tracks if auth state has been restored from Firebase

  // Actions
  login: (credentials?: LoginCredentials) => Promise<void>; // Made optional for Firebase Google auth
  logout: () => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
  refreshToken: () => Promise<void>; // Not needed for Firebase, but kept for compatibility
  updateUser: (user: Partial<User>) => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  
  // Helpers/Selectors
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  isAdmin: () => boolean;
  canAccess: (resource: string) => boolean;
}

/**
 * Convert Firebase User to Application User
 */
function firebaseUserToAppUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'User',
    email: firebaseUser.email || '',
    role: 'student', // Default role, can be customized based on your business logic
    status: 'active',
    deleted: false,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
    updatedAt: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
  };
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
       * Login Action - Firebase Google Authentication
       * Handles Google sign-in using Firebase popup
       */
      login: async (credentials?: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Sign in with Google using Firebase popup
          const result = await signInWithPopup(auth, googleProvider);
          const firebaseUser = result.user;
          
          // Convert Firebase user to application user format
          const user = firebaseUserToAppUser(firebaseUser);

          // Update authentication state
          set({
            isAuthenticated: true,
            user,
            isLoading: false,
            error: null,
          });

          console.log('✅ Google login successful:', user.email);
        } catch (error: any) {
          let errorMessage = 'Login failed';
          
          // Handle specific Firebase auth errors
          if (error.code) {
            switch (error.code) {
              case 'auth/popup-closed-by-user':
                errorMessage = 'Login cancelled by user';
                break;
              case 'auth/popup-blocked':
                errorMessage = 'Popup blocked by browser. Please allow popups and try again.';
                break;
              case 'auth/cancelled-popup-request':
                errorMessage = 'Login request cancelled';
                break;
              case 'auth/network-request-failed':
                errorMessage = 'Network error. Please check your connection and try again.';
                break;
              default:
                errorMessage = error.message || 'Login failed';
            }
          }

          set({
            isLoading: false,
            error: errorMessage,
            isAuthenticated: false,
            user: null,
          });
          
          throw new Error(errorMessage);
        }
      },

      /**
       * Logout Action - Firebase Sign Out
       * Clears authentication state and signs out from Firebase
       */
      logout: async () => {
        set({ isLoading: true });

        try {
          // Sign out from Firebase
          await signOut(auth);
          
          // Clear local state
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
          
          console.log('✅ Logout completed');
        } catch (error) {
          console.warn('⚠️ Logout error:', error);
          
          // Even if logout fails, clear local state
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null,
          });
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
       * Sets up Firebase auth state listener and restores authentication
       */
      initializeAuth: async () => {
        set({ isLoading: true });

        try {
          // Set up Firebase auth state listener
          const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              // User is signed in
              const user = firebaseUserToAppUser(firebaseUser);
              set({
                isAuthenticated: true,
                user,
                isLoading: false,
                isInitialized: true,
              });
              console.log('✅ Firebase auth state restored:', user.email);
            } else {
              // User is signed out
              set({
                isAuthenticated: false,
                user: null,
                isLoading: false,
                isInitialized: true,
              });
              console.log('ℹ️ No Firebase authentication found');
            }
          });

          // Store unsubscribe function for cleanup (you might want to handle this in app cleanup)
          // For now, we'll let it run for the app lifetime
        } catch (error) {
          console.error('❌ Failed to initialize Firebase authentication:', error);
          
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: 'Failed to initialize authentication',
            isInitialized: true,
          });
        }
      },

      /**
       * Refresh Token Action
       * Firebase handles token refresh automatically, so this is a no-op
       * Kept for compatibility with existing code
       */
      refreshToken: async () => {
        // Firebase handles token refresh automatically
        console.log('🔄 Firebase handles token refresh automatically');
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
       * For Firebase, this would involve updating the user profile
       * This is a placeholder implementation
       */
      updateProfile: async (profileData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) {
          throw new Error('No user logged in');
        }

        set({ isLoading: true, error: null });

        try {
          // In a real implementation, you might update Firebase user profile
          // and/or sync with your backend database
          
          // For now, just update local state
          const updatedUser = { ...currentUser, ...profileData };
          set({
            user: updatedUser,
            isLoading: false,
          });
          
          console.log('✅ Profile updated successfully (local only)');
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
