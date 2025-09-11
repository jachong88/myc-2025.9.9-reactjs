/**
 * Retry Mechanism for HTTP Requests
 * 
 * Provides intelligent retry logic with exponential backoff,
 * configurable retry conditions, and proper error handling.
 */

import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { APIError } from '../types/api';
import { normalizeError, shouldRetryError, getRetryDelay, logError } from './errorHandling';

/**
 * Retry configuration options
 */
export interface RetryConfig {
  /** Maximum number of retry attempts */
  maxRetries?: number;
  /** Base delay between retries in milliseconds */
  baseDelay?: number;
  /** Maximum delay between retries in milliseconds */
  maxDelay?: number;
  /** Whether to use exponential backoff */
  exponentialBackoff?: boolean;
  /** Custom function to determine if error should be retried */
  shouldRetry?: (error: APIError, attemptCount: number) => boolean;
  /** Custom function to calculate delay */
  calculateDelay?: (attemptCount: number, baseDelay: number) => number;
  /** Callback for retry attempts */
  onRetry?: (error: APIError, attemptCount: number, delay: number) => void;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: Required<RetryConfig> = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  exponentialBackoff: true,
  shouldRetry: shouldRetryError,
  calculateDelay: getRetryDelay,
  onRetry: (error, attemptCount, delay) => {
    logError(
      error,
      `Retry Attempt ${attemptCount}`,
      { 
        showConsoleLog: true, 
        logLevel: 'warn',
        showNotification: false 
      }
    );
    console.info(`⏳ Retrying in ${delay}ms...`);
  },
};

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Execute HTTP request with retry logic
 */
export async function executeWithRetry<T = any>(
  requestFn: () => Promise<AxiosResponse<T>>,
  config: RetryConfig = {}
): Promise<AxiosResponse<T>> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: APIError;
  
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      // Execute the request
      const response = await requestFn();
      
      // Log successful retry if this wasn't the first attempt
      if (attempt > 0) {
        console.info(`✅ Request succeeded after ${attempt} retry attempts`);
      }
      
      return response;
    } catch (error) {
      // Normalize the error
      lastError = normalizeError(error);
      
      // Check if we should retry this error
      const shouldRetry = retryConfig.shouldRetry(lastError, attempt);
      
      // If this is the last attempt or shouldn't retry, throw the error
      if (attempt >= retryConfig.maxRetries || !shouldRetry) {
        // Log the final failure
        logError(
          lastError,
          `Request Failed (${attempt + 1}/${retryConfig.maxRetries + 1} attempts)`,
          { 
            showConsoleLog: true, 
            logLevel: 'error',
            showNotification: false 
          }
        );
        throw lastError;
      }
      
      // Calculate delay for next retry
      const delay = Math.min(
        retryConfig.calculateDelay(attempt, retryConfig.baseDelay),
        retryConfig.maxDelay
      );
      
      // Call retry callback
      retryConfig.onRetry(lastError, attempt + 1, delay);
      
      // Wait before retrying
      await sleep(delay);
    }
  }
  
  // This should never be reached, but TypeScript requires it
  throw lastError!;
}

/**
 * Create a retry-enabled request function
 */
export function createRetryableRequest<T = any>(
  axiosInstance: any,
  config: RetryConfig = {}
) {
  return (requestConfig: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    // Skip retry if explicitly disabled in request config
    if (requestConfig.retries === 0) {
      return axiosInstance.request(requestConfig);
    }
    
    // Merge retry config with request-specific retries setting
    const mergedConfig = {
      ...config,
      maxRetries: requestConfig.retries ?? config.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries,
    };
    
    return executeWithRetry(
      () => axiosInstance.request(requestConfig),
      mergedConfig
    );
  };
}

/**
 * Add retry capability to existing axios instance
 */
export function addRetryCapability(
  axiosInstance: any,
  retryConfig: RetryConfig = {}
): void {
  // Store original request method
  const originalRequest = axiosInstance.request.bind(axiosInstance);
  
  // Override request method with retry logic
  axiosInstance.request = async (config: AxiosRequestConfig) => {
    // Skip retry if explicitly disabled
    if (config.retries === 0) {
      return originalRequest(config);
    }
    
    const mergedConfig = {
      ...retryConfig,
      maxRetries: config.retries ?? retryConfig.maxRetries ?? DEFAULT_RETRY_CONFIG.maxRetries,
    };
    
    return executeWithRetry(
      () => originalRequest(config),
      mergedConfig
    );
  };
  
  console.log('🔄 Retry capability added to HTTP client');
}
