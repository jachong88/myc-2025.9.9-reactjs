/**
 * User types tests - verify current API types compile and work correctly
 */

import { describe, it, expect } from 'vitest';
import type {
  User,
  UserListItem,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
  UserListResponse,
  CreateUserResponse,
  UserResponse,
  DeleteUserResponse,
  PaginationMeta,
  UserFormData,
  UserFilterData,
  UserTableState,
  UserSortField,
  SortOrder
} from './user';

describe('User API Types', () => {
  it('should create valid User objects matching backend structure', () => {
    const user: User = {
      id: '01HF5MCGQJKX2QYV9C8GZ3JBFW',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-234-567-8900',
      countryId: '01HF5MCGQJKX2QYV9C8GZ3JBFX',
      provinceId: '01HF5MCGQJKX2QYV9C8GZ3JBFY',
      roleId: '01HF5MCGQJKX2QYV9C8GZ3JBFZ',
      note: 'Test user'
    };

    expect(user.id).toBe('01HF5MCGQJKX2QYV9C8GZ3JBFW');
    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.phone).toBe('+1-234-567-8900');
  });

  it('should create valid UserListItem objects from API response', () => {
    const userListItem: UserListItem = {
      id: '01HF5MCGQJKX2QYV9C8GZ3JBFW',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: null,
      role: 'Teacher',
      country: 'Canada',
      province: 'Ontario',
      note: null
    };

    expect(userListItem.id).toBe('01HF5MCGQJKX2QYV9C8GZ3JBFW');
    expect(userListItem.name).toBe('Jane Smith');
    expect(userListItem.role).toBe('Teacher');
    expect(userListItem.country).toBe('Canada');
    expect(userListItem.province).toBe('Ontario');
  });

  it('should create valid CreateUserRequest objects', () => {
    const createRequest: CreateUserRequest = {
      name: 'New User',
      email: 'newuser@example.com',
      phone: '+1-555-0123',
      roleId: '01HF5MCGQJKX2QYV9C8GZ3JBFZ',
      countryId: '01HF5MCGQJKX2QYV9C8GZ3JBFX',
      provinceId: '01HF5MCGQJKX2QYV9C8GZ3JBFY',
      note: 'New user note'
    };

    expect(createRequest.name).toBe('New User');
    expect(createRequest.email).toBe('newuser@example.com');
    expect(createRequest.roleId).toBe('01HF5MCGQJKX2QYV9C8GZ3JBFZ');
  });

  it('should create valid UpdateUserRequest objects', () => {
    const updateRequest: UpdateUserRequest = {
      name: 'Updated Name',
      email: 'updated@example.com',
      roleId: '01HF5MCGQJKX2QYV9C8GZ3JBFZ',
      countryId: '01HF5MCGQJKX2QYV9C8GZ3JBFX',
      provinceId: '01HF5MCGQJKX2QYV9C8GZ3JBFY'
      // phone and note are optional
    };

    expect(updateRequest.name).toBe('Updated Name');
    expect(updateRequest.email).toBe('updated@example.com');
    expect(updateRequest.phone).toBeUndefined();
  });

  it('should create valid UserListParams objects', () => {
    const listParams: UserListParams = {
      page: 1,
      size: 20,
      name: 'john',
      countryId: '01HF5MCGQJKX2QYV9C8GZ3JBFX',
      deleted: false
    };

    expect(listParams.page).toBe(1);
    expect(listParams.size).toBe(20);
    expect(listParams.deleted).toBe(false);
  });

  it('should create valid PaginationMeta objects', () => {
    const meta: PaginationMeta = {
      page: 0,
      size: 10,
      totalItems: 100,
      totalPages: 10,
      hasNext: true
    };

    expect(meta.page).toBe(0);
    expect(meta.totalItems).toBe(100);
    expect(meta.hasNext).toBe(true);
  });

  it('should create valid UserListResponse objects', () => {
    const response: UserListResponse = {
      success: true,
      requestId: 'req-123',
      meta: {
        page: 0,
        size: 10,
        totalItems: 0,
        totalPages: 0,
        hasNext: false
      },
      data: [],
      error: null
    };

    expect(response.success).toBe(true);
    expect(response.data).toEqual([]);
    expect(response.meta.hasNext).toBe(false);
  });

  it('should create valid CreateUserResponse objects', () => {
    const response: CreateUserResponse = {
      success: true,
      requestId: 'req-456',
      meta: null,
      data: null,
      error: null
    };

    expect(response.success).toBe(true);
    expect(response.data).toBeNull();
    expect(response.meta).toBeNull();
  });

  it('should create valid UserFormData objects', () => {
    const formData: UserFormData = {
      name: 'Form User',
      email: 'form@example.com',
      phone: '+1-555-0155',
      roleId: '01HF5MCGQJKX2QYV9C8GZ3JBFZ',
      countryId: '01HF5MCGQJKX2QYV9C8GZ3JBFX',
      provinceId: '01HF5MCGQJKX2QYV9C8GZ3JBFY',
      note: 'Form note'
    };

    expect(formData.name).toBe('Form User');
    expect(formData.roleId).toBe('01HF5MCGQJKX2QYV9C8GZ3JBFZ');
  });

  it('should create valid UserFilterData objects', () => {
    const filterData: UserFilterData = {
      page: 0,
      size: 10,
      name: 'john',
      email: 'john@',
      deleted: false
    };

    expect(filterData.deleted).toBe(false);
    expect(filterData.name).toBe('john');
  });

  it('should create valid UserTableState objects', () => {
    const tableState: UserTableState = {
      selectedUsers: ['01HF5MCGQJKX2QYV9C8GZ3JBFW'],
      sortField: 'name',
      sortOrder: 'asc',
      filters: {
        deleted: false
      }
    };

    expect(tableState.selectedUsers).toEqual(['01HF5MCGQJKX2QYV9C8GZ3JBFW']);
    expect(tableState.sortField).toBe('name');
    expect(tableState.sortOrder).toBe('asc');
  });

  it('should validate UserSortField types', () => {
    const validSortFields: UserSortField[] = ['name', 'email', 'role', 'country', 'province'];
    
    validSortFields.forEach(field => {
      expect(['name', 'email', 'role', 'country', 'province']).toContain(field);
    });
  });

  it('should validate SortOrder types', () => {
    const validOrders: SortOrder[] = ['asc', 'desc'];
    
    validOrders.forEach(order => {
      expect(['asc', 'desc']).toContain(order);
    });
  });
});
