/**
 * Error Handling Utilities for HTTP Client
 * 
 * Provides centralized error handling, user message mapping,
 * and notification management for API responses.
 */

import { notification } from 'antd';
import type { APIError } from '../types/api';

/**
 * Error severity levels for different handling strategies
 */
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error handling configuration
 */
export interface ErrorHandlingConfig {
  showNotification?: boolean;
  showConsoleLog?: boolean;
  logLevel?: 'error' | 'warn' | 'info';
  severity?: ErrorSeverity;
  retryable?: boolean;
}

/**
 * User-friendly error message mapping
 * Maps technical error codes to user-friendly messages
 */
export const ERROR_MESSAGES: Record<string, { message: string; severity: ErrorSeverity; retryable: boolean }> = {
  // Authentication Errors
  'AUTH_TOKEN_EXPIRED': {
    message: 'Your session has expired. Please log in again.',
    severity: 'medium',
    retryable: false,
  },
  'AUTH_INVALID_TOKEN': {
    message: 'Invalid authentication. Please log in again.',
    severity: 'medium',
    retryable: false,
  },
  'AUTH_INSUFFICIENT_PERMISSIONS': {
    message: "You don't have permission to perform this action.",
    severity: 'medium',
    retryable: false,
  },

  // Network Errors
  'NETWORK_ERROR': {
    message: 'Network connection failed. Please check your internet connection.',
    severity: 'high',
    retryable: true,
  },
  'NETWORK_TIMEOUT': {
    message: 'Request timed out. Please try again.',
    severity: 'medium',
    retryable: true,
  },

  // Server Errors
  'SERVER_ERROR': {
    message: 'Server error occurred. Our team has been notified.',
    severity: 'high',
    retryable: true,
  },
  'SERVICE_UNAVAILABLE': {
    message: 'Service is temporarily unavailable. Please try again later.',
    severity: 'high',
    retryable: true,
  },
  'RATE_LIMIT_EXCEEDED': {
    message: 'Too many requests. Please wait a moment before trying again.',
    severity: 'medium',
    retryable: true,
  },

  // Validation Errors
  'VALIDATION_ERROR': {
    message: 'Please check your input and try again.',
    severity: 'low',
    retryable: false,
  },
  'INVALID_REQUEST': {
    message: 'Invalid request format.',
    severity: 'low',
    retryable: false,
  },

  // Resource Errors
  'RESOURCE_NOT_FOUND': {
    message: 'The requested resource was not found.',
    severity: 'low',
    retryable: false,
  },
  'RESOURCE_CONFLICT': {
    message: 'This action conflicts with existing data.',
    severity: 'medium',
    retryable: false,
  },

  // Default fallback
  'UNKNOWN_ERROR': {
    message: 'An unexpected error occurred. Please try again.',
    severity: 'medium',
    retryable: true,
  },
};

/**
 * HTTP status code to error code mapping
 */
export const HTTP_STATUS_TO_ERROR_CODE: Record<number, string> = {
  400: 'INVALID_REQUEST',
  401: 'AUTH_TOKEN_EXPIRED',
  403: 'AUTH_INSUFFICIENT_PERMISSIONS',
  404: 'RESOURCE_NOT_FOUND',
  409: 'RESOURCE_CONFLICT',
  422: 'VALIDATION_ERROR',
  429: 'RATE_LIMIT_EXCEEDED',
  500: 'SERVER_ERROR',
  502: 'SERVICE_UNAVAILABLE',
  503: 'SERVICE_UNAVAILABLE',
  504: 'NETWORK_TIMEOUT',
};

/**
 * Get user-friendly error information
 */
export function getErrorInfo(error: APIError | string | number): {
  code: string;
  message: string;
  severity: ErrorSeverity;
  retryable: boolean;
} {
  let errorCode: string;

  if (typeof error === 'string') {
    errorCode = error;
  } else if (typeof error === 'number') {
    errorCode = HTTP_STATUS_TO_ERROR_CODE[error] || 'UNKNOWN_ERROR';
  } else {
    errorCode = error.code || 'UNKNOWN_ERROR';
  }

  const errorInfo = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES['UNKNOWN_ERROR'];

  return {
    code: errorCode,
    ...errorInfo,
  };
}

/**
 * Show error notification to user
 */
export function showErrorNotification(
  error: APIError,
  config: ErrorHandlingConfig = {}
): void {
  const {
    showNotification = true,
    severity = 'medium',
  } = config;

  if (!showNotification) return;

  const errorInfo = getErrorInfo(error);
  const message = error.message || errorInfo.message;

  // Determine notification type based on severity
  const notificationType = severity === 'critical' || severity === 'high' 
    ? 'error' 
    : severity === 'medium' 
    ? 'warning' 
    : 'info';

  // Show notification with appropriate styling and duration
  notification[notificationType]({
    message: getNotificationTitle(errorInfo.severity),
    description: message,
    duration: getNotificationDuration(errorInfo.severity),
    placement: 'topRight',
    style: {
      zIndex: 9999,
    },
  });
}

/**
 * Get notification title based on severity
 */
function getNotificationTitle(severity: ErrorSeverity): string {
  switch (severity) {
    case 'critical':
      return 'Critical Error';
    case 'high':
      return 'Error';
    case 'medium':
      return 'Warning';
    case 'low':
    default:
      return 'Notice';
  }
}

/**
 * Get notification duration based on severity
 */
function getNotificationDuration(severity: ErrorSeverity): number {
  switch (severity) {
    case 'critical':
      return 0; // Don't auto-close critical errors
    case 'high':
      return 8; // 8 seconds
    case 'medium':
      return 5; // 5 seconds
    case 'low':
    default:
      return 3; // 3 seconds
  }
}

/**
 * Log error with appropriate level and context
 */
export function logError(
  error: APIError,
  context: string,
  config: ErrorHandlingConfig = {}
): void {
  const {
    showConsoleLog = process.env.NODE_ENV === 'development',
    logLevel = 'error',
  } = config;

  if (!showConsoleLog) return;

  const errorInfo = getErrorInfo(error);
  const logData = {
    context,
    code: errorInfo.code,
    message: error.message,
    severity: errorInfo.severity,
    retryable: errorInfo.retryable,
    details: error.details,
    timestamp: error.timestamp || new Date().toISOString(),
  };

  switch (logLevel) {
    case 'error':
      console.error(`❌ [${context}] ${errorInfo.code}:`, logData);
      break;
    case 'warn':
      console.warn(`⚠️ [${context}] ${errorInfo.code}:`, logData);
      break;
    case 'info':
      console.info(`ℹ️ [${context}] ${errorInfo.code}:`, logData);
      break;
  }
}

/**
 * Check if an error should trigger automatic retry
 */
export function shouldRetryError(error: APIError, attemptCount: number = 0): boolean {
  const errorInfo = getErrorInfo(error);
  
  // Don't retry if error is not retryable
  if (!errorInfo.retryable) return false;
  
  // Don't retry if we've exceeded maximum attempts
  if (attemptCount >= 3) return false;
  
  // Don't retry authentication errors
  if (errorInfo.code.startsWith('AUTH_')) return false;
  
  // Retry network and server errors
  return ['NETWORK_ERROR', 'NETWORK_TIMEOUT', 'SERVER_ERROR', 'SERVICE_UNAVAILABLE', 'RATE_LIMIT_EXCEEDED']
    .includes(errorInfo.code);
}

/**
 * Calculate retry delay with exponential backoff
 */
export function getRetryDelay(attemptCount: number, baseDelay: number = 1000): number {
  // Exponential backoff: 1s, 2s, 4s, 8s, etc.
  return Math.min(baseDelay * Math.pow(2, attemptCount), 10000); // Max 10 seconds
}

/**
 * Normalize different error types to APIError format
 */
export function normalizeError(error: any): APIError {
  // Already normalized
  if (error?.code && error?.message) {
    return error;
  }

  // Axios error with response
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;
    
    return {
      code: data?.code || HTTP_STATUS_TO_ERROR_CODE[status] || 'UNKNOWN_ERROR',
      message: data?.message || error.message || 'An unexpected error occurred',
      details: data?.details,
      field: data?.field,
      timestamp: new Date().toISOString(),
    };
  }

  // Network error
  if (error?.request || error?.code === 'ECONNABORTED') {
    return {
      code: error.code === 'ECONNABORTED' ? 'NETWORK_TIMEOUT' : 'NETWORK_ERROR',
      message: 'Network connection failed',
      timestamp: new Date().toISOString(),
    };
  }

  // Generic error
  return {
    code: 'UNKNOWN_ERROR',
    message: error?.message || 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };
}
