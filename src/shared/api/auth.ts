/**
 * Authentication API Client
 * 
 * Updated for Firebase Google Authentication
 * Provides minimal API functions for user profile management
 * Firebase handles authentication directly through the client SDK
 */

import { httpClient } from './http';
import type { AxiosResponse } from 'axios';
import type {
  UpdateProfileRequest,
  User,
} from '../types/domain';

/**
 * API paths for profile management
 * Authentication is now handled by Firebase
 */
const AUTH_ROUTES = {
  profile: '/auth/me',
  updateProfile: '/auth/me',
};

export const authAPI = {
  /**
   * Get current user profile (authenticated)
   * This might be used to sync additional user data from your backend
   * that's not stored in Firebase (like user preferences, app-specific data)
   */
  async getProfile(): Promise<User> {
    const res: AxiosResponse<{ data?: User } & User> = await httpClient.get(
      AUTH_ROUTES.profile
    );
    // Support both envelope {data} or direct payload
    return (res.data as any)?.data ?? (res.data as any);
  },

  /**
   * Update current user profile (authenticated)
   * This might be used to sync profile changes to your backend
   * Firebase user profile updates should be handled separately
   */
  async updateProfile(input: UpdateProfileRequest): Promise<User> {
    const res: AxiosResponse<{ data?: User } & User> = await httpClient.put(
      AUTH_ROUTES.updateProfile,
      input
    );
    return (res.data as any)?.data ?? (res.data as any);
  },

  /**
   * Sync Firebase user to backend (optional)
   * This could be used to sync Firebase user data with your backend database
   * Call this after Firebase authentication completes
   */
  async syncFirebaseUser(firebaseUser: {
    uid: string;
    email: string;
    displayName: string;
  }): Promise<User> {
    const res: AxiosResponse<{ data?: User } & User> = await httpClient.post(
      '/auth/sync-firebase-user',
      firebaseUser,
      {
        skipAuth: false, // Use Firebase ID token for authentication
        skipErrorHandling: false,
        timeout: 15000,
      }
    );
    return (res.data as any)?.data ?? (res.data as any);
  },
};

// Legacy functions removed:
// - login(): Now handled by Firebase signInWithPopup
// - logout(): Now handled by Firebase signOut  
// - refreshToken(): Now handled automatically by Firebase

