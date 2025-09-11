/**
 * MSW Test to verify Firebase authentication handlers are working
 * Tests Firebase-specific endpoints that support the Google authentication flow
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { httpClient, getHttpClientConfig } from '../shared/api/http';
import { server } from '../test-setup';

describe('MSW Firebase Auth Handlers', () => {
  beforeEach(() => {
    console.log('🔧 HTTP Client Config:', getHttpClientConfig());
    console.log('🔧 Active MSW handlers count:', server.listHandlers().length);
  });

  it('should handle Firebase user sync request', async () => {
    console.log('🧪 Testing MSW Firebase user sync...');
    
    try {
      const response = await httpClient.post('/auth/sync-firebase-user', {
        uid: 'firebase-uid-test-123',
        email: 'test@example.com',
        displayName: 'Test User'
      }, { skipAuth: true });
      
      console.log('📨 Firebase sync response:', {
        status: response.status,
        success: response.data?.success,
        hasUser: !!response.data?.data?.id
      });
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.id).toBeDefined();
      expect(response.data.data.email).toBe('test@example.com');
      console.log('✅ MSW Firebase sync handler working correctly');
    } catch (error: any) {
      console.error('❌ MSW Firebase sync handler failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
        request: error.request ? 'Request made' : 'No request'
      });
      throw error;
    }
  });

  it('should handle Firebase user sync with missing data', async () => {
    console.log('🧪 Testing MSW Firebase sync with invalid data...');
    
    try {
      await httpClient.post('/auth/sync-firebase-user', {
        // Missing uid and email
        displayName: 'Test User'
      }, { skipAuth: true });
      
      throw new Error('Should have failed with missing Firebase data');
    } catch (error: any) {
      console.log('📨 Invalid Firebase sync response:', {
        status: error.response?.status,
        success: error.response?.data?.success,
        errorCode: error.response?.data?.error?.code
      });
      
      expect(error.response?.status).toBe(422);
      expect(error.response?.data.success).toBe(false);
      expect(error.response?.data.error.code).toBe('VALIDATION_ERROR');
      console.log('✅ MSW Firebase sync validation working');
    }
  });

  it('should handle authenticated profile request', async () => {
    console.log('🧪 Testing MSW authenticated profile request...');
    
    try {
      // Simulate Firebase ID token in header
      const response = await httpClient.get('/auth/me', {
        headers: {
          'Authorization': 'Bearer firebase-id-token-mock'
        }
      });
      
      console.log('📨 Profile response:', {
        status: response.status,
        success: response.data?.success,
        hasUser: !!response.data?.data?.id
      });
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.email).toBe('admin@example.com'); // Mock default user
      console.log('✅ MSW authenticated profile handler working correctly');
    } catch (error: any) {
      console.error('❌ MSW profile handler failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });
      throw error;
    }
  });

  it('should handle unauthenticated profile request', async () => {
    console.log('🧪 Testing MSW unauthenticated profile request...');
    
    try {
      await httpClient.get('/auth/me', { skipAuth: true }); // No Authorization header
      
      throw new Error('Should have failed without Firebase token');
    } catch (error: any) {
      console.log('📨 Unauthenticated profile response:', {
        status: error.response?.status,
        success: error.response?.data?.success,
        errorCode: error.response?.data?.error?.code
      });
      
      expect(error.response?.status).toBe(401);
      expect(error.response?.data.success).toBe(false);
      expect(error.response?.data.error.code).toBe('MISSING_TOKEN');
      console.log('✅ MSW unauthenticated profile handling working');
    }
  });
});
