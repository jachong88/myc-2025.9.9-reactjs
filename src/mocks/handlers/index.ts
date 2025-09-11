/**
 * MSW Handlers Index
 * 
 * Exports all mock handlers for MSW
 */

import { authHandlers } from './auth';

// Combine all handlers
export const handlers = [
  ...authHandlers
];

// Export individual handler groups for selective use
export { authHandlers } from './auth';