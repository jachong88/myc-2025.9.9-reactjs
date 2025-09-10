/**
 * MYC Application Routes
 * 
 * Defines all application routes using React Router v6.
 * Uses nested routing with AppLayout as the root layout component.
 */

import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { Page } from '../shared/components/Page';
import { RouteErrorBoundary } from '../shared/components';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';

function UsersPlaceholder() {
  return (
    <Page title="Users">
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2>Users Management</h2>
        <p>User management features will be implemented in future user stories.</p>
      </div>
    </Page>
  );
}

function StudiosPlaceholder() {
  return (
    <Page title="Studios">
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2>Studios Management</h2>
        <p>Studio management features will be implemented in future user stories.</p>
      </div>
    </Page>
  );
}

function NotFoundPage() {
  return (
    <Page title="Page Not Found">
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <h2>404 - Page Not Found</h2>
        <p>The page you're looking for doesn't exist.</p>
        <p>
          <a href="/">Return to Dashboard</a>
        </p>
      </div>
    </Page>
  );
}

/**
 * Layout wrapper that includes AppLayout with route-aware active menu
 */
function RootLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  // Determine active menu item based on current route
  const getActiveMenuItem = (): string => {
    const path = location.pathname;
    if (path.startsWith('/users')) return 'users';
    if (path.startsWith('/studios')) return 'studios';
    return 'dashboard'; // Default for home/dashboard
  };

  const handleMenuSelect = (key: string) => {
    // Navigation will be handled by React Router links in the Sidebar component
    console.log('Menu selected:', key);
  };

  const handleLogout = () => {
    console.log('Logout clicked');
    // TODO: Add authentication logic in future user stories
  };

  return (
    <AppLayout
      userName="Admin User"
      activeMenuItem={getActiveMenuItem()}
      onMenuSelect={handleMenuSelect}
      onLogout={handleLogout}
    >
      <RouteErrorBoundary>
        {children}
      </RouteErrorBoundary>
    </AppLayout>
  );
}

/**
 * Application Router Configuration
 * 
 * Uses createBrowserRouter for modern routing with data APIs.
 * All routes are nested under the RootLayout which includes AppLayout.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RootLayout>
        <DashboardPage />
      </RootLayout>
    ),
  },
  {
    path: '/users',
    element: (
      <RootLayout>
        <UsersPlaceholder />
      </RootLayout>
    ),
  },
  {
    path: '/studios',
    element: (
      <RootLayout>
        <StudiosPlaceholder />
      </RootLayout>
    ),
  },
  {
    path: '/404',
    element: (
      <RootLayout>
        <NotFoundPage />
      </RootLayout>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);

export default router;
