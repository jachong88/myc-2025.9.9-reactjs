/**
 * Login Page
 * 
 * Provides Google authentication interface following MYC design system.
 * Features centered card layout with Google sign-in button.
 */

import React, { useCallback } from 'react';
import { Card } from '../../../ui/Card';
import { PageTitle, BodyText } from '../../../ui/Typography';
import { Button } from '../../../ui/Button';
import { useLogin, useAuthError } from '../../../shared/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Login Page Component
 * 
 * Renders a centered Google authentication interface following MYC wireframe specifications.
 * Integrates with Firebase Google authentication for secure login flow.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoggingIn } = useLogin();
  const { error, hasError, clearError } = useAuthError(5000);

  const handleGoogleLogin = useCallback(async () => {
    clearError(); // Clear any previous errors
    try {
      const result = await login(); // Firebase Google auth doesn't need credentials
      if (result.success) {
        // Redirect to intended route or dashboard
        const redirectPath = searchParams.get('from') || '/';
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      // Error handling is automatic via the auth store
      console.error('Google login failed:', error);
    }
  }, [login, navigate, searchParams, clearError]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--myc-color-bg, #f0f2f5)',
        padding: '16px',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '32px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center' }}>
            <PageTitle>MYC Studio Management</PageTitle>
            <BodyText type="secondary">Please sign in with Google to continue</BodyText>
          </div>

          {/* Error Display */}
          {hasError && (
            <div
              role="alert"
              style={{
                border: '1px solid var(--myc-color-danger, #ff4d4f)',
                background: 'rgba(255, 77, 79, 0.08)',
                color: 'var(--myc-color-danger, #ff4d4f)',
                padding: '12px',
                borderRadius: '8px',
                position: 'relative',
              }}
            >
              {error}
              <Button
                variant="link"
                onClick={clearError}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  padding: '4px',
                  minWidth: 'auto',
                }}
              >
                ×
              </Button>
            </div>
          )}

          {/* Google Authentication Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Button
              variant="primary"
              size="large"
              loading={isLoggingIn}
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              style={{
                width: '100%',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                backgroundColor: isLoggingIn ? '#ccc' : '#4285f4',
                borderColor: '#4285f4',
                color: 'white',
                fontWeight: '500',
                fontSize: '16px',
                borderRadius: '8px',
                border: '1px solid #4285f4',
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isLoggingIn) {
                  e.currentTarget.style.backgroundColor = '#3367d6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoggingIn) {
                  e.currentTarget.style.backgroundColor = '#4285f4';
                }
              }}
            >
              {/* Google Icon */}
              {!isLoggingIn && (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    fill="white"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="white"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="white"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="white"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              
              {isLoggingIn ? 'Signing in with Google...' : 'Continue with Google'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <BodyText 
                type="secondary" 
                style={{ fontSize: '14px', color: 'var(--myc-color-text-secondary, #666)' }}
              >
                Secure authentication powered by Google
              </BodyText>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
