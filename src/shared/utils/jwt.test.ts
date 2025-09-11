/**
 * JWT Utilities Test Suite
 * 
 * Comprehensive tests for JWT utilities functionality
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  decodeToken, 
  isTokenExpired, 
  getTokenExpiryMs, 
  setAccessToken, 
  getAccessToken, 
  clearTokens,
  secondsUntilExpiry 
} from './jwt';

// Sample JWT token for testing (expired, safe to use)
// Payload: {"sub":"user123","email":"test@example.com","roles":["user"],"iat":1600000000,"exp":1600003600}
const SAMPLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE2MDAwMDAwMDAsImV4cCI6MTYwMDAwMzYwMH0.f1nLxU5_JF8TjU8x0q3g_GfC7Qm1BHJ8FH7yKqO_5QM';

// Invalid token for testing
const INVALID_TOKEN = 'invalid.jwt.token';

describe('JWT Utilities', () => {
  beforeEach(() => {
    // Clear tokens before each test
    clearTokens();
  });

  describe('decodeToken', () => {
    it('should decode a valid JWT token', () => {
      const decoded = decodeToken(SAMPLE_TOKEN);
      
      expect(decoded).toBeTruthy();
      expect(decoded?.sub).toBe('user123');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.roles).toEqual(['user']);
      expect(decoded?.iat).toBe(1600000000);
      expect(decoded?.exp).toBe(1600003600);
    });

    it('should return null for invalid token', () => {
      const decoded = decodeToken(INVALID_TOKEN);
      expect(decoded).toBeNull();
    });

    it('should return null for empty token', () => {
      const decoded = decodeToken('');
      expect(decoded).toBeNull();
    });
  });

  describe('isTokenExpired', () => {
    it('should return true for expired token', () => {
      const expired = isTokenExpired(SAMPLE_TOKEN);
      expect(expired).toBe(true);
    });

    it('should return true for invalid token', () => {
      const expired = isTokenExpired(INVALID_TOKEN);
      expect(expired).toBe(true);
    });

    it('should return true for empty token', () => {
      const expired = isTokenExpired('');
      expect(expired).toBe(true);
    });
  });

  describe('token storage', () => {
    it('should store and retrieve access token', () => {
      setAccessToken(SAMPLE_TOKEN);
      const retrieved = getAccessToken();
      expect(retrieved).toBe(SAMPLE_TOKEN);
    });

    it('should return null when no token is stored', () => {
      const token = getAccessToken();
      expect(token).toBeNull();
    });

    it('should clear tokens', () => {
      setAccessToken(SAMPLE_TOKEN);
      expect(getAccessToken()).toBe(SAMPLE_TOKEN);
      
      clearTokens();
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('getTokenExpiryMs', () => {
    it('should return expiry time in milliseconds', () => {
      const expiryMs = getTokenExpiryMs(SAMPLE_TOKEN);
      expect(expiryMs).toBe(1600003600 * 1000); // exp * 1000
    });

    it('should return null for invalid token', () => {
      const expiryMs = getTokenExpiryMs(INVALID_TOKEN);
      expect(expiryMs).toBeNull();
    });
  });

  describe('secondsUntilExpiry', () => {
    it('should return 0 for expired token', () => {
      const secondsLeft = secondsUntilExpiry(SAMPLE_TOKEN);
      expect(secondsLeft).toBe(0);
    });

    it('should return null for invalid token', () => {
      const secondsLeft = secondsUntilExpiry(INVALID_TOKEN);
      expect(secondsLeft).toBeNull();
    });
  });
});
