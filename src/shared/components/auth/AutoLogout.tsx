/**
 * Auto Logout Component
 * 
 * Monitors token expiration and automatically logs out users when tokens expire.
 * Also provides warnings before expiration and handles silent token refresh.
 */

import React, { useEffect, useRef, useState } from 'react';
import { notification } from 'antd';
import { useAuthStore } from '../../stores/authStore';
import { getAccessToken, isTokenExpired, getTokenExpiration } from '../../utils/jwt';

interface AutoLogoutProps {
  /** Warning time before expiration in minutes (default: 5) */
  warningMinutes?: number;
  /** Whether to show expiration warnings (default: true) */
  showWarnings?: boolean;
  /** Whether to attempt silent token refresh (default: true) */
  enableRefresh?: boolean;
}

/**
 * Auto Logout Component
 * 
 * Should be mounted at the app root to monitor authentication state.
 * Automatically handles token expiration and logout.
 */
export const AutoLogout: React.FC<AutoLogoutProps> = ({
  warningMinutes = 5,
  showWarnings = true,
  enableRefresh = true,
}) => {
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [hasShownWarning, setHasShownWarning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkTokenExpiration = async () => {
    if (!isAuthenticated) return;

    const token = getAccessToken();
    if (!token) {
      await logout();
      return;
    }

    if (isTokenExpired(token)) {
      // Token is expired, attempt refresh if enabled
      if (enableRefresh) {
        try {
          await refreshToken();
          setHasShownWarning(false); // Reset warning flag after successful refresh
          return;
        } catch (error) {
          // Refresh failed, proceed with logout
          console.warn('Token refresh failed, logging out:', error);
        }
      }
      
      // Show expiration notification and logout
      if (showWarnings) {
        notification.warning({
          message: 'Session Expired',
          description: 'Your session has expired. Please log in again.',
          duration: 4,
          placement: 'topRight',
        });
      }

      await logout();
      return;
    }

    // Check if we should show a warning
    if (showWarnings && !hasShownWarning) {
      const expiration = getTokenExpiration(token);
      if (expiration) {
        const timeUntilExpiry = expiration - Date.now();
        const warningTime = warningMinutes * 60 * 1000; // Convert to milliseconds

        if (timeUntilExpiry <= warningTime && timeUntilExpiry > 0) {
          const minutesLeft = Math.ceil(timeUntilExpiry / (60 * 1000));
          
          notification.warning({
            message: 'Session Expiring Soon',
            description: `Your session will expire in ${minutesLeft} minute${minutesLeft !== 1 ? 's' : ''}. Please save your work.`,
            duration: 0, // Don't auto-close
            placement: 'topRight',
            key: 'session-warning',
            btn: enableRefresh ? (
              <button
                onClick={async () => {
                  notification.destroy('session-warning');
                  try {
                    await refreshToken();
                    notification.success({
                      message: 'Session Extended',
                      description: 'Your session has been successfully extended.',
                      duration: 3,
                    });
                    setHasShownWarning(false);
                  } catch (error) {
                    notification.error({
                      message: 'Refresh Failed',
                      description: 'Unable to extend session. Please save your work.',
                      duration: 5,
                    });
                  }
                }}
                style={{
                  background: 'var(--myc-color-primary, #1677ff)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                }}
              >
                Extend Session
              </button>
            ) : undefined,
          });
          
          setHasShownWarning(true);
        }
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear interval when not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setHasShownWarning(false);
      return;
    }

    // Start monitoring token expiration
    intervalRef.current = setInterval(checkTokenExpiration, 30000); // Check every 30 seconds

    // Initial check
    checkTokenExpiration();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAuthenticated, warningMinutes, showWarnings, enableRefresh]);

  // Component renders nothing - it's just for side effects
  return null;
};

export default AutoLogout;
