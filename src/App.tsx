import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { MYCThemeProvider } from './ui/ThemeProvider';
import { router } from './app/routes';

/**
 * Main App Component
 * 
 * Integrates MYCThemeProvider for design system consistency
 * and RouterProvider for routing with AppLayout structure
 */
function App() {
  return (
    <MYCThemeProvider>
      <RouterProvider router={router} />
    </MYCThemeProvider>
  );
}

export default App;
