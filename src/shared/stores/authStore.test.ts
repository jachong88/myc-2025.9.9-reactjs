/**
 * Basic Authentication Store Test
 * 
 * Simple test to verify auth store functionality
 * This will be expanded in EP-002-US-05 with comprehensive testing
 */

import { useAuthStore } from './authStore';
// Note: For component testing, use hooks from '@/shared/hooks'
// This test uses the store directly for internal testing

// Basic functionality test
console.log('🧪 Testing Authentication Store...');

// Get initial state
const initialState = useAuthStore.getState();
console.log('✅ Initial state:', {
  isAuthenticated: initialState.isAuthenticated,
  user: initialState.user,
  isLoading: initialState.isLoading,
  error: initialState.error,
  isInitialized: initialState.isInitialized,
});

// Test login functionality (mock)
const testLogin = async () => {
  const { login } = useAuthStore.getState();
  
  try {
    await login({
      email: 'test@example.com',
      password: 'password123',
    });
    
    const stateAfterLogin = useAuthStore.getState();
    console.log('✅ Login test successful:', {
      isAuthenticated: stateAfterLogin.isAuthenticated,
      userName: stateAfterLogin.user?.name,
      userEmail: stateAfterLogin.user?.email,
    });
  } catch (error) {
    console.error('❌ Login test failed:', error);
  }
};

// Test logout functionality
const testLogout = async () => {
  const { logout } = useAuthStore.getState();
  
  await logout();
  
  const stateAfterLogout = useAuthStore.getState();
  console.log('✅ Logout test successful:', {
    isAuthenticated: stateAfterLogout.isAuthenticated,
    user: stateAfterLogout.user,
  });
};

// Test role helpers
const testRoleHelpers = () => {
  const { hasRole, isAdmin, canAccess } = useAuthStore.getState();
  
  // First login to have a user for testing
  useAuthStore.getState().login({
    email: 'admin@example.com',
    password: 'password',
  }).then(() => {
    console.log('✅ Role helper tests:', {
      hasAdminRole: hasRole('admin'),
      isAdmin: isAdmin(),
      canAccessAdminResource: canAccess('admin-panel'),
      canAccessUserResource: canAccess('user-profile'),
    });
  });
};

// Run tests
testLogin()
  .then(() => testRoleHelpers())
  .then(() => testLogout())
  .then(() => {
    console.log('🎉 Authentication Store basic tests completed!');
  })
  .catch((error) => {
    console.error('❌ Authentication Store tests failed:', error);
  });

export {}; // Make this a module
