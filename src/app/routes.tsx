/**
 * MYC Application Routes
 * 
 * Defines all application routes using React Router v6.
 * Uses nested routing with AppLayout as the root layout component.
 */

import React, { useState } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { Page } from '../shared/components/Page';
import { RouteErrorBoundary } from '../shared/components';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import LoginPage from '../features/auth/pages/LoginPage';
import { ProtectedRoute, UnauthorizedPage } from '../shared/components/routing';
import { LogoutModal } from '../shared/components/auth';
import { useUser } from '../shared/hooks/useAuth';

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
  const { user } = useUser();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  
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
    setLogoutModalOpen(true);
  };

  const handleLogoutCancel = () => {
    setLogoutModalOpen(false);
  };

  const handleLogoutSuccess = () => {
    setLogoutModalOpen(false);
    // ProtectedRoute will handle navigation to login
  };

  return (
    <>
      <AppLayout
        userName={user?.email || 'User'}
        activeMenuItem={getActiveMenuItem()}
        onMenuSelect={handleMenuSelect}
        onLogout={handleLogout}
      >
        <RouteErrorBoundary>
          {children}
        </RouteErrorBoundary>
      </AppLayout>
      
      <LogoutModal
        open={logoutModalOpen}
        onCancel={handleLogoutCancel}
        onSuccess={handleLogoutSuccess}
      />
    </>
  );
}

/**
 * Application Router Configuration
 * 
 * Uses createBrowserRouter for modern routing with data APIs.
 * Most routes are nested under the RootLayout, except authentication pages.
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <RootLayout>
          <DashboardPage />
        </RootLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        <RootLayout>
          <UsersPlaceholder />
        </RootLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/studios',
    element: (
      <ProtectedRoute>
        <RootLayout>
          <StudiosPlaceholder />
        </RootLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: '/unauthorized',
    element: (
      <RootLayout>
        <UnauthorizedPage />
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
