import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { MYCThemeProvider } from './ui/ThemeProvider';
import { ErrorBoundary } from './shared/components';
import { router } from './app/routes';

/**
 * Main App Component
 * 
 * Integrates MYCThemeProvider for design system consistency,
 * ErrorBoundary for app-level error handling,
 * and RouterProvider for routing with AppLayout structure
 */
function App() {
  return (
    <ErrorBoundary level="app">
      <MYCThemeProvider>
        <RouterProvider router={router} />
      </MYCThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
