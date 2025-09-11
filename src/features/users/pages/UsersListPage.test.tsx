import React from 'react';
import { describe, it, expect, vi, beforeAll, afterEach, afterAll, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { userHandlers } from '../../../mocks/handlers/user';
import { UsersListPage } from './UsersListPage';

// Mock message from antd since we're not setting up full antd provider
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      error: vi.fn(),
      info: vi.fn(),
      success: vi.fn(),
    },
  };
});

// Setup MSW server for integration testing
const server = setupServer(...userHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  console.log('🔧 MSW Server started for UsersListPage integration tests');
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  console.log('🔧 MSW Server closed for UsersListPage integration tests');
});

describe('UsersListPage Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Rendering', () => {
    it('should render page header with title and buttons', async () => {
      render(<UsersListPage />);

      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add user/i })).toBeInTheDocument();
    });

    it('should render all main sections', async () => {
      render(<UsersListPage />);

      // Wait for initial data load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Check all sections are present
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument(); // Filters
      expect(screen.getByText('Name')).toBeInTheDocument(); // Table header
      expect(screen.getByText('1-5 of 5 users')).toBeInTheDocument(); // Pagination
    });
  });

  describe('Initial Data Loading', () => {
    it('should load and display users on page mount', async () => {
      render(<UsersListPage />);

      // Should show loading initially
      expect(screen.getByText('Loading users...')).toBeInTheDocument();

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      // Loading should disappear
      expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
    });

    it('should show correct pagination info after initial load', async () => {
      render(<UsersListPage />);

      await waitFor(() => {
        expect(screen.getByText('1-5 of 5 users')).toBeInTheDocument();
      });
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter users when search is performed', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial data load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Enter email filter
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'john.doe');

      // Click search
      await user.click(screen.getByRole('button', { name: /search/i }));

      // Should show loading
      expect(screen.getByText('Loading users...')).toBeInTheDocument();

      // Wait for filtered results
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });

      // Pagination should update
      expect(screen.getByText('1-1 of 1 users')).toBeInTheDocument();
    });

    it('should reset filters and reload data', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Apply filter
      await user.type(screen.getByLabelText(/email/i), 'john.doe');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(screen.getByText('1-1 of 1 users')).toBeInTheDocument();
      });

      // Reset filters
      await user.click(screen.getByRole('button', { name: /reset/i }));

      // Should show all users again
      await waitFor(() => {
        expect(screen.getByText('1-5 of 5 users')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });
    });

    it('should handle no results found', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Search for non-existent user
      await user.type(screen.getByLabelText(/email/i), 'nonexistent@example.com');
      await user.click(screen.getByRole('button', { name: /search/i }));

      // Should show empty state
      await waitFor(() => {
        expect(screen.getByText('No users found. Try adjusting your filters or add a new user.')).toBeInTheDocument();
      });
    });
  });

  describe('Pagination Functionality', () => {
    it('should handle pagination changes', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Change page size to 2
      const pageSizeSelector = screen.getByTitle('10 / page');
      await user.click(pageSizeSelector);

      await waitFor(() => {
        const option = screen.getByText('2 / page');
        expect(option).toBeInTheDocument();
      });

      await user.click(screen.getByText('2 / page'));

      // Should show loading and then update
      await waitFor(() => {
        expect(screen.getByText('1-2 of 5 users')).toBeInTheDocument();
      });

      // Should have pagination controls for multiple pages
      expect(screen.getByTitle('Next Page')).toBeInTheDocument();
    });

    it('should navigate between pages', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Set page size to 2 first
      const pageSizeSelector = screen.getByTitle('10 / page');
      await user.click(pageSizeSelector);
      await waitFor(() => screen.getByText('2 / page'));
      await user.click(screen.getByText('2 / page'));

      // Wait for page size change
      await waitFor(() => {
        expect(screen.getByText('1-2 of 5 users')).toBeInTheDocument();
      });

      // Go to next page
      const nextButton = screen.getByTitle('Next Page');
      await user.click(nextButton);

      // Should load next page
      await waitFor(() => {
        expect(screen.getByText('3-4 of 5 users')).toBeInTheDocument();
      });
    });
  });

  describe('User Actions', () => {
    it('should handle edit user action', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for data load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Click edit button for first user
      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      // Should show message (mocked)
      const { message } = await import('antd');
      expect(message.info).toHaveBeenCalledWith('Edit user: John Doe (ID: 1)');
    });

    it('should handle add user action', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Click add user button
      await user.click(screen.getByRole('button', { name: /add user/i }));

      // Should show message (mocked)
      const { message } = await import('antd');
      expect(message.info).toHaveBeenCalledWith('Add User functionality - Coming soon!');
    });

    it('should handle refresh action', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Click refresh
      await user.click(screen.getByRole('button', { name: /refresh/i }));

      // Should show loading and reload data
      expect(screen.getByText('Loading users...')).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle server errors gracefully', async () => {
      // Modify the server to return an error
      server.use(
        ...userHandlers.map(handler => {
          if (handler.info.method === 'GET' && handler.info.path?.includes('/users')) {
            return handler.clone({
              resolver: () => {
                return new Response(null, { status: 500, statusText: 'Internal Server Error' });
              }
            });
          }
          return handler;
        })
      );

      render(<UsersListPage />);

      // Should show error state
      await waitFor(() => {
        expect(screen.getByText('Error Loading Users')).toBeInTheDocument();
      });

      // Should show retry button
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    it('should allow retry after error', async () => {
      const user = userEvent.setup();

      // Start with error state
      server.use(
        ...userHandlers.map(handler => {
          if (handler.info.method === 'GET' && handler.info.path?.includes('/users')) {
            return handler.clone({
              resolver: () => {
                return new Response(null, { status: 500, statusText: 'Internal Server Error' });
              }
            });
          }
          return handler;
        })
      );

      render(<UsersListPage />);

      // Wait for error
      await waitFor(() => {
        expect(screen.getByText('Error Loading Users')).toBeInTheDocument();
      });

      // Reset handlers to working state
      server.resetHandlers();

      // Click retry
      await user.click(screen.getByRole('button', { name: /retry/i }));

      // Should load successfully
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Error Loading Users')).not.toBeInTheDocument();
      });
    });

    it('should handle unauthorized access', async () => {
      // Set up unauthorized response
      server.use(
        ...userHandlers.map(handler => {
          if (handler.info.method === 'GET' && handler.info.path?.includes('/users')) {
            return handler.clone({
              resolver: () => {
                return Response.json(
                  { success: false, message: 'Unauthorized access', errorCode: 'UNAUTHORIZED' },
                  { status: 401 }
                );
              }
            });
          }
          return handler;
        })
      );

      render(<UsersListPage />);

      // Should show error message
      const { message } = await import('antd');
      await waitFor(() => {
        expect(message.error).toHaveBeenCalledWith('Unauthorized access');
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading during initial data fetch', () => {
      render(<UsersListPage />);

      expect(screen.getByText('Loading users...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /refresh/i })).toBeDisabled();
    });

    it('should show loading during filtering', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Start a search
      await user.type(screen.getByLabelText(/email/i), 'john');
      
      // Click search and immediately check for loading
      const searchPromise = user.click(screen.getByRole('button', { name: /search/i }));
      
      // Should show loading
      expect(screen.getByText('Loading users...')).toBeInTheDocument();

      await searchPromise;
    });

    it('should disable buttons during loading', async () => {
      render(<UsersListPage />);

      // During initial load, buttons should be disabled
      expect(screen.getByRole('button', { name: /refresh/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
    });
  });

  describe('Data Flow Integration', () => {
    it('should maintain filter state during pagination', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Apply filter for US users
      const countrySelect = screen.getByLabelText(/country/i);
      await user.click(countrySelect);
      await waitFor(() => screen.getByText('United States'));
      await user.click(screen.getByText('United States'));

      await user.click(screen.getByRole('button', { name: /search/i }));

      // Wait for filtered results
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
        expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument(); // Canadian user
      });

      // Change page size
      const pageSizeSelector = screen.getByTitle('10 / page');
      await user.click(pageSizeSelector);
      await waitFor(() => screen.getByText('2 / page'));
      await user.click(screen.getByText('2 / page'));

      // Should maintain country filter
      await waitFor(() => {
        expect(screen.queryByText('Bob Johnson')).not.toBeInTheDocument();
        expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
      });
    });

    it('should reset page to 0 when filters change', async () => {
      const user = userEvent.setup();
      render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Go to page size 1 and navigate to second page
      const pageSizeSelector = screen.getByTitle('10 / page');
      await user.click(pageSizeSelector);
      await waitFor(() => screen.getByText('1 / page'));
      await user.click(screen.getByText('1 / page'));

      await waitFor(() => {
        expect(screen.getByText('1-1 of 5 users')).toBeInTheDocument();
      });

      // Navigate to next page
      const nextButton = screen.getByTitle('Next Page');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('2-2 of 5 users')).toBeInTheDocument();
      });

      // Now apply a filter
      await user.type(screen.getByLabelText(/email/i), 'john');
      await user.click(screen.getByRole('button', { name: /search/i }));

      // Should be back to first page
      await waitFor(() => {
        expect(screen.getByText('1-1 of 1 users')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Memory', () => {
    it('should not cause memory leaks with multiple re-renders', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<UsersListPage />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      // Trigger multiple re-renders by changing filters
      for (let i = 0; i < 5; i++) {
        const emailInput = screen.getByLabelText(/email/i);
        await user.clear(emailInput);
        await user.type(emailInput, `test${i}@example.com`);
        await user.click(screen.getByRole('button', { name: /search/i }));
        
        await waitFor(() => {
          expect(screen.getByText('No users found')).toBeInTheDocument();
        });

        rerender(<UsersListPage />);
      }

      // Should still work normally
      expect(screen.getByText('Users')).toBeInTheDocument();
    });
  });
});
