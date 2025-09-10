/**
 * Table Component Usage Examples
 * Demonstrates Table, TableActions, column helpers, and UserTable
 */

import { useState } from 'react';
import { message, Divider, Card, Space } from 'antd';
import { Table, TableActions, TableColumns, UserTable } from './Table';
import { Button } from './Button';
import { PageTitle, SectionTitle } from './Typography';
import type { StatusVariant } from './types';

export function TableExamples() {
  // Sample user data
  const userData = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+65 9123 4567',
      role: 'admin',
      status: 'active' as StatusVariant,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+65 9876 5432',
      role: 'teacher',
      status: 'active' as StatusVariant,
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      phone: null,
      role: 'student',
      status: 'pending' as StatusVariant,
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      phone: '+65 8765 4321',
      role: 'staff',
      status: 'inactive' as StatusVariant,
    },
  ];

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(userData);

  // Action handlers
  const handleView = (record: any) => {
    message.info(`Viewing user: ${record.name}`);
  };

  const handleEdit = (record: any) => {
    message.info(`Editing user: ${record.name}`);
  };

  const handleDelete = async (record: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setData(prev => prev.filter(item => item.id !== record.id));
    message.success(`Deleted user: ${record.name}`);
    setLoading(false);
  };

  const handleResetPassword = async (record: any) => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    message.success(`Password reset for: ${record.name}`);
    setLoading(false);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400 }}>
      <PageTitle>Table Component Examples</PageTitle>

      <Divider orientation="left">Basic Table with MYC Defaults</Divider>
      <Card>
        <Table
          dataSource={[
            { id: 1, name: 'Item 1', description: 'First item' },
            { id: 2, name: 'Item 2', description: 'Second item' },
            { id: 3, name: 'Item 3', description: 'Third item' },
          ]}
          columns={[
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Description', dataIndex: 'description', key: 'description' },
          ]}
        />
      </Card>

      <Divider orientation="left">Pre-configured User Table</Divider>
      <Card>
        <SectionTitle>Complete User Management Table</SectionTitle>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button variant="primary">Add User</Button>
            <Button>Import Users</Button>
            <Button>Export</Button>
          </Space>
        </div>
        
        <UserTable
          dataSource={data}
          loading={loading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResetPassword={handleResetPassword}
        />
      </Card>

      <Divider orientation="left">Custom Table with Column Helpers</Divider>
      <Card>
        <Table
          dataSource={data}
          columns={[
            TableColumns.name((id) => message.info(`Navigate to user ${id}`)),
            TableColumns.email(),
            TableColumns.role(),
            TableColumns.status(),
            {
              title: 'Custom Actions',
              key: 'custom',
              render: (_, record) => (
                <Space size="small">
                  <TableActions.View onClick={() => handleView(record)} />
                  <TableActions.Edit onClick={() => handleEdit(record)} />
                  <Button variant="default" size="small">
                    Custom Action
                  </Button>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Divider orientation="left">Table Action Components</Divider>
      <Card>
        <SectionTitle>Individual Action Components</SectionTitle>
        <Space>
          <TableActions.View onClick={() => message.info('View clicked')} />
          <TableActions.Edit onClick={() => message.info('Edit clicked')} />
          <TableActions.ResetPassword onConfirm={() => { message.info('Password reset'); }} />
          <TableActions.Delete 
            onConfirm={() => { message.info('Delete confirmed'); }}
            title="Delete this item?"
            description="This will permanently remove the item."
          />
        </Space>
      </Card>

      <Divider orientation="left">Table with Custom Pagination</Divider>
      <Card>
        <Table
          dataSource={Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
          }))}
          columns={[
            { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            { title: 'Email', dataIndex: 'email', key: 'email' },
          ]}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `Showing ${range[0]}-${range[1]} of ${total} users`,
          }}
        />
      </Card>

      <Divider orientation="left">Table Features Demo</Divider>
      <Card>
        <SectionTitle>Filtering, Sorting, and Searching</SectionTitle>
        <Table
          dataSource={data}
          columns={[
            {
              ...TableColumns.name((id) => message.info(`User ID: ${id}`)),
              sorter: true,
            },
            {
              ...TableColumns.email(),
              sorter: true,
            },
            {
              ...TableColumns.role(),
              // Filters are already included in TableColumns.role()
            },
            {
              ...TableColumns.status(),
              // Filters are already included in TableColumns.status()
            },
            {
              title: 'Actions',
              key: 'actions',
              render: (_, record) => (
                <TableActions.Edit onClick={() => handleEdit(record)} />
              ),
            },
          ]}
        />
      </Card>

      <Divider orientation="left">Design System Specifications</Divider>
      <Card title="MYC Table Features">
        <div style={{ fontSize: 14 }}>
          <div style={{ marginBottom: 16 }}>
            <strong>Table Defaults:</strong>
            <ul style={{ marginTop: 8 }}>
              <li><code>size="middle"</code> - Balanced row height</li>
              <li><code>rowKey="id"</code> - Unique row identification</li>
              <li><code>pageSize=10</code> - Default pagination size</li>
              <li>Total count display with range information</li>
              <li>Page size changer (10, 20, 50, 100)</li>
              <li>Quick jump to page number</li>
            </ul>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>TableActions Components:</strong>
            <ul style={{ marginTop: 8 }}>
              <li><strong>View</strong> - Link button for viewing details</li>
              <li><strong>Edit</strong> - Default button for editing</li>
              <li><strong>Delete</strong> - Danger button with confirmation</li>
              <li><strong>ResetPassword</strong> - Default button with confirmation</li>
              <li>All actions support loading states</li>
            </ul>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>Column Helpers:</strong>
            <ul style={{ marginTop: 8 }}>
              <li><strong>name</strong> - Clickable names with sorting</li>
              <li><strong>email</strong> - Email column with sorting</li>
              <li><strong>phone</strong> - Phone with fallback for empty values</li>
              <li><strong>role</strong> - Role column with filtering</li>
              <li><strong>status</strong> - Status with MYC tag integration and filtering</li>
              <li><strong>actions</strong> - Pre-configured actions column</li>
            </ul>
          </div>

          <div>
            <strong>UserTable Features:</strong>
            <ul style={{ marginTop: 8 }}>
              <li>Complete user management table out-of-the-box</li>
              <li>All common columns pre-configured</li>
              <li>Action handlers for view, edit, delete, reset password</li>
              <li>Status tag integration with filtering</li>
              <li>Responsive design and proper spacing</li>
            </ul>
          </div>
        </div>
      </Card>

      <Divider orientation="left">Usage Patterns</Divider>
      <Card title="Common Implementation Patterns">
        <div style={{ fontSize: 12, fontFamily: 'monospace' }}>
          <div style={{ marginBottom: 16 }}>
            <strong>Basic Table:</strong>
            <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4 }}>
              {`<Table dataSource={data} columns={columns} />`}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>User Management Table:</strong>
            <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4 }}>
              {`<UserTable
  dataSource={users}
  onView={handleView}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onResetPassword={handleResetPassword}
/>`}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <strong>Custom Columns with Helpers:</strong>
            <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4 }}>
              {`const columns = [
  TableColumns.name(onNavigate),
  TableColumns.email(),
  TableColumns.status(),
  TableColumns.actions({ onEdit, onDelete })
];`}
            </div>
          </div>

          <div>
            <strong>Individual Actions:</strong>
            <div style={{ background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4 }}>
              {`<Space>
  <TableActions.Edit onClick={handleEdit} />
  <TableActions.Delete onConfirm={handleDelete} />
</Space>`}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TableExamples;
