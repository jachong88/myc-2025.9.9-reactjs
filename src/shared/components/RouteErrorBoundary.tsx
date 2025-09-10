import { Component, ReactNode } from 'react';
import { ErrorFallback } from './ErrorFallback';
import type { ErrorBoundaryState, ErrorInfo } from '../types/errors';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  routeName?: string;
}

/**
 * Route-level ErrorBoundary to catch errors specific to route/page content
 * This wraps individual routes to provide page-specific error handling
 */
export class RouteErrorBoundary extends Component<RouteErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: RouteErrorBoundaryProps) {
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
    // Log error details with route context
    console.error('RouteErrorBoundary caught an error:', {
      error,
      errorInfo,
      route: this.props.routeName || 'unknown'
    });
    
    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to send error reports with route context
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send error to monitoring service with route information
      // this.reportRouteError(error, errorInfo, this.props.routeName);
    }
  }

  componentDidUpdate(prevProps: RouteErrorBoundaryProps) {
    // Reset error state when route changes
    if (prevProps.routeName !== this.props.routeName && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null
      });
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
      // Custom fallback component
      if (this.props.fallback && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      // Default fallback using ErrorFallback component with route-specific messaging
      const routeTitle = this.props.routeName 
        ? `Error in ${this.props.routeName}` 
        : 'Page Error';
      
      const routeMessage = this.props.routeName
        ? `The ${this.props.routeName} page encountered an error. Please try navigating to another page or refresh.`
        : 'This page encountered an error. Please try navigating to another page or refresh.';

      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo || undefined}
          onRetry={this.handleRetry}
          level="route"
          title={routeTitle}
          message={routeMessage}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        />
      );
    }

    return this.props.children;
  }
}
