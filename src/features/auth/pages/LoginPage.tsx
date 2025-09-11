/**
 * Login Page
 * 
 * Provides user authentication interface following MYC design system.
 * Features centered card layout ready for Google authentication.
 */

import React from 'react';
import { Card } from '../../../ui/Card';
import { PageTitle, BodyText } from '../../../ui/Typography';
import { Button } from '../../../ui/Button';
import { useAuthError } from '../../../shared/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Login Page Component
 * 
 * Renders a centered login interface following MYC wireframe specifications.
 * Prepared for Google authentication integration.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { error, hasError, clearError } = useAuthError(5000);

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
            <BodyText type="secondary">Please sign in to continue</BodyText>
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

          {/* Authentication Section - Ready for Google Login */}
          <div style={{ textAlign: 'center' }}>
            <BodyText type="secondary">
              Authentication system ready for Google login integration
            </BodyText>
          </div>
        </div>
      </Card>
    </div>
  );
}
