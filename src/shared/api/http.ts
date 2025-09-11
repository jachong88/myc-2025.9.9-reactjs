/**
 * MYC HTTP Client
 * 
 * Centralized HTTP client using Axios with request/response interceptors,
 * authentication handling, retry logic, and comprehensive error management.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { APIResponse, APIError, EnvConfig, RequestConfig, APIClientStatus } from '../types/api';
import { getAccessToken, isTokenExpired, clearTokens } from '../utils/jwt';
import { 
  normalizeError, 
  showErrorNotification, 
  logError, 
  shouldRetryError,
  getRetryDelay
} from './errorHandling';
import { executeWithRetry, addRetryCapability } from './retryMechanism';
import { useAuthStore } from '../stores/authStore';

/**
 * Handle specific HTTP status code errors with appropriate actions
 */
async function handleHttpStatusError(
  status: number, 
  error: APIError, 
  requestConfig?: AxiosRequestConfig
): Promise<void> {
  switch (status) {
    case 401:
      // Authentication failed
      console.warn('🔐 Authentication failed - handling token refresh or logout');
      
      // Clear invalid tokens
      clearTokens();
      
      try {
        // Attempt token refresh if this wasn't already a refresh request
        const authStore = useAuthStore.getState();
        if (requestConfig && !requestConfig.url?.includes('/refresh') && authStore) {
          console.info('🔄 Attempting token refresh...');
          // Note: This will trigger logout if refresh fails
          await authStore.refreshToken();
        } else {
          // Force logout if refresh not available or already tried
          await authStore?.logout();
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed, logging out user');
        // Logout will be handled by the auth store
      }
      break;
      
    case 403:
      // Insufficient permissions
      console.warn('🚫 Access forbidden - insufficient permissions');
      logError(error, 'Access Forbidden', { logLevel: 'warn' });
      break;
      
    case 429:
      // Rate limiting
      console.warn('⏳ Rate limit exceeded');
      logError(error, 'Rate Limited', { logLevel: 'warn' });
      break;
      
    case 500:
    case 502:
    case 503:
    case 504:
      // Server errors
      console.error('🔥 Server error detected:', status);
      logError(error, 'Server Error', { logLevel: 'error' });
      break;
      
    default:
      // Other errors
      if (status >= 400) {
        logError(error, `HTTP ${status} Error`, { logLevel: 'warn' });
      }
  }
}

/**
 * Environment Configuration
 * Reads and validates environment variables for API configuration
 */
function getEnvConfig(): EnvConfig {
  const config: EnvConfig = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000', 10),
    environment: import.meta.env.VITE_ENV || 'development',
    useMockApi: import.meta.env.VITE_USE_MOCK_API === 'true',
    useMSW: import.meta.env.VITE_USE_MSW === 'true',
    debugApi: import.meta.env.VITE_DEBUG_API === 'true',
    debugAuth: import.meta.env.VITE_DEBUG_AUTH === 'true',
  };

  // Validate required configuration
  if (!config.apiBaseUrl) {
    throw new Error('VITE_API_BASE_URL is required but not provided');
  }

  if (config.debugApi && config.environment === 'development') {
    console.log('🔧 HTTP Client Configuration:', {
      ...config,
      // Don't log sensitive data in production
      debugAuth: config.environment === 'development' ? config.debugAuth : '[HIDDEN]',
    });
  }

  return config;
}

/**
 * Create and configure Axios instance
 */
function createHttpClient(): AxiosInstance {
  const envConfig = getEnvConfig();
  
  const client = axios.create({
    baseURL: envConfig.apiBaseUrl,
    timeout: envConfig.apiTimeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Enhanced Request interceptor for authentication, timing, and request transformation
  client.interceptors.request.use(
    (config) => {
      // Add request start time for duration tracking
      config.requestStartTime = Date.now();
      
      // Get current access token
      const accessToken = getAccessToken();
      const skipAuth = config.skipAuth || false;
      
      // Add authentication header if token exists and auth is not skipped
      if (accessToken && !skipAuth) {
        // Check if token is expired before using it
        if (isTokenExpired(accessToken)) {
          console.warn('🔐 Access token is expired, API call may fail');
          // Note: Token refresh will be handled by response interceptor on 401
        }
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Enhanced request ID generation with timing and auth context
      const authStatus = accessToken ? (isTokenExpired(accessToken) ? 'expired' : 'valid') : 'none';
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2)}_auth-${authStatus}`;
      config.headers['X-Request-ID'] = requestId;

      // Enhanced debugging with authentication context and timing
      if (envConfig.debugApi && envConfig.environment === 'development') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
          requestId,
          data: config.data,
          params: config.params,
          headers: {
            ...config.headers,
            // Hide sensitive authorization header in logs
            Authorization: config.headers.Authorization ? '[HIDDEN]' : undefined,
          },
          hasAuth: Boolean(accessToken),
          authStatus,
          skipAuth,
          skipErrorHandling: config.skipErrorHandling,
          retries: config.retries,
          timeout: config.timeout,
        });
      }

      return config;
    },
    (error) => {
      if (envConfig.debugApi && envConfig.environment === 'development') {
        console.error('❌ Request Interceptor Error:', error);
      }
      return Promise.reject(error);
    }
  );

  // Enhanced Response interceptor with comprehensive error handling, retry logic, and auth integration
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Enhanced success logging
      if (envConfig.debugApi && envConfig.environment === 'development') {
        const requestDuration = response.config?.requestStartTime 
          ? Date.now() - response.config.requestStartTime
          : 'unknown';
        
        console.log(
          `✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url} (${requestDuration}ms)`,
          {
            status: response.status,
            statusText: response.statusText,
            headers: {
              'content-type': response.headers['content-type'],
              'x-request-id': response.headers['x-request-id'],
            },
            data: response.data,
            responseSize: JSON.stringify(response.data).length,
          }
        );
      }

      // Update API client status on successful response
      apiClientStatus.isOnline = true;
      apiClientStatus.lastRequestTime = Date.now();

      return response;
    },
    async (error) => {
      // Normalize the error first
      const normalizedError = normalizeError(error);
      const skipErrorHandling = error.config?.skipErrorHandling || false;
      
      // Enhanced error logging
      logError(
        normalizedError,
        'HTTP Response Error',
        {
          showConsoleLog: envConfig.debugApi && envConfig.environment === 'development',
          logLevel: 'error'
        }
      );

      // Update API client status based on error type
      if (error.response) {
        const status = error.response.status;
        apiClientStatus.isOnline = status < 500; // Server errors indicate offline status
        
        // Handle specific HTTP status codes
        await handleHttpStatusError(status, normalizedError, error.config);
      } else if (error.request || error.code === 'ECONNABORTED') {
        // Network errors or timeouts
        apiClientStatus.isOnline = false;
      }

      // Show user notification unless explicitly disabled
      if (!skipErrorHandling) {
        showErrorNotification(normalizedError, {
          showNotification: !error.config?.skipAuth, // Don't show notifications for background auth requests
        });
      }

      // Always reject with normalized error
      return Promise.reject(normalizedError);
    }
  );

  // Add retry capability to the client
  addRetryCapability(client, {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
  });

  return client;
}

/**
 * API Client Status Tracker
 */
export const apiClientStatus: APIClientStatus = {
  isOnline: true,
  baseUrl: getEnvConfig().apiBaseUrl,
  environment: getEnvConfig().environment,
};

/**
 * Main HTTP Client Instance
 */
export const httpClient = createHttpClient();

/**
 * Utility function to check if API client is properly configured
 */
export function validateHttpClientConfig(): boolean {
  try {
    const config = getEnvConfig();
    return !!(config.apiBaseUrl && config.apiTimeout > 0);
  } catch (error) {
    console.error('❌ HTTP Client configuration validation failed:', error);
    return false;
  }
}

/**
 * Utility function to get current environment configuration
 */
export function getHttpClientConfig(): EnvConfig {
  return getEnvConfig();
}

/**
 * Default export for convenience
 */
export default httpClient;
