/**
 * JWT Utilities for MYC
 *
 * - Decode and validate JWT tokens
 * - Manage secure storage of access and refresh tokens
 * - Provide helpers for token lifecycle operations
 *
 * Security Model:
 * - Access Token: kept in memory (not persisted) to minimize XSS risk
 * - Refresh Token: stored in httpOnly cookie (set by server), read via server-only; client only triggers refresh endpoint
 *
 * Note: This client utility only handles ACCESS token storage locally.
 * Refresh token handling is via API calls that set httpOnly cookies.
 */

import Cookies from 'js-cookie';

export interface JWTPayload {
  sub: string;           // subject (user id)
  email?: string;
  roles?: string[];
  iat?: number;          // issued at (seconds)
  exp?: number;          // expiration time (seconds)
  nbf?: number;          // not before (seconds)
  iss?: string;          // issuer
  aud?: string | string[]; // audience
  [key: string]: any;
}

// In-memory access token storage
let ACCESS_TOKEN: string | null = null;

// Cookie names (server should manage refresh token cookie httpOnly)
const REFRESH_COOKIE = 'refresh_token'; // httpOnly cookie set by server
const ACCESS_HEADER = 'Authorization';

/**
 * Base64 decode with URL-safe replacement
 */
function base64UrlDecode(input: string): string {
  try {
    // Replace URL-safe characters
    const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
}

/**
 * Decode a JWT token payload safely
 */
export function decodeToken(token: string): JWTPayload | null {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = base64UrlDecode(parts[1]);
  try {
    return JSON.parse(payload) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Get token expiration in milliseconds (epoch ms)
 */
export function getTokenExpiryMs(token: string): number | null {
  const payload = decodeToken(token);
  if (!payload?.exp) return null;
  return payload.exp * 1000;
}

/**
 * Determine if the token is expired (with optional skew in seconds)
 */
export function isTokenExpired(token: string, skewSeconds = 30): boolean {
  const expMs = getTokenExpiryMs(token);
  if (!expMs) return true;
  const now = Date.now();
  return now >= expMs - skewSeconds * 1000;
}

/**
 * Store access token in memory (never persist)
 */
export function setAccessToken(token: string | null) {
  ACCESS_TOKEN = token;
}

/**
 * Get current access token from memory
 */
export function getAccessToken(): string | null {
  return ACCESS_TOKEN;
}

/**
 * Clear all tokens (access in memory and refresh via cookie deletion request)
 * Note: Deleting httpOnly cookies must be initiated server-side.
 * This function will attempt to clear a non-httpOnly cookie if present (dev fallback).
 */
export function clearTokens() {
  ACCESS_TOKEN = null;
  // Best-effort client-side cookie removal (if not httpOnly in dev)
  Cookies.remove(REFRESH_COOKIE);
}

/**
 * Helper to check if a refresh cookie exists (non-httpOnly dev only)
 */
export function hasRefreshCookie(): boolean {
  return Boolean(Cookies.get(REFRESH_COOKIE));
}

/**
 * Header helper for Authorization
 */
export function withAuthHeader(headers: Record<string, any> = {}) {
  const token = getAccessToken();
  if (token) {
    headers[ACCESS_HEADER] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Get token expiration timestamp in milliseconds
 * Alias for getTokenExpiryMs for consistency with AutoLogout component
 */
export function getTokenExpiration(token: string): number | null {
  return getTokenExpiryMs(token);
}

/**
 * Compute remaining seconds to token expiry (or null)
 */
export function secondsUntilExpiry(token: string): number | null {
  const expMs = getTokenExpiryMs(token);
  if (!expMs) return null;
  return Math.max(0, Math.floor((expMs - Date.now()) / 1000));
}

