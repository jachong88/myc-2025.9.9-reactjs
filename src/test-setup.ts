import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Create MSW server with auth handlers
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ 
    onUnhandledRequest: 'warn'
  });
  
  console.log('🔧 MSW Server started with handlers:', handlers.length);
  console.log('🔧 MSW Auth handlers registered:');
  handlers.forEach((handler, index) => {
    console.log(`  ${index + 1}. ${handler.info.header}`);
  });
});

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => {
  server.close();
});
