/**
 * Logout Confirmation Modal
 * 
 * Provides a confirmation dialog before logging out users.
 * Prevents accidental logouts and follows UX best practices.
 */

import React from 'react';
import { Modal, notification } from 'antd';
import { Button } from '../../../ui/Button';
import { useLogout } from '../../hooks/useAuth';

export interface LogoutModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Callback when modal is closed without logout */
  onCancel: () => void;
  /** Optional callback after successful logout */
  onSuccess?: () => void;
}

/**
 * Logout Confirmation Modal Component
 * 
 * Shows a confirmation dialog with logout details and actions.
 * Handles the actual logout process with loading states and error handling.
 */
export const LogoutModal: React.FC<LogoutModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const { logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      // Show success notification
      notification.success({
        message: 'Logged Out',
        description: 'You have been successfully logged out.',
        duration: 3,
        placement: 'topRight',
      });
      
      onSuccess?.();
      // Navigation will be handled automatically by ProtectedRoute
    }
    // Errors are handled by the auth store and displayed via notifications
  };

  return (
    <Modal
      title="Confirm Logout"
      open={open}
      onCancel={onCancel}
      closable={!isLoggingOut}
      maskClosable={!isLoggingOut}
      footer={null}
      centered
      width={400}
    >
      <div style={{ padding: '8px 0 16px' }}>
        <p style={{ 
          marginBottom: '16px',
          color: 'var(--myc-color-text, #333)',
          lineHeight: '1.5'
        }}>
          Are you sure you want to log out? You'll need to sign in again to access your account.
        </p>
        
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          justifyContent: 'flex-end',
          marginTop: '24px' 
        }}>
          <Button
            variant="default"
            onClick={onCancel}
            disabled={isLoggingOut}
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            onClick={handleLogout}
            loading={isLoggingOut as any}
          >
            {isLoggingOut ? 'Logging out...' : 'Log Out'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LogoutModal;
