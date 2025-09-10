/**
 * MYC Shared Components
 * Barrel export file for clean shared component imports
 */

// Layout components
export { Page } from './Page';

// Error handling components
export { ErrorFallback } from './ErrorFallback';
export { ErrorBoundary } from './ErrorBoundary';
export { RouteErrorBoundary } from './RouteErrorBoundary';
export { FeatureErrorBoundary, withFeatureErrorBoundary } from './FeatureErrorBoundary';

// Re-export types if needed
export type { default as PageProps } from './Page';
