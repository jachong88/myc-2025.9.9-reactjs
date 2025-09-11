/**
 * MSW Test to verify handlers are working
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { httpClient, getHttpClientConfig } from '../shared/api/http';
import { server } from '../test-setup';

describe('MSW Auth Handlers', () => {
  beforeEach(() => {
    console.log('🔧 HTTP Client Config:', getHttpClientConfig());
    console.log('🔧 Active MSW handlers count:', server.listHandlers().length);
  });

  it('should handle login request with valid credentials', async () => {
    console.log('🧪 Testing MSW login with valid credentials...');
    
    try {
      const response = await httpClient.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      }, { skipAuth: true });
      
      console.log('📨 Login response:', {
        status: response.status,
        success: response.data?.success,
        hasToken: !!response.data?.data?.accessToken
      });
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      expect(response.data.data.accessToken).toBeDefined();
      console.log('✅ MSW login handler working correctly');
    } catch (error: any) {
      console.error('❌ MSW login handler failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code,
        request: error.request ? 'Request made' : 'No request'
      });
      throw error;
    }
  });

  it('should handle invalid credentials', async () => {
    console.log('🧪 Testing MSW login with invalid credentials...');
    
    try {
      await httpClient.post('/auth/login', {
        email: 'wrong@example.com',
        password: 'wrongpass'
      }, { skipAuth: true });
      
      throw new Error('Should have failed with invalid credentials');
    } catch (error: any) {
      console.log('📨 Invalid login response:', {
        status: error.response?.status,
        success: error.response?.data?.success,
        errorCode: error.response?.data?.error?.code
      });
      
      expect(error.response?.status).toBe(401);
      expect(error.response?.data.success).toBe(false);
      console.log('✅ MSW invalid credentials handling working');
    }
  });

  it('should handle logout request', async () => {
    console.log('🧪 Testing MSW logout...');
    
    try {
      const response = await httpClient.post('/auth/logout', {}, { skipAuth: true });
      
      console.log('📨 Logout response:', {
        status: response.status,
        success: response.data?.success
      });
      
      expect(response.status).toBe(200);
      expect(response.data.success).toBe(true);
      console.log('✅ MSW logout handler working correctly');
    } catch (error: any) {
      console.error('❌ MSW logout handler failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        code: error.code
      });
      throw error;
    }
  });
});
