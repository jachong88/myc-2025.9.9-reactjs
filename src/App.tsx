import React from 'react';
import { MYCThemeProvider } from './ui/ThemeProvider';
import { AppLayout } from './app/layout';
import { PageTitle } from './ui/Typography';

/**
 * Main App Component
 * 
 * Integrates MYCThemeProvider for design system consistency
 * and AppLayout for global layout structure
 */
function App() {
  const handleMenuSelect = (key: string) => {
    console.log('Menu selected:', key);
    // TODO: Add routing logic in future user stories
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // TODO: Add authentication logic in future user stories
  };

  return (
    <MYCThemeProvider>
      <AppLayout
        userName="Admin User"
        activeMenuItem="users"
        onMenuSelect={handleMenuSelect}
        onLogout={handleLogout}
      >
        {/* Placeholder content - will be replaced with routing in future stories */}
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <PageTitle>Welcome to MYC Studio Management System</PageTitle>
          <p>Global layout is now active with header, sidebar, and content area.</p>
          <p>Navigation and routing will be added in the next user story.</p>
        </div>
      </AppLayout>
    </MYCThemeProvider>
  );
}

export default App;
