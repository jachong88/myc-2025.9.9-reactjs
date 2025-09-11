/**
 * MSW Handlers Index
 * 
 * Exports all mock handlers for MSW
 */

import { authHandlers } from './auth';
import { userHandlers } from './user';

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...userHandlers
];

// Export individual handler groups for selective use
export { authHandlers } from './auth';
export { userHandlers } from './user';
