/**
 * Unauthorized Page
 * 
 * Displayed when user lacks required permissions to access a route.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../Page';
import { Button } from '../../../ui/Button';

/**
 * Unauthorized Page Component
 * 
 * Shows access denied message with options to return to dashboard
 */
export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Page title="Access Denied">
      <div style={{ textAlign: 'center', padding: '2rem 0', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
        
        <h2 style={{ 
          color: 'var(--myc-color-text, #333)', 
          marginBottom: '1rem' 
        }}>
          Access Denied
        </h2>
        
        <p style={{ 
          color: 'var(--myc-color-text-secondary, #8c8c8c)', 
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          You don't have permission to access this page. Please contact your administrator 
          if you believe this is an error.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </Button>
          
          <Button
            variant="default"
            onClick={() => navigate(-1)}
          >
            Go Back
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default UnauthorizedPage;
