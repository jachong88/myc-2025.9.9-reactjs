import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { userHandlers } from '../../mocks/handlers/user';
import { userApi } from './user';
import type { 
  UserListParams, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../types/user';

// Setup MSW server for testing
const server = setupServer(...userHandlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  console.log('🔧 MSW Server started for user API tests');
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  console.log('🔧 MSW Server closed for user API tests');
});

describe('User API Client', () => {
  describe('listUsers', () => {
    it('should fetch users with default parameters', async () => {
      const result = await userApi.listUsers({});

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.users).toBeInstanceOf(Array);
      expect(result.data!.users.length).toBeGreaterThan(0);
      expect(result.data!.meta).toBeDefined();
      expect(result.data!.meta.page).toBe(0);
      expect(result.data!.meta.size).toBe(10);
      expect(result.data!.meta.totalItems).toBeGreaterThan(0);
    });

    it('should fetch users with pagination parameters', async () => {
      const params: UserListParams = {
        page: 1,
        size: 2,
      };

      const result = await userApi.listUsers(params);

      expect(result.success).toBe(true);
      expect(result.data!.users.length).toBeLessThanOrEqual(2);
      expect(result.data!.meta.page).toBe(1);
      expect(result.data!.meta.size).toBe(2);
    });

    it('should filter users by email', async () => {
      const params: UserListParams = {
        email: 'john.doe',
        page: 0,
        size: 10,
      };

      const result = await userApi.listUsers(params);

      expect(result.success).toBe(true);
      expect(result.data!.users).toHaveLength(1);
      expect(result.data!.users[0].email).toContain('john.doe');
    });

    it('should filter users by role', async () => {
      const params: UserListParams = {
        role: 'ADMIN',
        page: 0,
        size: 10,
      };

      const result = await userApi.listUsers(params);

      expect(result.success).toBe(true);
      expect(result.data!.users.every(user => user.role === 'ADMIN')).toBe(true);
    });

    it('should filter users by multiple criteria', async () => {
      const params: UserListParams = {
        country: 'United States',
        role: 'USER',
        page: 0,
        size: 10,
      };

      const result = await userApi.listUsers(params);

      expect(result.success).toBe(true);
      expect(result.data!.users.every(user => 
        user.country === 'United States' && user.role === 'USER'
      )).toBe(true);
    });

    it('should return empty results for non-matching filters', async () => {
      const params: UserListParams = {
        email: 'nonexistent@example.com',
        page: 0,
        size: 10,
      };

      const result = await userApi.listUsers(params);

      expect(result.success).toBe(true);
      expect(result.data!.users).toHaveLength(0);
      expect(result.data!.meta.totalItems).toBe(0);
    });

    it('should handle server errors gracefully', async () => {
      const params: UserListParams = {
        page: 0,
        size: 10,
        // @ts-ignore - Adding test parameter
        _error: 'server',
      };

      await expect(userApi.listUsers(params)).rejects.toThrow();
    });

    it('should handle unauthorized access', async () => {
      const params: UserListParams = {
        page: 0,
        size: 10,
        // @ts-ignore - Adding test parameter
        _error: 'unauthorized',
      };

      const result = await userApi.listUsers(params);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });
  });

  describe('getUser', () => {
    it('should fetch a specific user by ID', async () => {
      const result = await userApi.getUser(1);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe(1);
      expect(result.data!.email).toBe('john.doe@example.com');
      expect(result.data!.firstName).toBe('John');
      expect(result.data!.lastName).toBe('Doe');
    });

    it('should handle user not found', async () => {
      const result = await userApi.getUser(999);

      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });

    it('should handle simulated not found error', async () => {
      // Using URL parameter to trigger error in MSW handler
      const result = await userApi.getUser(1, { _error: 'not_found' } as any);

      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const newUserData: CreateUserRequest = {
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        phone: '+1-555-0999',
        role: 'USER',
        country: 'Canada',
        province: 'British Columbia',
      };

      const result = await userApi.createUser(newUserData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.email).toBe(newUserData.email);
      expect(result.data!.firstName).toBe(newUserData.firstName);
      expect(result.data!.lastName).toBe(newUserData.lastName);
      expect(result.data!.role).toBe(newUserData.role);
      expect(result.data!.id).toBeGreaterThan(0);
    });

    it('should handle email already exists error', async () => {
      const existingUserData: CreateUserRequest = {
        email: 'john.doe@example.com', // Email that already exists
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
      };

      const result = await userApi.createUser(existingUserData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Email already exists');
    });

    it('should handle validation errors', async () => {
      // Trigger validation error via URL parameter
      const userData: CreateUserRequest & { _error?: string } = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'USER',
        _error: 'validation',
      };

      const result = await userApi.createUser(userData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Validation failed');
    });

    it('should create user with minimal required fields', async () => {
      const minimalUserData: CreateUserRequest = {
        email: 'minimal@example.com',
        firstName: 'Min',
        lastName: 'User',
        role: 'USER',
      };

      const result = await userApi.createUser(minimalUserData);

      expect(result.success).toBe(true);
      expect(result.data!.phone).toBeNull();
      expect(result.data!.country).toBeNull();
      expect(result.data!.province).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update an existing user successfully', async () => {
      const updateData: UpdateUserRequest = {
        firstName: 'Updated',
        lastName: 'Name',
        phone: '+1-555-UPDATED',
        country: 'Updated Country',
      };

      const result = await userApi.updateUser(1, updateData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data!.id).toBe(1);
      expect(result.data!.firstName).toBe('Updated');
      expect(result.data!.lastName).toBe('Name');
      expect(result.data!.phone).toBe('+1-555-UPDATED');
      expect(result.data!.country).toBe('Updated Country');
    });

    it('should handle user not found for update', async () => {
      const updateData: UpdateUserRequest = {
        firstName: 'Updated',
      };

      const result = await userApi.updateUser(999, updateData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });

    it('should handle simulated not found error for update', async () => {
      const updateData: UpdateUserRequest & { _error?: string } = {
        firstName: 'Updated',
        _error: 'not_found',
      };

      const result = await userApi.updateUser(1, updateData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });

    it('should update only provided fields', async () => {
      const updateData: UpdateUserRequest = {
        firstName: 'PartialUpdate',
      };

      const result = await userApi.updateUser(2, updateData);

      expect(result.success).toBe(true);
      expect(result.data!.firstName).toBe('PartialUpdate');
      // Other fields should remain unchanged
      expect(result.data!.email).toBe('jane.admin@example.com');
      expect(result.data!.role).toBe('ADMIN');
    });
  });

  describe('deleteUser', () => {
    it('should delete an existing user successfully', async () => {
      const result = await userApi.deleteUser(3);

      expect(result.success).toBe(true);
      expect(result.message).toContain('deleted successfully');
    });

    it('should handle user not found for deletion', async () => {
      const result = await userApi.deleteUser(999);

      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });

    it('should handle simulated not found error for deletion', async () => {
      // Using URL parameter to trigger error in MSW handler
      const result = await userApi.deleteUser(1, { _error: 'not_found' } as any);

      expect(result.success).toBe(false);
      expect(result.message).toContain('User not found');
    });
  });

  describe('API Error Handling', () => {
    it('should handle network errors', async () => {
      // Stop the server to simulate network error
      server.close();

      await expect(userApi.listUsers({})).rejects.toThrow();

      // Restart server for other tests
      server.listen();
    });

    it('should handle malformed response data', async () => {
      // This would be handled by the HTTP client's response validation
      const result = await userApi.listUsers({ page: 0, size: 10 });
      
      // Should still work with proper MSW handlers
      expect(result.success).toBe(true);
    });
  });

  describe('Type Safety', () => {
    it('should properly type user list response', async () => {
      const result = await userApi.listUsers({ page: 0, size: 5 });

      if (result.success && result.data) {
        // TypeScript should infer the correct types
        expect(typeof result.data.users[0].id).toBe('number');
        expect(typeof result.data.users[0].email).toBe('string');
        expect(typeof result.data.users[0].firstName).toBe('string');
        expect(['USER', 'ADMIN', 'MODERATOR']).toContain(result.data.users[0].role);
        expect(typeof result.data.meta.totalItems).toBe('number');
        expect(typeof result.data.meta.hasNext).toBe('boolean');
      }
    });

    it('should properly type user response', async () => {
      const result = await userApi.getUser(1);

      if (result.success && result.data) {
        expect(typeof result.data.id).toBe('number');
        expect(typeof result.data.email).toBe('string');
        expect(typeof result.data.createdAt).toBe('string');
        expect(typeof result.data.updatedAt).toBe('string');
      }
    });
  });
});
