# useAuth Hook Usage Examples

This document provides usage examples for the authentication hooks system.

## Basic Usage

### Main Authentication Hook

```tsx
import { useAuth } from '@/shared/hooks';

function UserProfile() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Login Form

```tsx
import { useLogin } from '@/shared/hooks';
import { useState } from 'react';

function LoginForm() {
  const { login, isLoggingIn, error, clearError } = useLogin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login({ email, password });
    
    if (result.success) {
      console.log('Login successful!');
    } else {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Logging in...' : 'Login'}
      </button>
      {error && (
        <div className="error">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}
    </form>
  );
}
```

## Role-Based Access Control

### Role Guard Hook

```tsx
import { useRoleGuard } from '@/shared/hooks';

function AdminPanel() {
  const { canRender, hasAccess } = useRoleGuard('admin');

  if (!canRender) {
    return <div>Access denied. Admin privileges required.</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Welcome to the admin area!</p>
    </div>
  );
}

// Multi-role access
function TeacherOrAdminContent() {
  const { canRender } = useRoleGuard(['admin', 'teacher']);

  return canRender ? <SensitiveContent /> : <AccessDenied />;
}
```

### Resource Access Control

```tsx
import { useResourceAccess } from '@/shared/hooks';

function UserManagement() {
  const { canAccess: canManageUsers } = useResourceAccess('users-management');
  const { canAccess: canDeleteUsers } = useResourceAccess('users-delete');

  return (
    <div>
      <h1>Users</h1>
      <UsersList />
      
      {canManageUsers && (
        <button>Add User</button>
      )}
      
      {canDeleteUsers && (
        <button className="danger">Delete Selected</button>
      )}
    </div>
  );
}
```

## Specialized Hooks

### Authentication Status (Performance Optimized)

```tsx
import { useAuthStatus } from '@/shared/hooks';

function NavigationBar() {
  // Only re-renders when auth status changes, not user data
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <nav>
      {isAuthenticated ? (
        <AuthenticatedNav />
      ) : (
        <PublicNav />
      )}
    </nav>
  );
}
```

### User Information

```tsx
import { useUser } from '@/shared/hooks';

function UserInfo() {
  const { user, isAdmin } = useUser();

  return (
    <div>
      <p>Name: {user?.name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      {isAdmin && <AdminBadge />}
    </div>
  );
}
```

### Authentication Errors with Auto-Clear

```tsx
import { useAuthError } from '@/shared/hooks';

function ErrorDisplay() {
  // Automatically clears error after 3 seconds
  const { error, hasError, clearError } = useAuthError(3000);

  if (!hasError) return null;

  return (
    <div className="error-banner">
      {error}
      <button onClick={clearError}>Dismiss</button>
    </div>
  );
}
```

## Application Initialization

### App Root with Auth Initialization

```tsx
import { useInitializeAuth } from '@/shared/hooks';

function App() {
  const { isInitialized } = useInitializeAuth();

  if (!isInitialized) {
    return <div>Initializing...</div>;
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}
```

## Advanced Patterns

### Conditional Component Rendering

```tsx
import { useAuth } from '@/shared/hooks';

function ConditionalContent() {
  const { isAuthenticated, hasRole, canAccess } = useAuth();

  return (
    <div>
      {/* Show for all authenticated users */}
      {isAuthenticated && <WelcomeMessage />}
      
      {/* Show only for admins */}
      {hasRole('admin') && <AdminControls />}
      
      {/* Show based on resource access */}
      {canAccess('reports') && <ReportsLink />}
    </div>
  );
}
```

### Logout with Confirmation

```tsx
import { useLogout } from '@/shared/hooks';

function LogoutButton() {
  const { logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      const result = await logout();
      if (result.success) {
        // Redirect handled automatically by auth system
      }
    }
  };

  return (
    <button onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? 'Logging out...' : 'Logout'}
    </button>
  );
}
```

## Best Practices

1. **Use the right hook for the job**: Use `useAuthStatus` for components that only need auth status to avoid unnecessary re-renders.

2. **Combine hooks for complex scenarios**: Use multiple hooks together when you need different aspects of authentication.

3. **Handle loading and error states**: Always account for loading and error states in your UI.

4. **Role-based rendering**: Use `useRoleGuard` and `useResourceAccess` for clean conditional rendering.

5. **Auto-clear errors**: Use `useAuthError` with appropriate timeout for better UX.

6. **Initialize auth early**: Use `useInitializeAuth` at the app root to restore sessions.
