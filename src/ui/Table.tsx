/**
 * MYC Table Components
 *
 * Standardized Table wrapper following MYC design system:
 * - Default size: middle
 * - Default rowKey: id
 * - Default pagination: 10 items with total count
 * - Integrated with MYC Button and Tag components
 * - Helper components for common patterns
 */

import { Table as AntTable, Space, Popconfirm } from 'antd';
import type { TableProps as AntTableProps, ColumnType } from 'antd/es/table';
import { Button } from './Button';
import { renderStatusTag } from './Tag';
import type { StatusVariant } from './types';

/**
 * Standard Table component with MYC defaults
 */
export function Table<T = any>({
  size = 'middle',
  rowKey = 'id',
  pagination = { 
    pageSize: 10, 
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ['10', '20', '50', '100']
  },
  ...props
}: AntTableProps<T>) {
  return (
    <AntTable<T>
      size={size}
      rowKey={rowKey}
      pagination={pagination}
      {...props}
    />
  );
}

/**
 * Table action helper components
 */
export const TableActions = {
  /**
   * Edit button for table row actions
   */
  Edit: ({ 
    onClick,
    loading = false,
    ...props 
  }: { 
    onClick: () => void;
    loading?: boolean;
  }) => (
    <Button 
      variant="default" 
      size="small" 
      onClick={onClick}
      loading={loading}
      {...props}
    >
      Edit
    </Button>
  ),

  /**
   * View button for table row actions
   */
  View: ({ 
    onClick,
    loading = false,
    ...props 
  }: { 
    onClick: () => void;
    loading?: boolean;
  }) => (
    <Button 
      variant="link" 
      size="small" 
      onClick={onClick}
      loading={loading}
      {...props}
    >
      View
    </Button>
  ),

  /**
   * Delete button with confirmation for table row actions
   */
  Delete: ({ 
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    loading = false,
    ...props 
  }: { 
    onConfirm: () => void | Promise<void>;
    title?: string;
    description?: string;
    loading?: boolean;
  }) => (
    <Popconfirm
      title={title}
      description={description}
      onConfirm={onConfirm}
      okText="Delete"
      okButtonProps={{ danger: true }}
    >
      <Button 
        variant="danger" 
        size="small"
        loading={loading}
        {...props}
      >
        Delete
      </Button>
    </Popconfirm>
  ),

  /**
   * Reset Password button for user table actions
   */
  ResetPassword: ({ 
    onConfirm,
    loading = false,
    ...props 
  }: { 
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
  }) => (
    <Popconfirm
      title="Reset password?"
      description="User will receive a new password via email."
      onConfirm={onConfirm}
      okText="Reset"
    >
      <Button 
        variant="default" 
        size="small"
        loading={loading}
        {...props}
      >
        Reset Password
      </Button>
    </Popconfirm>
  )
};

/**
 * Helper for rendering clickable name columns
 */
export const ClickableNameColumn = {
  render: (
    name: string, 
    record: any, 
    onNavigate: (id: string | number) => void
  ) => (
    <Button 
      variant="link" 
      onClick={() => onNavigate(record.id)}
      style={{ padding: 0, height: 'auto', fontWeight: 'normal' }}
    >
      {name}
    </Button>
  )
};

/**
 * Helper for rendering status columns with MYC tags
 */
export const StatusColumn = {
  render: (status: string | StatusVariant) => renderStatusTag(status)
};

/**
 * Helper for creating common table column definitions
 */
export const TableColumns = {
  /**
   * Clickable name column
   */
  name: (onNavigate: (id: string | number) => void): ColumnType<any> => ({
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name, record) => ClickableNameColumn.render(name, record, onNavigate),
    sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
  }),

  /**
   * Email column
   */
  email: (): ColumnType<any> => ({
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
  }),

  /**
   * Phone column
   */
  phone: (): ColumnType<any> => ({
    title: 'Phone',
    dataIndex: 'phone',
    key: 'phone',
    render: (phone) => phone || '—',
  }),

  /**
   * Role column
   */
  role: (): ColumnType<any> => ({
    title: 'Role',
    dataIndex: 'role',
    key: 'role',
    filters: [
      { text: 'Admin', value: 'admin' },
      { text: 'Teacher', value: 'teacher' },
      { text: 'Student', value: 'student' },
      { text: 'Staff', value: 'staff' },
    ],
    onFilter: (value, record) => record.role === value,
  }),

  /**
   * Status column with tags
   */
  status: (): ColumnType<any> => ({
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: StatusColumn.render,
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
      { text: 'Pending', value: 'pending' },
    ],
    onFilter: (value, record) => record.status === value,
  }),

  /**
   * Actions column
   */
  actions: (handlers: {
    onView?: (record: any) => void;
    onEdit?: (record: any) => void;
    onDelete?: (record: any) => void | Promise<void>;
    onResetPassword?: (record: any) => void | Promise<void>;
  }): ColumnType<any> => ({
    title: 'Actions',
    key: 'actions',
    width: 200,
    render: (_, record) => (
      <Space size="small">
        {handlers.onView && (
          <TableActions.View onClick={() => handlers.onView!(record)} />
        )}
        {handlers.onEdit && (
          <TableActions.Edit onClick={() => handlers.onEdit!(record)} />
        )}
        {handlers.onResetPassword && (
          <TableActions.ResetPassword onConfirm={() => handlers.onResetPassword!(record)} />
        )}
        {handlers.onDelete && (
          <TableActions.Delete onConfirm={() => handlers.onDelete!(record)} />
        )}
      </Space>
    ),
  }),
};

/**
 * Pre-configured User Table for common use case
 */
export function UserTable({
  dataSource,
  onView,
  onEdit,
  onDelete,
  onResetPassword,
  loading = false,
  ...props
}: {
  dataSource: any[];
  onView?: (record: any) => void;
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void | Promise<void>;
  onResetPassword?: (record: any) => void | Promise<void>;
  loading?: boolean;
} & Omit<AntTableProps<any>, 'dataSource' | 'columns' | 'loading'>) {
  
  const columns = [
    TableColumns.name((id) => onView?.({ id })),
    TableColumns.email(),
    TableColumns.phone(),
    TableColumns.role(),
    TableColumns.status(),
    TableColumns.actions({
      onView,
      onEdit,
      onDelete,
      onResetPassword,
    }),
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      {...props}
    />
  );
}

export default Table;
