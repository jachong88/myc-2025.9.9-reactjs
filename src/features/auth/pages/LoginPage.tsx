/**
 * Login Page
 * 
 * Provides user authentication interface following MYC design system.
 * Features centered card layout with email/password form validation.
 */

import React, { useCallback } from 'react';
import { Card } from '../../../ui/Card';
import { PageTitle, BodyText } from '../../../ui/Typography';
import { Form, FormItem, FormActions, useForm } from '../../../ui/Form';
import { Input, InputPassword } from '../../../ui/Input';
import { Button } from '../../../ui/Button';
import { useLogin, useAuthError } from '../../../shared/hooks/useAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Login Page Component
 * 
 * Renders a centered login form following MYC wireframe specifications.
 * Integrates with authentication system for secure login flow.
 */
export default function LoginPage() {
  const [form] = useForm();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, isLoggingIn } = useLogin();
  const { error, hasError, clearError } = useAuthError(5000);

  const handleFinish = useCallback(async (values: { email: string; password: string }) => {
    const result = await login(values);
    if (result.success) {
      // Redirect to intended route or dashboard
      const redirectPath = searchParams.get('from') || '/';
      navigate(redirectPath, { replace: true });
    }
  }, [login, navigate, searchParams]);

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

          {/* Login Form */}
          <Form 
            form={form} 
            layout="vertical" 
            onFinish={handleFinish}
            style={{ width: '100%' }}
          >
            <FormItem
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input 
                type="email"
                placeholder="you@example.com" 
                allowClear 
                size="large"
              />
            </FormItem>

            <FormItem
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <InputPassword 
                placeholder="Enter your password" 
                size="large"
              />
            </FormItem>

            <div style={{ marginTop: '8px' }}>
              <FormActions>
                <Button
                  variant="primary"
                  htmlType="submit"
                  loading={isLoggingIn as any}
                  size="large"
                  style={{ width: '100%' }}
                >
                  {isLoggingIn ? 'Signing in...' : 'Login'}
                </Button>
              </FormActions>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
}
