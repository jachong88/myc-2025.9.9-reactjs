/**
 * User domain types test - verify types compile and work correctly
 */

import { describe, it, expect } from 'vitest';
import type {
  User,
  UserWithLocation,
  UserRole,
  UserStatus,
  CreateUserRequest,
  UpdateUserRequest,
  UserListParams,
  UserListResponse,
  Country,
  Province,
  UserSummary,
  UserTableRow,
  UserFormData,
  UserValidationError
} from './user';

describe('User Domain Types', () => {
  it('should create valid User objects', () => {
    const user: User = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-234-567-8900',
      role: 'student',
      status: 'active',
      country_id: 1,
      province_id: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    expect(user.id).toBe(1);
    expect(user.name).toBe('John Doe');
    expect(user.role).toBe('student');
    expect(user.status).toBe('active');
  });

  it('should create valid UserWithLocation objects', () => {
    const country: Country = {
      id: 1,
      name: 'Canada',
      code: 'CA'
    };

    const province: Province = {
      id: 10,
      name: 'Ontario',
      code: 'ON',
      country_id: 1
    };

    const userWithLocation: UserWithLocation = {
      id: 1,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: null,
      role: 'instructor',
      status: 'active',
      country_id: 1,
      province_id: 10,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      country,
      province
    };

    expect(userWithLocation.country?.name).toBe('Canada');
    expect(userWithLocation.province?.name).toBe('Ontario');
  });

  it('should validate UserRole types', () => {
    const validRoles: UserRole[] = ['admin', 'manager', 'instructor', 'student'];
    
    validRoles.forEach(role => {
      const user: Partial<User> = { role };
      expect(['admin', 'manager', 'instructor', 'student']).toContain(user.role);
    });
  });

  it('should validate UserStatus types', () => {
    const validStatuses: UserStatus[] = ['active', 'inactive', 'pending'];
    
    validStatuses.forEach(status => {
      const user: Partial<User> = { status };
      expect(['active', 'inactive', 'pending']).toContain(user.status);
    });
  });

  it('should create valid CreateUserRequest objects', () => {
    const createRequest: CreateUserRequest = {
      name: 'New User',
      email: 'newuser@example.com',
      phone: '+1-555-0123',
      role: 'student',
      status: 'pending',
      country_id: 1,
      province_id: 10
    };

    expect(createRequest.name).toBe('New User');
    expect(createRequest.email).toBe('newuser@example.com');
    expect(createRequest.role).toBe('student');
    expect(createRequest.status).toBe('pending');
  });

  it('should create valid UpdateUserRequest objects', () => {
    const updateRequest: UpdateUserRequest = {
      name: 'Updated Name',
      status: 'active'
      // All other fields are optional
    };

    expect(updateRequest.name).toBe('Updated Name');
    expect(updateRequest.status).toBe('active');
    expect(updateRequest.email).toBeUndefined();
  });

  it('should create valid UserListParams objects', () => {
    const listParams: UserListParams = {
      page: 1,
      per_page: 20,
      sort: 'name',
      order: 'asc',
      role: ['student', 'instructor'],
      status: 'active',
      search: 'john',
      country_id: 1
    };

    expect(listParams.page).toBe(1);
    expect(listParams.per_page).toBe(20);
    expect(listParams.role).toEqual(['student', 'instructor']);
    expect(Array.isArray(listParams.role)).toBe(true);
  });

  it('should create valid UserListResponse objects', () => {
    const response: UserListResponse = {
      data: [],
      total: 0,
      page: 1,
      per_page: 20,
      total_pages: 0,
      has_next: false,
      has_prev: false
    };

    expect(response.data).toEqual([]);
    expect(response.total).toBe(0);
    expect(response.has_next).toBe(false);
  });

  it('should create valid UserSummary objects', () => {
    const summary: UserSummary = {
      id: 1,
      name: 'Summary User',
      email: 'summary@example.com',
      role: 'manager',
      status: 'active'
    };

    expect(summary.id).toBe(1);
    expect(summary.name).toBe('Summary User');
    expect(summary.role).toBe('manager');
  });

  it('should create valid UserTableRow objects', () => {
    const tableRow: UserTableRow = {
      id: 1,
      name: 'Table User',
      email: 'table@example.com',
      role: 'admin',
      status: 'active',
      phone: '+1-555-0199',
      country_name: 'Canada',
      province_name: 'Ontario',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    };

    expect(tableRow.id).toBe(1);
    expect(tableRow.country_name).toBe('Canada');
    expect(tableRow.province_name).toBe('Ontario');
  });

  it('should create valid UserFormData objects', () => {
    const formData: UserFormData = {
      name: 'Form User',
      email: 'form@example.com',
      phone: '+1-555-0155',
      role: 'student',
      status: 'pending',
      country_id: 1,
      province_id: 10
    };

    expect(formData.name).toBe('Form User');
    expect(formData.status).toBe('pending');
    expect(formData.role).toBe('student');
  });

  it('should create valid UserValidationError objects', () => {
    const validationError: UserValidationError = {
      field: 'email',
      message: 'Email is required',
      code: 'REQUIRED'
    };

    expect(validationError.field).toBe('email');
    expect(validationError.message).toBe('Email is required');
    expect(validationError.code).toBe('REQUIRED');
  });
});
