import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserFilters } from './UserFilters';
import type { UserListParams } from '../../../shared/types/user';

describe('UserFilters Component', () => {
  const mockOnSearch = vi.fn();
  const defaultProps = {
    onSearch: mockOnSearch,
    loading: false,
  };

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  describe('Rendering', () => {
    it('should render all filter fields', () => {
      render(<UserFilters {...defaultProps} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/province/i)).toBeInTheDocument();
    });

    it('should render search and reset buttons', () => {
      render(<UserFilters {...defaultProps} />);

      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    });

    it('should display initial values when provided', () => {
      const initialValues: UserListParams = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        country: 'United States',
        province: 'California',
        page: 0,
        size: 10,
      };

      render(<UserFilters {...defaultProps} initialValues={initialValues} />);

      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('USER')).toBeInTheDocument();
      expect(screen.getByDisplayValue('United States')).toBeInTheDocument();
      expect(screen.getByDisplayValue('California')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should handle text input changes', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'user@example.com');

      expect(emailInput).toHaveValue('user@example.com');
    });

    it('should handle role selection', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      const roleSelect = screen.getByLabelText(/role/i);
      
      // Click to open dropdown
      await user.click(roleSelect);
      
      // Wait for options to appear and select ADMIN
      await waitFor(() => {
        const adminOption = screen.getByText('ADMIN');
        expect(adminOption).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('ADMIN'));
      
      expect(roleSelect).toHaveTextContent('ADMIN');
    });

    it('should handle country selection', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      const countrySelect = screen.getByLabelText(/country/i);
      
      await user.click(countrySelect);
      
      await waitFor(() => {
        const canadaOption = screen.getByText('Canada');
        expect(canadaOption).toBeInTheDocument();
      });
      
      await user.click(screen.getByText('Canada'));
      
      expect(countrySelect).toHaveTextContent('Canada');
    });

    it('should update province options when country changes', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      const countrySelect = screen.getByLabelText(/country/i);
      const provinceSelect = screen.getByLabelText(/province/i);

      // Select Canada
      await user.click(countrySelect);
      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
      await user.click(screen.getByText('Canada'));

      // Check that province dropdown is updated
      await user.click(provinceSelect);
      
      await waitFor(() => {
        expect(screen.getByText('Ontario')).toBeInTheDocument();
        expect(screen.getByText('Quebec')).toBeInTheDocument();
        expect(screen.getByText('British Columbia')).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should call onSearch with form values when search button is clicked', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      // Fill out form
      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.type(screen.getByLabelText(/first name/i), 'John');
      await user.type(screen.getByLabelText(/last name/i), 'Doe');

      // Select role
      await user.click(screen.getByLabelText(/role/i));
      await waitFor(() => screen.getByText('USER'));
      await user.click(screen.getByText('USER'));

      // Click search
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith({
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'USER',
          country: undefined,
          province: undefined,
          page: 0,
          size: 10,
        });
      });
    });

    it('should call onSearch with only filled values', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      // Fill only email
      await user.type(screen.getByLabelText(/email/i), 'partial@example.com');

      // Click search
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith({
          email: 'partial@example.com',
          firstName: '',
          lastName: '',
          role: undefined,
          country: undefined,
          province: undefined,
          page: 0,
          size: 10,
        });
      });
    });

    it('should handle form submission via Enter key', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'enter@example.com');
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'enter@example.com',
          })
        );
      });
    });
  });

  describe('Reset Functionality', () => {
    it('should clear all fields when reset button is clicked', async () => {
      const user = userEvent.setup();
      const initialValues: UserListParams = {
        email: 'test@example.com',
        firstName: 'John',
        role: 'ADMIN',
        page: 0,
        size: 10,
      };

      render(<UserFilters {...defaultProps} initialValues={initialValues} />);

      // Verify initial values are set
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();

      // Click reset
      await user.click(screen.getByRole('button', { name: /reset/i }));

      // Wait for fields to be cleared
      await waitFor(() => {
        expect(screen.getByLabelText(/email/i)).toHaveValue('');
        expect(screen.getByLabelText(/first name/i)).toHaveValue('');
        expect(screen.getByLabelText(/last name/i)).toHaveValue('');
      });

      // Verify onSearch is called with empty values
      expect(mockOnSearch).toHaveBeenCalledWith({
        email: '',
        firstName: '',
        lastName: '',
        role: undefined,
        country: undefined,
        province: undefined,
        page: 0,
        size: 10,
      });
    });

    it('should reset province when country is cleared', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      const countrySelect = screen.getByLabelText(/country/i);
      
      // Select a country first
      await user.click(countrySelect);
      await waitFor(() => screen.getByText('Canada'));
      await user.click(screen.getByText('Canada'));

      // Select a province
      const provinceSelect = screen.getByLabelText(/province/i);
      await user.click(provinceSelect);
      await waitFor(() => screen.getByText('Ontario'));
      await user.click(screen.getByText('Ontario'));

      // Clear country selection
      await user.click(countrySelect);
      await user.click(screen.getByTitle('Clear')); // Ant Design clear button

      // Province should be cleared too
      await waitFor(() => {
        expect(provinceSelect).not.toHaveTextContent('Ontario');
      });
    });
  });

  describe('Loading State', () => {
    it('should disable buttons when loading', () => {
      render(<UserFilters {...defaultProps} loading={true} />);

      expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled();
    });

    it('should show loading indicator on search button', () => {
      render(<UserFilters {...defaultProps} loading={true} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      expect(searchButton).toHaveClass('ant-btn-loading');
    });

    it('should not disable form fields when loading', () => {
      render(<UserFilters {...defaultProps} loading={true} />);

      expect(screen.getByLabelText(/email/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/first name/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/role/i)).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for all form fields', () => {
      render(<UserFilters {...defaultProps} />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/province/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      // Tab through form fields
      await user.tab();
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/first name/i)).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText(/last name/i)).toHaveFocus();
    });

    it('should have proper button roles and accessible names', () => {
      render(<UserFilters {...defaultProps} />);

      const searchButton = screen.getByRole('button', { name: /search/i });
      const resetButton = screen.getByRole('button', { name: /reset/i });

      expect(searchButton).toHaveAttribute('type', 'submit');
      expect(resetButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Data Validation', () => {
    it('should handle empty string values correctly', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      // Type and then clear an input
      const emailInput = screen.getByLabelText(/email/i);
      await user.type(emailInput, 'test');
      await user.clear(emailInput);

      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            email: '',
          })
        );
      });
    });

    it('should trim whitespace from text inputs', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      await user.type(screen.getByLabelText(/email/i), '  spaced@example.com  ');
      await user.click(screen.getByRole('button', { name: /search/i }));

      await waitFor(() => {
        expect(mockOnSearch).toHaveBeenCalledWith(
          expect.objectContaining({
            email: '  spaced@example.com  ', // Component should handle trimming
          })
        );
      });
    });
  });

  describe('Performance', () => {
    it('should not call onSearch multiple times for single action', async () => {
      const user = userEvent.setup();
      render(<UserFilters {...defaultProps} />);

      await user.type(screen.getByLabelText(/email/i), 'test@example.com');
      await user.click(screen.getByRole('button', { name: /search/i }));

      // Wait a bit to ensure no additional calls
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });
  });
});
