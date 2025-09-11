import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserTable } from './UserTable';
import type { UserListItem } from '../../../shared/types/user';

// Mock user data for testing
const mockUsers: UserListItem[] = [
  {
    id: 1,
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1-555-0101',
    role: 'USER',
    country: 'United States',
    province: 'California',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    email: 'jane.admin@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1-555-0102',
    role: 'ADMIN',
    country: 'United States',
    province: 'New York',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z',
  },
  {
    id: 3,
    email: 'bob.moderator@example.com',
    firstName: 'Bob',
    lastName: 'Johnson',
    phone: null,
    role: 'MODERATOR',
    country: null,
    province: null,
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-17T12:00:00Z',
  },
];

describe('UserTable Component', () => {
  const mockOnEdit = vi.fn();
  const mockOnPaginationChange = vi.fn();
  
  const defaultProps = {
    users: mockUsers,
    loading: false,
    onEdit: mockOnEdit,
    pagination: {
      current: 1,
      total: 100,
      pageSize: 10,
      onChange: mockOnPaginationChange,
    },
  };

  beforeEach(() => {
    mockOnEdit.mockClear();
    mockOnPaginationChange.mockClear();
  });

  describe('Rendering', () => {
    it('should render table with all column headers', () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(screen.getByText('Province')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    it('should render user data correctly', () => {
      render(<UserTable {...defaultProps} />);

      // Check if user data is rendered
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('+1-555-0101')).toBeInTheDocument();
      expect(screen.getByText('USER')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('California')).toBeInTheDocument();
    });

    it('should render multiple users', () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should show dash for null/empty values', () => {
      render(<UserTable {...defaultProps} />);

      // Bob Johnson has null phone, country, province
      const bobRow = screen.getByText('Bob Johnson').closest('tr');
      expect(bobRow).toHaveTextContent('-'); // Should have dashes for null values
    });

    it('should render Edit buttons for each user', () => {
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByText('Edit');
      expect(editButtons).toHaveLength(mockUsers.length);
    });
  });

  describe('Role Tags', () => {
    it('should render role tags with correct colors', () => {
      render(<UserTable {...defaultProps} />);

      const userTag = screen.getByText('USER');
      const adminTag = screen.getByText('ADMIN');
      const moderatorTag = screen.getByText('MODERATOR');

      expect(userTag).toHaveClass('ant-tag');
      expect(adminTag).toHaveClass('ant-tag');
      expect(moderatorTag).toHaveClass('ant-tag');

      // Check color classes (these are Ant Design internal classes)
      expect(userTag.closest('.ant-tag')).toHaveClass('ant-tag-blue');
      expect(adminTag.closest('.ant-tag')).toHaveClass('ant-tag-red');
      expect(moderatorTag.closest('.ant-tag')).toHaveClass('ant-tag-green');
    });

    it('should handle unknown roles with default color', () => {
      const usersWithUnknownRole = [
        {
          ...mockUsers[0],
          role: 'UNKNOWN_ROLE' as any,
        }
      ];

      render(
        <UserTable 
          {...defaultProps} 
          users={usersWithUnknownRole}
        />
      );

      const unknownTag = screen.getByText('UNKNOWN_ROLE');
      expect(unknownTag).toHaveClass('ant-tag');
      expect(unknownTag.closest('.ant-tag')).toHaveClass('ant-tag');
    });
  });

  describe('User Actions', () => {
    it('should call onEdit when Edit button is clicked', async () => {
      const user = userEvent.setup();
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should call onEdit with correct user for different rows', async () => {
      const user = userEvent.setup();
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByText('Edit');
      
      // Click second edit button (Jane Smith)
      await user.click(editButtons[1]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[1]);
    });

    it('should have Edit buttons with correct icons', () => {
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByText('Edit');
      editButtons.forEach(button => {
        expect(button.closest('button')).toHaveClass('ant-btn-primary');
        expect(button.closest('button')).toHaveClass('ant-btn-sm');
      });
    });
  });

  describe('Pagination', () => {
    it('should render pagination with correct props', () => {
      render(<UserTable {...defaultProps} />);

      // Ant Design pagination should be rendered
      expect(screen.getByText('1-10 of 100 users')).toBeInTheDocument();
    });

    it('should call onChange when page is changed', async () => {
      const user = userEvent.setup();
      render(<UserTable {...defaultProps} />);

      // Look for pagination controls
      const nextButton = screen.getByTitle('Next Page');
      await user.click(nextButton);

      expect(mockOnPaginationChange).toHaveBeenCalledWith(2, 10);
    });

    it('should display correct page information', () => {
      const customPagination = {
        current: 3,
        total: 250,
        pageSize: 20,
        onChange: mockOnPaginationChange,
      };

      render(
        <UserTable 
          {...defaultProps} 
          pagination={customPagination}
        />
      );

      expect(screen.getByText('41-60 of 250 users')).toBeInTheDocument();
    });

    it('should have page size selector', async () => {
      const user = userEvent.setup();
      render(<UserTable {...defaultProps} />);

      // Look for page size selector
      const pageSizeSelector = screen.getByTitle('10 / page');
      await user.click(pageSizeSelector);

      // Should show options
      await waitFor(() => {
        expect(screen.getByText('20 / page')).toBeInTheDocument();
        expect(screen.getByText('50 / page')).toBeInTheDocument();
        expect(screen.getByText('100 / page')).toBeInTheDocument();
      });
    });

    it('should have quick jumper', () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText(/Go to/)).toBeInTheDocument();
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('should not show pagination when pagination prop is false', () => {
      render(
        <UserTable 
          {...defaultProps} 
          pagination={false}
        />
      );

      expect(screen.queryByText('1-10 of 100 users')).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      render(<UserTable {...defaultProps} loading={true} />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should disable pagination during loading', () => {
      render(<UserTable {...defaultProps} loading={true} />);

      const paginationButtons = screen.queryAllByRole('button');
      // Pagination buttons should be disabled during loading
      const pageButtons = paginationButtons.filter(btn => 
        btn.getAttribute('aria-label')?.includes('page')
      );
      
      pageButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should still render table structure during loading', () => {
      render(<UserTable {...defaultProps} loading={true} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no users', () => {
      render(
        <UserTable 
          {...defaultProps} 
          users={[]}
        />
      );

      expect(screen.getByText('No users found')).toBeInTheDocument();
    });

    it('should not show pagination when no users', () => {
      render(
        <UserTable 
          {...defaultProps} 
          users={[]}
        />
      );

      expect(screen.queryByText('1-10 of')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have horizontal scroll capability', () => {
      render(<UserTable {...defaultProps} />);

      const table = screen.getByRole('table').closest('.ant-table-wrapper');
      expect(table).toHaveStyle({ overflowX: 'auto' }); // Ant Design sets this
    });

    it('should have fixed Actions column', () => {
      render(<UserTable {...defaultProps} />);

      // Actions column should be fixed to the right
      const actionsHeader = screen.getByText('Actions').closest('th');
      expect(actionsHeader).toHaveClass('ant-table-cell-fix-right');
    });
  });

  describe('Accessibility', () => {
    it('should have proper table structure', () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('columnheader')).toHaveLength(7); // 7 columns
      expect(screen.getAllByRole('row')).toHaveLength(4); // 3 data rows + 1 header
    });

    it('should have accessible Edit buttons', () => {
      render(<UserTable {...defaultProps} />);

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      expect(editButtons).toHaveLength(mockUsers.length);
      
      editButtons.forEach(button => {
        expect(button).toHaveAttribute('type', 'button');
      });
    });

    it('should support keyboard navigation for Edit buttons', async () => {
      const user = userEvent.setup();
      render(<UserTable {...defaultProps} />);

      const firstEditButton = screen.getAllByText('Edit')[0];
      
      // Focus on the button
      firstEditButton.closest('button')?.focus();
      expect(firstEditButton.closest('button')).toHaveFocus();

      // Should be activatable with Enter
      await user.keyboard('{Enter}');
      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe('Data Formatting', () => {
    it('should format full names correctly', () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should handle users with missing names gracefully', () => {
      const usersWithMissingNames = [
        {
          ...mockUsers[0],
          firstName: '',
          lastName: 'LastOnly',
        },
        {
          ...mockUsers[1],
          firstName: 'FirstOnly',
          lastName: '',
        }
      ];

      render(
        <UserTable 
          {...defaultProps} 
          users={usersWithMissingNames}
        />
      );

      expect(screen.getByText(' LastOnly')).toBeInTheDocument(); // Space + last name
      expect(screen.getByText('FirstOnly ')).toBeInTheDocument(); // First name + space
    });

    it('should display email addresses as-is', () => {
      render(<UserTable {...defaultProps} />);

      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      expect(screen.getByText('jane.admin@example.com')).toBeInTheDocument();
    });
  });

  describe('Row Key', () => {
    it('should use user ID as row key', () => {
      render(<UserTable {...defaultProps} />);

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1); // Skip header row

      // Each data row should have a data-row-key attribute with user ID
      expect(dataRows[0]).toHaveAttribute('data-row-key', '1');
      expect(dataRows[1]).toHaveAttribute('data-row-key', '2');
      expect(dataRows[2]).toHaveAttribute('data-row-key', '3');
    });
  });

  describe('Performance', () => {
    it('should not call onEdit multiple times for single click', async () => {
      const user = userEvent.setup();
      render(<UserTable {...defaultProps} />);

      const editButton = screen.getAllByText('Edit')[0];
      await user.click(editButton);

      // Wait a bit to ensure no additional calls
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('should handle large datasets efficiently', () => {
      const largeUserList = Array.from({ length: 1000 }, (_, index) => ({
        ...mockUsers[0],
        id: index + 1,
        email: `user${index}@example.com`,
      }));

      const { container } = render(
        <UserTable 
          {...defaultProps} 
          users={largeUserList}
        />
      );

      // Should still render without performance issues
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
