/**
 * Authentication API Client
 *
 * Provides endpoints for:
 * - login (public)
 * - logout (authenticated)
 * - refresh token (public - cookie-based refresh)
 * - getProfile (authenticated)
 * - updateProfile (authenticated)
 */

import { httpClient } from './http';
import type { AxiosResponse } from 'axios';
import type {
  LoginCredentials,
  AuthResponse,
  UpdateProfileRequest,
  User,
} from '../types/domain';

/**
 * API paths (adjust to your backend routes)
 */
const AUTH_ROUTES = {
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  profile: '/auth/me',
  updateProfile: '/auth/me',
};

export const authAPI = {
  /**
   * Login endpoint (public)
   * Returns AuthResponse: user + accessToken (refresh via httpOnly cookie is assumed server-side)
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const res: AxiosResponse<AuthResponse> = await httpClient.post(
      AUTH_ROUTES.login,
      credentials,
      {
        skipAuth: true, // This request must not attach an expired token
        skipErrorHandling: false,
        timeout: 15000,
      }
    );
    return res.data;
  },

  /**
   * Logout endpoint (authenticated)
   * Invalidates refresh token server-side; client will clear access token
   */
  async logout(): Promise<void> {
    await httpClient.post(
      AUTH_ROUTES.logout,
      {},
      {
        skipErrorHandling: false,
      }
    );
  },

  /**
   * Refresh token endpoint (public)
   * Server should read refresh token from httpOnly cookie and issue new access token
   */
  async refreshToken(): Promise<{ accessToken: string; expiresIn?: number }> {
    const res: AxiosResponse<{ accessToken: string; expiresIn?: number }> =
      await httpClient.post(
        AUTH_ROUTES.refresh,
        {},
        {
          skipAuth: true,
          skipErrorHandling: true, // handled silently by auth store
          timeout: 15000,
        }
      );
    return res.data;
  },

  /**
   * Get current user profile (authenticated)
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
   */
  async updateProfile(input: UpdateProfileRequest): Promise<User> {
    const res: AxiosResponse<{ data?: User } & User> = await httpClient.put(
      AUTH_ROUTES.updateProfile,
      input
    );
    return (res.data as any)?.data ?? (res.data as any);
  },
};

