import React from 'react';
import { Table, Button, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { UserListItem } from '@/shared/types/user';

interface UserTableProps {
  users: UserListItem[];
  loading?: boolean;
  onEdit: (user: UserListItem) => void;
  pagination?: {
    current: number;
    total: number;
    pageSize: number;
    onChange: (page: number, pageSize?: number) => void;
  };
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  loading = false,
  onEdit,
  pagination,
}) => {
  const columns: ColumnsType<UserListItem> = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (firstName: string, record: UserListItem) => 
        `${firstName} ${record.lastName}`,
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone: string) => phone || '-',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      render: (role: string) => {
        const roleColors: Record<string, string> = {
          ADMIN: 'red',
          USER: 'blue',
          MODERATOR: 'green',
        };
        return (
          <Tag color={roleColors[role] || 'default'}>
            {role}
          </Tag>
        );
      },
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      width: 120,
      render: (country: string) => country || '-',
    },
    {
      title: 'Province',
      dataIndex: 'province',
      key: 'province',
      width: 120,
      render: (province: string) => province || '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record: UserListItem) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users}
      loading={loading}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      pagination={pagination ? {
        current: pagination.current,
        total: pagination.total,
        pageSize: pagination.pageSize,
        onChange: pagination.onChange,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} users`,
        pageSizeOptions: ['10', '20', '50', '100'],
      } : false}
      locale={{
        emptyText: 'No users found',
      }}
      size="middle"
    />
  );
};
