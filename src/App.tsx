import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { MYCThemeProvider } from './ui/ThemeProvider';
import { ErrorBoundary } from './shared/components';
import { AutoLogout } from './shared/components/auth';
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
        <AutoLogout warningMinutes={5} />
        <RouterProvider router={router} />
      </MYCThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
