/**
 * Basic JWT Utilities Test
 * 
 * Simple test to verify JWT utilities are working correctly
 * This will be expanded in EP-002-US-05 with comprehensive testing
 */

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

// Run basic tests
console.log('🧪 Testing JWT Utilities...');

// Test 1: Token Decoding
const decoded = decodeToken(SAMPLE_TOKEN);
console.log('✅ Token decoded:', decoded);

// Test 2: Token Expiry Check (should be expired since it's from 2020)
const expired = isTokenExpired(SAMPLE_TOKEN);
console.log('✅ Token expired check:', expired);

// Test 3: Token Storage
setAccessToken(SAMPLE_TOKEN);
const retrieved = getAccessToken();
console.log('✅ Token storage works:', retrieved === SAMPLE_TOKEN);

// Test 4: Token Clear
clearTokens();
const clearedToken = getAccessToken();
console.log('✅ Token clearing works:', clearedToken === null);

// Test 5: Expiry time
const expiryMs = getTokenExpiryMs(SAMPLE_TOKEN);
console.log('✅ Token expiry time:', new Date(expiryMs || 0).toISOString());

// Test 6: Seconds until expiry
const secondsLeft = secondsUntilExpiry(SAMPLE_TOKEN);
console.log('✅ Seconds until expiry:', secondsLeft);

console.log('🎉 JWT Utilities basic test completed!');

export {}; // Make this a module
