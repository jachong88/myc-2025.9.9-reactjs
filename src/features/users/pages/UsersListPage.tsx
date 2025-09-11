import React, { useState, useEffect, useCallback } from 'react';
import { Layout, Typography, Button, Space, message, Spin, Alert } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { UserFilters, UserTable } from '../components';
import { userApi } from '@/shared/api/user';
import type { 
  UserListItem, 
  UserListParams, 
  UserListResponse,
  PaginationMeta 
} from '@/shared/types/user';

const { Content } = Layout;
const { Title } = Typography;

interface UsersPageState {
  users: UserListItem[];
  loading: boolean;
  error: string | null;
  filters: UserListParams;
  pagination: PaginationMeta;
}

export const UsersListPage: React.FC = () => {
  const [state, setState] = useState<UsersPageState>({
    users: [],
    loading: false,
    error: null,
    filters: {
      page: 0,
      size: 10,
    },
    pagination: {
      page: 0,
      size: 10,
      totalItems: 0,
      totalPages: 0,
      hasNext: false,
    },
  });

  // Fetch users data
  const fetchUsers = useCallback(async (params: UserListParams) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response: UserListResponse = await userApi.listUsers(params);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          users: response.data.users,
          pagination: response.data.meta,
          loading: false,
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch users');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      message.error(errorMessage);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchUsers(state.filters);
  }, []); // Empty dependency array for initial load only

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters: UserListParams) => {
    const updatedFilters = {
      ...newFilters,
      page: 0, // Reset to first page when filters change
    };
    
    setState(prev => ({ ...prev, filters: updatedFilters }));
    fetchUsers(updatedFilters);
  }, [fetchUsers]);

  // Handle pagination changes
  const handlePaginationChange = useCallback((page: number, pageSize?: number) => {
    const updatedFilters = {
      ...state.filters,
      page: page - 1, // Convert from 1-based to 0-based for API
      size: pageSize || state.filters.size,
    };
    
    setState(prev => ({ ...prev, filters: updatedFilters }));
    fetchUsers(updatedFilters);
  }, [state.filters, fetchUsers]);

  // Handle user edit action
  const handleEditUser = useCallback((user: UserListItem) => {
    // TODO: Navigate to edit user page or open edit modal
    message.info(`Edit user: ${user.firstName} ${user.lastName} (ID: ${user.id})`);
    console.log('Edit user:', user);
  }, []);

  // Handle add user button
  const handleAddUser = useCallback(() => {
    // TODO: Navigate to add user page or open add modal
    message.info('Add User functionality - Coming soon!');
  }, []);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    fetchUsers(state.filters);
  }, [fetchUsers, state.filters]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px' }}>
          {/* Page Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '16px',
          }}>
            <Title level={2} style={{ margin: 0 }}>
              Users
            </Title>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={handleRetry}
                disabled={state.loading}
              >
                Refresh
              </Button>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={handleAddUser}
                size="large"
              >
                Add User
              </Button>
            </Space>
          </div>

          {/* Error Alert */}
          {state.error && (
            <Alert
              message="Error Loading Users"
              description={state.error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: '16px' }}
              action={
                <Button size="small" onClick={handleRetry}>
                  Retry
                </Button>
              }
              onClose={() => setState(prev => ({ ...prev, error: null }))}
            />
          )}

          {/* Filters Section */}
          <div style={{ marginBottom: '24px' }}>
            <UserFilters
              initialValues={state.filters}
              onSearch={handleFiltersChange}
              loading={state.loading}
            />
          </div>

          {/* Loading Overlay */}
          <Spin 
            spinning={state.loading} 
            tip="Loading users..."
            size="large"
          >
            {/* Users Table */}
            <UserTable
              users={state.users}
              loading={state.loading}
              onEdit={handleEditUser}
              pagination={{
                current: state.pagination.page + 1, // Convert to 1-based for display
                total: state.pagination.totalItems,
                pageSize: state.pagination.size,
                onChange: handlePaginationChange,
              }}
            />
          </Spin>

          {/* Empty State */}
          {!state.loading && state.users.length === 0 && !state.error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '48px 24px',
              color: '#666',
            }}>
              <Typography.Text type="secondary" style={{ fontSize: '16px' }}>
                No users found. Try adjusting your filters or add a new user.
              </Typography.Text>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
};
