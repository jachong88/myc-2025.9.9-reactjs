/**
 * UserFilters Component
 * 
 * Filter/search form for the Users list page
 * Based on wireframe: docs/frontend/UI/wireframe/user/users-list.md
 */

import React, { useState } from 'react';
import { Button, Input, Select, Row, Col, Form, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { UserListParams } from '../../../shared/types/user';

interface UserFiltersProps {
  /** Callback when filters are applied */
  onFilter: (filters: UserListParams) => void;
  /** Loading state during API calls */
  loading?: boolean;
  /** Initial filter values */
  initialValues?: Partial<UserListParams>;
}

/**
 * User filter form component
 * 
 * Provides filtering for:
 * - Name (text input)
 * - Email (text input)
 * - Phone (text input)
 * - Role (dropdown)
 * - Country (dropdown)
 * - Province (dropdown, dependent on country)
 * - Deleted status (dropdown)
 */
export const UserFilters: React.FC<UserFiltersProps> = ({ 
  onFilter, 
  loading = false,
  initialValues = {}
}) => {
  const [form] = Form.useForm();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  
  // TODO: Replace with real data from API/context
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'student', label: 'Student' },
    { value: 'manager', label: 'Manager' },
  ];
  
  const countryOptions = [
    { value: 'country-1', label: 'Canada' },
    { value: 'country-2', label: 'Singapore' },
    { value: 'country-3', label: 'United States' },
    { value: 'country-4', label: 'Australia' },
  ];
  
  // Province options based on selected country
  const getProvinceOptions = (countryId?: string) => {
    switch (countryId) {
      case 'country-1': // Canada
        return [
          { value: 'province-1', label: 'Ontario' },
          { value: 'province-2', label: 'British Columbia' },
          { value: 'province-3', label: 'Alberta' },
          { value: 'province-4', label: 'Quebec' },
        ];
      case 'country-2': // Singapore
        return [
          { value: 'province-5', label: 'Central' },
          { value: 'province-6', label: 'North' },
          { value: 'province-7', label: 'South' },
          { value: 'province-8', label: 'East' },
          { value: 'province-9', label: 'West' },
        ];
      case 'country-3': // United States
        return [
          { value: 'province-10', label: 'California' },
          { value: 'province-11', label: 'New York' },
          { value: 'province-12', label: 'Texas' },
          { value: 'province-13', label: 'Florida' },
        ];
      case 'country-4': // Australia
        return [
          { value: 'province-14', label: 'New South Wales' },
          { value: 'province-15', label: 'Victoria' },
          { value: 'province-16', label: 'Queensland' },
          { value: 'province-17', label: 'Western Australia' },
        ];
      default:
        return [];
    }
  };

  /**
   * Handle form submission - apply filters
   */
  const handleSubmit = (values: any) => {
    const filters: UserListParams = {
      ...values,
      deleted: values.deleted ?? false, // Default to false (active users)
      page: 0, // Reset to first page when filtering
      size: 10, // Default page size
    };
    
    // Remove empty/null values
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof UserListParams] === '' || 
          filters[key as keyof UserListParams] === null || 
          filters[key as keyof UserListParams] === undefined) {
        delete filters[key as keyof UserListParams];
      }
    });
    
    onFilter(filters);
  };

  /**
   * Handle form reset - clear all filters
   */
  const handleReset = () => {
    form.resetFields();
    setSelectedCountry(undefined);
    onFilter({ 
      deleted: false, // Show active users by default
      page: 0,
      size: 10
    });
  };

  /**
   * Handle country change - update province options
   */
  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    // Clear province when country changes
    form.setFieldValue('provinceId', undefined);
  };

  return (
    <div style={{ 
      background: '#fafafa', 
      padding: '16px', 
      borderRadius: '8px',
      marginBottom: '16px' 
    }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ 
          deleted: false, // Default to active users
          ...initialValues 
        }}
      >
        <Row gutter={16}>
          {/* Name Filter */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Name" name="name">
              <Input 
                placeholder="Enter name" 
                allowClear 
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          {/* Email Filter */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Email" name="email">
              <Input 
                placeholder="Enter email" 
                allowClear 
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          {/* Phone Filter */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Phone" name="phone">
              <Input 
                placeholder="Enter phone" 
                allowClear 
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          {/* Role Filter */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Role" name="role">
              <Select 
                placeholder="Select role" 
                allowClear 
                options={roleOptions}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          {/* Country Filter */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Country" name="countryId">
              <Select 
                placeholder="Select country" 
                allowClear 
                options={countryOptions}
                onChange={handleCountryChange}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          {/* Province Filter */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Province" name="provinceId">
              <Select 
                placeholder="Select province" 
                allowClear 
                options={getProvinceOptions(selectedCountry)}
                disabled={loading || !selectedCountry}
                notFoundContent={!selectedCountry ? 'Please select a country first' : 'No provinces found'}
              />
            </Form.Item>
          </Col>
          
          {/* Status Filter */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label="Status" name="deleted">
              <Select
                options={[
                  { value: false, label: 'Active' },
                  { value: true, label: 'Deleted' },
                ]}
                disabled={loading}
              />
            </Form.Item>
          </Col>
          
          {/* Action Buttons */}
          <Col xs={24} sm={12} md={8} lg={6} xl={4}>
            <Form.Item label=" " style={{ marginBottom: 0 }}>
              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  icon={<SearchOutlined />}
                  loading={loading}
                  size="middle"
                >
                  Search
                </Button>
                <Button 
                  icon={<ClearOutlined />} 
                  onClick={handleReset}
                  disabled={loading}
                  size="middle"
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
