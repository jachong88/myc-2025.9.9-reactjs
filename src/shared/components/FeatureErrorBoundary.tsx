import { Component, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';
import type { ErrorBoundaryState, ErrorInfo } from '../types/errors';

interface FeatureErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  featureName: string;
  allowFallback?: boolean;
}

/**
 * Feature-level ErrorBoundary template for future feature modules
 * This wraps individual features to provide isolated error handling
 * without breaking the entire page or application
 */
export class FeatureErrorBoundary extends Component<FeatureErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36)
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details with feature context
    console.error('FeatureErrorBoundary caught an error:', {
      error,
      errorInfo,
      feature: this.props.featureName
    });
    
    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send error reports with feature context
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send error to monitoring service with feature information
      // this.reportFeatureError(error, errorInfo, this.props.featureName);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // If allowFallback is false, rethrow the error to parent boundary
      if (!this.props.allowFallback) {
        throw this.state.error;
      }

      // Custom fallback component
      if (this.props.fallback && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Default fallback using ErrorFallback component with feature-specific messaging
      const featureTitle = `Error in ${this.props.featureName}`;
      const featureMessage = `The ${this.props.featureName} feature encountered an error. Please try again or continue using other features.`;

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo || undefined}
          onRetry={this.handleRetry}
          level="feature"
          title={featureTitle}
          message={featureMessage}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}

// Higher-order component for easier usage with features
export function withFeatureErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  featureName: string,
  allowFallback = true
) {
  const WithFeatureErrorBoundary = (props: P) => (
    <FeatureErrorBoundary
      featureName={featureName}
      allowFallback={allowFallback}
    >
      <WrappedComponent {...props} />
    </FeatureErrorBoundary>
  );

  WithFeatureErrorBoundary.displayName = `withFeatureErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithFeatureErrorBoundary;
}
