# Routing Components

This directory contains routing utilities for authentication and authorization.

## ProtectedRoute

The `ProtectedRoute` component provides authentication-based route protection with optional role-based access control.

### Features

- ✅ **Authentication Checking** - Verifies user is logged in
- ✅ **Loading States** - Shows loading indicator during auth initialization
- ✅ **Automatic Redirects** - Redirects to login with return path
- ✅ **Role-Based Access** - Optional role requirements for fine-grained control
- ✅ **TypeScript Support** - Full type safety and IntelliSense

### Basic Usage

```tsx
import { ProtectedRoute } from '../shared/components/routing';

// Basic authentication protection
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// Role-based protection
<ProtectedRoute requiredRole="admin">
  <AdminPanel />
</ProtectedRoute>

// Multiple roles (any role matches)
<ProtectedRoute requiredRole={["admin", "moderator"]}>
  <ManagementPanel />
</ProtectedRoute>
```

### Advanced Configuration

```tsx
// Custom loading component
<ProtectedRoute 
  fallback={<CustomSpinner />}
  showLoading={true}
>
  <ProtectedContent />
</ProtectedRoute>

// Custom redirect destination
<ProtectedRoute 
  redirectTo="/custom-login"
>
  <ProtectedContent />
</ProtectedRoute>

// Disable loading state
<ProtectedRoute showLoading={false}>
  <ProtectedContent />
</ProtectedRoute>
```

### Higher-Order Component

```tsx
import { withProtectedRoute } from '../shared/components/routing';

// Wrap component with protection
const ProtectedDashboard = withProtectedRoute(DashboardPage);

// With options
const ProtectedAdmin = withProtectedRoute(AdminPanel, {
  requiredRole: 'admin',
  redirectTo: '/access-denied'
});
```

### Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to render when authorized |
| `requiredRole` | `UserRole \| UserRole[]` | - | Required role(s) for access |
| `redirectTo` | `string` | `/login` | Redirect path for unauthorized users |
| `showLoading` | `boolean` | `true` | Show loading during initialization |
| `fallback` | `ReactNode` | - | Custom loading component |

### Integration with Router

The component is already integrated into the main application routing:

```tsx
// In app/routes.tsx
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
          <UsersPage />
        </RootLayout>
      </ProtectedRoute>
    ),
  },
]);
```

### Authentication Flow

1. **Initialization** - Component checks if auth is initialized
2. **Loading State** - Shows loading fallback if not initialized
3. **Authentication Check** - Verifies user is authenticated
4. **Login Redirect** - Redirects to login with return path if not authenticated
5. **Role Verification** - Checks required roles if specified
6. **Access Control** - Redirects to unauthorized page if insufficient permissions
7. **Content Render** - Renders protected content if all checks pass

### Return Path Handling

When redirecting unauthenticated users to login, the current path is preserved:

```
User tries to access: /users/123
Redirected to: /login?from=%2Fusers%2F123
After login: Automatically returns to /users/123
```

### Error States

- **Unauthorized Access** - Users lacking required roles are redirected to `/unauthorized`
- **Authentication Failed** - Users not logged in are redirected to `/login`
- **Loading Errors** - Handled by the authentication store's error boundary

### Testing

```tsx
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStatus, useUser } from '../../hooks/useAuth';

jest.mock('../../hooks/useAuth');

test('renders protected content when authenticated', () => {
  (useAuthStatus as jest.Mock).mockReturnValue({
    isAuthenticated: true,
    isInitialized: true,
  });
  
  (useUser as jest.Mock).mockReturnValue({
    user: { role: 'admin' },
    hasRole: jest.fn(() => true),
  });

  render(
    <ProtectedRoute>
      <div>Protected Content</div>
    </ProtectedRoute>
  );

  expect(screen.getByText('Protected Content')).toBeInTheDocument();
});
```

## UnauthorizedPage

A user-friendly page shown when users lack sufficient permissions.

### Features

- Clear access denied messaging
- Navigation options (Dashboard, Go Back)
- Consistent MYC design system styling
- Accessible and semantic HTML

### Usage

The page is automatically used by `ProtectedRoute` but can also be used directly:

```tsx
import { UnauthorizedPage } from '../shared/components/routing';

<Route path="/unauthorized" element={<UnauthorizedPage />} />
```

### Best Practices

1. **Single Protection Point** - Use ProtectedRoute at the route level, not nested components
2. **Role Hierarchy** - Design clear role hierarchies (user < admin < super-admin)
3. **Graceful Fallbacks** - Always provide loading states and error boundaries
4. **Testing Coverage** - Test both authenticated and unauthenticated scenarios
5. **Security Defense** - Remember this is UI-level protection; always validate on the backend

### Security Note

⚠️ **Important**: Route protection is for UX only. Always validate permissions on the backend for actual security.
