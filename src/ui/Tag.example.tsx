/**
 * Tag Component Usage Examples
 * Demonstrates Tag, StatusTag, and specific status variants
 */

import { Space, Divider, Table, Card } from 'antd';
import { Tag, StatusTag, ActiveTag, InactiveTag, PendingTag, renderStatusTag } from './Tag';
import type { StatusVariant } from './types';

export function TagExamples() {
  // Sample user data for table example
  const userData = [
    { id: 1, name: 'John Doe', status: 'active' as StatusVariant, role: 'Admin' },
    { id: 2, name: 'Jane Smith', status: 'inactive' as StatusVariant, role: 'Teacher' },
    { id: 3, name: 'Bob Wilson', status: 'pending' as StatusVariant, role: 'Student' },
    { id: 4, name: 'Alice Brown', status: 'active' as StatusVariant, role: 'Staff' },
  ];

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => renderStatusTag(status),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <Divider orientation="left">Basic Tag</Divider>
      <Space>
        <Tag>Default Tag</Tag>
        <Tag color="blue">Blue Tag</Tag>
        <Tag color="purple">Purple Tag</Tag>
        <Tag closable>Closable Tag</Tag>
      </Space>

      <Divider orientation="left">Status Tags (MYC Design System Colors)</Divider>
      <Space>
        <ActiveTag />
        <InactiveTag />
        <PendingTag />
      </Space>

      <Divider orientation="left">Status Tags with Custom Text</Divider>
      <Space>
        <ActiveTag>Enabled</ActiveTag>
        <InactiveTag>Disabled</InactiveTag>
        <PendingTag>Processing</PendingTag>
      </Space>

      <Divider orientation="left">StatusTag Component (Dynamic)</Divider>
      <Space>
        <StatusTag status="active" />
        <StatusTag status="inactive" />
        <StatusTag status="pending" />
        <StatusTag status="active">Online</StatusTag>
        <StatusTag status="pending">Awaiting Approval</StatusTag>
      </Space>

      <Divider orientation="left">renderStatusTag Utility</Divider>
      <Space>
        {renderStatusTag('active')}
        {renderStatusTag('inactive')}
        {renderStatusTag('pending')}
        {renderStatusTag('unknown')} {/* Fallback example */}
      </Space>

      <Divider orientation="left">Table Integration Example</Divider>
      <Table 
        dataSource={userData} 
        columns={columns} 
        pagination={false}
        size="small"
      />

      <Divider orientation="left">Design System Specifications</Divider>
      <Card title="MYC Tag Colors" style={{ marginTop: 16 }}>
        <Space direction="vertical">
          <div>
            <ActiveTag /> - <strong>Green (#52c41a)</strong> - For active users, enabled features, successful states
          </div>
          <div>
            <InactiveTag /> - <strong>Red (#ff4d4f)</strong> - For inactive users, disabled features, error states
          </div>
          <div>
            <PendingTag /> - <strong>Orange (#faad14)</strong> - For pending approvals, processing states, warning states
          </div>
        </Space>
        
        <div style={{ marginTop: 16, fontSize: 12, color: '#666' }}>
          These colors match the MYC design system tokens and are consistent with 
          Button danger variants and other status indicators throughout the application.
        </div>
      </Card>

      <Divider orientation="left">Usage Patterns</Divider>
      <div style={{ fontSize: 14 }}>
        <div style={{ marginBottom: 8 }}>
          <strong>Table Status Columns:</strong>
          <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4 }}>
            {`render: (status: string) => renderStatusTag(status)`}
          </div>
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <strong>User Profile Status:</strong>
          <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4 }}>
            &lt;StatusTag status={'{'}"active"{'}'} /&gt;
          </div>
        </div>
        
        <div>
          <strong>Custom Status Text:</strong>
          <div style={{ fontFamily: 'monospace', background: '#f5f5f5', padding: 8, borderRadius: 4, marginTop: 4 }}>
            &lt;ActiveTag&gt;Online&lt;/ActiveTag&gt;
          </div>
        </div>
      </div>
    </div>
  );
}

export default TagExamples;
