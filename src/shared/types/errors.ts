/**
 * Error handling types for the MYC Studio Management System
 */

export interface AppError {
  message: string;
  code?: string;
  stack?: string;
  timestamp: Date;
}

export interface ErrorInfo {
  componentStack: string;
}

export type ErrorRecoveryAction = 'retry' | 'reload' | 'goHome' | 'goBack';

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}
