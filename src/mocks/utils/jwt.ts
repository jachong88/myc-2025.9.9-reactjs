/**
 * JWT Utilities for MSW Mocks
 * 
 * Generate realistic JWT tokens for testing
 */

import type { User } from '../../shared/types/domain';

// Mock JWT header and signature (these don't need to be valid)
const JWT_HEADER = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
const JWT_SIGNATURE = 'mock-signature-for-testing';

/**
 * Generate a realistic JWT token for a user
 */
export function generateMockJWT(user: User, expiresInSeconds: number = 3600): string {
  const now = Math.floor(Date.now() / 1000);
  
  const payload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    roles: [user.role],
    iat: now,
    exp: now + expiresInSeconds,
    aud: 'myc-frontend',
    iss: 'myc-backend'
  };

  // Base64 encode the payload
  const payloadBase64 = btoa(JSON.stringify(payload))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${JWT_HEADER}.${payloadBase64}.${JWT_SIGNATURE}`;
}

/**
 * Generate a mock refresh token
 */
export function generateMockRefreshToken(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Decode mock JWT payload (for testing purposes)
 */
export function decodeMockJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

/**
 * Check if mock JWT is expired
 */
export function isMockJWTExpired(token: string): boolean {
  const payload = decodeMockJWT(token);
  if (!payload || !payload.exp) return true;
  
  return payload.exp < Math.floor(Date.now() / 1000);
}