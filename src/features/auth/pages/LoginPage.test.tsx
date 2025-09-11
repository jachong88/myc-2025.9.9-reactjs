/**
 * LoginPage Component Tests
 * 
 * Tests Firebase Google authentication LoginPage component
 * Mocks Firebase authentication for testing
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as useAuthModule from '../../../shared/hooks/useAuth';

// Mock Firebase auth
vi.mock('../../../config/firebase', () => ({
  auth: {},
  googleProvider: {}
}));

vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  GoogleAuthProvider: vi.fn()
}));

// Mock the auth hooks
const mockLogin = vi.fn();
const mockClearError = vi.fn();

vi.mock('../../../shared/hooks/useAuth', () => ({
  useLogin: () => ({
    login: mockLogin,
    isLoggingIn: false,
    error: null,
    clearError: mockClearError,
    isAuthenticated: false
  }),
  useAuthError: () => ({
    error: null,
    hasError: false,
    clearError: mockClearError
  })
}));

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams()]
  };
});

// Wrapper component for Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the login page with Google sign-in button', () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByText('MYC Studio Management')).toBeInTheDocument();
      expect(screen.getByText('Please sign in with Google to continue')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument();
    });

    it('should render security message', () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByText('Secure authentication powered by Google')).toBeInTheDocument();
    });

    it('should render Google icon in the button', () => {
      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const button = screen.getByRole('button', { name: /continue with google/i });
      expect(button).toBeInTheDocument();
      // SVG should be present
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('Google Login Interaction', () => {
    it('should call login function when Google button is clicked', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockClearError).toHaveBeenCalled();
        expect(mockLogin).toHaveBeenCalledWith();
      });
    });

    it('should navigate to home on successful login', async () => {
      mockLogin.mockResolvedValueOnce({ success: true });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const googleButton = screen.getByRole('button', { name: /continue with google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during authentication', () => {
      vi.spyOn(useAuthModule, 'useLogin').mockReturnValue({
        login: mockLogin,
        isLoggingIn: true,
        error: null,
        clearError: mockClearError,
        isAuthenticated: false
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByText('Signing in with Google...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
      
      // Loading spinner should be visible during loading
      expect(screen.getByRole('button').querySelector('svg[data-icon="loading"]')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error message when there is an authentication error', () => {
      vi.spyOn(useAuthModule, 'useAuthError').mockReturnValue({
        error: 'Login failed. Please try again.',
        hasError: true,
        clearError: mockClearError
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
    });

    it('should have error dismiss button', () => {
      vi.spyOn(useAuthModule, 'useAuthError').mockReturnValue({
        error: 'Login failed. Please try again.',
        hasError: true,
        clearError: mockClearError
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const dismissButton = screen.getByRole('button', { name: '×' });
      fireEvent.click(dismissButton);

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      // Mock normal (non-loading, non-error) state
      vi.spyOn(useAuthModule, 'useLogin').mockReturnValue({
        login: mockLogin,
        isLoggingIn: false,
        error: null,
        clearError: mockClearError,
        isAuthenticated: false
      });
      
      vi.spyOn(useAuthModule, 'useAuthError').mockReturnValue({
        error: null,
        hasError: false,
        clearError: mockClearError
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const button = screen.getByRole('button', { name: /continue with google/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should have error alert with proper role', () => {
      vi.spyOn(useAuthModule, 'useAuthError').mockReturnValue({
        error: 'Login failed. Please try again.',
        hasError: true,
        clearError: mockClearError
      });

      render(
        <RouterWrapper>
          <LoginPage />
        </RouterWrapper>
      );

      const errorAlert = screen.getByRole('alert');
      expect(errorAlert).toBeInTheDocument();
    });
  });
});
