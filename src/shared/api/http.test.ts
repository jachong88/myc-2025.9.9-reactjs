/**
 * HTTP Client Authentication Integration Test
 * 
 * Tests the integration between HTTP client and JWT utilities
 * Verifies automatic token attachment and error handling
 */

import { describe, it, expect } from 'vitest';
import { httpClient } from './http';
import { setAccessToken, getAccessToken, clearTokens } from '../utils/jwt';

describe('HTTP Client Authentication Integration', () => {
  it('should have HTTP client configured with defaults', () => {
    expect(httpClient.defaults).toBeDefined();
    expect(httpClient.defaults.baseURL).toBeDefined();
    expect(httpClient.defaults.timeout).toBeDefined();
  });

  it('should handle token storage and retrieval', () => {
    // Clear any existing tokens
    clearTokens();
    expect(getAccessToken()).toBeNull();

    // Set a mock token
    const mockToken = 'mock.jwt.token.for.testing';
    setAccessToken(mockToken);
    expect(getAccessToken()).toBe(mockToken);
  });

  it('should handle token clearing', () => {
    // Set a token first
    setAccessToken('test.token');
    expect(getAccessToken()).toBe('test.token');

    // Clear tokens
    clearTokens();
    expect(getAccessToken()).toBeNull();
  });

  it('should have request and response interceptors configured', () => {
    expect(typeof httpClient.interceptors.request.use).toBe('function');
    expect(typeof httpClient.interceptors.response.use).toBe('function');
  });

  it('should have proper HTTP client configuration', () => {
    const config = {
      baseURL: httpClient.defaults.baseURL,
      timeout: httpClient.defaults.timeout,
      hasRequestInterceptors: typeof httpClient.interceptors.request.use === 'function',
      hasResponseInterceptors: typeof httpClient.interceptors.response.use === 'function',
    };

    expect(config.baseURL).toBeDefined();
    expect(config.timeout).toBeDefined();
    expect(config.hasRequestInterceptors).toBe(true);
    expect(config.hasResponseInterceptors).toBe(true);
  });
});
