import { useState } from 'react';
import { Button } from 'antd';

/**
 * Test component to trigger errors for testing ErrorBoundary functionality
 * This should only be used in development for testing purposes
 */
export function ErrorBoundaryTest() {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    // Simulate an error for testing ErrorBoundary
    throw new Error('Test error: ErrorBoundary test triggered');
  }

  return (
    <div style={{ padding: '16px', border: '1px dashed #ccc', margin: '16px 0' }}>
      <h4>Error Boundary Test (Development Only)</h4>
      <p>Click the button below to trigger an error and test the ErrorBoundary:</p>
      <Button 
        danger 
        onClick={() => setShouldThrow(true)}
        style={{ marginTop: '8px' }}
      >
        Trigger Error
      </Button>
    </div>
  );
}
