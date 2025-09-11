/**
 * MSW Browser Setup
 * 
 * Sets up Mock Service Worker for browser development
 * Controlled by environment variables
 */

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Create worker with all handlers
export const worker = setupWorker(...handlers);

/**
 * Start MSW in development mode based on environment variables
 */
export async function startMSW(): Promise<void> {
  // Check if MSW should be enabled
  const useMSW = import.meta.env.VITE_USE_MSW === 'true';
  const environment = import.meta.env.VITE_ENV || 'development';
  
  // Only start MSW in development/local environments when enabled
  if (!useMSW || environment === 'production') {
    console.log('🔧 MSW: Disabled (VITE_USE_MSW=false or production environment)');
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: 'warn',
      quiet: false,
    });
    
    console.log('🔧 MSW: Mock API started for development');
    console.log(`🔧 MSW: Using API base URL: ${import.meta.env.VITE_API_BASE_URL}`);
    console.log(`🔧 MSW: Registered ${handlers.length} handlers`);
    
    // Log registered handlers in development
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      handlers.forEach((handler, index) => {
        console.log(`  ${index + 1}. ${handler.info.header}`);
      });
    }
  } catch (error) {
    console.error('🔧 MSW: Failed to start worker:', error);
  }
}

/**
 * Stop MSW worker
 */
export function stopMSW(): void {
  worker.stop();
  console.log('🔧 MSW: Worker stopped');
}
