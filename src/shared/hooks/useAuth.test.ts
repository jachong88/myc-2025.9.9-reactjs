/**
 * useAuth Hooks Tests
 * 
 * Tests all Firebase authentication hooks for functionality and integration
 * Mocks Firebase authentication for testing
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { 
  useAuth, 
  useAuthStatus, 
  useAuthActions, 
  useUser, 
  useInitializeAuth, 
  useRoleGuard, 
  useResourceAccess, 
  useAuthError, 
  useLogin, 
  useLogout 
} from './useAuth';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types/domain';

// Mock Firebase auth
vi.mock('../../config/firebase', () => ({
  auth: {},
  googleProvider: {}
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn()
}));

// Mock the auth store
vi.mock('../stores/authStore', () => ({
  useAuthStore: vi.fn()
}));

const mockUseAuthStore = vi.mocked(useAuthStore);

describe('useAuth Hooks', () => {
  const mockUser: User = {
    id: 'test-uid-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    status: 'active',
    deleted: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockStore = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    isInitialized: false,
    login: vi.fn(),
    logout: vi.fn(),
    clearError: vi.fn(),
    refreshToken: vi.fn(),
    updateUser: vi.fn(),
    updateProfile: vi.fn(),
    initializeAuth: vi.fn(),
    hasRole: vi.fn(),
    hasAnyRole: vi.fn(),
    isAdmin: vi.fn(),
    canAccess: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuthStore.mockImplementation(() => mockStore);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('useAuth', () => {
    it('should return complete authentication state and actions', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current).toHaveProperty('isAuthenticated', false);
      expect(result.current).toHaveProperty('user', null);
      expect(result.current).toHaveProperty('isLoading', false);
      expect(result.current).toHaveProperty('error', null);
      expect(result.current).toHaveProperty('isInitialized', false);
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('clearError');
      expect(result.current).toHaveProperty('refreshToken');
      expect(result.current).toHaveProperty('updateUser');
      expect(result.current).toHaveProperty('hasRole');
      expect(result.current).toHaveProperty('hasAnyRole');
      expect(result.current).toHaveProperty('isAdmin');
      expect(result.current).toHaveProperty('canAccess');
    });

    it('should compute isAdmin correctly when user has admin role', () => {
      mockUseAuthStore.mockImplementation(() => ({
        ...mockStore,
        isAuthenticated: true,
        user: mockUser
      }));

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAdmin).toBe(true);
    });

    it('should compute isAdmin as false when user has non-admin role', () => {
      mockUseAuthStore.mockImplementation(() => ({
        ...mockStore,
        isAuthenticated: true,
        user: { ...mockUser, role: 'student' }
      }));

      const { result } = renderHook(() => useAuth());

      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe('useAuthStatus', () => {
    it('should return only authentication status fields', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true
      }));

      const { result } = renderHook(() => useAuthStatus());

      expect(result.current).toEqual({
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true
      });
    });
  });

  describe('useAuthActions', () => {
    it('should return only action functions', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        login: mockStore.login,
        logout: mockStore.logout,
        clearError: mockStore.clearError,
        refreshToken: mockStore.refreshToken,
        updateUser: mockStore.updateUser
      }));

      const { result } = renderHook(() => useAuthActions());

      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('clearError');
      expect(result.current).toHaveProperty('refreshToken');
      expect(result.current).toHaveProperty('updateUser');
    });
  });

  describe('useUser', () => {
    it('should return user data and role functions', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        user: mockUser,
        isAuthenticated: true,
        hasRole: mockStore.hasRole,
        hasAnyRole: mockStore.hasAnyRole,
        isAdmin: mockStore.isAdmin,
        canAccess: mockStore.canAccess
      }));

      const { result } = renderHook(() => useUser());

      expect(result.current).toHaveProperty('user', mockUser);
      expect(result.current).toHaveProperty('isAuthenticated', true);
      expect(result.current).toHaveProperty('hasRole');
      expect(result.current).toHaveProperty('hasAnyRole');
      expect(result.current).toHaveProperty('isAdmin');
      expect(result.current).toHaveProperty('canAccess');
    });
  });

  describe('useInitializeAuth', () => {
    it('should auto-initialize by default', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        initializeAuth: mockStore.initializeAuth,
        isInitialized: false
      }));

      renderHook(() => useInitializeAuth());

      expect(mockStore.initializeAuth).toHaveBeenCalled();
    });

    it('should not auto-initialize when disabled', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        initializeAuth: mockStore.initializeAuth,
        isInitialized: false
      }));

      renderHook(() => useInitializeAuth(false));

      expect(mockStore.initializeAuth).not.toHaveBeenCalled();
    });

    it('should not initialize if already initialized', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        initializeAuth: mockStore.initializeAuth,
        isInitialized: true
      }));

      renderHook(() => useInitializeAuth());

      expect(mockStore.initializeAuth).not.toHaveBeenCalled();
    });

    it('should provide manual initialize function', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        initializeAuth: mockStore.initializeAuth,
        isInitialized: false
      }));

      const { result } = renderHook(() => useInitializeAuth(false));

      act(() => {
        result.current.initialize();
      });

      expect(mockStore.initializeAuth).toHaveBeenCalled();
    });
  });

  describe('useRoleGuard', () => {
    it('should grant access when user has required role', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        user: mockUser,
        isAuthenticated: true,
        hasRole: vi.fn(() => true),
        hasAnyRole: vi.fn(() => true)
      }));

      const { result } = renderHook(() => useRoleGuard('admin'));

      expect(result.current.hasAccess).toBe(true);
      expect(result.current.canRender).toBe(true);
    });

    it('should deny access when user lacks required role', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        user: mockUser,
        isAuthenticated: true,
        hasRole: vi.fn(() => false),
        hasAnyRole: vi.fn(() => false)
      }));

      const { result } = renderHook(() => useRoleGuard('admin'));

      expect(result.current.hasAccess).toBe(false);
      expect(result.current.canRender).toBe(false);
    });

    it('should deny access when user is not authenticated', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        user: null,
        isAuthenticated: false,
        hasRole: vi.fn(() => false),
        hasAnyRole: vi.fn(() => false)
      }));

      const { result } = renderHook(() => useRoleGuard('admin'));

      expect(result.current.hasAccess).toBe(false);
      expect(result.current.canRender).toBe(false);
    });

    it('should handle multiple roles with hasAnyRole', () => {
      const mockHasAnyRole = vi.fn(() => true);
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        user: mockUser,
        isAuthenticated: true,
        hasRole: vi.fn(),
        hasAnyRole: mockHasAnyRole
      }));

      const { result } = renderHook(() => useRoleGuard(['admin', 'teacher']));

      expect(result.current.hasAccess).toBe(true);
      expect(mockHasAnyRole).toHaveBeenCalledWith(['admin', 'teacher']);
    });
  });

  describe('useResourceAccess', () => {
    it('should check resource access correctly', () => {
      const mockCanAccess = vi.fn(() => true);
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        canAccess: mockCanAccess,
        isAuthenticated: true,
        user: mockUser
      }));

      const { result } = renderHook(() => useResourceAccess('users-management'));

      expect(result.current.canAccess).toBe(true);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.userRole).toBe('admin');
      expect(mockCanAccess).toHaveBeenCalledWith('users-management');
    });
  });

  describe('useAuthError', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should return error state and clearError function', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        error: 'Login failed',
        clearError: mockStore.clearError
      }));

      const { result } = renderHook(() => useAuthError());

      expect(result.current.error).toBe('Login failed');
      expect(result.current.hasError).toBe(true);
      expect(result.current.clearError).toBe(mockStore.clearError);
    });

    it('should auto-clear errors after timeout', async () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        error: 'Login failed',
        clearError: mockStore.clearError
      }));

      renderHook(() => useAuthError(1000));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockStore.clearError).toHaveBeenCalled();
    });

    it('should not auto-clear when timeout is 0', () => {
      mockUseAuthStore.mockImplementation((selector: any) => selector({
        error: 'Login failed',
        clearError: mockStore.clearError
      }));

      renderHook(() => useAuthError(0));

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(mockStore.clearError).not.toHaveBeenCalled();
    });
  });

  describe('useLogin', () => {
    it('should provide login function and state', () => {
      const { result } = renderHook(() => useLogin());

      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('isLoggingIn');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('clearError');
      expect(result.current).toHaveProperty('isAuthenticated');
    });

    it('should clear errors before login attempt', async () => {
      mockStore.login.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login();
      });

      expect(mockStore.clearError).toHaveBeenCalled();
      expect(mockStore.login).toHaveBeenCalled();
    });

    it('should return success result on successful login', async () => {
      mockStore.login.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        const loginResult = await result.current.login();
        expect(loginResult).toEqual({ success: true });
      });
    });

    it('should return error result on failed login', async () => {
      mockStore.login.mockRejectedValueOnce(new Error('Firebase error'));

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        const loginResult = await result.current.login();
        expect(loginResult).toEqual({ 
          success: false, 
          error: 'Firebase error' 
        });
      });
    });

    it('should handle non-Error exceptions', async () => {
      mockStore.login.mockRejectedValueOnce('String error');

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        const loginResult = await result.current.login();
        expect(loginResult).toEqual({ 
          success: false, 
          error: 'Login failed' 
        });
      });
    });
  });

  describe('useLogout', () => {
    it('should provide logout function and state', () => {
      const { result } = renderHook(() => useLogout());

      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('isLoggingOut');
    });

    it('should return success result on successful logout', async () => {
      mockStore.logout.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useLogout());

      await act(async () => {
        const logoutResult = await result.current.logout();
        expect(logoutResult).toEqual({ success: true });
      });

      expect(mockStore.logout).toHaveBeenCalled();
    });

    it('should return error result on failed logout', async () => {
      mockStore.logout.mockRejectedValueOnce(new Error('Firebase logout error'));

      const { result } = renderHook(() => useLogout());

      await act(async () => {
        const logoutResult = await result.current.logout();
        expect(logoutResult).toEqual({ 
          success: false, 
          error: 'Firebase logout error' 
        });
      });
    });

    it('should handle non-Error exceptions during logout', async () => {
      mockStore.logout.mockRejectedValueOnce('Logout string error');

      const { result } = renderHook(() => useLogout());

      await act(async () => {
        const logoutResult = await result.current.logout();
        expect(logoutResult).toEqual({ 
          success: false, 
          error: 'Logout failed' 
        });
      });
    });
  });
});
