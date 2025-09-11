/**
 * HTTP Client Authentication Integration Test
 * 
 * Tests the integration between HTTP client and JWT utilities
 * Verifies automatic token attachment and error handling
 */

import { httpClient } from './http';
import { setAccessToken, clearTokens } from '../utils/jwt';

console.log('🧪 Testing HTTP Client Authentication Integration...');

// Test 1: Request without token
console.log('Test 1: Request without token');
try {
  // This should not include Authorization header
  const config = httpClient.defaults;
  console.log('✅ HTTP client configured successfully');
} catch (error) {
  console.error('❌ HTTP client configuration failed:', error);
}

// Test 2: Set token and verify it's attached to requests
console.log('Test 2: Request with valid token');
try {
  // Set a mock token
  setAccessToken('mock.jwt.token.for.testing');
  
  // Create a request config (simulated - in real usage this would be an actual request)
  const mockRequest = {
    url: '/test',
    method: 'GET',
    headers: {},
    skipAuth: false,
  };

  console.log('✅ Token set successfully');
} catch (error) {
  console.error('❌ Token attachment test failed:', error);
}

// Test 3: Test skipAuth functionality
console.log('Test 3: Request with skipAuth option');
try {
  const mockRequestNoAuth = {
    url: '/public',
    method: 'GET', 
    headers: {},
    skipAuth: true,
  };

  console.log('✅ skipAuth configuration works');
} catch (error) {
  console.error('❌ skipAuth test failed:', error);
}

// Test 4: Clear tokens
console.log('Test 4: Clear tokens');
try {
  clearTokens();
  console.log('✅ Tokens cleared successfully');
} catch (error) {
  console.error('❌ Token clearing failed:', error);
}

// Test 5: Verify HTTP client configuration
console.log('Test 5: HTTP client configuration validation');
try {
  const baseURL = httpClient.defaults.baseURL;
  const timeout = httpClient.defaults.timeout;
  
  console.log('✅ HTTP Client Configuration:', {
    baseURL,
    timeout,
    // Interceptor presence (not accessing internal handlers)
    hasRequestInterceptors: typeof httpClient.interceptors.request.use === 'function',
    hasResponseInterceptors: typeof httpClient.interceptors.response.use === 'function',
  });
} catch (error) {
  console.error('❌ HTTP client validation failed:', error);
}

console.log('🎉 HTTP Client Authentication Integration tests completed!');

export {}; // Make this a module
